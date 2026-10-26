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
      'There is a time limit for filing consumer complaints, counted from when the cause of action arose; delay can sometimes be condoned.',
    source: 'Consumer Protection Act, 2019 (India)',
    sectionRef: '[VERIFY — limitation period and condonation rule]',
    verified: false,
    lastChecked: '2026-10-25',
    notes: 'Deliberately NO number stated anywhere in the UI until verified.',
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
    id: 'dlsa-routing',
    claim:
      'District Legal Services Authorities provide free legal aid and are organised district-wise.',
    source: 'Legal Services Authorities Act, 1987 (India)',
    sectionRef: '[VERIFY — DLSA contact data per district]',
    verified: false,
    lastChecked: '2026-10-25',
    notes: 'Prototype shows a clearly-marked placeholder contact until real data is added.',
  },
  {
    id: 'mmc-property-tax',
    claim:
      'Municipal corporations issue annual property-tax demands under their governing municipal act; the demand notice states the amount, the period, and the payment deadline.',
    source: 'Mumbai Municipal Corporation Act, 1888',
    sectionRef: 'S. 149 [VERIFY — property-tax demand provision]',
    verified: false,
    lastChecked: '2026-10-26',
    notes: 'Cited by the notice-interpretation scenario. Section number is a placeholder pending verification.',
  },
]

export function legalById(id: string): LegalEntry | undefined {
  return LEGAL_CONTENT.find((e) => e.id === id)
}
