import { REASSURANCE } from './refund-journey'
import type { ScopeDecision } from './scope-rules'

/**
 * Replay mode: prepared conversations that play themselves back with
 * simulated HUMAN actions — typing into the composer, tapping a reply chip,
 * confirming the fact gate — so a viewer can watch how LokAI behaves
 * end-to-end without touching anything. Nothing is live; everything here is
 * the same scripted data the interactive demo uses.
 */
export type ReplayStep =
  /** human typing into the composer (char-by-char simulation) */
  | { kind: 'typing'; text: string }
  | { kind: 'assistant'; text: string; stream?: boolean }
  | { kind: 'system'; text: string }
  /** a quick-reply row the simulated human taps (select = index) */
  | { kind: 'chips'; question: string; options: string[]; select: number }
  /** the simulated voice capture beat, then the reviewed transcript auto-sends */
  | { kind: 'voice'; seconds: number; transcript: string }
  | { kind: 'card'; card: 'factcheck' | 'finding' | 'ladder' | 'protective' | 'handover'; why?: string }
  | { kind: 'pause'; ms: number }

export interface ReplayScript {
  id: string
  label: string
  mode: 'text' | 'voice'
  blurb: string
  steps: ReplayStep[]
}

const THREAT_DECISION: ScopeDecision = {
  tier: 'hard-stop',
  ruleId: 'threat-intimidation',
  label: 'Threats and intimidation',
  why: 'Threats or intimidation are a safety matter first. A human helper — the police, or a lawyer — must look at this, not an automated tool.',
  certainty: 'matched',
}

export const REPLAY_SCRIPTS: ReplayScript[] = [
  {
    id: 'refund-typed',
    label: 'Refund refused — typed journey',
    mode: 'text',
    blurb:
      'A mixer grinder arrives cracked and the seller refuses a refund. The human types, answers one question, signs the fact gate — and gets the finding plus the lowest-risk-first ladder.',
    steps: [
      {
        kind: 'typing',
        text: 'I bought a mixer grinder from HomeKart about 1 year ago. It arrived cracked and they refused a refund. What can I do?',
      },
      { kind: 'assistant', text: REASSURANCE.hassle.en!, stream: true },
      {
        kind: 'chips',
        question: 'When did you buy it?',
        options: ['Within 30 days', '1 to 2 years ago', 'More than 2 years ago', 'Not sure'],
        select: 1,
      },
      { kind: 'card', card: 'factcheck' },
      { kind: 'pause', ms: 1600 },
      { kind: 'card', card: 'finding' },
      { kind: 'pause', ms: 600 },
      { kind: 'card', card: 'ladder' },
    ],
  },
  {
    id: 'threat-voice',
    label: 'Seller threats — voice journey',
    mode: 'voice',
    blurb:
      'A seller threatens a customer for filing a complaint. The human speaks instead of typing — and LokAI stops carefully: the protective card stays inside the conversation, with the emergency channel and the handover packet.',
    steps: [
      {
        kind: 'voice',
        seconds: 3,
        transcript:
          'The seller is threatening me. He says he will send people to my home if I file a consumer complaint.',
      },
      { kind: 'system', text: 'Outside safe scope' },
      { kind: 'card', card: 'protective', why: THREAT_DECISION.why },
      { kind: 'card', card: 'handover', why: THREAT_DECISION.why },
    ],
  },
]

export function replayById(id: string | undefined): ReplayScript | undefined {
  return REPLAY_SCRIPTS.find((s) => s.id === id)
}
