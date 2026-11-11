import type { LangCode } from './languages'

/**
 * Simulated voice-capture samples (one per UI language). AI-drafted, never
 * reviewed — the whole voice surface carries the "Simulated in prototype"
 * tag. The mic is never accessed; these stand in for a transcript.
 */
/** Simulated voice-capture samples (prepared languages; others fall back to English). */
export const VOICE_SAMPLES: Partial<Record<LangCode, string>> = {
  en: "Listen, I ordered a Mixwell mixer from HomeKart for ₹8,999. When I opened the box, the jar was cracked and the motor wouldn't even start. Now their app says the 48-hour return window is over and they closed my ticket. Can I actually do anything, or is my money gone?",
  hi: 'सुनिए, मैंने HomeKart से ₹8,999 का मिक्सर मंगाया था। डब्बा खोला तो जार टूटा हुआ था और मोटर बिल्कुल नहीं चल रही। अब कस्टमर केयर बोल रहा है कि 48 घंटे की रिटर्न विंडो खत्म हो गई और टिकट बंद कर दिया। अब मेरा पैसा वापस मिल सकता है या गया?',
  mr: 'नमस्कार, मला काल महानगरपालिकेकडून ही मालमत्ता कराची नोटीस आली आहे… यात लाल अक्षरात ₹१८,४५० थकबाकी लिहिली आहे आणि १५ दिवसांत भरली नाही तर जप्तीची कारवाई करू असे काहीतरी लिहिले आहे. मला ही सरकारी भाषा नीट समजत नाहीये, कृपया सांगा मी काय करू?',
  ta: 'அய்யா, நான் நாலு நாளைக்கு முன்னாடி ஹோம்கார்ட்ல ₹8,999 கொடுத்து மிக்ஸி வாங்கினேன். பாக்ஸை பிரிச்சு பார்த்தா ஜார் உடைஞ்சு இருக்கு, மோட்டார்ல இருந்து புகை நாத்தம் வருது. கஸ்டமர் கேர்ல கேட்டா ரிட்டர்ன் விண்டோ முடிஞ்சு போச்சுன்னு சொல்றாங்க.',
  ur: 'السلام علیکم، میں نے چار دن پہلے ہوم کارٹ سے 8,999 روپے کا مکسر منگوایا تھا۔ ڈبہ کھولا تو جار ٹوٹا ہوا تھا اور موٹر سے جلنے کی بو آ رہی ہے۔ کسٹمر کیئر والے کہہ رہے ہیں کہ اب واپسی کا وقت ختم ہو گیا ہے۔',
}

/** mm:ss clock for the simulated listening timer. */
export function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
