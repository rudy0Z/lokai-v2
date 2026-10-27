import type { LangCode } from './languages'

/**
 * Live branching interactive scenarios (master build prompt, Part 2): at
 * every turn of a live test the recruiter picks from 3–4 "tester prompt
 * cards" written in authentic, slightly messy Indian conversational style.
 * Each option DECLARES the path it stress-tests via its meta key, and its
 * `route` is deterministic — free typing still goes through the classifier.
 * Fictional sellers only (HomeKart/Mixwell); no invented statute numbers or
 * helpline numbers anywhere (rails are named, never numbered).
 */
export type ScenarioRoute = 'proceed' | 'vague' | 'informal' | 'stop' | 'notice' | 'pushback' | 'resolved'

export interface TesterOption {
  text: string
  route: ScenarioRoute
  /** i18n UiKey of the meta label, e.g. 'metaEvidence' */
  meta: string
}

export interface Scenario {
  id: string
  outcome: 'proceed' | 'caution' | 'notice' | 'stop' | 'mixed'
  turn1: Partial<Record<LangCode, TesterOption[]>>
  /** shown after the finding/ladder mounts (stage 'engaged') */
  postFinding?: Partial<Record<LangCode, TesterOption[]>>
}


export const INTERACTIVE_SCENARIOS: Scenario[] = [
  {
    id: 'scn1',
    outcome: 'mixed',
    turn1: {
      en: [
        { text: 'bhai i ordered mixwell mixer grinder for 8999 from homekart 4 days back... jar is cracked and motor smelling burnt when switched on. customer care guy says return window closed, talk to service center only!!', route: 'proceed', meta: 'metaEvidence' },
        { text: 'online shopping wale paisa nahi wapas kar rahe, broken item mila hai yesterday, help karo', route: 'vague', meta: 'metaVague' },
        { text: 'bought watch from insta page @luxdeals_india for 4500, paid on gpay personal number, now he blocked me on whatsapp. no bill nothing', route: 'informal', meta: 'metaInformal' },
      ],
      hi: [
        { text: 'भैया होमकार्ट से 8999 का मिक्सवेल मिक्सर 4 दिन पहले ऑर्डर किया था... जार टूटा आया और चालू करते ही मोटर से जलने जैसी सीख आती है। कस्टमर केयर बोला रिटर्न विंडो क्लोज, सर्विस सेंटर जाओ!!', route: 'proceed', meta: 'metaEvidence' },
        { text: 'ऑनलाइन शॉपिंग वाले पैसे नहीं वापस कर रहे, कल टूटा हुआ सामान मिला है, मदद करो', route: 'vague', meta: 'metaVague' },
        { text: 'इंस्टा पेज @luxdeals_india से 4500 की घड़ी ली थी, gpay पर पर्सनल नंबर पर भुगतान किया, अब whatsapp पर ब्लॉक कर दिया। बिल भी नहीं दिया', route: 'informal', meta: 'metaInformal' },
      ],
      mr: [
        { text: 'होमकार्टवरून 8999 चा मिक्सवेल मिक्सर 4 दिवसांपूर्वी ऑर्डर केला होता... जार फुटलेला आला आणि सुरू केल्यावर मोटरचा जळजळीत वास येतो. कस्टमर केअर म्हणतो रिटर्न विंडो बंद, सर्व्हिस सेंटरला जा!!', route: 'proceed', meta: 'metaEvidence' },
        { text: 'ऑनलाइन शॉपिंगवाले पैसे परत करत नाहीयेत, काल तुटलेला माल आलाय, मदत करा', route: 'vague', meta: 'metaVague' },
        { text: 'इन्स्टा पेज @luxdeals_india कडून 4500 चे घड्याळ घेतले, gpay वर खाजगी नंबरावर पैसे दिले, आता whatsapp वर ब्लॉक केले. बिलही नाही', route: 'informal', meta: 'metaInformal' },
      ],
      ta: [
        { text: 'ஹோம்கார்ட்டில் 8999-க்கு மிக்ஸ்வெல் மிக்சர் 4 நாள் முன் ஆர்டர் செய்தேன்... ஜார் உடைந்து வந்தது, ஆன் செய்யும்போது மோட்டாரிலிருந்து எரியும் வாசனை. கஸ்டமர் கேர் ரிட்டர்ன் விண்டோ முடிந்தது, சர்வீஸ் சென்டர் போன்று சொல்கிறார்கள்!!', route: 'proceed', meta: 'metaEvidence' },
        { text: 'ஆன்லைன் ஷாப்பிங் காரர்கள் பணம் திரும்பத் தரவில்லை, நேற்று உடைந்த பொருள் வந்தது, உதவி செய்யுங்கள்', route: 'vague', meta: 'metaVague' },
        { text: 'இன்ஸ்டா பேஜ் @luxdeals_india-லிருந்து 4500-க்கு கடிகாரம் வாங்கினேன், gpay-ல் தனிப்பட்ட எண்ணுக்கு பணம் கொடுத்தேன், இப்போது whatsapp-ல் பிளாக் செய்தார். பில் கூட இல்லை', route: 'informal', meta: 'metaInformal' },
      ],
      ur: [
        { text: 'بھائی ہوم کارٹ سے 8999 کا مکس ویل مکسر 4 دن پہلے آرڈر کیا تھا... جار ٹوٹا آیا اور آن کرنے پر موٹر سے جلنے کی بو آتی ہے۔ کسٹمر کیئر کہہ رہا ہے ریٹرن ونڈو بند، سروس سینٹر جاؤ!!', route: 'proceed', meta: 'metaEvidence' },
        { text: 'آن لائن شاپنگ والے پیسے واپس نہیں کر رہے، کل ٹوٹا ہوا مال آیا ہے، مدد کریں', route: 'vague', meta: 'metaVague' },
        { text: 'انسٹا پیج @luxdeals_india سے 4500 کی گھڑی لی تھی، gpay پر ذاتی نمبر پر ادائیگی کی، اب واٹس ایپ پر بلاک کر دیا۔ بل بھی نہیں دیا', route: 'informal', meta: 'metaInformal' },
      ],
    },
    postFinding: {
      en: [
        { text: 'i sent your whatsapp message to support... they replied "as per company policy electronics only have brand warranty no refund". what to say now??', route: 'pushback', meta: 'metaPushback' },
        { text: 'the local dealer is calling my phone, saying he knows where i live and will send boys if i file a complaint', route: 'stop', meta: 'metaThreat' },
        { text: 'omg they actually approved the pickup and refund after seeing the message!! thanks', route: 'resolved', meta: 'metaResolved' },
      ],
      hi: [
        { text: 'आपका whatsapp मैसेज सपोर्ट को भेजा... उन्होंने जवाब दिया "कंपनी पॉलिसी के अनुसार इलेक्ट्रॉनिक्स पर सिर्फ ब्रांड वारंटी, रिफंड नहीं"। अब क्या कहूँ??', route: 'pushback', meta: 'metaPushback' },
        { text: 'लोकल डीलर मेरे फ़ोन पर कॉल करके कह रहा है कि उसे पता है मैं कहाँ रहता हूँ, शिकायत की तो लड़के भेजेगा', route: 'stop', meta: 'metaThreat' },
        { text: 'अरे वाह, मैसेज देखकर उन्होंने पिकअप और रिफंड मंज़ूर कर लिया!! शुक्रिया', route: 'resolved', meta: 'metaResolved' },
      ],
      mr: [
        { text: 'तुमचा whatsapp संदेश सपोर्टला पाठवला... उत्तर आले "कंपनी पॉलिसीनुसार इलेक्ट्रॉनिक्सवर फक्त ब्रँड वॉरंटी, परतावा नाही". आता काय म्हणावे??', route: 'pushback', meta: 'metaPushback' },
        { text: 'लोकल डीलर फोनवर कॉल करून म्हणतोय, त्याला माहीत मी कुठे राहतो, तक्रार केली तर माणसं पाठवेल', route: 'stop', meta: 'metaThreat' },
        { text: 'अरे वा, संदेश बघून त्यांनीच पिकअप आणि परतावा मंजूर केला!! धन्यवाद', route: 'resolved', meta: 'metaResolved' },
      ],
      ta: [
        { text: 'உங்கள் whatsapp செய்தியை சப்போர்ட்டுக்கு அனுப்பினேன்... "நிறுவன கொள்கைப்படி எலக்ட்ரானிக்ஸுக்கு பிராண்ட் வாரண்டி மட்டுமே, ரீஃபண்ட் இல்லை" என்றார்கள். இப்போது என்ன சொல்வது??', route: 'pushback', meta: 'metaPushback' },
        { text: 'லோக்கல் டீலர் என் போனுக்கு கால் செய்து சொல்கிறார், நான் எங்கே இருக்கிறேன் தெரியும், புகார் கொடுத்தால் ஆட்களை அனுப்புவேன் என்கிறார்', route: 'stop', meta: 'metaThreat' },
        { text: 'அடடா, செய்தியைப் பார்த்ததும் அவர்களே பிக்கப்-உம் ரீஃபண்டும் ஒப்புக்கொண்டார்கள்!! நன்றி', route: 'resolved', meta: 'metaResolved' },
      ],
      ur: [
        { text: 'آپ کا واٹس ایپ میسج سپورٹ کو بھیجا... انہوں نے جواب دیا "کمپنی پالیسی کے مطابق الیکٹرانکس پر صرف برانڈ وارنٹی، ریفنڈ نہیں"۔ اب کیا کہوں؟؟', route: 'pushback', meta: 'metaPushback' },
        { text: 'لوکل ڈیلر میرے فون پر کال کر کے کہہ رہا ہے کہ اسے پتا ہے میں کہاں رہتا ہوں، شکایت کی تو لڑکے بھیجے گا', route: 'stop', meta: 'metaThreat' },
        { text: 'واہ، میسج دیکھ کر انہوں نے خود پک اپ اور ریفنڈ منظور کر لیا!! شکریہ', route: 'resolved', meta: 'metaResolved' },
      ],
    },
  },

  {
    id: 'scn2',
    outcome: 'mixed',
    turn1: {
      en: [
        { text: 'vacated my flat in pune last month, gave 1 month notice properly. landlord is holding my 50,000 deposit saying painting and deep cleaning will take 35k!! no bills shown', route: 'proceed', meta: 'metaEvidence' },
        { text: 'stayed in a pg room for 6 months, paid 15k deposit in cash. owner says no refund because no rent agreement was signed', route: 'informal', meta: 'metaVague' },
        { text: 'landlord locked my room with my laptop and certificates inside and threw my bag on the road', route: 'stop', meta: 'metaThreat' },
      ],
      hi: [
        { text: 'पिछले महीने पुणे में फ्लैट खाली किया, एक महीने का नोटिस ठीक से दिया। मकान मालिक 50,000 की डिपॉज़िट रोके हैं, कह रहा पेंटिंग-डीप क्लीनिंग में 35 हज़ार लगेंगे!! कोई बिल नहीं दिखाया', route: 'proceed', meta: 'metaEvidence' },
        { text: '6 महीने पीजी रूम में रहा, 15 हज़ार डिपॉज़िट कैश में दिया। मालिक कह रहा रेंट एग्रीमेंट साइन नहीं हुआ तो रिफंड नहीं', route: 'informal', meta: 'metaVague' },
        { text: 'मकान मालिक ने मेरा कमरा बंद कर दिया, लैपटॉप और सर्टिफिकेट अंदर हैं, और मेरा बैग सड़क पर फेंक दिया', route: 'stop', meta: 'metaThreat' },
      ],
      mr: [
        { text: 'गेल्या महिन्यात पुण्यातील फ्लॅट सोडला, एक महिन्याची नोटीस व्यवस्थित दिली. मालक माझी 50,000 ची भरपगाडी धरून बसला, पेंटिंग-डीप क्लीनिंगला 35 हजार लागतील म्हणतो!! बिल दाखवलेले नाही', route: 'proceed', meta: 'metaEvidence' },
        { text: '6 महिने पीजी रूममध्ये राहिलो, 15 हजार भरपगाडी रोखीने दिली. मालक म्हणतो रेंट करार साईन झाला नाही म्हणून परतावा नाही', route: 'informal', meta: 'metaVague' },
        { text: 'मालकाने माझी खोली बंद केली, लॅपटॉप आणि प्रमाणपत्रं आत आहेत, आणि माझी बॅग रस्त्यावर फेकली', route: 'stop', meta: 'metaThreat' },
      ],
      ta: [
        { text: 'கடந்த மாதம் புனேயில் ஃப்ளாட்டை காலியாக்கினேன், ஒரு மாத நோட்டீஸ் சரியாகக் கொடுத்தேன். வீட்டு உரிமையாளர் என் 50,000 முன்பணத்தை பிடித்திருக்கிறார், பெயின்டிங்-டீப் க்ளீனிங்குக்கு 35 ஆயிரம் ஆகுமாம்!! பில் காட்டவில்லை', route: 'proceed', meta: 'metaEvidence' },
        { text: '6 மாதம் பிஜி ரூமில் இருந்தேன், 15 ஆயிரம் முன்பணம் ரொக்கமாக கொடுத்தேன். ரெண்ட் ஒப்பந்தம் சைன் ஆகவில்லை என்று திரும்பத் தர மறுக்கிறார்', route: 'informal', meta: 'metaVague' },
        { text: 'வீட்டு உரிமையாளர் என் அறையை பூட்டிவிட்டார், லேப்டாப் சான்றிதழ்கள் உள்ளே, என் பையை ரோட்டில் தூக்கி எறிந்தார்', route: 'stop', meta: 'metaThreat' },
      ],
      ur: [
        { text: 'پچھلے مہینے پونے میں فلیٹ خالی کیا، ایک مہینے کا نوٹس ٹھیک سے دیا۔ مالک میری 50,000 کی محنتانہ روکے ہوئے ہے، کہہ رہا پینٹنگ ڈیپ کلیننگ میں 35 ہزار لگیں گے!! کوئی بل نہیں دکھایا', route: 'proceed', meta: 'metaEvidence' },
        { text: '6 مہینے پی جی روم میں رہا، 15 ہزار محنتانہ نقد دیا۔ مالک کہہ رہا ہے رینٹ ایگریمنٹ سائن نہیں ہوا تو واپسی نہیں', route: 'informal', meta: 'metaVague' },
        { text: 'مالک نے میرا کمرہ بند کر دیا، لیپ ٹاپ اور سرٹیفکیٹ اندر ہیں، اور میرا باغ رول پر پھینک دیا', route: 'stop', meta: 'metaThreat' },
      ],
    },
  },

  {
    id: 'scn3',
    outcome: 'notice',
    turn1: {
      en: [
        { text: 'ye marathi me mahapalika ka notice aaya hai ghar pe, ₹18,450 likha hai lal shekdi me. are they going to seal my house??', route: 'notice', meta: 'metaNotice' },
        { text: 'this bill amount is totally wrong, the meter was faulty for 3 months and i already gave an application at the office', route: 'notice', meta: 'metaNotice' },
      ],
      hi: [
        { text: 'ये मराठी में महापालिका का नोटिस घर पर आया है, ₹18,450 लाल शेकड़ी में लिखा है। क्या ये मेरा घर सील कर देंगे??', route: 'notice', meta: 'metaNotice' },
        { text: 'इस बिल की रकम पूरी ग़लत है, 3 महीने से मीटर खराब था और मैं दफ़्तर में आवेदन दे चुका हूँ', route: 'notice', meta: 'metaNotice' },
      ],
      mr: [
        { text: 'मराठीत महापालिकेचा नोटीस घरी आलाय, ₹18,450 लाल शेकड़ीत लिहिलाय. घर शिक्कामार्फत होणार का??', route: 'notice', meta: 'metaNotice' },
        { text: 'या बिलाची रक्कम पूर्ण चुकीची आहे, 3 महिने मीटर खराब होता आणि मी दप्तरात अर्ज दिलाय', route: 'notice', meta: 'metaNotice' },
      ],
      ta: [
        { text: 'மராத்தியில் மஹாபாலிகா அறிவிப்பு வீட்டுக்கு வந்திருக்கு, ₹18,450 சிவப்பு எழுத்தில் இருக்கு. என் வீட்டை சீல் செய்வார்களா??', route: 'notice', meta: 'metaNotice' },
        { text: 'இந்த பில் தொகை முற்றிலும் தவறு, 3 மாதம் மீட்டர் பழுது, அலுவலகத்தில் விண்ணப்பம் கொடுத்துவிட்டேன்', route: 'notice', meta: 'metaNotice' },
      ],
      ur: [
        { text: 'مراٹھی میں میونسپل کا نوٹس گھر آیا ہے، ₹18,450 لال حروف میں لکھا ہے۔ کیا یہ میرا گھر سیل کر دیں گے??', route: 'notice', meta: 'metaNotice' },
        { text: 'اس بل کی رقم بالکل غلط ہے، 3 مہینے سے میٹر خراب تھا اور میں دفتر میں درخواست دے چکا ہوں', route: 'notice', meta: 'metaNotice' },
      ],
    },
  },

  {
    id: 'scn4',
    outcome: 'caution',
    turn1: {
      en: [
        { text: 'sent 12,000 by mistake to a wrong phonepe number 1 hour ago, the person is not picking up my call', route: 'informal', meta: 'metaRails' },
        { text: 'left the company 2 months back, hr is holding 42,000 full and final settlement saying the manager has not signed the noc', route: 'informal', meta: 'metaWorkplace' },
      ],
      hi: [
        { text: '1 घंटा पहले ग़लती से ग़लत phonepe नंबर पर 12,000 भेज दिए, वो आदमी फ़ोन नहीं उठा रहा', route: 'informal', meta: 'metaRails' },
        { text: '2 महीने पहले कंपनी छोड़ी, hr 42,000 का फुल एंड फ़ाइनल सेटलमेंट रोके हैं कह रहे मैनेजर ने noc साइन नहीं किया', route: 'informal', meta: 'metaWorkplace' },
      ],
      mr: [
        { text: '1 तासापूर्वी चुकीने चुकीच्या phonepe नंबरवर 12,000 पाठवले, तो माणूस फोन उचलत नाही', route: 'informal', meta: 'metaRails' },
        { text: '2 महिन्यांपूर्वी कंपनी सोडली, hr 42,000 चे फुल अ‍ॅन्ड फायनल सेटलमेंट धरून आहे, मॅनेजरने noc साईन केले नाही म्हणतात', route: 'informal', meta: 'metaWorkplace' },
      ],
      ta: [
        { text: '1 மணி நேரத்திற்கு முன் தவறுதலாக தவறான phonepe எண்ணுக்கு 12,000 அனுப்பிவிட்டேன், அந்த நபர் ஃபோன் எடுக்கவில்லை', route: 'informal', meta: 'metaRails' },
        { text: '2 மாதங்களுக்கு முன் நிறுவனத்தை விட்டேன், hr 42,000 ஃபுல் அண்ட் ஃபைனல் செட்டில்மென்ட்டை பிடித்திருக்கிறார், மேனேஜர் noc சைன் செய்யவில்லை என்கிறார்கள்', route: 'informal', meta: 'metaWorkplace' },
      ],
      ur: [
        { text: '1 گھنٹہ پہلے غلطی سے غلط phonepe نمبر پر 12,000 بھیج دیے، وہ آدمی فون نہیں اٹھا رہا', route: 'informal', meta: 'metaRails' },
        { text: '2 مہینے پہلے کمپنی چھوڑی، hr 42,000 کا فل اینڈ فائنل سیٹلمنٹ روکے ہیں، کہتے ہیں مینیجر نے noc سائن نہیں کیا', route: 'informal', meta: 'metaWorkplace' },
      ],
    },
  },

  {
    id: 'scn5',
    outcome: 'stop',
    turn1: {
      en: [
        { text: 'my husband and in-laws are threatening to throw me out tonight and they took my phone', route: 'stop', meta: 'metaStop' },
      ],
      hi: [
        { text: 'मेरे पति और ससुराल वाले आज रात मुझे घर से निकालने की धमकी दे रहे हैं और उन्होंने मेरा फ़ोन छीन लिया', route: 'stop', meta: 'metaStop' },
      ],
      mr: [
        { text: 'माझा नवरा आणि सासरे आज रात्री मला घराबाहेर काढण्याची धमकी देत आहेत आणि त्यांनी माझा फोन घेतला', route: 'stop', meta: 'metaStop' },
      ],
      ta: [
        { text: 'என் கணவரும் மாமியார் வீட்டாரும் இன்று இரவு என்னை வீட்டிலிருந்து வெளியேற்றுவதாக மிரட்டுகிறார்கள், என் போனை எடுத்துக்கொண்டார்கள்', route: 'stop', meta: 'metaStop' },
      ],
      ur: [
        { text: 'میرے شوہر اور سسرال والے آج رات مجھے گھر سے نکالنے کی دھمکی دے رہے ہیں اور انہوں نے میرا فون چھین لیا', route: 'stop', meta: 'metaStop' },
      ],
    },
  },
]

/** languages the sandbox offers up front (master prompt Part 1) */
export const SANDBOX_LANGS: LangCode[] = ['en', 'hi', 'mr', 'ta', 'ur', 'bn', 'gu', 'kn', 'ml', 'pa', 'te']

export function scenarioById(id: string | undefined): Scenario | undefined {
  return INTERACTIVE_SCENARIOS.find((s) => s.id === id)
}
