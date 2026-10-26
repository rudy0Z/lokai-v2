import { useEffect, useRef, useState } from 'react'
import { useApp } from '../lib/app-context'
import { navigate } from '../lib/router'
import { REPLAY_SCRIPTS, replayById, type ReplayScript } from '../data/replays'
import { FINDING } from '../data/refund-journey'
import { AppShell } from '../components/ui/shell'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Chip } from '../components/ui/Chip'
import { Thread } from '../components/chat/Thread'
import { MessageBubble } from '../components/chat/MessageBubble'
import { StreamText } from '../components/chat/StreamText'
import { FindingCard } from '../components/cards/FindingCard'
import { ActionLadder } from '../components/cards/ActionLadder'
import { FactCheckCard, type FactItem } from '../components/cards/FactCheckCard'
import { HandoverCard } from '../components/cards/HandoverCard'
import { ProtectiveCard } from '../components/stop/ProtectiveCard'
import { VoiceOrb } from '../components/voice/VoiceOrb'
import { IconPlay } from '../components/ui/icons'

/**
 * Replay mode: a prepared conversation plays itself with simulated HUMAN
 * actions — typing into the composer, tapping a reply chip, the voice beat.
 * The viewer just watches (play/pause/restart/speed). Nothing is live.
 */

type ReplayItem =
  | { id: number; kind: 'user'; text: string }
  | { id: number; kind: 'assistant'; text: string; stream?: boolean }
  | { id: number; kind: 'system'; text: string }
  | { id: number; kind: 'chips'; question: string; options: string[]; select: number; tapped: boolean }
  | { id: number; kind: 'voice'; seconds: number; transcript: string; revealed: boolean }
  | { id: number; kind: 'card'; card: 'factcheck' | 'finding' | 'ladder' | 'protective' | 'handover'; why?: string }

const FACT_ITEMS: FactItem[] = [
  { key: 'item', label: 'Item', value: 'Mixer grinder' },
  { key: 'seller', label: 'Seller', value: 'HomeKart' },
  { key: 'issue', label: 'Issue', value: 'Arrived cracked' },
  { key: 'ask', label: 'Refused', value: 'Refund and replacement' },
  { key: 'when', label: 'Bought', value: '1 to 2 years ago' },
]

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

const streamMs = (text: string) => text.split(/\s+/).length * 45 + 600

/** Omit that distributes over the union (plain Omit collapses it). */
type DistOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never

export default function ReplayPage({ id }: { id?: string }) {
  const script = replayById(id)
  if (!id) return <ReplayPicker />
  if (!script) return <ReplayPicker missing />
  return <ReplayPlayer key={script.id} script={script} />
}

function ReplayPicker({ missing = false }: { missing?: boolean }) {
  const { tr } = useApp()
  return (
    <AppShell showTabs={false} topBarExtra={<Button variant="ghost" size="sm" onClick={() => navigate('/')}>{tr('back')}</Button>}>
      <div className="scroll-calm flex-1 overflow-y-auto px-4 py-5">
        <div className="mx-auto flex max-w-[340px] flex-col gap-4">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-fg-primary">{tr('replayBadge')}</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-fg-secondary">{tr('replayHint')}</p>
          </div>
          {missing && <p className="text-sm text-fg-tertiary">Unknown replay.</p>}
          {REPLAY_SCRIPTS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => navigate(`/replay/${s.id}`)}
              className="pressable bg-card rounded-[22px] p-4 text-start"
            >
              <div className="flex items-center gap-2">
                <Badge tone="brand" variant="outline">{s.mode === 'voice' ? tr('listen') : tr('typeInstead')}</Badge>
                <span className="text-sm font-semibold text-fg-primary" lang="en">{s.label}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-fg-secondary" lang="en">{s.blurb}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-2xs font-semibold text-brand-fg">
                <IconPlay className="size-3.5" /> {tr('replayPlay')}
              </span>
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

function ReplayPlayer({ script }: { script: ReplayScript }) {
  const { tr } = useApp()
  const [items, setItems] = useState<ReplayItem[]>([])
  const [typing, setTyping] = useState('')
  const [playing, setPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [finished, setFinished] = useState(false)
  /** bumped by restart to tear down the running loop (state, not a ref:
      a ref in the deps array would restart the loop on every render) */
  const [runToken, setRunToken] = useState(0)
  const idRef = useRef(0)
  const stepRef = useRef(0)
  const speedRef = useRef(1)
  speedRef.current = speed

  const nextId = () => ++idRef.current
  const push = (item: DistOmit<ReplayItem, 'id'>) => {
    const id = nextId()
    setItems((prev) => [...prev, { ...item, id } as ReplayItem])
    return id
  }
  const patch = (id: number, change: Partial<ReplayItem>) =>
    setItems((prev) => prev.map((i) => (i.id === id ? ({ ...i, ...change } as ReplayItem) : i)))

  useEffect(() => {
    if (!playing) return
    let dead = false
    const alive = () => !dead

    const run = async () => {
      const steps = script.steps
      while (!dead && stepRef.current < steps.length) {
        const step = steps[stepRef.current]!
        const s = speedRef.current
        switch (step.kind) {
          case 'typing': {
            for (let i = 1; i <= step.text.length; i++) {
              if (!alive()) return
              setTyping(step.text.slice(0, i))
              await sleep(26 / s)
            }
            if (!alive()) return
            push({ kind: 'user', text: step.text })
            setTyping('')
            await sleep(420 / s)
            break
          }
          case 'assistant': {
            if (!alive()) return
            const itemId = push({ kind: 'assistant', text: step.text, stream: step.stream ?? false })
            await sleep((step.stream ? streamMs(step.text) : 320) / s)
            if (!alive()) return
            if (step.stream) patch(itemId, { stream: false })
            await sleep(260 / s)
            break
          }
          case 'system': {
            if (!alive()) return
            push({ kind: 'system', text: step.text })
            await sleep(500 / s)
            break
          }
          case 'chips': {
            if (!alive()) return
            const itemId = push({
              kind: 'chips',
              question: step.question,
              options: step.options,
              select: step.select,
              tapped: false,
            })
            await sleep(800 / s)
            if (!alive()) return
            patch(itemId, { tapped: true })
            await sleep(520 / s)
            if (!alive()) return
            push({ kind: 'user', text: step.options[step.select]! })
            setItems((prev) => prev.filter((i) => i.id !== itemId))
            await sleep(340 / s)
            break
          }
          case 'voice': {
            if (!alive()) return
            const itemId = push({
              kind: 'voice',
              seconds: step.seconds,
              transcript: step.transcript,
              revealed: false,
            })
            await sleep((step.seconds * 1000 + 700) / s)
            if (!alive()) return
            patch(itemId, { revealed: true })
            await sleep(1300 / s)
            if (!alive()) return
            push({ kind: 'user', text: step.transcript })
            await sleep(420 / s)
            break
          }
          case 'card': {
            if (!alive()) return
            push({ kind: 'card', card: step.card, why: step.why })
            await sleep((step.card === 'factcheck' ? 1500 : 900) / s)
            break
          }
          case 'pause': {
            await sleep(step.ms / s)
            break
          }
        }
        if (!alive()) return
        stepRef.current += 1
      }
      if (alive()) {
        setPlaying(false)
        setFinished(true)
      }
    }
    void run()
    return () => {
      dead = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, runToken])

  const restart = () => {
    stepRef.current = 0
    idRef.current = 0
    setItems([])
    setTyping('')
    setFinished(false)
    setSpeed(1)
    setPlaying(true)
    setRunToken((t) => t + 1)
  }

  const progress = Math.round((stepRef.current / script.steps.length) * 100)

  return (
    <AppShell
      showTabs={false}
      topBarExtra={
        <div className="flex items-center gap-2">
          <Badge tone="brand" variant="outline">{tr('replayBadge')}</Badge>
          <Button variant="ghost" size="sm" onClick={() => navigate('/replay')}>
            {tr('back')}
          </Button>
        </div>
      }
      footer={
        <div className="rounded-[26px] bg-sunken px-4 py-3">
          {typing ? (
            <p className="min-h-6 truncate text-base text-fg-primary" lang="en" aria-label="Simulated typing">
              {typing}
              <span className="stream-caret" aria-hidden="true" />
            </p>
          ) : (
            <p className="min-h-6 text-base text-fg-tertiary">
              {finished ? 'Replay finished.' : tr('replayHint')}
            </p>
          )}
        </div>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col">
        {/* player control bar */}
        <div className="flex items-center gap-2 border-b border-line-default bg-shell px-3.5 py-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPlaying((p) => !p)}
            disabled={finished}
          >
            {playing ? tr('replayPause') : tr('replayPlay')}
          </Button>
          <Button variant="ghost" size="sm" onClick={restart}>
            {tr('replayRestart')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSpeed((v) => (v === 1 ? 1.5 : 1))}
            aria-pressed={speed !== 1}
          >
            {speed}×
          </Button>
          <div className="ms-auto flex min-w-8 items-center gap-1.5">
            <div className="h-1 w-16 overflow-hidden rounded-full bg-container" aria-hidden="true">
              <div className="h-full rounded-full bg-brand-solid transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-2xs tabular-nums text-fg-tertiary">{progress}%</span>
          </div>
        </div>

        <Thread scrollKey={`${items.length}-${typing.length}-${playing}`} autoScroll>
          <div className="flex flex-col gap-1 px-3.5 pb-6 pt-3">
            <p className="mb-1 font-serif text-lg font-semibold text-fg-primary" lang="en">
              {script.label}
            </p>
            <p className="mb-2 text-sm leading-relaxed text-fg-secondary" lang="en">
              {script.blurb}
            </p>

            {items.map((item) => {
              switch (item.kind) {
                case 'user':
                  return (
                    <MessageBubble key={item.id} role="user">
                      {item.text}
                    </MessageBubble>
                  )
                case 'assistant':
                  return (
                    <MessageBubble key={item.id} role="assistant">
                      {item.stream ? (
                        <p className="whitespace-pre-line text-sm leading-relaxed">
                          <StreamText
                            text={item.text}
                            onDone={() => patch(item.id, { stream: false })}
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
                  return (
                    <div key={item.id} className="flex flex-col gap-2.5 ps-7">
                      <p className="text-sm font-medium text-fg-primary" lang="en">{item.question}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.options.map((o, idx) => (
                          <Chip key={o} selected={item.tapped && idx === item.select} lang="en">
                            {o}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )
                case 'voice':
                  return (
                    <MessageBubble key={item.id} role="assistant">
                      <Card className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <VoiceOrb state={item.revealed ? 'idle' : 'listening'} size="md" />
                          <span className="font-mono text-2xs text-fg-tertiary" lang="en">
                            0:0{item.seconds} / 0:0{item.seconds}
                          </span>
                          <Badge tone="warning" variant="subtle">{tr('simulatedTag')}</Badge>
                        </div>
                        <div className="waveform" aria-hidden="true">
                          {Array.from({ length: 24 }, (_, i) => (
                            <span key={i} className="wave-bar" />
                          ))}
                        </div>
                        {item.revealed && (
                          <p className="font-serif text-sm leading-relaxed text-fg-primary" lang="en">
                            “{item.transcript}”
                          </p>
                        )}
                      </Card>
                    </MessageBubble>
                  )
                case 'card':
                  if (item.card === 'factcheck')
                    return (
                      <MessageBubble key={item.id} role="assistant">
                        <FactCheckCard facts={FACT_ITEMS} onConfirm={() => { /* simulated tap: the script continues */ }} />
                      </MessageBubble>
                    )
                  if (item.card === 'finding')
                    return (
                      <MessageBubble key={item.id} role="assistant">
                        <FindingCard data={FINDING} />
                      </MessageBubble>
                    )
                  if (item.card === 'ladder')
                    return (
                      <div key={item.id} className="ps-7">
                        <ActionLadder mode="full" onOpenNotice={() => navigate('/notice')} />
                      </div>
                    )
                  if (item.card === 'protective')
                    return (
                      <MessageBubble key={item.id} role="assistant">
                        <ProtectiveCard
                          decision={{ tier: 'hard-stop', label: 'Threats and intimidation', why: item.why ?? '', certainty: 'matched' }}
                          onOpenGuide={() => navigate('/')}
                          onReRoute={() => navigate('/')}
                        />
                      </MessageBubble>
                    )
                    return (
                      <div key={item.id} className="ps-7">
                        <HandoverCard tierLabel={tr('tierHardStop')} why={item.why ?? ''} />
                      </div>
                    )
                default:
                  return null
              }
            })}
          </div>
        </Thread>
      </div>
    </AppShell>
  )
}
