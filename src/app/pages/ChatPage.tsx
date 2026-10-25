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

type ItemKind = 'user' | 'assistant' | 'chips' | 'finding' | 'ladder' | 'caution' | 'error' | 'system'

interface ChatItem {
  id: number
  kind: ItemKind
  text?: string
  variant?: 'full' | 'free'
  stale?: boolean
  role?: 'answer'
}

type AnswerId = '30' | '1to2' | '2plus' | 'notsure'

export default function ChatPage() {
  const { tr, lang } = useApp()
  const { params } = useHashRoute()
  const seedId = params.get('s')

  const [items, setItems] = useState<ChatItem[]>([])
  const [busy, setBusy] = useState(false)
  const [stageLabel, setStageLabel] = useState<string | undefined>()
  const [offline, setOffline] = useState(false)
  const [attachments, setAttachments] = useState<string[]>([])
  const [stopDecision, setStopDecision] = useState<ScopeDecision | null>(null)
  const [stopPending, setStopPending] = useState(false)
  const [noticeOpen, setNoticeOpen] = useState(false)
  const [findingData, setFindingData] = useState<FindingCardData>(FINDING)

  const idRef = useRef(0)
  const seededRef = useRef<string | null>(null)
  const retryRef = useRef<(() => void) | null>(null)

  const nextId = () => ++idRef.current
  const push = (...newItems: Omit<ChatItem, 'id'>[]) =>
    setItems((prev) => [...prev, ...newItems.map((i) => ({ ...i, id: nextId() }))])

  /** deterministic staged beats -> then(); failure injectable for the error state */
  const run = useCallback((beatClass: BeatClass, then: () => void, fail = false) => {
    setBusy(true)
    retryRef.current = () => run(beatClass, then, false)
    runBeats(beatClass, (label) => setStageLabel(label), { failAfterFirstBeat: fail })
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

  const startConsumerFlow = (fail = false) => {
    run(
      'explain',
      () => {
        push(
          { kind: 'assistant', text: `${JOURNEY_STRINGS.reassurance![lang]}\n\n${tr('restatePrefix')} ${JOURNEY_STRINGS.restatement![lang]}` },
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
    const decision = classifyMatter(text)

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
    // notice-chip special: scanner arrives in a later phase — stay honest
    if (/official notice|सरकारी नोटिस|शासकीय जाहीरनामा|அரசு அறிவிப்பு|سرکاری نوٹس/i.test(text)) {
      run('disclose', () => {
        push({
          kind: 'assistant',
          text: 'The notice reader is coming in a later phase of this prototype. For now, tell me in your own words what the notice says — who sent it, any amount, any deadline — and I will help you think it through.',
        })
      })
      return
    }
    startConsumerFlow(fail)
  }

  const handleAnswer = (answer: AnswerId) => {
    const label =
      answer === '30' ? tr('ans30') : answer === '1to2' ? tr('ans1to2') : answer === '2plus' ? tr('ans2plus') : tr('ansNotSure')
    push({ kind: 'user', text: label, role: 'answer' })

    if (answer === '30' || answer === '1to2') {
      run('explain', () => {
        push({ kind: 'finding' }, { kind: 'ladder', variant: 'full' })
      })
    } else {
      run('caution', () => {
        push({ kind: 'caution' }, { kind: 'ladder', variant: 'free' })
      })
    }
  }

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
    const decision = reRouteAsCaution()
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
        <Composer
          onSend={handleSend}
          disabled={busy}
          offline={offline}
          attachments={attachments}
          onAttach={(name) => setAttachments((a) => [...a, name])}
          onRemoveAttachment={(name) => setAttachments((a) => a.filter((x) => x !== name))}
        />
      }
    >
      {noticeOpen ? (
        <DemandNoticeReview onBack={() => setNoticeOpen(false)} />
      ) : stopDecision || stopPending ? (
        <StopScreen
          decision={stopDecision}
          pending={stopPending}
          onBack={() => {
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
          <Thread scrollKey={`${items.length}-${busy}-${stageLabel ?? ''}`}>
            {empty && (
              <div className="flex flex-col items-center gap-4 px-2 pb-8 pt-10 text-center">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-standout">
                  <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
                    <path
                      d="M12 5c-.9 2.6-3.4 3.4-3.4 6.3a3.4 3.4 0 0 0 6.8 0C15.4 8.4 12.9 7.6 12 5z"
                      fill="var(--c-spark)"
                      stroke="none"
                    />
                  </svg>
                </span>
                <div>
                  <h1 className="text-lg font-semibold text-fg-primary">{tr('greeting')}</h1>
                  <p className="mt-1.5 max-w-[300px] text-sm text-fg-secondary">{tr('greetingSub')}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <Chip onClick={() => handleSend(SCENARIO_SEEDS[0]!.userMessage, [])}>{tr('chipDefective')}</Chip>
                  <Chip onClick={() => handleSend('I received an official notice about property tax', [])}>
                    {tr('chipNotice')}
                  </Chip>
                  <Chip onClick={() => handleSend(SCENARIO_SEEDS[3]!.userMessage, [])}>{tr('chipThreat')}</Chip>
                  <Chip onClick={() => document.querySelector<HTMLTextAreaElement>('textarea')?.focus()}>
                    {tr('chipOther')}
                  </Chip>
                </div>
                <p className="text-2xs text-fg-tertiary">{tr('protoTag')}</p>
                <Button variant="ghost" size="sm" onClick={() => navigate('/dev')}>
                  Scenario launcher (dev)
                </Button>
              </div>
            )}

            {items.map((item) => {
              switch (item.kind) {
                case 'user':
                  return (
                    <MessageBubble
                      key={item.id}
                      role="user"
                      stale={item.stale}
                      onStaleAction={item.role === 'answer' ? () => reopenQuestion(item.id) : undefined}
                      staleActionLabel={tr('update')}
                    >
                      {item.text}
                    </MessageBubble>
                  )
                case 'assistant':
                  return (
                    <MessageBubble key={item.id} role="assistant">
                      <p className="whitespace-pre-line text-sm leading-relaxed">{item.text}</p>
                    </MessageBubble>
                  )
                case 'system':
                  return (
                    <MessageBubble key={item.id} role="system">
                      {item.text}
                    </MessageBubble>
                  )
                case 'chips':
                  return (
                    <div key={item.id} className="flex flex-col gap-2.5 ps-7">
                      <p className="text-sm font-medium text-fg-primary">{tr('qWhen')}</p>
                      {chipsForQuestion}
                    </div>
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

            {busy && <TypingIndicator stageLabel={stageLabel} />}
          </Thread>
        </>
      )}
    </AppShell>
  )
}
