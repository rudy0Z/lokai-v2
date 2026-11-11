import type { DomainBranch, DomainId } from './domain-playbooks'
import type { LangCode } from './languages'

/**
 * Live branching interactive scenarios (master spec Part 2): at every turn
 * the recruiter picks from authentic, messy, code-mixed Indian prompts —
 * missing punctuation, emotional urgency, real Hinglish — each declaring the
 * path it stress-tests. Options referencing a DOMAIN route into that
 * domain's playbook (multi-domain engine); free typing still goes through
 * the classifier.
 */

export type ScenarioRoute =
  | 'proceed' | 'vague' | 'informal' | 'stop' | 'notice' | 'pushback' | 'resolved' | 'save' | 'updateFacts'

export interface TesterOption {
  text: string
  /** crisp 2-4 word label rendered inside the Chip pill */
  label?: string
  route: ScenarioRoute
  /** i18n UiKey of the meta label, e.g. 'metaEvidence' */
  meta: string
  /** when set, the option enters a domain playbook instead of the generic flow */
  domain?: DomainId
  branch?: DomainBranch
  /** option-level fact overrides — the gate shows what THIS prompt said,
      honestly '—' where the prompt gave nothing */
  factOverrides?: { key: string; value: string }[]
  /** associated scenario ID (e.g. 'scn1', 'scn2', 'scn5') */
  scenarioId?: string
}

export interface Scenario {
  id: string
  outcome: 'proceed' | 'caution' | 'notice' | 'stop' | 'mixed'
  turn1: Partial<Record<LangCode, TesterOption[]>>
  clarifyPrompts?: Partial<Record<LangCode, TesterOption[]>>
  /** shown after the finding/ladder mounts (stage 'engaged') */
  postFinding?: Partial<Record<LangCode, TesterOption[]>>
}

const P = (
  text: string,
  meta: string,
  route: ScenarioRoute,
  domain?: DomainId,
  branch?: DomainBranch,
  factOverrides?: { key: string; value: string }[],
  label?: string,
  scenarioId?: string,
): TesterOption => ({ text, meta, route, domain, branch, factOverrides, label, scenarioId })

/* ── Starter Options (rendered as pills on empty thread) ── */

export const STARTER_OPTIONS: TesterOption[] = [
  P(
    'I ordered a Mixwell mixer from HomeKart for ₹8,999. It arrived with a cracked jar and dead motor, and support closed my ticket saying the 48-hour return window is over.',
    'metaEvidence',
    'proceed',
    'refund',
    'standard',
    undefined,
    '⚡ Defective mixer (₹8,999)',
    'scn1',
  ),
  P(
    "I paid ₹2,400 via personal UPI to an Instagram page for a kurta set. No GST bill, and now they've blocked me on WhatsApp without shipping anything.",
    'metaInformal',
    'informal',
    'refund',
    'informal',
    undefined,
    '🧾 Instagram seller blocked me',
    'scn2',
  ),
  P(
    "I vacated my flat in Bengaluru last month and handed over the keys peacefully, but my landlord is holding back ₹35,000 from my deposit claiming 'deep cleaning and repainting' without showing any bills.",
    'metaEvidence',
    'proceed',
    'deposit',
    'standard',
    undefined,
    '🏠 Landlord keeping deposit',
    'scn1',
  ),
  P(
    'The local electronics dealer is refusing to refund my defective inverter and his men just called threatening to come to my house if I post a review or file a complaint.',
    'metaThreat',
    'stop',
    undefined,
    undefined,
    undefined,
    '🛡️ Dealer is threatening me',
    'scn5',
  ),
]

/* ── Scenario 1 · refund — defective appliance & stonewalling support ── */

const scn1turn1: Partial<Record<LangCode, TesterOption[]>> = {
  en: [
    P(
      'I ordered a Mixwell mixer from HomeKart for ₹8,999. It arrived with a cracked jar and dead motor, and support closed my ticket saying the 48-hour return window is over.',
      'metaEvidence',
      'proceed',
      'refund',
      'standard',
      undefined,
      '⚡ Defective mixer (₹8,999)',
    ),
    P(
      'mera naya mixer bilkul chal nahi raha hai... company wale refund dene se mana kar rahe hain bol rahe humari galti nahi hai, ab mera paisa phas gaya kya??',
      'metaVague',
      'vague',
      undefined,
      undefined,
      undefined,
      '❓ Missing bill & details',
    ),
    P(
      "I paid ₹2,400 via personal UPI to an Instagram page for a kurta set. No GST bill, and now they've blocked me on WhatsApp without shipping anything.",
      'metaInformal',
      'informal',
      'refund',
      'informal',
      undefined,
      '🧾 Instagram seller blocked me',
    ),
  ],
  hi: [
    P(
      'मैंने HomeKart से ₹8,999 का मिक्सवेल मिक्सर मंगाया था। डब्बा खोला तो जार टूटा हुआ था और मोटर बिल्कुल नहीं चल रही। कस्टमर केयर बोल रहा 48 घंटे बीत गए, रिफंड नहीं होगा।',
      'metaEvidence',
      'proceed',
      'refund',
      'standard',
      undefined,
      '⚡ टूटा मिक्सर (₹8,999)',
    ),
    P(
      'मेरा नया मिक्सर बिल्कुल चल नहीं रहा... कंपनी वाले रिफंड देने से मना कर रहे हैं, कह रहे हमारी गलती नहीं। अब मेरा पैसा फँस गया क्या??',
      'metaVague',
      'vague',
      undefined,
      undefined,
      undefined,
      '❓ विवरण उपलब्ध नहीं',
    ),
    P(
      'इंस्टाग्राम पेज पर कुर्ता सेट के लिए ₹2,400 दिए। कोई बिल नहीं मिला और अब मुझे व्हाट्सएप पर ब्लॉक कर दिया।',
      'metaInformal',
      'informal',
      'refund',
      'informal',
      undefined,
      '🧾 इंस्टाग्राम सेलर ने ब्लॉक किया',
    ),
  ],
  mr: [
    P(
      'भावा 18 रोजी होमकार्टवरून 8999 चा मिक्सवेल 750w मिक्सर ऑर्डर केला होता... डब्बा उघडला तो जार cracked आणि मोटरचा जळजळीत वास. कस्टमर केअर म्हणतंय 48hr रिटर्न विंडो बंद, ब्रँड सर्व्हिस सेंटरला जा!! GST बिल आहे माझ्याकडे, मदत करा',
      'metaEvidence',
      'proceed',
      'refund',
      'standard',
      undefined,
      '⚡ खराब मिक्सर (₹8,999)',
    ),
    P(
      'माझा नवीन मिक्सर अजिबात चालत नाहीये... कंपनीवाले परतावा देण्यास नकारतायत, म्हणतायत आमची चूक नाही. आता माझं पैसे अडकले का??',
      'metaVague',
      'vague',
      undefined,
      undefined,
      undefined,
      '❓ तपशील अपुरे',
    ),
    P(
      'इन्स्टा पेज @sneakerdeals_india वर फसलो गेलो 😭 6 दिवसांपूर्वी gpay वर 4500 दिले jordans साठी, न ट्रॅकिंग दिली न बिल, आणि आता whatsapp वर ब्लॉक केले... कडे फक्त gpay स्क्रीनशॉट आणि utr नंबर आहे',
      'metaInformal',
      'informal',
      'refund',
      'informal',
      undefined,
      '🧾 इन्स्टा सेलरने ब्लॉक केले',
    ),
  ],
  ta: [
    P(
      'நண்பா 18-ல் ஹோம்கார்ட்டில் 8999-க்கு மிக்ஸ்வெல் 750w மிக்சர் ஆர்டர் செய்தேன்... பாக்ஸ் திறந்து பார்த்தால் ஜார் உடைந்து, மோட்டாரில் எரியும் வாசனை. கஸ்டமர் கேர் 48hr ரிட்டர்ன் விண்டோ முடிஞ்சிடுச்சு, பிராண்ட் சர்வீஸ் சென்டர் போன்று சொல்கிறாங்க!! GST பில் இருக்கு, உதவுங்க',
      'metaEvidence',
      'proceed',
      'refund',
      'standard',
      undefined,
      '⚡ பழுதான மிக்சி (₹8,999)',
    ),
    P(
      'என் புது மிக்சர் மொத்தமா வேலை செய்யல... கம்பெனி வாலர்கள் ரீஃபண்ட் கொடுக்க மறுக்கிறாங்க, எங்க தப்பு இல்லைன்னு சொல்றாங்க. இப்போ என் காசு சிக்கிடுச்சா??',
      'metaVague',
      'vague',
      undefined,
      undefined,
      undefined,
      '❓ விவரங்கள் இல்லை',
    ),
    P(
      'இன்ஸ்டா பேஜ் @sneakerdeals_india-ல ஏமாத்தினாங்க 😭 6 நாள் முன்னாடி gpay-ல 4500 கொடுத்தேன் jordans-க்கு, ட்ராக்கிங்கும் இல்ல பில்லும் இல்ல, இப்போ whatsapp-ல பிளாக் பண்ணிட்டாங்க... கையில gpay ஸ்கிரீன்ஷாட், utr நம்பர் மட்டும் தான் இருக்கு',
      'metaInformal',
      'informal',
      'refund',
      'informal',
      undefined,
      '🧾 இன்ஸ்டா விற்பனையாளர் பிளாக்',
    ),
  ],
  ur: [
    P(
      'بھائی 18 کو ہوم کارٹ سے 8999 کا مکس ویل 750w مکسر آرڈر کیا تھا... ڈبہ کھولا تو جار ٹوٹا تھا اور موٹر سے جلنے کی بو آ رہی ہے۔ کسٹمر کیئر کہہ رہے 48hr ریٹرن ونڈو بند، برانڈ سروس سینٹر جاؤ!! GST بل میرے پاس ہے، مدد کریں',
      'metaEvidence',
      'proceed',
      'refund',
      'standard',
      undefined,
      '⚡ خراب مکسر (₹8,999)',
    ),
    P(
      'میرا نیا مکسر بالکل چل نہیں رہا... کمپنی والے ریفنڈ دینے سے منع کر رہے ہیں، کہہ رہے ہماری غلطی نہیں۔ اب میرا پیسہ پھنس گیا کیا؟؟',
      'metaVague',
      'vague',
      undefined,
      undefined,
      undefined,
      '❓ تفصیلات غائب',
    ),
    P(
      'انسٹا پیج @sneakerdeals_india پر دھوکا ہو گیا 😭 6 دن پہلے gpay پر 4500 دیے jordans کے لیے، نہ ٹریکنگ دی نہ بل، اور اب واٹس ایپ پر بلاک کر دیا... پاس بس gpay اسکرین شاٹ اور utr نمبر ہے',
      'metaInformal',
      'informal',
      'refund',
      'informal',
      undefined,
      '🧾 انسٹا سیلر نے بلاک کیا',
    ),
  ],
}

const scn1clarify: Partial<Record<LangCode, TesterOption[]>> = {
  en: [
    P(
      'mixwell 750w mixer hai, 8999 ka liya tha homekart se 4 din pehle (18 oct). gst bill aur unboxing photo dono hai mere paas',
      'metaEvidence',
      'proceed',
      'refund',
      'standard',
      undefined,
      '📄 GST bill & photos',
    ),
    P(
      'insta page se 4500 mein mangaya tha, koi bill nahi diya bas gpay screenshot hai',
      'metaInformal',
      'informal',
      'refund',
      'informal',
      undefined,
      '🧾 No bill, UPI only',
    ),
  ],
  hi: [
    P(
      'मिक्सवेल 750w मिक्सर है, 4 दिन पहले (18 oct) होमकार्ट से 8999 में लिया था। GST बिल और अनबॉक्सिंग फोटो दोनों पास हैं',
      'metaEvidence',
      'proceed',
      'refund',
      'standard',
      undefined,
      '📄 GST बिल और फोटो',
    ),
    P(
      'इंस्टा पेज से 4500 में मंगाया था, कोई बिल नहीं दिया बस gpay स्क्रीनशॉट है',
      'metaInformal',
      'informal',
      'refund',
      'informal',
      undefined,
      '🧾 कोई बिल नहीं, UPI',
    ),
  ],
  mr: [
    P(
      'मिक्सवेल 750w मिक्सर आहे, 4 दिवसांपूर्वी होमकार्टवरून 8999 ला घेतला होता. GST बिल आणि अनबॉक्सिंग फोटो दोन्ही आहेत',
      'metaEvidence',
      'proceed',
      'refund',
      'standard',
      undefined,
      '📄 GST बिल व फोटो',
    ),
    P(
      'इन्स्टा पेजवरून 4500 ला मागवला होता, बिल नाही फक्त gpay स्क्रीनशॉट आहे',
      'metaInformal',
      'informal',
      'refund',
      'informal',
      undefined,
      '🧾 बिल नाही, फक्त UPI',
    ),
  ],
  ta: [
    P(
      'மிக்ஸ்வெல் 750w மிக்சர், 4 நாள் முன்னாடி ஹோம்கார்ட்ல 8999-க்கு வாங்கினேன். GST பில் மற்றும் அன்பாக்ஸிங் புகைப்படம் இருக்கு',
      'metaEvidence',
      'proceed',
      'refund',
      'standard',
      undefined,
      '📄 GST பில் மற்றும் படம்',
    ),
    P(
      'இன்ஸ்டா பேஜ்ல 4500-க்கு வாங்கினேன், பில் எதுவும் இல்ல வெறும் gpay ஸ்கிரீன்ஷாட் தான்',
      'metaInformal',
      'informal',
      'refund',
      'informal',
      undefined,
      '🧾 பில் இல்லை, UPI மட்டும்',
    ),
  ],
  ur: [
    P(
      'مکس ویل 750w مکسر ہے، 4 دن پہلے ہوم کارٹ سے 8999 میں لیا تھا۔ GST بل اور ان باکسنگ فوٹو دونوں پاس ہیں',
      'metaEvidence',
      'proceed',
      'refund',
      'standard',
      undefined,
      '📄 GST بل اور تصویر',
    ),
    P(
      'انسٹا پیج سے 4500 میں منگوایا تھا، کوئی بل نہیں دیا بس gpay اسکرین شاٹ ہے',
      'metaInformal',
      'informal',
      'refund',
      'informal',
      undefined,
      '🧾 کوئی بل نہیں، صرف UPI',
    ),
  ],
}

const scn1post: Partial<Record<LangCode, TesterOption[]>> = {
  en: [
    P(
      "I sent that message to their grievance officer. Support just replied saying they can't refund it because 48 hours passed—best they can do is a ₹500 voucher or I have to visit a service center myself.",
      'metaPushback',
      'pushback',
      undefined,
      undefined,
      undefined,
      '💬 Seller offered ₹500 voucher',
    ),
    P(
      'After I sent the message, the seller called my number and threatened to file a defamation case and send people to my address if I escalate this.',
      'metaThreat',
      'stop',
      undefined,
      undefined,
      undefined,
      '🛡️ Seller is threatening me',
    ),
    P(
      "Update: HomeKart's grievance desk replied to the message, approved the pickup, and initiated my full ₹8,999 UPI refund today!",
      'metaResolved',
      'resolved',
      undefined,
      undefined,
      undefined,
      '🎉 Got my refund!',
    ),
  ],
  hi: [
    P(
      'मैंने ग्रीवांस ऑफिसर को वह मैसेज भेजा। सपोर्ट का जवाब आया कि 48 घंटे बीत चुके हैं इसलिए रिफंड नहीं हो सकता — सबसे ज़्यादा ₹500 का वाउचर दे सकते हैं या खुद सर्विस सेंटर जाना होगा।',
      'metaPushback',
      'pushback',
      undefined,
      undefined,
      undefined,
      '💬 सेलर ने ₹500 वाउचर दिया',
    ),
    P(
      'मैसेज भेजने के बाद सेलर ने मुझे फोन करके मानहानि का केस करने और आगे बढ़ने पर घर आदमी भेजने की धमकी दी।',
      'metaThreat',
      'stop',
      undefined,
      undefined,
      undefined,
      '🛡️ सेलर मुझे धमकी दे रहा है',
    ),
    P(
      'अपडेट: HomeKart की ग्रीवांस टीम ने मैसेज का जवाब दिया, पिकअप अप्रूव किया और आज पूरा ₹8,999 का UPI रिफंड जारी कर दिया!',
      'metaResolved',
      'resolved',
      undefined,
      undefined,
      undefined,
      '🎉 रिफंड मिल गया!',
    ),
  ],
  mr: [
    P(
      'त्यांना तो मेसेज पाठवला. सपोर्टने उत्तर दिले की 48 तास उलटल्यामुळे परतावा देता येणार नाही — जास्तीत जास्त ₹500 चे व्हाउचर देऊ शकतात किंवा स्वतः सर्व्हिस सेंटरला जावे लागेल.',
      'metaPushback',
      'pushback',
      undefined,
      undefined,
      undefined,
      '💬 सेलरने ₹500 व्हाउचर दिले',
    ),
    P(
      'मेसेज पाठवल्यानंतर सेलरने कॉल करून अब्रूनुकसानीचा दावा ठोकण्याची आणि घरी माणसे पाठवण्याची धमकी दिली.',
      'metaThreat',
      'stop',
      undefined,
      undefined,
      undefined,
      '🛡️ सेलर मला धमकी देतोय',
    ),
    P(
      'अपडेट: HomeKart च्या ग्रीव्हन्स डेस्कने मेसेजला उत्तर दिले, पिकअप मंजूर केला आणि आज संपूर्ण ₹8,999 चा UPI परतावा जमा केला!',
      'metaResolved',
      'resolved',
      undefined,
      undefined,
      undefined,
      '🎉 परतावा मिळाला!',
    ),
  ],
  ta: [
    P(
      'அதிகாரிக்கு அந்த செய்தியை அனுப்பினேன். 48 மணி நேரம் கடந்துவிட்டதால் பணத்தைத் திரும்பப் பெற முடியாது என்று ஆதரவு பதிலளித்தது — அதிகபட்சம் ₹500 வவுச்சர் தருவதாக அல்லது நானே சேவை மையத்திற்குச் செல்ல வேண்டும் என்கிறார்கள்.',
      'metaPushback',
      'pushback',
      undefined,
      undefined,
      undefined,
      '💬 விற்பனையாளர் ₹500 வவுச்சர் தந்தார்',
    ),
    P(
      'செய்தியை அனுப்பிய பிறகு, விற்பனையாளர் என்னை அழைத்து அவதூறு வழக்கு போடுவதாகவும், நான் தீவிரப்படுத்தினால் வீட்டுக்கு ஆட்களை அனுப்புவதாகவும் மிரட்டினார்.',
      'metaThreat',
      'stop',
      undefined,
      undefined,
      undefined,
      '🛡️ விற்பனையாளர் மிரட்டுகிறார்',
    ),
    P(
      'அப்டேட்: HomeKart குறைதீர்க்கும் பிரிவு செய்திக்குப் பதிலளித்து, பிக்கப்பை அங்கீகரித்து, எனது முழு ₹8,999 UPI பணத்தையும் இன்று திருப்பி அனுப்பியது!',
      'metaResolved',
      'resolved',
      undefined,
      undefined,
      undefined,
      '🎉 பணம் திரும்பியது!',
    ),
  ],
  ur: [
    P(
      'میں نے وہ پیغام ان کے شکایات افسر کو بھیجا۔ سپورٹ نے جواب دیا کہ 48 گھنٹے گزر چکے ہیں اس لیے رقم واپس نہیں ہو سکتی — زیادہ سے زیادہ ₹500 کا واؤچر دے سکتے ہیں یا خود سروس سینٹر جانا ہوگا۔',
      'metaPushback',
      'pushback',
      undefined,
      undefined,
      undefined,
      '💬 سیلر نے ₹500 واؤچر دیا',
    ),
    P(
      'پیغام بھیجنے کے بعد سیلر نے فون کر کے ہتک عزت کا کیس کرنے اور آگے بڑھنے پر گھر آدمی بھیجنے کی دھمکی دی۔',
      'metaThreat',
      'stop',
      undefined,
      undefined,
      undefined,
      '🛡️ سیلر مجھے دھمکی دے رہا ہے',
    ),
    P(
      'اپ ڈیٹ: HomeKart کے شکایات ڈیسک نے پیغام کا جواب دیا، پک اپ منظور کیا، اور آج میرا پورا ₹8,999 UPI ریفنڈ جاری کر دیا!',
      'metaResolved',
      'resolved',
      undefined,
      undefined,
      undefined,
      '🎉 ریفنڈ مل گیا!',
    ),
  ],
}

/* ── Scenario 2 · deposit — landlord withholding the deposit ── */

const scn2turn1: Partial<Record<LangCode, TesterOption[]>> = {
  en: [
    P(
      "I vacated my flat in Bengaluru last month and handed over the keys peacefully, but my landlord is holding back ₹35,000 from my deposit claiming 'deep cleaning and repainting' without showing any bills.",
      'metaEvidence',
      'proceed',
      'deposit',
      'standard',
      undefined,
      '🏠 Landlord keeping deposit',
    ),
    P('landlord deposit wapas nahi kar raha... roz bolta hai agle hafte dunga, ab phone uthana hi band kar diya. 40 hazaar atka hua hai mera', 'metaVague', 'vague', 'deposit', 'standard', undefined, '❓ Deposit withheld, vague'),
    P('humara koi rent agreement bana hi nahi tha, broker ke through shift hue the... 50k deposit bank transfer kiya tha aur har mahine rent gpay karta tha. ab owner bol raha agreement nahi hai toh 1 rupya nahi milega jo karna hai kar lo', 'metaInformal', 'informal', 'deposit', 'informal', undefined, '📜 No agreement signed'),
  ],
  hi: [
    P('पिछले महीने बेंगलुरु का फ्लैट खाली किया और शांति से चाबियाँ सौंप दीं। अब मकान मालिक बिना कोई बिल दिखाए ₹35,000 डिपॉज़िट रोक रहा है।', 'metaEvidence', 'proceed', 'deposit', 'standard', undefined, '🏠 मकान मालिक ने डिपॉज़िट रोका'),
    P('मकान मालिक डिपॉज़िट वापस नहीं कर रहा... रोज़ कहता है अगले हफ़्ते दूँगा, अब फोन उठाना ही बंद कर दिया। 40 हज़ार अटका हुआ है मेरा', 'metaVague', 'vague', 'deposit', 'standard', undefined, '❓ विवरण उपलब्ध नहीं'),
    P('हमारा कोई रेंट एग्रीमेंट बना ही नहीं था, ब्रोकर के ज़रिए शिफ्ट हुए थे... 50k डिपॉज़िट बैंक ट्रांसफ़र किया था और हर महीने रेंट gpay करता था। अब मालिक कह रहा एग्रीमेंट नहीं है तो 1 रुपया नहीं मिलेगा, जो करना है कर लो', 'metaInformal', 'informal', 'deposit', 'informal', undefined, '📜 कोई एग्रीमेंट नहीं'),
  ],
  mr: [
    P('गेल्या महिन्यात कोथरूड पुणे येथील 2bhk फ्लॅट सोडला... पूर्ण 1 महिन्याची नोटीस दिली आणि चाव्याही दिल्या. आता मालक 50k भरपगाडीतून 35,000 काढतायत, म्हणतायत डीप क्लीनिंग आणि फुल फ्लॅट पेंटिंग केली! एकही बिल दाखवत नाहीयेत', 'metaEvidence', 'proceed', 'deposit', 'standard', undefined, '🏠 डिपॉझिट अडवले'),
    P('मालक भरपगाडी परत करत नाहीये... रोज म्हणतो पुढच्या आठवड्यात देईन, आता फोन घेणेही बंद केलंय. 40 हजार माझे अडवून आहेत', 'metaVague', 'vague', 'deposit', 'standard', undefined, '❓ तपशील अपुरे'),
    P('आमचा रेंट करार बनवलाच नव्हता, ब्रोकरच्या मार्गतून शिफ्ट झालो होतो... 50k भरपगाडी बँक ट्रान्सफर केली आणि दर महिन्याला भाडे gpay केले. आता मालक म्हणतोय करार नाही तर 1 रुपयाही मिळणार नाही, जे करायचं ते करा', 'metaInformal', 'informal', 'deposit', 'informal', undefined, '📜 करार नाही'),
  ],
  ta: [
    P('கடந்த மாதம் கோத்திருட் புனேயில் என் 2bhk ஃப்ளாட்டை காலியாக்கினேன்... முழு 1 மாத நோட்டீஸும் கொடுத்தேன், கீயும் கொடுத்தேன். இப்போ லேண்ட்லார்ட் 50k முன்பணத்துல இருந்து 35,000 கழட்டறாரு, டீப் க்ளீனிங் மற்றும் ஃபுல் பெயின்டிங் பண்ணினேன்னு! ஒரு பில்ல காட்டல', 'metaEvidence', 'proceed', 'deposit', 'standard', undefined, '🏠 முன்பணம் பிடித்தம்'),
    P('லேண்ட்லார்ட் முன்பணம் திருப்பி தரல... ரோஜும் அடுத்த வாரம் தரேன்னு சொல்றாரு, இப்போ போனே எடுக்கல. 40 ஆயிரம் சிக்கிடுச்சு என்னோட', 'metaVague', 'vague', 'deposit', 'standard', undefined, '❓ விவரங்கள் இல்லை'),
    P('எங்களுக்கு ரெண்ட் ஒப்பந்தமே போடல, பிரோக்கர் மூலமா ஷிப்ட் ஆனேன்... 50k முன்பணம் பேங்க் டிரான்ஸ்ஃபர் செய்தேன், மாதம்தோறும் ரெண்ட் gpay பண்ணேன். இப்போ ஓனர் சொல்றாரு ஒப்பந்தம் இல்லைன்னா 1 ரூபாயும் தரமாட்டேன், என்ன வேணும்னாலும் செய்யுங்கன்னு', 'metaInformal', 'informal', 'deposit', 'informal', undefined, '📜 ஒப்பந்தம் இல்லை'),
  ],
  ur: [
    P('پچھلے مہینے کوٹھرڈ پونے کا 2bhk فلیٹ خالی کیا... پورا 1 مہینے کا نوٹس دیا اور چابیاں بھی سونپ دیں۔ اب مالک 50k محنتانے میں سے 35,000 کاٹ رہے ہیں، کہہ رہے ڈیپ کلیننگ اور مکمل پینٹنگ کروائی! کوئی بل نہیں دکھا رہے', 'metaEvidence', 'proceed', 'deposit', 'standard', undefined, '🏠 سیکیورٹی ڈپازٹ روکا'),
    P('مالک محنتانہ واپس نہیں کر رہا... روز کہتا ہے اگلے ہفتے دوں گا، اب فون اٹھانا ہی بند کر دیا۔ 40 ہزار میرا پھنسا ہوا ہے', 'metaVague', 'vague', 'deposit', 'standard', undefined, '❓ تفصیلات غائب'),
    P('ہمارا کوئی رینٹ ایگریمنٹ بنا ہی نہیں تھا، بروکر کے ذریعے شفٹ ہوئے تھے... 50k محنتانہ بینک ٹرانسفر کیا تھا اور ہر مہینے کرایہ gpay کرتا تھا۔ اب مالک کہہ رہا ایگریمنٹ نہیں تو 1 روپیہ بھی نہیں ملے گا، جو کرنا ہے کر لو', 'metaInformal', 'informal', 'deposit', 'informal', undefined, '📜 ایگریمنٹ نہیں'),
  ],
}

const scn2clarify: Partial<Record<LangCode, TesterOption[]>> = {
  en: [
    P('pune kothrud mein 2bhk tha, 50,000 deposit diya tha. 30 sept ko 1 month notice deke khali kiya, ab kulkarni uncle 35,000 painting ka kaat rahe bina bill ke', 'metaEvidence', 'proceed', 'deposit', 'standard', undefined, '🏠 Pune flat ₹35k cut'),
    P('30k deposit gpay kiya tha par koi rent agreement sign nahi hua tha, owner bol raha bina agreement paise bhool jao', 'metaInformal', 'informal', 'deposit', 'informal', undefined, '📱 30k GPay no agreement'),
  ],
  hi: [
    P('पुणे कोथरूड में 2bhk था, 50,000 डिपॉज़िट दिया था। 30 सितंबर को 1 माह का नोटिस देकर खाली किया, अब मालिक 35,000 पेंटिंग का काट रहे बिना बिल के', 'metaEvidence', 'proceed', 'deposit', 'standard', undefined, '🏠 पुणे फ्लैट ₹35k कटौती'),
    P('30k डिपॉज़िट gpay किया था पर कोई रेंट एग्रीमेंट साइन नहीं हुआ था, मालिक कह रहा बिना एग्रीमेंट पैसे भूल जाओ', 'metaInformal', 'informal', 'deposit', 'informal', undefined, '📱 कोई एग्रीमेंट नहीं'),
  ],
  mr: [
    P('पुणे कोथरूडमध्ये 2bhk होता, 50,000 भरपगारी दिली होती. 30 सप्टेंबरला 1 महिन्याची नोटीस देऊन सोडला, आता मालक 35,000 पेंटिंगचे काढतोय बिनबिलाचे', 'metaEvidence', 'proceed', 'deposit', 'standard', undefined, '🏠 पुणे फ्लॅट ₹35k कपात'),
    P('30k भरपगारी gpay केली होती पण भाडेकरार नव्हता, मालक म्हणतोय कराराशिवाय पैसे विसरून जा', 'metaInformal', 'informal', 'deposit', 'informal', undefined, '📱 करार नाही'),
  ],
  ta: [
    P('புனே கோத்திருட்டில் 2bhk, 50,000 முன்பணம் தந்தேன். 30 செப்டம்பரில் 1 மாத நோட்டீஸ் தந்து காலி செய்தேன், இப்போ ஓனர் 35,000 பெயின்டிங்குக்கு பில் இல்லாம கழட்டறாரு', 'metaEvidence', 'proceed', 'deposit', 'standard', undefined, '🏠 புனே ஃப்ளாட் ₹35k பிடித்தம்'),
    P('30k முன்பணம் gpay பண்ணினேன் ஆனால் வாடகை ஒப்பந்தம் போடல, ஓனர் ஒப்பந்தம் இல்லாம காசை மறந்துடுன்னு சொல்றாரு', 'metaInformal', 'informal', 'deposit', 'informal', undefined, '📱 ஒப்பந்தம் இல்லை'),
  ],
  ur: [
    P('پونے کوٹھرڈ میں 2bhk تھا، 50,000 محنتانہ دیا تھا۔ 30 ستمبر کو 1 ماہ کا نوٹس دے کر خالی کیا، اب مالک 35,000 پینٹنگ کا کاٹ رہے بغیر بل کے', 'metaEvidence', 'proceed', 'deposit', 'standard', undefined, '🏠 پونے فلیٹ ₹35k کٹوتی'),
    P('30k محنتانہ gpay کیا تھا پر کوئی رینٹ ایگریمنٹ نہیں تھا، مالک کہہ رہا ایگریمنٹ کے بغیر پیسے بھول جاؤ', 'metaInformal', 'informal', 'deposit', 'informal', undefined, '📱 بغیر ایگریمنٹ'),
  ],
}

const scn2post: Partial<Record<LangCode, TesterOption[]>> = {
  en: [
    P('msg bheja toh bol rahe "agreement ke clause 9 mein likha hai painting charge tenant dega". par 35 hazaar thodi lagta hai 2bhk ke whitewash mein? bina bill ke kaise kaat sakte hain?', 'metaPushback', 'pushback', undefined, undefined, undefined, '💬 Landlord cites Clause 9'),
    P('owner ne flat pe apna naya tala laga diya hai aur mera laptop aur kapde andar hi band hain... watchman ko bola hai mujhe society ke andar ghusne mat dena warna hath pair tod dunga', 'metaThreat', 'stop', undefined, undefined, undefined, '🛡️ Landlord locked flat'),
    P('society secretary ko beech mein daala aur aapka transfer of property act wala msg bheja toh uncle maan gaye! 45,000 gpay kar diya abhi, bas 5k actual cleaning ka kata. sorted!', 'metaResolved', 'resolved', undefined, undefined, undefined, '🎉 Returned ₹45k after notice'),
  ],
  hi: [
    P('msg भेजा तो बोले "एग्रीमेंट के क्लॉज 9 में लिखा है पेंटिंग चार्ज किराएदार देगा"। पर 35 हज़ार थोड़े लगते हैं 2bhk के व्हाइटवॉश में? बिना बिल कैसे काट सकते हैं?', 'metaPushback', 'pushback', undefined, undefined, undefined, '💬 मकान मालिक ने क्लॉज 9 कहा'),
    P('मालिक ने फ्लैट पर अपना नया ताला लगा दिया और मेरा लैपटॉप और कपड़े अंदर बंद हैं... वॉचमैन को बोला है मुझे सोसाइटी में घुसने मत देना वरना हाथ-पैर तोड़ दूँगा', 'metaThreat', 'stop', undefined, undefined, undefined, '🛡️ मालिक ने ताला लगाया'),
    P('सोसाइटी सेक्रेटरी को बीच में डाला और आपका ट्रांसफ़र ऑफ़ प्रॉपर्टी ऐक्ट वाला msg भेजा तो अंकल मान गए! 45,000 gpay कर दिए अभी, बस 5k असली क्लीनिंग का काटा। सॉर्टेड!', 'metaResolved', 'resolved', undefined, undefined, undefined, '🎉 ₹45k वापस मिले'),
  ],
  mr: [
    P('msg पाठवला तर म्हणतात "कराराच्या कलम 9 मध्ये लिहिलंय पेंटिंग चार्ज भाडेकरू देईल". पण 35 हजार किती लागतील 2bhk च्या व्हाइटवॉशला? बिनबिल्ला कसे काढू शकतात?', 'metaPushback', 'pushback', undefined, undefined, undefined, '💬 मालकाने कलम 9 दाखवले'),
    P('मालकाने फ्लॅटवर आपलं कुलूप लावलंय आणि माझं लॅपटॉप-कपडे आत बंद आहेत... वॉचमनला सांगितलंय मला सोसायटीत घालू नका नाहीतर हातपाय मोडीन', 'metaThreat', 'stop', undefined, undefined, undefined, '🛡️ मालकाने कुलूप लावले'),
    P('सोसायटी सेक्रेटरीला मध्ये घातला आणि तुमचा ट्रान्सफर ऑफ प्रॉपर्टी ॲक्टचा msg पाठवला तर काका मानले! 45,000 gpay केले आत्ता, फक्त 5k खरी साफसफाई काढली. सॉर्टेड!', 'metaResolved', 'resolved', undefined, undefined, undefined, '🎉 ₹45k परत मिळाले'),
  ],
  ta: [
    P('msg அனுப்பினா சொல்றாங்க "ஒப்பந்தத்துல கிளாஸ் 9-ல பெயின்டிங் சார்ஜ் வாடகைக்காரர் தரணும்னு எழுதியிருக்கு". ஆனா 35 ஆயிரம் 2bhk வைட்வாஷ்க்கு கொஞ்சம் கூடும்னா? பில் இல்லாம எப்பிடி கழட்ட முடியும்?', 'metaPushback', 'pushback', undefined, undefined, undefined, '💬 ஓனர் கிளாஸ் 9 சொல்கிறார்'),
    P('ஓனர் ஃப்ளாட்டுக்கு புது பூட்டு போட்டிட்டாரு, என் லேப்டாப் சட்டைகள் உள்ள இருக்கு... வாட்ச்மென்-கிட்ட சொல்லிட்டாரு என்னை சொஸைட்டி உள்ள விடக்கூடாது, இல்லன்னா கைகால் உடைப்பேன்னு', 'metaThreat', 'stop', undefined, undefined, undefined, '🛡️ ஓனர் பூட்டு போட்டுவிட்டார்'),
    P('சொஸைட்டி செக்ரட்டரியை நடுவுல போட்டு, உங்க டிரான்ஸ்ஃபர் ஆஃப் ப்ராப்பர்ட்டி ஆக்ட msg அனுப்பினேன் — மாமா ஒத்துக்கிட்டாரு! 45,000 gpay பண்ணிட்டாரு இப்போ, 5k அசல் க்ளீனிங்குக்கு மட்டும் கழட்டினாரு. சார்டெட!', 'metaResolved', 'resolved', undefined, undefined, undefined, '🎉 ₹45k திரும்பியது'),
  ],
  ur: [
    P('msg بھیجا تو بولے "ایگریمنٹ کے کلاز 9 میں لکھا ہے پینٹنگ چارج کرایہ دار دے گا". پر 35 ہزار کم ہی لگتے ہیں 2bhk کے وائٹ واش میں؟ بغیر بل کیسے کاٹ سکتے ہیں؟', 'metaPushback', 'pushback', undefined, undefined, undefined, '💬 مالک کلاز 9 بتا رہا ہے'),
    P('مالک نے فلیٹ پر اپنا نیا تالا لگا دیا ہے اور میرا لیپ ٹاپ کپڑے اندر بند ہیں... چوکیدار کو بولا ہے مجھے سوسائٹی میں گھسنے نہ دے ورنہ ہاتھ پاؤں توڑ دوں گا', 'metaThreat', 'stop', undefined, undefined, undefined, '🛡️ مالک نے تالا لگا دیا'),
    P('سوسائٹی سیکریٹری کو بیچ میں ڈالا اور آپ کا ٹرانسفر آف پراپرٹی ایکٹ والا msg بھیجا تو انکل مان گئے! 45,000 gpay کر دیے ابھی، بس 5k اصل صفائی کا کاٹا۔ سورٹڈ!', 'metaResolved', 'resolved', undefined, undefined, undefined, '🎉 ₹45k واپس مل گئے'),
  ],
}

/* ── Scenario 4 · upi_salary — wrong transfer & withheld dues ── */

const scn4turn1: Partial<Record<LangCode, TesterOption[]>> = {
  en: [
    P('bhai abhi 2 ghante pehle phonepe se 12,000 rupaye galti se galat number pe chale gaye!! ek digit 8 ki jagah 9 type ho gaya... us bande ko call kiya toh pehle uthaya aur ab phone switch off kar liya 😭 utr number hai mere paas, paisa wapas aayega kya??', 'metaEvidence', 'proceed', 'upi', 'standard', undefined, '💸 Wrong UPI transfer ₹12k'),
    P('left my previous IT company in noida 45 days ago... full 2 months notice serve kiya, laptop id card sab jama kar diya. ab HR 68,000 ka F&F salary aur relieving letter rok ke baithi hai, bolti manager ne sign nahi kiya', 'metaWorkplace', 'proceed', 'salary', 'standard', undefined, '💼 Unpaid F&F salary ₹68k'),
    P('meri purani company wale pichle 2 mahine ki salary nahi de rahe aur experience letter ke badle 50k bond mang rahe hain', 'metaVague', 'vague', 'salary', 'informal', undefined, '❓ Withheld salary, vague'),
  ],
  hi: [
    P('भैया अभी 2 घंटे पहले phonepe से 12,000 रुपये गलती से गलत नंबर पर चले गए!! एक अंक 8 की जगह 9 टाइप हो गया... उस बंदे को कॉल किया तो पहले उठाया और अब फोन बंद कर दिया 😭 UTR नंबर है मेरे पास, पैसा वापस आएगा क्या??', 'metaEvidence', 'proceed', 'upi', 'standard', undefined, '💸 ग़लत UPI ₹12k'),
    P('नोएडा की पिछली IT कंपनी 45 दिन पहले छोड़ी... पूरे 2 महीने का नोटिस निभाया, लैपटॉप आईडी कार्ड सब जमा कर दिया। अब HR 68,000 का F&F वेतन और रिलीविंग लैटर रोके बैठी है, कहती मैनेजर ने साइन नहीं किया', 'metaWorkplace', 'proceed', 'salary', 'standard', undefined, '💼 बकाया सैलरी ₹68k'),
    P('पुरानी कंपनी वाले पिछले 2 महीने की सैलरी नहीं दे रहे और एक्सपीरियंस लैटर के बदले 50k का बॉन्ड माँग रहे हैं', 'metaVague', 'vague', 'salary', 'informal', undefined, '❓ विवरण उपलब्ध नहीं'),
  ],
  mr: [
    P('भावा आत्ताच 2 तासांपूर्वी phonepe वरून 12,000 रुपये चुकून चुकीच्या नंबरवर गेले!! एक अंक 8 ऐवजी 9 टाइप झाला... त्याला कॉल केला तो पहिल्यांदा घेत होता आणि आता फोन बंद केलाय 😭 UTR नंबर आहे माझ्याकडे, पैसे परत येतील का??', 'metaEvidence', 'proceed', 'upi', 'standard', undefined, '💸 चुकीचा UPI ₹12k'),
    P('नोएडाची मागील IT कंपनी 45 दिवसांपूर्वी सोडली... पूर्ण 2 महिन्यांची नोटीस भागवली, लॅपटॉप आयडी कार्ड सगळं जमा केलं. आता HR 68,000 चा F&F पगार आणि रिलीव्हिंग लेटर धरून बसलीये, म्हणतायत मॅनेजरने साईन केलं नाही', 'metaWorkplace', 'proceed', 'salary', 'standard', undefined, '💼 थकीत पगार ₹68k'),
    P('जुनी कंपनी गेल्या 2 महिन्यांचा पगार देत नाहीये आणि एक्सपिरियन्स लेटरच्या बदल्यात 50k चा बॉन्ड मागतायत', 'metaVague', 'vague', 'salary', 'informal', undefined, '❓ तपशील अपुरे'),
  ],
  ta: [
    P('நண்பா இப்ப 2 மணி நேரத்துக்கு முன்னாடி phonepe-ல 12,000 ரூபாய் தவறுதலா தப்பு நம்பருக்கு போயிடுச்சு!! ஒரு எண் 8-க்கு பதிலா 9 டைப் ஆயிடுச்சு... அவருக்கு கால் பண்ணேன் முதல்ல எடுத்தாரு, இப்போ போன் ஆஃப் பண்ணிட்டாரு 😭 UTR நம்பர் என் கையில இருக்கு, காசு திரும்பி வருமா??', 'metaEvidence', 'proceed', 'upi', 'standard', undefined, '💸 தவறான UPI ₹12k'),
    P('நொய்டா IT கம்பெனியை 45 நாள் முன்னாடி விட்டுட்டேன்... முழு 2 மாத நோட்டீஸ் சர்வ் பண்ணேன், லேப்டாப் ஐடி கார்டு எல்லாம் ஒப்படைச்சேன். இப்போ HR 68,000 F&F சம்பளம், ரிலீவிங் லெட்டரை பிடிச்சிருக்காங்க, மேனேஜர் சைன் பண்ணலைன்னு சொல்றாங்க', 'metaWorkplace', 'proceed', 'salary', 'standard', undefined, '💼 நிலுவை சம்பளம் ₹68k'),
    P('பழைய கம்பெனி வாலர்கள் கடந்த 2 மாத சம்பளம் தரல, எக்ஸ்பீரியன்ஸ் லெட்டருக்கு பதிலா 50k பாண்ட் கேட்கிறாங்க', 'metaVague', 'vague', 'salary', 'informal', undefined, '❓ விவரங்கள் இல்லை'),
  ],
  ur: [
    P('بھائی ابھی 2 گھنٹے پہلے phonepe سے 12,000 روپے غلطی سے غلط نمبر پر چلے گئے!! ایک ہندسہ 8 کی جگہ 9 ٹائپ ہو گیا... اس بندے کو کال کی تو پہلے اٹھایا اور اب فون بند کر دیا 😭 UTR نمبر میرے پاس ہے، پیسہ واپس آئے گا کیا؟؟', 'metaEvidence', 'proceed', 'upi', 'standard', undefined, '💸 غلط UPI ₹12k'),
    P('نوئیڈا کی پچھلی IT کمپنی 45 دن پہلے چھوڑی... پورے 2 مہینے کا نوٹس نبھایا، لیپ ٹاپ آئی ڈی کارڈ سب جمع کر دیے۔ اب HR 68,000 کا F&F تنخواہ اور ریلیونگ لیٹر روکے بیٹھی ہے، کہتی ہے مینیجر نے سائن نہیں کیا', 'metaWorkplace', 'proceed', 'salary', 'standard', undefined, '💼 واجب الادا تنخواہ ₹68k'),
    P('پرانی کمپنی والے پچھلے 2 مہینے کی تنخواہ نہیں دے رہے اور ایکسپیرینس لیٹر کے بدلے 50k کا بانڈ مانگ رہے ہیں', 'metaVague', 'vague', 'salary', 'informal', undefined, '❓ تفصیلات غائب'),
  ],
}

const scn4clarify: Partial<Record<LangCode, TesterOption[]>> = {
  en: [
    P('bhai 2 ghante pehle phonepe se 12,000 galat number pe chale gaye, utr number 429188301294 hai aur screenshot bhi hai', 'metaEvidence', 'proceed', 'upi', 'standard', undefined, '💸 PhonePe UTR screenshot'),
    P('noida IT company mein 60 days notice serve karke 45 din pehle chhoda, 68,000 F&F aur relieving letter HR ne roka hai', 'metaWorkplace', 'proceed', 'salary', 'standard', undefined, '💼 60 days notice served'),
  ],
  hi: [
    P('2 घंटे पहले phonepe से 12,000 ग़लत नंबर पर चले गए, UTR नंबर 429188301294 है और स्क्रीनशॉट भी है', 'metaEvidence', 'proceed', 'upi', 'standard', undefined, '💸 UTR स्क्रीनशॉट'),
    P('नोएडा IT कंपनी में 60 दिन नोटिस निभाकर 45 दिन पहले छोड़ा, 68,000 F&F और रिलीविंग लैटर HR ने रोका है', 'metaWorkplace', 'proceed', 'salary', 'standard', undefined, '💼 नोटिस पूरा किया'),
  ],
  mr: [
    P('2 तासांपूर्वी phonepe वरून 12,000 चुकीच्या नंबरवर गेले, UTR नंबर 429188301294 आहे आणि स्क्रीनशॉटही आहे', 'metaEvidence', 'proceed', 'upi', 'standard', undefined, '💸 UTR स्क्रीनशॉट'),
    P('नोएडा IT कंपनीत 60 दिवस नोटीस भागवून 45 दिवसांपूर्वी सोडली, 68,000 F&F आणि रिलीव्हिंग लेटर अडवले आहे', 'metaWorkplace', 'proceed', 'salary', 'standard', undefined, '💼 नोटीस पूर्ण केली'),
  ],
  ta: [
    P('2 மணி நேரத்துக்கு முன் phonepe-ல 12,000 தவறான எண்ணுக்கு போனது, UTR எண் 429188301294 மற்றும் ஸ்கிரீன்ஷாட் இருக்கு', 'metaEvidence', 'proceed', 'upi', 'standard', undefined, '💸 UTR ஸ்கிரீன்ஷாட்'),
    P('நொய்டா IT கம்பெனியில் 60 நாள் நோட்டீஸ் முடித்து 45 நாள் ஆனது, 68,000 F&F மற்றும் ரிலீவிங் லெட்டரை HR பிடித்திருக்கிறார்கள்', 'metaWorkplace', 'proceed', 'salary', 'standard', undefined, '💼 நோட்டீஸ் முடிந்தது'),
  ],
  ur: [
    P('2 گھنٹے پہلے phonepe سے 12,000 غلط نمبر پر چلے گئے، UTR نمبر 429188301294 ہے اور اسکرین شاٹ بھی ہے', 'metaEvidence', 'proceed', 'upi', 'standard', undefined, '💸 UTR اسکرین شاٹ'),
    P('نوئیڈا IT کمپنی میں 60 دن کا نوٹس نبھا کر 45 دن پہلے چھوڑا، 68,000 F&F اور ریلیونگ لیٹر HR نے روکا ہے', 'metaWorkplace', 'proceed', 'salary', 'standard', undefined, '💼 نوٹس مکمل کیا'),
  ],
}

const scn4post: Partial<Record<LangCode, TesterOption[]>> = {
  en: [
    P('bank customer care pe call kiya toh bol rahe "sir aapne khud UPI PIN daala toh hum kuch nahi kar sakte, police mein jao". bank wale taal rahe hain, ab nodal officer ko kaise pakdu?', 'metaPushback', 'pushback', undefined, undefined, undefined, '💬 Bank says police complaint'),
    P('company ke maalik ne call karke dhamki di ki agar labour court ya linkedin pe kuch daala toh background verification (BGV) mein fake fraud case daal ke mera career kharab kar dega aur ghar pe gunde bhejega', 'metaThreat', 'stop', undefined, undefined, undefined, '🛡️ Employer threatens fraud'),
    P('NPCI portal pe complaint daali aur bank nodal officer ko wrong-credit guidelines quote kiya toh recipient ke bank ne 12,000 pe lien mark kar diya! bank se msg aaya ki 3 working days mein reversal ho jayega!', 'metaResolved', 'resolved', undefined, undefined, undefined, '🎉 Bank marked lien on ₹12k'),
  ],
  hi: [
    P('बैंक कस्टमर केयर पर कॉल किया तो बोले "सर आपने खुद UPI PIN डाला था तो हम कुछ नहीं कर सकते, पुलिस में जाओ"। बैंक वाले टाल रहे हैं, अब नोडल ऑफ़िसर को कैसे पकड़ूँ?', 'metaPushback', 'pushback', undefined, undefined, undefined, '💬 बैंक ने पुलिस जाने को कहा'),
    P('कंपनी के मालिक ने कॉल करके धमकी दी कि अगर लेबर कोर्ट या लिंकडइन पर कुछ डाला तो BGV में फ़ेक फ़्रॉड केस डालकर करियर ख़राब कर देंगे और घर पर गुंडे भेजेंगे', 'metaThreat', 'stop', undefined, undefined, undefined, '🛡️ मालिक धमकी दे रहा है'),
    P('NPCI पोर्टल पर शिकायत डाली और बैंक नोडल ऑफ़िसर को wrong-credit गाइडलाइंस कोट किया तो प्राप्तकर्ता के बैंक ने 12,000 पर लीन मार्क कर दिया! बैंक से msg आया कि 3 वर्किंग डेज़ में रिवर्सल हो जाएगा!', 'metaResolved', 'resolved', undefined, undefined, undefined, '🎉 बैंक ने लीन मार्क किया'),
  ],
  mr: [
    P('बँक कस्टमर केअरला कॉल केला तर म्हणतात "सर, तुम्ही स्वतः UPI PIN टाकला आम्ही काही करू शकत नाही, पोलीसात जा". बँकवाले टाळतायत, आता नोडल ऑफिसरला कसं पकडू?', 'metaPushback', 'pushback', undefined, undefined, undefined, '💬 बँकेने पोलिसांकडे पाठवले'),
    P('कंपनीच्या मालकाने कॉल करून धमकी दिली की लेबर कोर्ट किंवा LinkedIn वर काही टाकलं तर BGV मध्ये खोटा फसला खटला घालून करिअर बिघडवेल आणि घरी गुंडे पाठवेल', 'metaThreat', 'stop', undefined, undefined, undefined, '🛡️ मालक धमकी देतोय'),
    P('NPCI पोर्टलवर तक्रार टाकली आणि बँक नोडल ऑफिसरला wrong-credit गाइडलाइन कोट केल्या तर प्राप्तकर्त्याच्या बँकेने 12,000 वर लीन मार्क केला! बँकेचा मेसेज आला 3 वर्किंग डेजमध्ये रिव्हर्सल होईल!', 'metaResolved', 'resolved', undefined, undefined, undefined, '🎉 बँकेने लीन लावला'),
  ],
  ta: [
    P('பேங்க் கஸ்டமர் கேர்ல கால் பண்ணேன், "சார் நீங்க தான் UPI PIN போட்டிருக்கீங்க, நாங்க எதுவும் செய்ய முடியாது, போலீஸ்க்கு போங்க"ன்னு சொல்றாங்க. பேங்க் வாலர்கள் தப்பிக்கிறாங்க, நோடல் ஆஃபிஸரை எப்பிடி கையாள்றது?', 'metaPushback', 'pushback', undefined, undefined, undefined, '💬 வங்கி போலீஸிடம் போகச் சொல்கிறது'),
    P('கம்பெனி ஓனர் கால் பண்ணி மிரட்டுறாரு — லேபர் கோர்ட்லயோ லிங்க்டின்லயோ எதாவது போட்டா BGV-ல போலீஸ் கேஸ் போட்டு கேரியர் கெடுப்பேன், வீட்டுக்கு ரௌடிகளை அனுப்புவேன்னு', 'metaThreat', 'stop', undefined, undefined, undefined, '🛡️ உரிமையாளர் மிரட்டுகிறார்'),
    P('NPCI போர்ட்டல்ல கம்ப்ளைன்ட் போட்டு, பேங்க் நோ஡ல் ஆஃபிஸர்கிட்ட wrong-credit கைட்லைன்ஸ் கோட் பண்ணேன் — ரெசிபியன்ட் பேங்க் 12,000-க்கு லீன் மார்க் பண்ணிட்டாங்க! 3 வர்க்கிங் டேஸ்ல ரிவர்சல் ஆகும்னு பேங்க் மெசேஜ் வந்திருக்கு!', 'metaResolved', 'resolved', undefined, undefined, undefined, '🎉 வங்கி லீன் மார்க் செய்தது'),
  ],
  ur: [
    P('بینک کسٹمر کیئر پر کال کی تو بولے "سر آپ نے خود UPI PIN ڈالا تھا ہم کچھ نہیں کر سکتے، پولیس میں جائیں"۔ بینک والے ٹال رہے ہیں، اب نوڈل آفیسر کو کیسے پکڑوں؟', 'metaPushback', 'pushback', undefined, undefined, undefined, '💬 بینک نے پولیس جانے کو کہا'),
    P('کمپنی کے مالک نے کال کر کے دھمکی دی کہ لیبر کورٹ یا لنکڈان پر کچھ ڈالا تو BGV میں جھوٹا فراڈ کیس ڈال کر کیریئر خراب کر دیں گے اور گھر گنڈے بھیجیں گے', 'metaThreat', 'stop', undefined, undefined, undefined, '🛡️ مالک دھمکی دے رہا ہے'),
    P('NPCI پورٹل پر شکایت ڈالی اور بینک نوڈل آفیسر کو wrong-credit گائیڈ لائنز کوٹ کیا تو وصول کنندہ کے بینک نے 12,000 پر لین مارک کر دیا! بینک سے میسج آیا 3 ورکنگ ڈیز میں ریورسل ہو جائے گا!', 'metaResolved', 'resolved', undefined, undefined, undefined, '🎉 بینک نے لین مارک کیا'),
  ],
}

/* ── the registry ── */

export const INTERACTIVE_SCENARIOS: Scenario[] = [
  { id: 'scn1', outcome: 'mixed', turn1: scn1turn1, clarifyPrompts: scn1clarify, postFinding: scn1post },
  { id: 'scn2', outcome: 'mixed', turn1: scn2turn1, clarifyPrompts: scn2clarify, postFinding: scn2post },
  {
    id: 'scn3',
    outcome: 'notice',
    turn1: {
      en: [
        P('ye marathi me mahapalika ka notice aaya hai ghar pe, ₹18,450 likha hai lal shekdi me. are they going to seal my house??', 'metaNotice', 'notice', undefined, undefined, undefined, '🏛️ Marathi tax notice ₹18k'),
        P('this bill amount is totally wrong, the meter was faulty for 3 months and i already gave an application at the office', 'metaNotice', 'notice', undefined, undefined, undefined, '⚡ Faulty meter reading'),
      ],
      hi: [
        P('ये मराठी में महापालिका का नोटिस घर पर आया है, ₹18,450 लाल शेकड़ी में लिखा है। क्या ये मेरा घर सील कर देंगे??', 'metaNotice', 'notice', undefined, undefined, undefined, '🏛️ मराठी नोटिस ₹18k'),
        P('इस बिल की रकम पूरी ग़लत है, 3 महीने से मीटर खराब था और मैं दफ़्तर में आवेदन दे चुका हूँ', 'metaNotice', 'notice', undefined, undefined, undefined, '⚡ मीटर खराब था'),
      ],
      mr: [
        P('मराठीत महापालिकेचा नोटीस घरी आलाय, ₹18,450 लाल शेकड़ीत लिहिलाय. घर शिक्कामार्फत होणार का??', 'metaNotice', 'notice', undefined, undefined, undefined, '🏛️ महापालिका नोटीस ₹18k'),
        P('या बिलाची रक्कम पूर्ण चुकीची आहे, 3 महिने मीटर खराब होता आणि मी दप्तरात अर्ज दिलाय', 'metaNotice', 'notice', undefined, undefined, undefined, '⚡ मीटर खराब होते'),
      ],
      ta: [
        P('மராத்தியில் மஹாபாலிகா அறிவிப்பு வீட்டுக்கு வந்திருக்கு, ₹18,450 சிவப்பு எழுத்தில் இருக்கு. என் வீட்டை சீல் செய்வார்களா??', 'metaNotice', 'notice', undefined, undefined, undefined, '🏛️ மராத்தி அறிவிப்பு ₹18k'),
        P('இந்த பில் தொகை முற்றிலும் தவறு, 3 மாதம் மீட்டர் பழுது, அலுவலகத்தில் விண்ணப்பம் கொடுத்துவிட்டேன்', 'metaNotice', 'notice', undefined, undefined, undefined, '⚡ மீட்டர் பழுது'),
      ],
      ur: [
        P('مراٹھی میں میونسپل کا نوٹس گھر آیا ہے، ₹18,450 لال حروف میں لکھا ہے۔ کیا یہ میرا گھر سیل کر دیں گے??', 'metaNotice', 'notice', undefined, undefined, undefined, '🏛️ میونسپل نوٹس ₹18k'),
        P('اس بل کی رقم بالکل غلط ہے، 3 مہینے سے میٹر خراب تھا اور میں دفتر میں درخواست دے چکا ہوں', 'metaNotice', 'notice', undefined, undefined, undefined, '⚡ میٹر خراب تھا'),
      ],
    },
  },
  { id: 'scn4', outcome: 'mixed', turn1: scn4turn1, clarifyPrompts: scn4clarify, postFinding: scn4post },
  {
    id: 'scn5',
    outcome: 'stop',
    turn1: {
      en: [
        P(
          'The local electronics dealer is refusing to refund my defective inverter and his men just called threatening to come to my house if I post a review or file a complaint.',
          'metaThreat',
          'stop',
          undefined,
          undefined,
          undefined,
          '🛡️ Dealer is threatening me',
        ),
      ],
      hi: [
        P(
          'स्थानीय इलेक्ट्रॉनिक्स डीलर मेरे खराब इन्वर्टर का रिफंड नहीं दे रहा और उसके आदमियों ने फोन करके धमकी दी कि अगर कोई शिकायत की तो वे घर आ जाएंगे।',
          'metaThreat',
          'stop',
          undefined,
          undefined,
          undefined,
          '🛡️ डीलर धमकी दे रहा है',
        ),
      ],
      mr: [
        P(
          'स्थानिक इलेक्ट्रॉनिक्स डीलर इन्व्हर्टरचा परतावा नाकारत आहे आणि त्याच्या माणसांनी तक्रार केल्यास घरी येण्याची धमकी दिली आहे.',
          'metaThreat',
          'stop',
          undefined,
          undefined,
          undefined,
          '🛡️ डीलर धमकी देतोय',
        ),
      ],
      ta: [
        P(
          'இன்வெர்ட்டர் பழுதானதால் பணத்தை திருப்பித் தர மறுக்கும் டீலர், புகார் செய்தால் ஆட்களை அனுப்புவேன் என மிரட்டுகிறார்.',
          'metaThreat',
          'stop',
          undefined,
          undefined,
          undefined,
          '🛡️ டீலர் மிரட்டுகிறார்',
        ),
      ],
      ur: [
        P(
          'لوکل الیکٹرانکس ڈیلر انورٹر کا ریفنڈ نہیں دے رہا اور اس کے آدمیوں نے شکایت کرنے پر گھر آنے کی دھمکی دی ہے۔',
          'metaThreat',
          'stop',
          undefined,
          undefined,
          undefined,
          '🛡️ ڈیلر دھمکی دے رہا ہے',
        ),
      ],
    },
  },
]

/** languages the sandbox offers up front (master spec Part 1) */
export const SANDBOX_LANGS: LangCode[] = ['en', 'hi', 'mr', 'ta', 'ur', 'bn', 'gu', 'kn', 'ml', 'pa', 'te']

export function scenarioById(id: string | undefined): Scenario | undefined {
  return INTERACTIVE_SCENARIOS.find((s) => s.id === id)
}
