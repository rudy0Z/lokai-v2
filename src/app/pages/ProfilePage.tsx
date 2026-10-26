import { toast } from 'sonner'
import { useApp } from '../lib/app-context'
import { AppShell } from '../components/ui/shell'
import { Banner } from '../components/ui/Banner'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { LanguageSelect, ThemeToggle } from '../components/ui/shell'
import { LogoMark } from '../components/ui/LogoMark'
import { ALL_LANGS, LANGUAGES } from '../data/languages'
import { markVaultCleared } from '../lib/vault'

export default function ProfilePage() {
  const { tr, lang, setLang } = useApp()
  return (
    <AppShell activeTab="profile">
      <div className="scroll-calm flex-1 overflow-y-auto px-4 py-5">
        <div className="mx-auto flex max-w-[340px] flex-col gap-4">
          <div className="flex items-center gap-3">
            <LogoMark size="md" />
            <div>
              <p className="text-sm font-semibold text-fg-primary" lang="en">Demo user</p>
              <p className="text-2xs text-fg-tertiary">{tr('profileNote')}</p>
            </div>
          </div>

          <section className="flex flex-col gap-2 rounded-[22px] bg-card p-4">
            <h2 className="text-sm font-semibold text-fg-primary">{tr('langLabel')}</h2>
            <p className="text-2xs text-fg-tertiary">{tr('profileLangsNote')}</p>
            <div className="flex flex-wrap gap-2">
              {ALL_LANGS.map((c) => {
                const cfg = LANGUAGES[c]
                const active = lang === c
                return (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setLang(c)}
                    className={
                      'pressable min-h-11 rounded-full px-4 text-sm font-medium transition-colors ' +
                      (active
                        ? 'bg-brand-solid text-on-brand-solid'
                        : 'bg-container text-fg-primary')
                    }
                  >
                    {cfg.native}
                    {cfg.coverage !== 'full' && (
                      <span className={active ? 'ms-1.5 opacity-70' : 'ms-1.5 text-fg-tertiary'}>·</span>
                    )}
                  </button>
                )
              })}
            </div>
            <p className="text-2xs text-fg-tertiary">{tr('profileCoverageNote')}</p>
            <div className="flex items-center gap-3 pt-1">
              <span className="text-2xs text-fg-tertiary">{tr('themeLabel')}</span>
              <ThemeToggle />
              <span className="ms-auto"><LanguageSelect /></span>
            </div>
          </section>

          <section className="flex flex-col gap-2.5 bg-card rounded-[22px] p-4">
            <h2 className="text-sm font-semibold text-fg-primary">{tr('privacyTitle')}</h2>
            <p className="text-sm leading-relaxed text-fg-secondary">{tr('privacyBody')}</p>
            <div className="rounded-xl bg-sunken px-3.5 py-3">
              <p className="text-2xs font-semibold text-fg-secondary">{tr('whatStored')}</p>
              <p className="mt-1 text-2xs text-fg-secondary">{tr('storedBody')}</p>
            </div>
            <ConfirmDialog
              danger
              trigger={
                <Button variant="secondary" size="sm" className="self-start text-danger-fg hover:bg-danger-subtle">
                  {tr('deleteAll')}
                </Button>
              }
              title={tr('deleteAll')}
              body={tr('deleteAllConfirm')}
              confirmLabel={tr('deleteYes')}
              cancelLabel={tr('deleteNo')}
              onConfirm={() => {
                try {
                  window.localStorage.clear()
                  window.sessionStorage.clear()
                } catch {
                  /* ignore */
                }
                markVaultCleared()
                toast.success(tr('deleteYes'))
              }}
            />
          </section>

          <Banner tone="offline">{tr('offlineBanner')}</Banner>
        </div>
      </div>
    </AppShell>
  )
}
