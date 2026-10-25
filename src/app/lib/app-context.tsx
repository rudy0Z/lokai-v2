import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { LANGUAGES, type LangCode } from '../data/languages'
import { UI, type UiKey } from '../data/i18n'

type Theme = 'light' | 'dark'

interface AppContextValue {
  theme: Theme
  toggleTheme: () => void
  lang: LangCode
  setLang: (l: LangCode) => void
  /** localized UI chrome string */
  tr: (key: UiKey) => string
  direction: 'ltr' | 'rtl'
}

const AppContext = createContext<AppContextValue | null>(null)

function readStored<T extends string>(key: string, fallback: T, valid: readonly T[]): T {
  try {
    const v = window.localStorage.getItem(key)
    if (v && (valid as readonly string[]).includes(v)) return v as T
  } catch {
    /* private mode etc. */
  }
  return fallback
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => readStored('lokai.theme', 'light', ['light', 'dark'] as const))
  const [lang, setLangState] = useState<LangCode>(() => readStored('lokai.lang', 'en', ['en', 'hi', 'mr', 'ta', 'ur'] as const))

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const cfg = LANGUAGES[lang]
    document.documentElement.lang = lang
    document.documentElement.dataset.script = cfg.script
    document.documentElement.dir = cfg.direction
  }, [lang])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      try {
        window.localStorage.setItem('lokai.theme', next)
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  const setLang = useCallback((l: LangCode) => {
    setLangState(l)
    try {
      window.localStorage.setItem('lokai.lang', l)
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      theme,
      toggleTheme,
      lang,
      setLang,
      tr: (key: UiKey) => UI[key][lang],
      direction: LANGUAGES[lang].direction,
    }),
    [theme, toggleTheme, lang, setLang],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp outside AppProvider')
  return ctx
}
