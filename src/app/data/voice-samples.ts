import type { LangCode } from './languages'

/**
 * Simulated voice-capture samples (one per UI language). AI-drafted, never
 * reviewed — the whole voice surface carries the "Simulated in prototype"
 * tag. The mic is never accessed; these stand in for a transcript.
 */
export const VOICE_SAMPLES: Record<LangCode, string> = {
  en: 'I got a legal notice about a property dispute. I want to understand what it says and what I should do.',
  hi: 'मुझे संपत्ति विवाद के बारे में एक कानूनी नोटिस मिला है। मैं समझना चाहता हूँ कि इसमें क्या लिखा है और मुझे क्या करना चाहिए।',
  mr: 'मला मालमत्ता वादाबाबत एक कायदेशीर जाहीरनामा आला आहे. यात काय लिहिले आहे आणि मी काय करावे हे समजून घ्यायचे आहे.',
  ta: 'ஒரு சொத்து தகராறு தொடர்பான சட்ட அறிவிப்பு எனக்கு வந்துள்ளது. அதில் என்ன எழுதியுள்ளது, நான் என்ன செய்யவேண்டும் என்று புரிந்துகொள்ள விரும்புகிறேன்.',
  ur: 'مجھے جائیداد کے تنازعے کے بارے میں ایک قانونی نوٹس ملا ہے۔ میں سمجھنا چاہتا ہوں کہ اس میں کیا لکھا ہے اور مجھے کیا کرنا چاہیے۔',
}

/** mm:ss clock for the simulated listening timer. */
export function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
