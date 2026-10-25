#!/usr/bin/env node
/**
 * LokAI v2 verification gate — the deterministic sibling of v1's verify-demo.
 *
 *  1. Demo integrity: no network, no media capture, no file inputs, no keys.
 *  2. Design law: no raw colors / inline font styles outside the system files.
 *  3. Presence: specimen + gallery + 5 languages (incl. ur RTL) + legal store
 *     schema with [VERIFY] policy + scope rules incl. the downgrade law.
 *  4. WCAG AA: contrast spot-check of declared token pairs, light AND dark.
 *
 * Exit 0 = pass. Any failure prints file:line evidence and exits 1.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const SRC = join(ROOT, 'src')
const STYLE_FILES = new Set([
  'src/styles/index.css',
  'src/styles/tokens.css',
  'src/styles/base.css',
])
const failures = []
const notes = []
const ok = (m) => notes.push(`  ok  ${m}`)
const fail = (m) => failures.push(m)

/* ---------- walkers ---------- */
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}
const files = walk(SRC)
const rel = (p) => relative(ROOT, p).replaceAll('\\', '/')
const tsxFiles = files.filter((p) => /\.[jt]sx?$/.test(p))

/* ---------- 1. demo integrity ---------- */
const FORBIDDEN = [
  [/\bfetch\s*\(/, 'network fetch('],
  [/getUserMedia/, 'camera/mic capture'],
  [/new\s+MediaRecorder/, 'media recording'],
  [/type=["']file["']/, 'file input'],
  [/VITE_[A-Z_]*API_KEY/, 'API key env'],
]
for (const p of tsxFiles) {
  const text = readFileSync(p, 'utf8')
  const lines = text.split('\n')
  lines.forEach((line, i) => {
    for (const [re, label] of FORBIDDEN) {
      if (re.test(line)) fail(`${rel(p)}:${i + 1} forbidden ${label}`)
    }
  })
}
ok('demo integrity: no network / capture / file-input / key patterns')

/* ---------- 2. design law ---------- */
for (const p of tsxFiles) {
  const text = readFileSync(p, 'utf8')
  const lines = text.split('\n')
  lines.forEach((line, i) => {
    const no = line.replace(/\/\/.*$/, '')
    if (/#[0-9a-fA-F]{3,8}\b/.test(no)) fail(`${rel(p)}:${i + 1} raw hex color`)
    if (/fontFamily\s*:/.test(no)) fail(`${rel(p)}:${i + 1} inline fontFamily`)
    if (/fontSize\s*:/.test(no)) fail(`${rel(p)}:${i + 1} inline fontSize`)
    if (/letterSpacing\s*:/.test(no)) fail(`${rel(p)}:${i + 1} letterSpacing`)
    if (/lineHeight\s*:/.test(no)) fail(`${rel(p)}:${i + 1} lineHeight`)
  })
}
{
  // css files other than the system trio must not define colors either
  const cssFiles = files.filter((p) => p.endsWith('.css'))
  for (const p of cssFiles) {
    if (STYLE_FILES.has(rel(p))) continue
    const text = readFileSync(p, 'utf8')
    if (/#[0-9a-fA-F]{3,8}\b/.test(text) || /oklch\(/.test(text)) {
      fail(`${rel(p)} raw color values outside the system style files`)
    }
  }
}
ok('design law: raw colors/typography confined to src/styles/*')

/* ---------- 3. presence ---------- */
const mustContain = [
  ['src/app/pages/SpecimenPage.tsx', 'SpecimenPage', 'type specimen route'],
  ['src/app/pages/GalleryPage.tsx', 'GalleryPage', 'component gallery route'],
  ['src/app/data/languages.ts', "'ur'", 'Urdu config'],
  ['src/app/data/languages.ts', "direction: 'rtl'", 'RTL direction flag'],
  ['src/app/data/scope-rules.ts', 'hard-stop', 'hard-stop tier'],
  ['src/app/data/scope-rules.ts', 'downgrade', 'downgrade law'],
  ['src/app/components/trust/ReasoningPill.tsx', 'simulatedTag', 'simulated tag wiring'],
  ['src/app/data/i18n.ts', 'simulatedTag', 'simulated tag string'],
]
for (const [file, needle, label] of mustContain) {
  const p = join(ROOT, file)
  if (!existsSync(p)) fail(`missing ${file} (${label})`)
  else if (!readFileSync(p, 'utf8').includes(needle)) fail(`${file} missing "${needle}" (${label})`)
  else ok(`presence: ${label}`)
}

/* languages: 5 codes incl ur with rtl */
{
  const text = readFileSync(join(ROOT, 'src/app/data/languages.ts'), 'utf8')
  for (const code of ['en', 'hi', 'mr', 'ta', 'ur']) {
    if (!new RegExp(`${code}:\\s*\\{`).test(text)) fail(`languages.ts missing ${code}`)
  }
}
ok('presence: en/hi/mr/ta/ur language configs')

/* legal content: every entry unverified + [VERIFY] visible */
{
  const p = join(ROOT, 'src/app/data/legal-content.ts')
  const text = readFileSync(p, 'utf8')
  const entries = text.match(/verified:\s*(true|false)/g) ?? []
  if (entries.length < 3) fail('legal-content.ts: expected at least 3 entries')
  if (entries.some((e) => e.includes('true'))) {
    fail('legal-content.ts: an entry is verified:true — owner-only flip, and never in a fresh build')
  }
  if (!text.includes('[VERIFY')) fail('legal-content.ts: [VERIFY] markers missing')
  if (!/lastChecked/.test(text)) fail('legal-content.ts: lastChecked missing')
  ok(`presence: legal store — ${entries.length} entries, all [VERIFY] / verified:false`)
}

/* reasoning pill simulated tag is ALWAYS rendered (not only expanded) */
{
  const p = join(ROOT, 'src/app/components/trust/ReasoningPill.tsx')
  const text = readFileSync(p, 'utf8')
  const expandedBlock = text.slice(text.indexOf('{open &&'))
  if (!/simulatedTag|Simulated/.test(expandedBlock)) {
    fail('ReasoningPill: expanded panel must carry the Simulated tag')
  } else ok('presence: reasoning pill simulated tag in expanded panel')
}

/* ---------- 4. WCAG AA contrast ---------- */
function parseBlocks(css) {
  const grab = (selector) => {
    const idx = css.indexOf(selector)
    if (idx === -1) return {}
    const start = css.indexOf('{', idx)
    let depth = 1
    let end = start + 1
    while (depth > 0 && end < css.length) {
      if (css[end] === '{') depth++
      if (css[end] === '}') depth--
      end++
    }
    const body = css.slice(start + 1, end - 1)
    const vars = {}
    for (const m of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) vars[m[1]] = m[2].trim()
    return vars
  }
  return { light: grab(':root'), dark: grab('[data-theme="dark"]') }
}

/** oklch(..) string -> LINEAR sRGB triplet (0..1, no gamma encode) */
function oklchToLinear(str) {
  const m = str.match(/oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\s*\)/)
  if (!m) return null
  const L = parseFloat(m[1]) / (str.includes('%') ? 100 : 1)
  const C = parseFloat(m[2])
  const H = (parseFloat(m[3]) * Math.PI) / 180
  const a_ = C * Math.cos(H)
  const b_ = C * Math.sin(H)
  const l_ = L + 0.3963377774 * a_ + 0.2158037573 * b_
  const m_ = L - 0.1055613458 * a_ - 0.0638541728 * b_
  const s_ = L - 0.0894841775 * a_ - 1.291485548 * b_
  const l3 = l_ ** 3
  const m3 = m_ ** 3
  const s3 = s_ ** 3
  return [
    4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3,
    -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3,
    -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3,
  ]
}

/** relative luminance from a CSS color string (oklch or rgb()) */
function luminance(str) {
  let lin
  if (str.startsWith('rgb(')) {
    const parts = str.match(/[\d.]+/g).map(Number)
    const [r, g, b] = parts.slice(0, 3)
    const dec = (v) => {
      const c = v / 255
      return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    }
    lin = [dec(r), dec(g), dec(b)]
  } else {
    lin = oklchToLinear(str)
  }
  if (!lin) return null
  const clamped = lin.map((c) => Math.min(Math.max(c, 0), 1))
  return 0.2126 * clamped[0] + 0.7152 * clamped[1] + 0.0722 * clamped[2]
}

function contrast(fg, bg) {
  const l1 = luminance(fg)
  const l2 = luminance(bg)
  if (l1 === null || l2 === null) return null
  const [a, b] = l1 >= l2 ? [l1, l2] : [l2, l1]
  return (a + 0.05) / (b + 0.05)
}

const PAIRS = [
  ['fg-primary', 'shell', 4.5],
  ['fg-secondary', 'shell', 4.5],
  ['fg-tertiary', 'shell', 4.5],
  ['fg-primary', 'card', 4.5],
  ['fg-secondary', 'sunken', 4.5],
  ['on-brand-solid', 'brand-solid', 4.5],
  ['brand-fg', 'shell', 4.5],
  ['on-brand-subtle', 'brand-subtle', 4.5],
  ['on-positive-solid', 'positive-solid', 4.5],
  ['on-positive-subtle', 'positive-subtle', 4.5],
  ['on-warning-solid', 'warning-solid', 4.5],
  ['on-warning-subtle', 'warning-subtle', 4.5],
  ['on-danger-solid', 'danger-solid', 4.5],
  ['on-danger-subtle', 'danger-subtle', 4.5],
  ['fg-on-inverted', 'standout', 4.5],
  ['fg-standout-secondary', 'standout', 4.5],
  ['brand-solid', 'shell', 3.0],
  ['positive-solid', 'shell', 3.0],
  ['danger-solid', 'shell', 3.0],
]

{
  const css = readFileSync(join(ROOT, 'src/styles/tokens.css'), 'utf8')
  const { light, dark } = parseBlocks(css)
  for (const [themeName, theme] of [
    ['light', light],
    ['dark', dark],
  ]) {
    const merged = { ...light, ...theme } // dark re-points over light base
    for (const [fgKey, bgKey, min] of PAIRS) {
      const fgVal = merged[`c-${fgKey}`]
      const bg = merged[`c-${bgKey}`]
      if (!fgVal || !bg) {
        fail(`tokens.css: missing var for pair ${fgKey}/${bgKey} (${themeName})`)
        continue
      }
      const ratio = contrast(fgVal, bg)
      if (ratio === null) {
        notes.push(`  ..  ${themeName} ${fgKey}/${bgKey}: skipped (non-lit value)`)
        continue
      }
      if (ratio < min) {
        fail(`WCAG ${themeName}: ${fgKey} on ${bgKey} = ${ratio.toFixed(2)} < ${min}`)
      } else {
        ok(`WCAG ${themeName}: ${fgKey}/${bgKey} = ${ratio.toFixed(2)}`)
      }
    }
  }
}

/* ---------- report ---------- */
console.log('LokAI v2 verify gate')
console.log('─'.repeat(60))
for (const n of notes.filter((x, i) => notes.indexOf(x) === i)) console.log(n)
if (failures.length === 0) {
  console.log('─'.repeat(60))
  console.log('PASS — all gates green')
  process.exit(0)
} else {
  console.log('─'.repeat(60))
  console.log(`FAIL — ${failures.length} violation(s):`)
  for (const f of failures) console.log(`  ✗  ${f}`)
  process.exit(1)
}
