/**
 * 'Delete everything' honesty (audit fix): once the profile's delete-all runs,
 * this flag makes History and Saved render their real empty states instead of
 * the seeded demo rows — the destructive action actually does what it says.
 */
const KEY = 'lokai.vaultCleared'

export function isVaultCleared(): boolean {
  try {
    return window.localStorage.getItem(KEY) != null
  } catch {
    return false
  }
}

export function markVaultCleared(): void {
  try {
    window.localStorage.setItem(KEY, String(Date.now()))
  } catch {
    /* private mode etc. */
  }
}
