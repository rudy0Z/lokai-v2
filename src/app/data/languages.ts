/**
 * Language configuration (A4b). Adding a language = adding ONE entry here plus
 * its strings in i18n.ts. Urdu is the RTL stress test.
 * All non-English strings are AI-drafted placeholders — reviewedByNativeSpeaker
 * is false until a human reviews them. Legal content in any language must
 * additionally pass the [VERIFY] policy in legal-content.ts.
 */
export type LangCode = 'en' | 'hi' | 'mr' | 'ta' | 'ur'
export type ScriptId = 'latin' | 'devanagari' | 'tamil' | 'urdu'
export type Direction = 'ltr' | 'rtl'

export interface LanguageConfig {
  code: LangCode
  english: string
  native: string
  script: ScriptId
  direction: Direction
  /** root font-size scaling set via [data-script] in tokens.css */
  rootScale: string
  /** documented hypothesis, tuned against the specimen route */
  bodyLineHeight: number
  /** single project-wide decision (A4b rule 9): Latin digits everywhere */
  numeralStyle: 'latn'
  reviewedByNativeSpeaker: boolean
}

export const LANGUAGES: Record<LangCode, LanguageConfig> = {
  en: {
    code: 'en',
    english: 'English',
    native: 'English',
    script: 'latin',
    direction: 'ltr',
    rootScale: '16px',
    bodyLineHeight: 1.55,
    numeralStyle: 'latn',
    reviewedByNativeSpeaker: true,
  },
  hi: {
    code: 'hi',
    english: 'Hindi',
    native: 'हिन्दी',
    script: 'devanagari',
    direction: 'ltr',
    rootScale: '17.5px',
    bodyLineHeight: 1.7,
    numeralStyle: 'latn',
    reviewedByNativeSpeaker: false,
  },
  mr: {
    code: 'mr',
    english: 'Marathi',
    native: 'मराठी',
    script: 'devanagari',
    direction: 'ltr',
    rootScale: '17.5px',
    bodyLineHeight: 1.7,
    numeralStyle: 'latn',
    reviewedByNativeSpeaker: false,
  },
  ta: {
    code: 'ta',
    english: 'Tamil',
    native: 'தமிழ்',
    script: 'tamil',
    direction: 'ltr',
    rootScale: '17.25px',
    bodyLineHeight: 1.75,
    numeralStyle: 'latn',
    reviewedByNativeSpeaker: false,
  },
  ur: {
    code: 'ur',
    english: 'Urdu',
    native: 'اردو',
    script: 'urdu',
    direction: 'rtl',
    rootScale: '17px',
    bodyLineHeight: 2.15,
    numeralStyle: 'latn',
    reviewedByNativeSpeaker: false,
  },
}

export const LANG_ORDER: LangCode[] = ['en', 'hi', 'mr', 'ta', 'ur']
