/**
 * The ONE legal-content store (A6). Rules:
 *  - Do NOT invent statute section numbers, limitation periods, fees or
 *    helpline numbers. Anything unverified carries a [VERIFY] marker.
 *  - Every entry starts verified:false in this prototype. The owner verifies
 *    before flipping.
 *  - Nothing user-facing may cite law outside this file.
 */
export interface LegalEntry {
  id: string
  /** the claim in plain words */
  claim: string
  /** where the claim comes from (statute / official channel / practice note) */
  source: string
  sectionRef: string
  verified: boolean
  lastChecked: string
  notes?: string
}

export const LEGAL_CONTENT: LegalEntry[] = [
  {
    id: 'cpa-defect-goods',
    claim:
      'Goods that arrive damaged or faulty can count as a "defect" under the Consumer Protection Act, 2019 — the seller is responsible for the condition of what they sold.',
    source: 'Consumer Protection Act, 2019 (India)',
    sectionRef: 'S. 2(10) [VERIFY — exact definition wording]',
    verified: false,
    lastChecked: '2026-10-25',
    notes: 'Ported from v1 research; owner must verify section text before any verified flip.',
  },
  {
    id: 'cpa-complaint-where',
    claim:
      'A consumer complaint can be filed with the appropriate District Consumer Commission, including electronically.',
    source: 'Consumer Protection Act, 2019 (India)',
    sectionRef: 'S. 35 [VERIFY — filing provision and current procedure]',
    verified: false,
    lastChecked: '2026-10-25',
    notes:
      'Electronic filing has moved to e-Jagriti (which absorbed the earlier e-Daakhil portal). Re-verify the current channel name and URL before any verified flip.',
  },
  {
    id: 'cpa-limitation',
    claim:
      'Consumer complaints generally have a two-year filing window from when the cause of action arose under Section 69; a Commission can sometimes condone delay for recorded reasons, but condonation is discretionary, not a right.',
    source: 'Consumer Protection Act, 2019 (India)',
    sectionRef: 'S. 69 [VERIFY — limitation period and condonation rule]',
    verified: false,
    lastChecked: '2026-10-31',
    notes: 'Primary text verified: 2-year window from cause of action. Delay can be condoned for sufficient cause under S. 69(2).',
  },
  {
    id: 'national-consumer-helpline',
    claim:
      'A free national consumer helpline exists to register and route consumer complaints.',
    source: 'Government of India consumer helpline',
    sectionRef: '1915 [VERIFY — number, hours, languages]',
    verified: false,
    lastChecked: '2026-10-25',
    notes: 'v1 consistently used 1915; verify before any verified flip.',
  },
  {
    id: 'cpa-e-jagriti',
    claim:
      'A consumer can file a complaint online on the unified e-Jagriti portal before the District Commission where they reside or work, covering claims up to ₹50 lakh.',
    source: 'Consumer Protection Act, 2019 / e-Jagriti (India)',
    sectionRef: 'S. 35 & S. 34(2) [VERIFY — e-Jagriti electronic filing & ₹50L pecuniary limit]',
    verified: false,
    lastChecked: '2026-10-31',
    notes: 'e-Jagriti absorbed e-Daakhil. 2021 Jurisdiction Rules set District Commission pecuniary limit at ₹50 lakh.',
  },
  {
    id: 'dlsa-routing',
    claim:
      'District Legal Services Authorities provide free legal aid under Section 12 of the Legal Services Authorities Act, 1987, and front offices are located at District Court ADR Centres.',
    source: 'Legal Services Authorities Act, 1987 (India)',
    sectionRef: 'S. 12 [VERIFY — DLSA eligibility & court complex front offices]',
    verified: false,
    lastChecked: '2026-10-31',
    notes: 'Free legal aid eligibility under S. 12. Helpdesk front offices sit in District Court complexes.',
  },
  {
    id: 'nalsa-15100',
    claim:
      'National Legal Services Authority (NALSA) operates a national toll-free helpline (15100) for free legal aid and advice.',
    source: 'National Legal Services Authority (NALSA)',
    sectionRef: '15100 [VERIFY — national legal aid helpline]',
    verified: false,
    lastChecked: '2026-10-31',
    notes: 'Toll-free national legal assistance hotline.',
  },
  {
    id: 'emergency-112',
    claim:
      '112 is the single national emergency helpline number across India for police, fire, and health emergencies.',
    source: 'Emergency Response Support System (ERSS)',
    sectionRef: '112 [VERIFY — national emergency helpline]',
    verified: false,
    lastChecked: '2026-10-31',
    notes: 'National unified emergency number.',
  },
  {
    id: 'women-helpline-181',
    claim:
      '181 is the national women helpline providing 24/7 emergency response and referral for women facing violence or threats.',
    source: 'Ministry of Women and Child Development (India)',
    sectionRef: '181 [VERIFY — women helpline]',
    verified: false,
    lastChecked: '2026-10-31',
    notes: 'National women distress and emergency helpline.',
  },
  {
    id: 'cpa-ecommerce-grievance',
    claim:
      'An online marketplace must run a grievance process for defective deliveries, and its own store policy cannot shorten or waive the remedies the law gives the consumer.',
    source: 'Consumer Protection (E-Commerce) Rules, 2020',
    sectionRef: 'R. 4(4)–(5) [VERIFY — 48h acknowledgement & 1-month redressal]',
    verified: false,
    lastChecked: '2026-10-31',
    notes: 'Backs the refund-domain playbook. Grievance officer must acknowledge within 48h and redress within 1 month.',
  },
  {
    id: 'tpa-wear-tear',
    claim:
      'A tenant must return premises as received, allowing for reasonable wear and tear — routine repainting after a long stay is the owner’s cost, and deductions need itemised bills.',
    source: 'Transfer of Property Act, 1882 (India)',
    sectionRef: 'S. 108 [VERIFY — clause letter; state rent acts may override]',
    verified: false,
    lastChecked: '2026-10-31',
    notes: 'Backs the deposit-domain playbook. Act IV of 1882. State-specific rent/control acts must be checked before any flip.',
  },
  {
    id: 'tpa-implied-tenancy',
    claim:
      'Regular rent payments and a deposit transfer can establish a month-to-month tenancy even without a written agreement.',
    source: 'Transfer of Property Act, 1882 (India)',
    sectionRef: 'S. 106 [VERIFY — tacit month-to-month tenancy]',
    verified: false,
    lastChecked: '2026-10-31',
    notes: 'Backs the deposit informal (no-agreement) caution. Act IV of 1882.',
  },
  {
    id: 'contract-mistake-72',
    claim:
      'Money paid to another person by mistake can be recovered — the recipient has no right to keep it.',
    source: 'Indian Contract Act, 1872 (India)',
    sectionRef: 'S. 72 [VERIFY — money paid by mistake]',
    verified: false,
    lastChecked: '2026-10-28',
    notes: 'Backs the UPI wrong-credit playbook.',
  },
  {
    id: 'npci-wrong-credit',
    claim:
      'Banks and the payment network run a wrong-credit dispute mechanism to request reversal review, though an automatic account freeze is not guaranteed.',
    source: 'NPCI UPI dispute redressal mechanism',
    sectionRef: '[VERIFY — circular number & dispute window]',
    verified: false,
    lastChecked: '2026-10-31',
    notes: 'Backs the UPI playbook ladder. Bank-to-bank dispute framework exists; hold/lien is requested, not guaranteed.',
  },
  {
    id: 'payment-wages-ff',
    claim:
      'After the notice period is served and assets are cleared, earned wages must be released; white-collar employees and resignation dues rely on State Shops and Establishments Acts and conciliation portals [VERIFY].',
    source: 'Payment of Wages Act, 1936 / state labour grievance portals',
    sectionRef: '[VERIFY — S&E acts applicability & conciliation portal URL]',
    verified: false,
    lastChecked: '2026-10-31',
    notes: 'PWA has ₹24k/month ceiling and industrial establishment scope. White-collar IT resignation relies on S&E Acts.',
  },
  {
    id: 'cyber-fraud-report',
    claim:
      'A national cybercrime reporting channel exists to flag fraudulent or withheld payment transactions quickly, and the receiving account can be flagged.',
    source: 'National cybercrime reporting portal / helpline',
    sectionRef: '1930 [VERIFY — number & portal]',
    verified: false,
    lastChecked: '2026-10-28',
    notes: 'Backs the refund-informal and UPI playbooks. Same [VERIFY] pattern as the 1915 entry.',
  },
  {
    id: 'mmc-property-tax',
    claim:
      'Municipal corporations issue annual property-tax demands under their governing municipal act; the demand notice states the amount, the period, and the payment deadline.',
    source: 'Mumbai Municipal Corporation Act, 1888',
    sectionRef: '[VERIFY — municipal tax assessment provision; S. 149 concerns notice of transfer of title]',
    verified: false,
    lastChecked: '2026-10-31',
    notes: 'Cited by the notice-interpretation scenario. Section 149 is transfer of title; annual demand section requires verification.',
  },
]

export function legalById(id: string): LegalEntry | undefined {
  return LEGAL_CONTENT.find((e) => e.id === id)
}

/**
 * Epistemic confidence resolver (Law 2 — no fabricated confidence).
 * If any referenced backing statute entry is unverified (`verified: false`),
 * the confidence level is programmatically clamped to at most 'likely'.
 * 'clear' may ONLY be rendered when backing legal records are verified by owner.
 */
export function resolveConfidence(
  requested: 'clear' | 'likely' | 'unsure',
  legalIds?: string | string[],
): 'clear' | 'likely' | 'unsure' {
  if (requested !== 'clear') return requested
  const ids = Array.isArray(legalIds) ? legalIds : legalIds ? [legalIds] : []
  const allVerified = ids.length > 0 && ids.every((id) => legalById(id)?.verified === true)
  return allVerified ? 'clear' : 'likely'
}
