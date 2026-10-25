import { useEffect, useState } from 'react'

export interface HashRoute {
  path: string
  params: URLSearchParams
}

function parse(): HashRoute {
  const raw = window.location.hash.replace(/^#/, '') || '/'
  const [path, query = ''] = raw.split('?')
  return { path: path === '' ? '/' : path, params: new URLSearchParams(query) }
}

export function navigate(to: string) {
  window.location.hash = to.startsWith('/') ? to.slice(1) : to
}

export function useHashRoute(): HashRoute {
  const [route, setRoute] = useState<HashRoute>(parse)
  useEffect(() => {
    const onHash = () => setRoute(parse())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return route
}
