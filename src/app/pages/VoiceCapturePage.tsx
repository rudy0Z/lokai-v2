import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { useApp } from '../lib/app-context'
import { navigate } from '../lib/router'
import { LANG_ORDER, LANGUAGES, type LangCode } from '../data/languages'
import { VOICE_SAMPLES, formatClock } from '../data/voice-samples'
import { AppShell } from '../components/ui/shell'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { VoiceOrb } from '../components/voice/VoiceOrb'
import { IconCamera, IconKeyboard, IconMic, IconPencil, IconStop } from '../components/ui/icons'

type CaptureState = 'listening' | 'review'

/**
 * Simulated voice capture (Phase V): listening (timer + waveform, mic never
 * touched) -> review & send ("Here's what I heard", editable transcript).
 * The whole surface is tagged simulated (A7).
 */
export default function VoiceCapturePage() {
  const { tr, lang } = useApp()
  const [phase, setPhase] = useState<CaptureState>('listening')
  const [seconds, setSeconds] = useState(0)
  const [transcript, setTranscript] = useState(VOICE_SAMPLES[lang])
  const [detected, setDetected] = useState<LangCode | 'auto'>(lang)
  const secondsRef = useRef(0)

  useEffect(() => {
    if (phase !== 'listening') return
    const t = window.setInterval(() => {
      secondsRef.current += 1
      setSeconds(secondsRef.current)
    }, 1000)
    return () => window.clearInterval(t)
  }, [phase])

  const stop = () => setPhase('review')

  const send = () => {
    const text = transcript.trim()
    if (!text) {
      toast.error(tr('errorTitle'))
      return
    }
    try {
      window.sessionStorage.setItem('lokai.pendingTranscript', text)
    } catch {
      /* ignore */
    }
    navigate('/')
  }

  if (phase === 'listening') {
    return (
      <AppShell showTabs={false} topBarExtra={<Button variant="ghost" size="sm" onClick={() => navigate('/')}>{tr('back')}</Button>}>
        <div className="flex flex-1 flex-col items-center justify-between px-6 pb-8 pt-10">
          <div className="flex flex-col items-center gap-1">
            <h1 className="font-serif text-2xl font-semibold text-fg-primary">{tr('listening')}</h1>
            <p className="font-mono text-sm text-fg-tertiary" lang="en">{formatClock(seconds)}</p>
          </div>

          <div className="flex flex-col items-center gap-7">
            <button type="button" onClick={stop} aria-label={tr('tapToStop')} className="rounded-full outline-offset-8">
              <VoiceOrb state="listening" size="lg" />
            </button>
            <div className="w-full max-w-[300px] rounded-2xl border border-line-default bg-card p-4">
              <div className="waveform" aria-hidden="true">
                {Array.from({ length: 28 }, (_, i) => (
                  <span key={i} className="wave-bar" />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-fg-secondary">{VOICE_SAMPLES[lang]}</p>
            </div>
            <p className="max-w-[280px] text-center text-2xs text-fg-tertiary">{tr('speakNaturally')}</p>
          </div>

          <div className="flex w-full max-w-[300px] flex-col items-center gap-2.5">
            <Button variant="secondary" size="lg" block leadingIcon={<IconStop className="size-4 text-danger-fg" />} onClick={stop}>
              {tr('tapToStop')}
            </Button>
            <Badge tone="warning" variant="subtle">{tr('simulatedTag')}</Badge>
            <p className="text-2xs text-fg-tertiary">{tr('simulatedVoiceNote')}</p>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell showTabs={false} topBarExtra={<Button variant="ghost" size="sm" onClick={() => setPhase('listening')}>{tr('back')}</Button>}>
      <div className="scroll-calm flex-1 overflow-y-auto px-4 py-5">
        <div className="mx-auto flex max-w-[340px] flex-col gap-4">
          <div>
            <h1 className="font-serif text-2xl font-semibold leading-snug text-fg-primary">{tr('heardTitle')}</h1>
            <p className="mt-1 text-2xs text-fg-tertiary">{tr('heardSub')}</p>
          </div>

          <div className="relative rounded-2xl border border-line-default bg-card p-4">
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={6}
              aria-label={tr('heardTitle')}
              className="w-full resize-none bg-transparent font-serif text-base leading-relaxed text-fg-primary focus:outline-none"
            />
            <span className="absolute end-3 top-3 text-fg-tertiary" aria-hidden="true">
              <IconPencil className="size-4" />
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-2xs font-medium text-fg-secondary">{tr('detectedLang')}</p>
            <div className="flex items-center gap-2">
              <select
                value={detected}
                onChange={(e) => setDetected(e.target.value as LangCode | 'auto')}
                aria-label={tr('detectedLang')}
                className="min-h-11 flex-1 rounded-xl border border-line-default bg-container px-3 text-sm text-fg-primary focus-visible:border-brand-line focus-visible:outline-none"
              >
                <option value="auto">{`${LANGUAGES[lang].english} (${tr('autoDetect')})`}</option>
                {LANG_ORDER.map((c) => (
                  <option key={c} value={c}>{LANGUAGES[c].english}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-2xs font-medium text-fg-secondary">{tr('addDetails')}</p>
            {(
              [
                { icon: <IconCamera className="size-4" />, label: tr('addFilePhoto') },
                { icon: <IconMic className="size-4" />, label: tr('addLocation') },
                { icon: <IconKeyboard className="size-4" />, label: tr('specifyDate') },
              ] as const
            ).map((row) => (
              <button
                key={row.label}
                type="button"
                onClick={() => toast('Attachments are mocked in this prototype')}
                className="flex min-h-11 items-center gap-2.5 rounded-xl border border-line-default bg-container px-3 text-start text-sm text-fg-primary transition-colors hover:bg-component-hover"
              >
                <span className="text-fg-tertiary">{row.icon}</span>
                {row.label}
              </button>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
            <Button variant="primary" size="lg" block onClick={send}>
              {tr('sendToLokai')}
            </Button>
            <p className="mt-2 text-center text-2xs text-fg-tertiary">
              <Badge tone="warning" variant="subtle">{tr('simulatedTag')}</Badge>
            </p>
          </motion.div>
        </div>
      </div>
    </AppShell>
  )
}
