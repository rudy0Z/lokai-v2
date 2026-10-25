/**
 * Scope classification (Phase 2) — visible, editable, NEVER hidden in prose.
 *
 * DOWNGRADE LAW: wrongly proceeding on a hard-stop matter is worse than
 * wrongly pausing a valid claim. When classification is uncertain, the
 * result is CAUTION — never a silent Proceed. `classifyMatter` encodes this.
 */
export type ScopeTier = 'proceed' | 'caution' | 'hard-stop'

export interface ScopeRule {
  id: string
  tier: ScopeTier
  label: string
  /** user-facing why, plain language, no blame */
  why: string
  patterns: RegExp[]
}

export const SCOPE_RULES: ScopeRule[] = [
  {
    id: 'criminal-safety',
    tier: 'hard-stop',
    label: 'Criminal matter or safety risk',
    why: 'This kind of matter can seriously affect your position if handled by an automated tool. A person should look at it.',
    patterns: [/\bfir\b/i, /\bpolice\b/i, /\barrest(ed)?\b/i, /धमकी/, /पुलिस/, /تھریٹ/, /پولیس/],
  },
  {
    id: 'eviction-tenancy',
    tier: 'hard-stop',
    label: 'Eviction or tenancy dispute',
    why: 'Housing disputes move fast and mistakes can cost you your home. A person should look at it.',
    patterns: [/evict/i, /eviction/i, /tenan/i, /landlord/i, /vacate/i, /बेदखल/, /खाली कर/, /मकान मालिक/, /اجارہ داری/, /خالی کرو/],
  },
  {
    id: 'commercial-b2b',
    tier: 'hard-stop',
    label: 'Commercial or business dispute',
    why: 'Business-to-business disputes sit outside consumer-protection scope. A person should look at it.',
    patterns: [/\bb2b\b/i, /my (?:company|business|shop|firm)/i, /business (?:dispute|invoice|contract)/i, /gst/i, /मेरी (?:दुकान|कंपनी)/, /व्यापारी विवाद/, /میرا کاروبار/, /کاروباری جھگڑا/],
  },
  {
    id: 'threat-intimidation',
    tier: 'hard-stop',
    label: 'Threats or intimidation',
    why: 'If you are being threatened, your safety comes first. A person should look at it — and keep every message.',
    patterns: [/threaten/i, /intimidat/i, /blackmail/i, /हथियार/, /धमकी/],
  },
  {
    id: 'possible-time-barred',
    tier: 'caution',
    label: 'Possible time-barred claim',
    why: 'Time limits may apply. They can sometimes be excused — a helper should check your dates before you act.',
    patterns: [/\b(?:3|three|4|four|5|five|ten|10)\s+years?\s+(?:ago|old)\b/i, /बहुत पुराना/, /बरसांपूर्वी/, /बहुत वर्षांपूर्वी/, /کئی سال پہلے/],
  },
  {
    id: 'unclear-facts',
    tier: 'caution',
    label: 'Facts not clear yet',
    why: 'I am not sure I have the full picture. Let us confirm a few facts before choosing a step.',
    patterns: [/not sure/i, /don'?t know/i, /याद नहीं/, /आठवत नाही/, /یاد نہیں/],
  },
]

export interface ScopeDecision {
  tier: ScopeTier
  ruleId?: string
  label: string
  why: string
  /** matched = a rule fired; uncertain = downgrade law applied */
  certainty: 'matched' | 'uncertain'
}

/** Hard-stop wins over caution wins over proceed. Uncertain input -> caution. */
export function classifyMatter(text: string): ScopeDecision {
  const hit = SCOPE_RULES.find((r) => r.patterns.some((p) => p.test(text)))
  if (hit) {
    return { tier: hit.tier, ruleId: hit.id, label: hit.label, why: hit.why, certainty: 'matched' }
  }
  const looksConsumer = /(refund|replace|defect|crack|broken|broke|bill|invoice|seller|order|delivered|warranty|product|item|refund|money back|उत्पाद|रिफंड|खराब|विक्रेता|वस्तू|पैसा|परत|रिफंड|பொருள்|பணம்|رفنڈ|خراب|پیسہ)/i
  if (looksConsumer.test(text) || text.trim().length > 25) {
    return {
      tier: 'proceed',
      label: 'Consumer matter',
      why: '',
      certainty: 'matched',
    }
  }
  // DOWNGRADE LAW in action: too little signal to proceed silently.
  return {
    tier: 'caution',
    label: 'Not sure what this is yet',
    why: 'I am not sure I have the full picture. Tell me a little more and I will route you correctly.',
    certainty: 'uncertain',
  }
}

/** The user's explicit re-entry: "this is actually a consumer matter". */
export function reRouteAsCaution(): ScopeDecision {
  return {
    tier: 'caution',
    label: 'Needs care',
    why: 'Thank you. Because you told me this touches another area, I will stay careful: the free steps below are still safe, and a human helper should double-check the boundary.',
    certainty: 'matched',
  }
}
