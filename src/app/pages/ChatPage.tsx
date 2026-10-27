import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useApp } from '../lib/app-context'
import { navigate, useHashRoute } from '../lib/router'
import { runBeats, SimulatedFailure, type BeatClass } from '../lib/engine'
import { classifyMatter, reRouteAsCaution, SCOPE_RULES, type ScopeDecision } from '../data/scope-rules'
import { REASSURANCE, SCENARIO_SEEDS } from '../data/refund-journey'
import { FOLLOW_UPS } from '../data/localized-content'
import {
  extractFacts,
  factRows,
  buildFinding,
  EMPTY_FACTS,
  type FactRecord,
} from '../lib/matter-facts'
import { LANGUAGES } from '../data/languages'
import { AppShell } from '../components/ui/shell'
import { Banner } from '../components/ui/Banner'
import { Button } from '../components/ui/Button'
import { Chip } from '../components/ui/Chip'
import { Thread } from '../components/chat/Thread'
import { MessageBubble } from '../components/chat/MessageBubble'
import { TypingIndicator } from '../components/chat/TypingIndicator'
import { Composer } from '../components/chat/Composer'
import { FindingCard, type FindingCardData } from '../components/cards/FindingCard'
import { ActionLadder } from '../components/cards/ActionLadder'
import { CautionCard } from '../components/cards/CautionCard'
import { CloseOutCard } from '../components/cards/CloseOutCard'
import { DemandNoticeReview } from '../components/cards/DemandNoticeReview'
import { StopScreen } from '../components/stop/StopScreen'
import { ProtectiveCard } from '../components/stop/ProtectiveCard'
import { HandoverCard, WHAT_TO_BRING } from '../components/cards/HandoverCard'
import { VoiceOrb } from '../components/voice/VoiceOrb'
import { IconCamera, IconKeyboard, IconCopy, IconPlay } from '../components/ui/icons'
import { useSpans } from '../lib/useSpans'
import { StreamText } from '../components/chat/StreamText'
import { copyText } from '../lib/format'
import { FactCheckCard, type FactItem } from '../components/cards/FactCheckCard'
import { Card } from '../components/ui/Card'

type ItemKind =
  | 'user'
  | 'assistant'
  | 'finding'
  | 'ladder'
  | 'caution'
  | 'error'
  | 'system'
  | 'factcheck'
  | 'handover'
  | 'noticecard'
  | 'protective'
  | 'closeout'

interface ChatItem {
  id: number
  kind: ItemKind
  text?: string
  variant?: 'full' | 'free'
  /** assistant text still revealing (caret streaming) */
  stream?: boolean
  /** the scope decision attached to protective/handover/caution items */
  decision?: ScopeDecision
}

/**
 * Conversational stage (deep-audit P0 fix): follow-ups in the composer are
 * no longer re-classified as Turn 1. intake = before the first finding;
 * engaged = a finding/ladder/caution is on the table; stopped = a protective
 * stop landed. Safety patterns (strongStop) always win over the stage.
 */
type ThreadStage = 'intake' | 'engaged' | 'stopped'

const CARD_KINDS = new Set<ItemKind>([
  'finding', 'ladder', 'caution', 'factcheck', 'protective', 'handover', 'noticecard', 'closeout', 'error',
])

const RE_PROMISE =
  /will i (?:really |actually )?(?:get|win|receive)|i will (?:get|win)|refund,?\s*right|pakka|मिलेगा|पक्का|मिलेल का|கிடைக்குமா|ملے گا|مل جائے گا|पैसे मिल/i
const RE_ESCALATE = /ignore|no reply|not respon|जवाब नहीं|जवाब नही|பதில் இல்லை|جواب نہیں/i

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
  const [stage, setStage] = useState<ThreadStage>('intake')
  const [protectDecision, setProtectDecision] = useState<ScopeDecision | null>(null)
  const [stopDecision, setStopDecision] = useState<ScopeDecision | null>(null)
  const [noticeOpen, setNoticeOpen] = useState(false)
  const [matterFacts, setMatterFacts] = useState<FactRecord>(EMPTY_FACTS)
  const [findingData, setFindingData] = useState<FindingCardData>(() => buildFinding(EMPTY_FACTS, 'en'))
  const [factItems, setFactItems] = useState<FactItem[]>([])
  const [composerOpen, setComposerOpen] = useState(false)

  const idRef = useRef(0)
  const seededRef = useRef<string | null>(null)
  const retryRef = useRef<(() => void) | null>(null)
  const cancelRef = useRef(false)
  const lastUserRef = useRef('')

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
        const facts = extractFacts(userText ?? '')
        setMatterFacts(facts)
        setFactItems(factRows(facts, lang))
        // Anti-fatigue (audit Dimension 2): NO verbatim echo — the emotion-
        // matched acknowledgment only. The FactCheckCard is the single
        // structured confirmation (purchase window included), later in the
        // thread.
        push(
          {
            kind: 'assistant',
            stream: true,
            text: REASSURANCE.hassle[lang] ?? REASSURANCE.hassle.en,
          },
          { kind: 'factcheck' },
        )
      },
      fail,
    )
  }

  const runProtective = (decision: ScopeDecision) => {
    setProtectDecision(decision)
    setStage('stopped')
    run('stop', () => {
      push(
        { kind: 'system', text: tr('tierHardStop') },
        { kind: 'protective', decision },
        { kind: 'handover', decision },
      )
    })
  }

  const startCautionFlow = (decision: ScopeDecision) => {
    setStage('engaged')
    run('caution', () => {
      push(
        { kind: 'system', text: tr('tierCaution') },
        { kind: 'caution', decision },
        { kind: 'ladder', variant: 'free' },
      )
    })
  }

  /** turn-aware follow-up (deep-audit P0-1): answer the human, never re-run Turn 1 */
  const followUp = (currentStage: ThreadStage) => {
    const pack = FOLLOW_UPS[lang] ?? FOLLOW_UPS.en!
    const text = lastUserRef.current
    const msg = RE_PROMISE.test(text)
      ? pack.outcome
      : RE_ESCALATE.test(text)
        ? pack.escalate
        : currentStage === 'stopped'
          ? pack.stopped
          : pack.general
    run('progress', () => {
      push({ kind: 'assistant', stream: true, text: msg })
    })
  }

  const handleSend = (text: string, _atts: string[], fail = false) => {
    push({ kind: 'user', text })
    lastUserRef.current = text

    // safety first: strong hard-stop signals win over everything, any turn
    const strongStop = /evict|throw (?:us|me|him|her) out|threat|police|\bfir\b|धमकी|बेदखल|पुलिस|پولیس/i.test(text)
    if (strongStop) {
      const decision = classifyMatter(text, lang)
      const d: ScopeDecision =
        decision.tier === 'hard-stop'
          ? decision
          : { ...decision, tier: 'hard-stop' as const }
      runProtective(d)
      return
    }

    if (stage !== 'intake') {
      followUp(stage)
      return
    }

    // notice-intent: a received legal/official/tax notice → the interpreter
    // (explain-only), NOT the consumer script and NOT a fake "coming later"
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
    if (noticeIntent) {
      run('progress', () => {
        push(
          { kind: 'assistant', stream: true, text: REASSURANCE.notice[lang] ?? REASSURANCE.notice.en },
          { kind: 'noticecard' },
        )
      })
      return
    }

    const decision = classifyMatter(text, lang)

    if (decision.tier === 'hard-stop') {
      // In-thread protective triage (audit Dimension 1): the stop lands in
      // the conversation — no full-screen takeover. The protective footer
      // replaces the composer while the stop is active.
      runProtective(decision)
      return
    }
    if (decision.tier === 'caution') {
      startCautionFlow(decision)
      return
    }
    startConsumerFlow(fail, text)
  }

  /**
   * The signed confirmation (deep-audit P0-3): the fact gate's values ARE
   * the matter record now — the finding, the drafts and the demand notice
   * are built from them. Correct a fact, confirm again, and the downstream
   * cards update in place. The purchase-window row routes 2yr+/not-sure to
   * the honest time-barred caution.
   */
  const confirmFacts = (values: Record<string, string>) => {
    const next: FactRecord = {
      item: values.item ?? '',
      seller: values.seller ?? '',
      amount: values.amount ?? '',
      issue: (values.issue as FactRecord['issue']) ?? '',
      ask: (values.ask as FactRecord['ask']) ?? '',
      when: (values.when as FactRecord['when']) ?? '',
    }
    setMatterFacts(next)
    setStage('engaged')

    if (next.when === '2plus' || next.when === 'ns') {
      const rule = SCOPE_RULES.find((r) => r.id === 'possible-time-barred')!
      const decision: ScopeDecision = {
        tier: 'caution',
        ruleId: rule.id,
        label: rule.label,
        why: rule.whyI18n[lang] ?? rule.whyI18n.en ?? '',
        certainty: 'matched',
      }
      run('caution', () => {
        push({ kind: 'caution', decision }, { kind: 'ladder', variant: 'free' })
      })
      return
    }

    run('progress', () => {
      setFindingData(buildFinding(next, lang))
      push({ kind: 'finding' }, { kind: 'ladder', variant: 'full' }, { kind: 'closeout' })
    })
  }

  /* unclear-caution disambiguation doors (deep-audit P0-2) */
  const reConsumer = () => {
    run('explain', () => {
      const facts = extractFacts(lastUserRef.current)
      setMatterFacts(facts)
      setFactItems(factRows(facts, lang))
      push(
        { kind: 'assistant', stream: true, text: REASSURANCE.hassle[lang] ?? REASSURANCE.hassle.en },
        { kind: 'factcheck' },
      )
    })
  }
  const reNotice = () => {
    run('progress', () => {
      push(
        { kind: 'assistant', stream: true, text: REASSURANCE.notice[lang] ?? REASSURANCE.notice.en },
        { kind: 'noticecard' },
      )
    })
  }
  const reOther = (decision?: ScopeDecision) => {
    run('progress', () => {
      push({ kind: 'handover', decision })
    })
  }

  const retryError = () => {
    setItems((prev) => prev.filter((i) => i.kind !== 'error'))
    retryRef.current?.()
  }

  const tellMore = () => {
    setProtectDecision(null)
    setStopDecision(null)
    setStage('engaged')
    const decision = reRouteAsCaution(lang)
    push({ kind: 'system', text: tr('tierCaution') })
    run('caution', () => {
      push(
        { kind: 'assistant', text: decision.why },
        { kind: 'ladder', variant: 'free' },
      )
    })
  }

  const copyHandover = async () => {
    const d = protectDecision
    if (!d) return
    const note = [
      tr('tierHardStop') + ' — ' + d.label,
      '',
      d.why,
      '',
      lastUserRef.current,
      '',
      tr('handoverWhat') + ':',
      ...WHAT_TO_BRING.map((w) => `· ${w}`),
    ].join('\n')
    const ok = await copyText(note)
    if (ok) toast.success(tr('copied'))
  }

  const reset = () => {
    setItems([])
    setStopDecision(null)
    setProtectDecision(null)
    setNoticeOpen(false)
    setStage('intake')
    setMatterFacts(EMPTY_FACTS)
    setFindingData(buildFinding(EMPTY_FACTS, 'en'))
    setFactItems([])
  }

  /* the finding card re-speaks the signed facts in the current language */
  useEffect(() => {
    setFindingData(buildFinding(matterFacts, lang))
    // matterFacts intentionally excluded: rebuild on language switch only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

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
    reset()
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

  /* scroll focus: the first card of the trailing card batch mounts with its
     headline in view (deep-audit P2-10) instead of yanking to the bottom */
  let focusSelector: string | null = null
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i]!
    if (!CARD_KINDS.has(it.kind)) break
    focusSelector = `[data-chat-item="${it.id}"]`
  }

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
          <FindingCard data={findingData} onUpdate={setFindingData} />
        </MessageBubble>
      )}
      {focusItem.kind === 'caution' && <CautionCard decision={focusItem.decision} />}
      {focusItem.kind === 'ladder' && (
        <ActionLadder mode={focusItem.variant ?? 'full'} onOpenNotice={() => setNoticeOpen(true)} facts={matterFacts} />
      )}
    </aside>
  )
  const spanRow = spans ? 'flex min-h-0 flex-1 flex-row gap-2' : 'flex min-h-0 flex-1 flex-col'

  const whenOptions = [
    { key: '30', label: tr('ans30') },
    { key: '1to2', label: tr('ans1to2') },
    { key: '2plus', label: tr('ans2plus') },
    { key: 'ns', label: tr('ansNotSure') },
  ]

  const protectiveFooter = protectDecision ? (
    <div
      className="flex flex-col gap-2 rounded-[26px] bg-standout p-2.5 text-fg-on-inverted"
      role="region"
      aria-label={tr('protectGuide')}
    >
      {/* deep-audit §6(a): while a protective stop is active the composer
          gives way to an action bar — no more scared follow-ups looping
          duplicate protective cards */}
      <Button variant="inverted" size="sm" block onClick={() => setStopDecision(protectDecision)}>
        {tr('protectGuide')}
      </Button>
      <div className="flex gap-2">
        <Button variant="inverted" size="sm" block onClick={copyHandover}>
          {tr('copyHandoverNote')}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-fg-standout-secondary enabled:hover:bg-veil-standout"
          onClick={tellMore}
        >
          {tr('tellMore')}
        </Button>
      </div>
    </div>
  ) : null

  return (
    <AppShell
      topBarExtra={
        <Button variant="ghost" size="sm" onClick={reset} className="hidden sm:inline-flex">
          {tr('newChat')}
        </Button>
      }
      footer={
        // one input model per screen: voice-first empty state and the notice
        // flow show none; the active stop shows the protective action bar;
        // everything else is the composer (typing stays live during beats).
        empty && !composerOpen ? undefined : noticeOpen || stopDecision ? undefined : (
          (protectiveFooter ?? (
            <Composer
              onSend={handleSend}
              sendLocked={busy}
              offline={offline}
              attachments={attachments}
              onAttach={(name) => setAttachments((a) => [...a, name])}
              onRemoveAttachment={(name) => setAttachments((a) => a.filter((x) => x !== name))}
            />
          ))
        )
      }
    >
      {noticeOpen ? (
        <DemandNoticeReview key={`${lang}-${matterFacts.amount}-${matterFacts.item}`} facts={matterFacts} onBack={() => setNoticeOpen(false)} />
      ) : stopDecision ? (
        <StopScreen
          decision={stopDecision}
          onBack={() => setStopDecision(null)}
          onReRoute={tellMore}
        />
      ) : (
        <>
          {(offline || LANGUAGES[lang].coverage !== 'full') && (
            <div className="flex flex-col gap-2 px-3.5 pt-3">
              {offline && <Banner tone="offline">{tr('offlineBanner')}</Banner>}
              {/* honest coverage signpost (deep-audit §6(e), Tier 2) */}
              {LANGUAGES[lang].coverage !== 'full' && <Banner tone="info">{tr('coverageNotice')}</Banner>}
            </div>
          )}
          <div className={spanRow}>
            <Thread
              scrollKey={`${items.length}-${busy}-${stageLabel ?? ''}`}
              autoScroll={items.length > 0}
              focusSelector={focusSelector}
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
                  <h1
                    className={
                      'font-serif text-[2.1rem] font-semibold leading-[1.12] text-fg-primary' +
                      (lang === 'en' ? ' tracking-[-0.02em]' : '')
                    }
                  >
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
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => navigate('/dev')}>
                    Scenario launcher (dev)
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    leadingIcon={<IconPlay className="size-3.5" />}
                    onClick={() => navigate('/replay')}
                  >
                    {tr('replayWatch')}
                  </Button>
                </div>
              </div>
            )}

            {threadItems.map((item) => {
              switch (item.kind) {
                case 'user':
                  return (
                    <MessageBubble
                      key={item.id}
                      role="user"
                      dataId={item.id}
                    >
                      {item.text}
                    </MessageBubble>
                  )
                case 'assistant':
                  return (
                    <MessageBubble
                      key={item.id}
                      role="assistant"
                      dataId={item.id}
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
                case 'noticecard':
                  return (
                    <MessageBubble key={item.id} role="assistant" dataId={item.id}>
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
                    <MessageBubble key={item.id} role="assistant" dataId={item.id}>
                      <FindingCard
                        data={findingData}
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
                    <div key={item.id} data-chat-item={item.id} className="scroll-mt-20 ps-7">
                      <ActionLadder
                        mode={item.variant ?? 'full'}
                        onOpenNotice={() => setNoticeOpen(true)}
                        facts={matterFacts}
                      />
                    </div>
                  )
                case 'caution':
                  return (
                    <MessageBubble key={item.id} role="assistant" dataId={item.id}>
                      <CautionCard
                        decision={item.decision}
                        onConsumer={reConsumer}
                        onNotice={reNotice}
                        onOther={() => reOther(item.decision)}
                        onDiscard={() => {
                          setItems((prev) => prev.filter((i) => i.id !== item.id))
                          toast('Caution card discarded')
                        }}
                      />
                    </MessageBubble>
                  )
                case 'closeout':
                  return (
                    <div key={item.id} data-chat-item={item.id} className="scroll-mt-20 ps-7">
                      <CloseOutCard findingTitle={findingData.title} />
                    </div>
                  )
                case 'factcheck':
                  return (
                    <MessageBubble key={item.id} role="assistant" dataId={item.id}>
                      <FactCheckCard
                        facts={factItems}
                        whenOptions={whenOptions}
                        onConfirm={confirmFacts}
                      />
                    </MessageBubble>
                  )
                case 'protective':
                  return (
                    <MessageBubble key={item.id} role="assistant" dataId={item.id}>
                      <ProtectiveCard
                        decision={item.decision!}
                        onOpenGuide={() => setStopDecision(item.decision ?? null)}
                        onReRoute={tellMore}
                      />
                    </MessageBubble>
                  )
                case 'handover':
                  return (
                    <div key={item.id} data-chat-item={item.id} className="scroll-mt-20 ps-7">
                      <HandoverCard
                        tierLabel={item.decision?.tier === 'caution' ? tr('tierCaution') : tr('tierHardStop')}
                        why={item.decision?.why ?? ''}
                      />
                    </div>
                  )
                case 'error':
                  return (
                    <div key={item.id} data-chat-item={item.id} className="scroll-mt-20 ps-7">
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
