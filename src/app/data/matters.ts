/**
 * Mock matters backing the History tab and matter-detail views (v1's
 * stage-driven case experience, condensed to the v2 spine). Fictional only.
 */
export type MatterTier = 'consumer' | 'notice' | 'stop'
export type StageStatus = 'done' | 'current' | 'todo'

export interface MatterStage {
  key: string
  label: string
  status: StageStatus
}

export interface MatterRecord {
  id: string
  title: string
  when: string
  tier: MatterTier
  stages: MatterStage[]
  finding?: { title: string; summary: string }
  sources: { label: string; section: string; coverage: 'direct' | 'related' | 'missing' }[]
  receipt?: { tierLabel: string; why: string }
}

const S = (key: string, label: string, status: StageStatus): MatterStage => ({ key, label, status })

const DONE = (key: string, label: string) => S(key, label, 'done')
const NOW = (key: string, label: string) => S(key, label, 'current')
const TODO = (key: string, label: string) => S(key, label, 'todo')

export const MATTERS: MatterRecord[] = [
  {
    id: 'h1',
    title: 'Mixer grinder — refund refused',
    when: 'Today, 10:24',
    tier: 'consumer',
    stages: [
      DONE('intake', 'Intake'),
      DONE('clarify', 'Clarify'),
      DONE('verify', 'Fact check'),
      NOW('assess', 'Assessment'),
      TODO('plan', 'Plan'),
      TODO('packet', 'Packet'),
    ],
    finding: {
      title: 'Cracked on arrival is a product defect',
      summary:
        'The seller is responsible for the condition of what they sold. Asking HomeKart for a refund or a replacement is a normal, reasonable ask — keep the bill, the photos and every chat with customer care.',
    },
    sources: [
      { label: 'Consumer Protection Act, 2019', section: 'S. 2(10) [VERIFY]', coverage: 'direct' },
      { label: 'Consumer Protection Act, 2019', section: 'S. 35 [VERIFY]', coverage: 'related' },
    ],
  },
  {
    id: 'h2',
    title: 'Property-tax demand (Marathi notice)',
    when: 'Yesterday',
    tier: 'notice',
    stages: [
      DONE('intake', 'Intake'),
      DONE('read', 'Document read'),
      NOW('fields', 'Field check'),
      TODO('explain', 'Explainer'),
    ],
    sources: [
      { label: 'Mumbai Municipal Corporation Act, 1888', section: 'S. 149 [VERIFY]', coverage: 'direct' },
    ],
  },
  {
    id: 'h3',
    title: 'Eviction letter from landlord',
    when: '12 Oct',
    tier: 'stop',
    stages: [
      DONE('intake', 'Intake'),
      DONE('scope', 'Scope check'),
      DONE('stop', 'Protective stop'),
      NOW('handover', 'Handover'),
    ],
    receipt: {
      tierLabel: 'Outside safe scope',
      why: 'Housing disputes move fast and mistakes can cost you your home. A person should look at it.',
    },
    sources: [],
  },
]

export function matterById(id: string): MatterRecord | undefined {
  return MATTERS.find((m) => m.id === id)
}
