import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useApp } from '../lib/app-context'
import { navigate, useHashRoute } from '../lib/router'
import { runBeats, SimulatedFailure, type BeatClass } from '../lib/engine'
import { classifyMatter, reRouteAsCaution, type ScopeDecision } from '../data/scope-rules'
import {
  FINDING,
  JOURNEY_STRINGS,
  SCENARIO_SEEDS,
} from '../data/refund-journey'
import { AppShell } from '../components/ui/shell'
import { Banner } from '../components/ui/Banner'
import { Button } from '../components/ui/Button'
import { Chip } from '../components/ui/Chip'
import { Thread } from '../components/chat/Thread'
import { MessageBubble } from '../components/chat/MessageBubble'
import { TypingIndicator } from '../components/chat/TypingIndicator'
import { QuickReplies } from '../components/chat/QuickReplies'
import { Composer } from '../components/chat/Composer'
import { FindingCard, type FindingCardData } from '../components/cards/FindingCard'
import { ActionLadder } from '../components/cards/ActionLadder'
import { CautionCard } from '../components/cards/CautionCard'
import { DemandNoticeReview } from '../components/cards/DemandNoticeReview'
import { StopScreen } from '../components/stop/StopScreen'
import { VoiceOrb } from '../components/voice/VoiceOrb'
import { IconCamera, IconKeyboard, IconCopy } from '../components/ui/icons'
import { useSpans } from '../lib/useSpans'
import { StreamText } from '../components/chat/StreamText'
import { copyText } from '../lib/format'
import { FactCheckCard, type FactItem } from '../components/cards/FactCheckCard'
import { HandoverCard } from '../components/cards/HandoverCard'
import { Card } from '../components/ui/Card'

type ItemKind =
  | 'user'
  | 'assistant'
  | 'chips'
  | 'finding'
  | 'ladder'
  | 'caution'
  | 'error'
  | 'system'
  | 'factcheck'
  | 'handover'
  | 'noticecard'

interface ChatItem {
  id: number
  kind: ItemKind
  text?: string
  variant?: 'full' | 'free'
  stale?: boolean
  role?: 'answer'
  /** assistant text still revealing (caret streaming) */
  stream?: boolean
  /** a consumed question row (collapsed once answered) */
  done?: boolean
}

type AnswerId = '30' | '1to2' | '2plus' | 'notsure'

export default function ChatPage() {
  const { tr, lang } = useApp()
  const { params } = useHashRoute()
  const seedId = params.get('s')
  const spans = useSpans()

  const [items, setItems] = useState<ChatItem[]>([])
  const [busy, setBusy] = useState(false)
  const [stageLabel, setStageLabel] = useState<string | undefined>()
  const [offline, setOffline] = useState(false)
  const [attachments, setAttachments] = useState<string[]>([])
  const [stopDecision, setStopDecision] = useState<ScopeDecision | null>(null)
  const [stopPending, setStopPending] = useState(false)
  const [noticeOpen, setNoticeOpen] = useState(false)
  const [findingData, setFindingData] = useState<FindingCardData>(FINDING)
  const [factItems, setFactItems] = useState<FactItem[]>([])
  const [lastStop, setLastStop] = useState<ScopeDecision | null>(null)
  const [composerOpen, setComposerOpen] = useState(false)

  const idRef = useRef(0)
  const seededRef = useRef<string | null>(null)
  const retryRef = useRef<(() => void) | null>(null)
  const cancelRef = useRef(false)

  const nextId = () => ++idRef.current
  const push = (...newItems: Omit<ChatItem, 'id'>[]) =>
    setItems((prev) => [...prev, ...newItems.map((i) => ({ ...i, id: nextId() }))])

  /** skip the remaining narrated beats — resolve straight to the answer */
  const skipBeats = () => {
    cancelRef.current = true
  }

  /** deterministic staged beats -> then(); failure injectable for the error state */
  const run = useCallback((beatClass: BeatClass, then: () => void, fail = false) => {
    setBusy(true)
    cancelRef.current = false
    retryRef.current = () => run(beatClass, then, false)
    runBeats(beatClass, (label) => setStageLabel(label), {
      failAfterFirstBeat: fail,
      isCancelled: () => cancelRef.current,
    })
      .then(() => {
        if (!fail) then()
      })
      .catch((err) => {
        if (err instanceof SimulatedFailure) {
          push({ kind: 'error' })
        }
      })
      .finally(() => {
        setBusy(false)
        setStageLabel(undefined)
      })
  }, [])

  /* ---- flows ---- */

  const startConsumerFlow = (fail = false, userText?: string) => {
    run(
      'explain',
      () => {
        // the scripted restatement belongs to the exact HomeKart demo seed;
        // anything else gets an honest echo of the user's own words (P0-2)
        const isExactMixerSeed = userText === SCENARIO_SEEDS[0]!.userMessage
        const restatement = isExactMixerSeed
          ? JOURNEY_STRINGS.restatement![lang] ?? JOURNEY_STRINGS.restatement!.en
          : `“${(userText ?? '').trim()}”`
        push(
          {
            kind: 'assistant',
            stream: true,
            text: `${JOURNEY_STRINGS.reassurance![lang] ?? JOURNEY_STRINGS.reassurance!.en}\n\n${tr('restatePrefix')} ${restatement}`,
          },
          { kind: 'chips', text: 'qWhen' },
        )
      },
      fail,
    )
  }

  const startCautionFlow = () => {
    run('caution', () => {
      push(
        { kind: 'system', text: tr('tierCaution') },
        { kind: 'caution' },
        { kind: 'ladder', variant: 'free' },
      )
    })
  }

  const handleSend = (text: string, _atts: string[], fail = false) => {
    push({ kind: 'user', text })

    // safety first: strong hard-stop signals never route to the notice reader
    const strongStop = /evict|throw (?:us|me|him|her) out|threat|police|\bfir\b|धमकी|बेदखल|पुलिस|پولیس/i.test(text)
    // notice-intent: a received legal/official/tax notice → the interpreter
    // (explain-only), NOT the consumer script and NOT a fake "coming later" (Trap 2)
    const noticeIntent =
      /\b(?:legal|official|court|tax|municipal|property[- ]tax|govt|government)\s+notice\b/i.test(text) ||
      /\bnotice\s+(?:about|regarding|from|came|received)\b/i.test(text) ||
      /received a notice/i.test(text) ||
      /(कानूनी|सरकारी|कोर्ट|अदालत|टैक्स|नगर निगम|संपत्ति)[\s-]*नोटिस/i.test(text) ||
      /नोटिस (?:आया|मिला|आया है)/i.test(text) ||
      /(कायदेशीर|शासकीय|महापालिका|मालमत्ता)[\s-]*जाहीरनामा/i.test(text) ||
      /जाहीरनामा (?:आल|मिळाल)/i.test(text) ||
      /(சட்ட|அரசு|வரி|மாநகர|சொத்து)[\s-]*அறிவிப்பு/i.test(text) ||
      /(قانونی|سرکاری|ٹیکس|بلدیہ|جائیداد)[\s-]*نوٹس/i.test(text)
    if (!strongStop && noticeIntent) {
      push({ kind: 'noticecard' })
      return
    }

    const decision = classifyMatter(text, lang)

    if (decision.tier === 'hard-stop') {
      setStopPending(true)
      run('stop', () => {
        setStopPending(false)
        setStopDecision(decision)
      })
      return
    }
    if (decision.tier === 'caution') {
      startCautionFlow()
      return
    }
    startConsumerFlow(fail, text)
  }

  const handleAnswer = (answer: AnswerId) => {
    const label =
      answer === '30' ? tr('ans30') : answer === '1to2' ? tr('ans1to2') : answer === '2plus' ? tr('ans2plus') : tr('ansNotSure')
    // collapse the answered question chips — the thread reads as a conversation (Trap 3)
    setItems((prev) => prev.map((i) => (i.kind === 'chips' ? { ...i, done: true } : i)))
    push({ kind: 'user', text: label, role: 'answer' })

    if (answer === '30' || answer === '1to2') {
      setFactItems([
        { key: 'item', label: 'Item', value: 'Mixer grinder' },
        { key: 'seller', label: 'Seller', value: 'HomeKart' },
        { key: 'issue', label: 'Issue', value: 'Arrived cracked' },
        { key: 'ask', label: 'Refused', value: 'Refund and replacement' },
        { key: 'when', label: 'Bought', value: label },
      ])
      // the verification gate: nothing generative until facts are signed (A2.7)
      run('explain', () => {
        push({ kind: 'factcheck' })
      })
    } else {
      run('caution', () => {
        push({ kind: 'caution' }, { kind: 'ladder', variant: 'free' })
      })
    }
  }

  const confirmFacts = useCallback(() => {
    run('progress', () => {
      push({ kind: 'finding' }, { kind: 'ladder', variant: 'full' })
    })
  }, [run])

  /** user changes an earlier answer: downstream cards go stale, question re-opens */
  const reopenQuestion = (userId: number) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === userId)
      const downstream = prev.slice(idx + 1)
      const staleDownstream = downstream.map((i) =>
        i.kind === 'finding' || i.kind === 'ladder' || i.kind === 'caution' ? { ...i, stale: true } : i,
      )
      return [...prev.slice(0, idx + 1), ...staleDownstream, { id: nextId(), kind: 'chips', text: 'qWhen' }]
    })
  }

  const retryError = () => {
    setItems((prev) => prev.filter((i) => i.kind !== 'error'))
    retryRef.current?.()
  }

  const tellMore = () => {
    setStopDecision(null)
    const decision = reRouteAsCaution(lang)
    push({ kind: 'system', text: tr('tierCaution') })
    run('caution', () => {
      push(
        { kind: 'assistant', text: decision.why },
        { kind: 'caution' },
        { kind: 'ladder', variant: 'free' },
      )
    })
  }

  const reset = () => {
    setItems([])
    setStopDecision(null)
    setNoticeOpen(false)
    setFindingData(FINDING)
  }

  /* ---- handoff from the simulated voice flow (review & send).
     StrictMode-safe: the storage item is consumed only when the timer
     actually fires, so the discarded first effect run doesn't eat it. ---- */
  useEffect(() => {
    let pending: string | null = null
    try {
      pending = window.sessionStorage.getItem('lokai.pendingTranscript')
    } catch {
      /* ignore */
    }
    if (!pending || !pending.trim()) return
    const t = window.setTimeout(() => {
      try {
        window.sessionStorage.removeItem('lokai.pendingTranscript')
      } catch {
        /* ignore */
      }
      handleSend(pending!.trim(), [])
    }, 450)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ---- offline (seeded or real) ---- */
  useEffect(() => {
    const sync = () => setOffline(window.navigator.onLine === false)
    sync()
    window.addEventListener('online', sync)
    window.addEventListener('offline', sync)
    return () => {
      window.removeEventListener('online', sync)
      window.removeEventListener('offline', sync)
    }
  }, [])

  /* ---- scenario seeding (once per seed id; StrictMode-safe: the guard is
     set only when the timer actually fires, so the double-invoked effect
     re-schedules instead of silently skipping) ---- */
  useEffect(() => {
    if (!seedId || seededRef.current === seedId) return
    const seed = SCENARIO_SEEDS.find((s) => s.id === seedId)
    if (!seed) return
    // launcher discipline: a fresh seed always starts a fresh conversation
    setItems([])
    setNoticeOpen(false)
    setStopDecision(null)
    setStopPending(false)
    setFindingData(FINDING)
    if (seed.forceOffline) {
      seededRef.current = seedId
      setOffline(true)
      return
    }
    const timer = window.setTimeout(() => {
      seededRef.current = seedId
      handleSend(seed.userMessage, [], seed.simulateError ?? false)
    }, 450)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedId])

  /* ---- render ---- */

  const empty = items.length === 0 && !stopDecision && !noticeOpen

  /* Duo spanning: the latest generative card docks in the right pane */
  const focusItem = spans
    ? [...items].reverse().find((i) => i.kind === 'finding' || i.kind === 'caution' || i.kind === 'ladder')
    : undefined
  const focusPane = !focusItem ? null : (
    <aside
      aria-label="Focus"
      className="scroll-calm min-w-0 flex-1 overflow-y-auto pe-[max(1rem,env(safe-area-inset-right))] ps-1 pt-3"
    >
      {focusItem.kind === 'finding' && (
        <MessageBubble role="assistant">
          <FindingCard data={findingData} stale={focusItem.stale} onUpdate={setFindingData} />
        </MessageBubble>
      )}
      {focusItem.kind === 'caution' && <CautionCard />}
      {focusItem.kind === 'ladder' && (
        <ActionLadder mode={focusItem.variant ?? 'full'} onOpenNotice={() => setNoticeOpen(true)} />
      )}
    </aside>
  )
  const spanRow = spans ? 'flex min-h-0 flex-1 flex-row gap-2' : 'flex min-h-0 flex-1 flex-col'

  const chipsForQuestion = (
    <QuickReplies
      options={[
        { id: '30', label: tr('ans30'), onSelect: () => handleAnswer('30') },
        { id: '1to2', label: tr('ans1to2'), onSelect: () => handleAnswer('1to2') },
        { id: '2plus', label: tr('ans2plus'), onSelect: () => handleAnswer('2plus') },
        { id: 'ns', label: tr('ansNotSure'), onSelect: () => handleAnswer('notsure') },
      ]}
    />
  )

  return (
    <AppShell
      topBarExtra={
        <Button variant="ghost" size="sm" onClick={reset} className="hidden sm:inline-flex">
          {tr('newChat')}
        </Button>
      }
      footer={
        // Trap-3A fix: no chat composer on the voice-first empty state, on the
        // stop screen, or on the notice flows — one input model per screen
        empty && !composerOpen ? undefined : noticeOpen || stopDecision || stopPending ? undefined : (
          <Composer
            onSend={handleSend}
            disabled={busy}
            offline={offline}
            attachments={attachments}
            onAttach={(name) => setAttachments((a) => [...a, name])}
            onRemoveAttachment={(name) => setAttachments((a) => a.filter((x) => x !== name))}
          />
        )
      }
    >
      {noticeOpen ? (
        <DemandNoticeReview onBack={() => setNoticeOpen(false)} />
      ) : stopDecision || stopPending ? (
        <StopScreen
          decision={stopDecision}
          pending={stopPending}
          onBack={() => {
            // returning from a stop leaves the handover packet in the thread
            if (stopDecision) {
              setLastStop(stopDecision)
              push({ kind: 'system', text: tr('tierHardStop') }, { kind: 'handover' })
            }
            setStopDecision(null)
            setStopPending(false)
          }}
          onReRoute={tellMore}
        />
      ) : (
        <>
          {offline && (
            <div className="px-3.5 pt-3">
              <Banner tone="offline">{tr('offlineBanner')}</Banner>
            </div>
          )}
          <div className={spanRow}>
            <Thread
              scrollKey={`${items.length}-${busy}-${stageLabel ?? ''}`}
              autoScroll={items.length > 0}
              className={spans ? 'min-w-0 flex-1 ps-[max(1rem,env(safe-area-inset-left))]' : undefined}
            >
            {(() => {
              const focus = spans
                ? [...items].reverse().find((i) => i.kind === 'finding' || i.kind === 'caution' || i.kind === 'ladder')
                : undefined
              const threadItems = focus ? items.filter((i) => i.id !== focus.id) : items
              return (
                <>
            {empty && (
              <div className="flex flex-col items-center gap-6 px-5 pb-10 pt-14 text-center">
                <div>
                  <h1 className="font-serif text-[2.1rem] font-semibold leading-[1.12] tracking-[-0.02em] text-fg-primary">
                    {tr('greeting')}
                  </h1>
                  <p className="mx-auto mt-3 max-w-[320px] text-[0.95rem] leading-relaxed text-fg-secondary">
                    {tr('greetingSub')}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/voice')}
                  aria-label={tr('speakCta')}
                  className="pressable rounded-full outline-offset-8"
                >
                  <VoiceOrb state="idle" size="lg" />
                </button>
                <div className="-mt-2">
                  <p className="text-base font-semibold text-fg-primary">{tr('speakCta')}</p>
                  <p className="mt-1 text-sm text-fg-tertiary">{tr('langHint')}</p>
                </div>

                <div className="grid w-full max-w-[350px] grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/notice')}
                    className="pressable flex min-h-28 flex-col items-center justify-center gap-2 rounded-[22px] bg-card px-3 py-5 transition-colors"
                  >
                    <IconCamera className="size-6 text-brand-fg" />
                    <span className="text-base font-medium text-fg-primary">{tr('addNotice')}</span>
                    <span className="text-2xs text-fg-tertiary">{tr('addNoticeSub')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setComposerOpen(true)
                      window.setTimeout(
                        () => document.querySelector<HTMLTextAreaElement>('textarea')?.focus(),
                        60,
                      )
                    }}
                    className="pressable flex min-h-28 flex-col items-center justify-center gap-2 rounded-[22px] bg-card px-3 py-5 transition-colors"
                  >
                    <IconKeyboard className="size-6 text-brand-fg" />
                    <span className="text-base font-medium text-fg-primary">{tr('typeInstead')}</span>
                    <span className="text-2xs text-fg-tertiary">{tr('typeInsteadSub')}</span>
                  </button>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  <Chip onClick={() => handleSend(SCENARIO_SEEDS[0]!.userMessage, [])}>{tr('chipDefective')}</Chip>
                  <Chip onClick={() => handleSend(SCENARIO_SEEDS[3]!.userMessage, [])}>{tr('chipThreat')}</Chip>
                  <Chip onClick={() => handleSend('I received an official notice about property tax', [])}>
                    {tr('chipNotice')}
                  </Chip>
                </div>
                <p className="text-2xs text-fg-tertiary">{tr('protoTag')}</p>
                <Button variant="ghost" size="sm" onClick={() => navigate('/dev')}>
                  Scenario launcher (dev)
                </Button>
              </div>
            )}

            {threadItems.map((item) => {
              switch (item.kind) {
                case 'user':
                  return (
                    <MessageBubble
                      key={item.id}
                      role="user"
                      isAnswer={item.role === 'answer'}
                      stale={item.stale}
                      onStaleAction={item.role === 'answer' ? () => reopenQuestion(item.id) : undefined}
                      staleActionLabel={tr('update')}
                    >
                      {item.text}
                    </MessageBubble>
                  )
                case 'assistant':
                  return (
                    <MessageBubble
                      key={item.id}
                      role="assistant"
                      actions={
                        item.stream ? undefined : (
                          <Button
                            variant="ghost"
                            size="sm"
                            leadingIcon={<IconCopy className="size-3.5" />}
                            onClick={async () => {
                              const ok = await copyText(item.text ?? '')
                              if (ok) toast.success(tr('copied'))
                            }}
                          >
                            {tr('copy')}
                          </Button>
                        )
                      }
                    >
                      {item.stream ? (
                        <p className="whitespace-pre-line text-sm leading-relaxed">
                          <StreamText
                            text={item.text ?? ''}
                            onDone={() =>
                              setItems((prev) =>
                                prev.map((i) => (i.id === item.id ? { ...i, stream: false } : i)),
                              )
                            }
                          />
                        </p>
                      ) : (
                        <p className="whitespace-pre-line text-sm leading-relaxed">{item.text}</p>
                      )}
                    </MessageBubble>
                  )
                case 'system':
                  return (
                    <MessageBubble key={item.id} role="system">
                      {item.text}
                    </MessageBubble>
                  )
                case 'chips':
                  if (item.done) return null
                  return (
                    <div key={item.id} className="flex flex-col gap-2.5 ps-7">
                      <p className="text-sm font-medium text-fg-primary">{tr('qWhen')}</p>
                      {chipsForQuestion}
                    </div>
                  )
                case 'noticecard':
                  return (
                    <MessageBubble key={item.id} role="assistant">
                      <Card className="flex flex-col gap-2.5">
                        <h3 className="font-serif text-lg font-semibold text-fg-primary">
                          {tr('noticeCardTitle')}
                        </h3>
                        <p className="text-sm leading-relaxed text-fg-secondary">
                          {tr('noticeCardBody')}
                        </p>
                        <Button variant="primary" size="sm" className="self-start" onClick={() => navigate('/notice')}>
                          {tr('noticeCardOpen')}
                        </Button>
                      </Card>
                    </MessageBubble>
                  )
                case 'finding':
                  return (
                    <MessageBubble key={item.id} role="assistant">
                      <FindingCard
                        data={findingData}
                        stale={item.stale}
                        onUpdate={setFindingData}
                        onDiscard={() => {
                          setItems((prev) => prev.filter((i) => i.id !== item.id))
                          toast('Finding discarded')
                        }}
                      />
                    </MessageBubble>
                  )
                case 'ladder':
                  return (
                    <div key={item.id} className="ps-7">
                      <ActionLadder mode={item.variant ?? 'full'} onOpenNotice={() => setNoticeOpen(true)} />
                    </div>
                  )
                case 'caution':
                  return (
                    <MessageBubble key={item.id} role="assistant">
                      <CautionCard
                        onDiscard={() => {
                          setItems((prev) => prev.filter((i) => i.id !== item.id))
                          toast('Caution card discarded')
                        }}
                      />
                    </MessageBubble>
                  )
                case 'factcheck':
                  return (
                    <MessageBubble key={item.id} role="assistant">
                      <FactCheckCard facts={factItems} onConfirm={confirmFacts} />
                    </MessageBubble>
                  )
                case 'handover':
                  return (
                    <div key={item.id} className="ps-7">
                      <HandoverCard
                        tierLabel={lastStop?.tier === 'caution' ? tr('tierCaution') : tr('tierHardStop')}
                        why={lastStop?.why ?? ''}
                      />
                    </div>
                  )
                case 'error':
                  return (
                    <div key={item.id} className="ps-7">
                      <Banner
                        tone="danger"
                        action={
                          <Button variant="secondary" size="sm" onClick={retryError}>
                            {tr('retry')}
                          </Button>
                        }
                      >
                        <p className="font-semibold">{tr('errorTitle')}</p>
                        <p className="mt-0.5 text-2xs">{tr('errorBody')}</p>
                      </Banner>
                    </div>
                  )
                default:
                  return null
              }
            })}

            {busy && (
              <div className="flex items-center gap-1.5 ps-7">
                <TypingIndicator stageLabel={stageLabel} />
                <Button variant="ghost" size="sm" onClick={skipBeats}>
                  {tr('skip')}
                </Button>
              </div>
            )}
                </>
              )
            })()}
          </Thread>
          {spans && focusPane}
          </div>
        </>
      )}
    </AppShell>
  )
}
