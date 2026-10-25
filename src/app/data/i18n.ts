import type { LangCode } from './languages'

/**
 * UI chrome strings. Translations for hi/mr/ta/ur are AI-drafted placeholders
 * (reviewedByNativeSpeaker: false — see languages.ts). Legal claims never
 * live here; they live only in legal-content.ts behind the [VERIFY] policy.
 */
type Pack = Record<LangCode, string>

export interface UiStrings {
  roleLine: Pack
  protoTag: Pack
  greeting: Pack
  greetingSub: Pack
  chipDefective: Pack
  chipNotice: Pack
  chipThreat: Pack
  chipOther: Pack
  composerPlaceholder: Pack
  composerSend: Pack
  composerAttach: Pack
  attachTitle: Pack
  attachHint: Pack
  attachDocBill: Pack
  attachDocPhoto: Pack
  stageReading: Pack
  stageChecking: Pack
  stageWriting: Pack
  confClear: Pack
  confClearDesc: Pack
  confLikely: Pack
  confLikelyDesc: Pack
  confUnsure: Pack
  confUnsureDesc: Pack
  badgeVerified: Pack
  badgePrototype: Pack
  reasoningTitle: Pack
  simulatedTag: Pack
  findingWhatHappened: Pack
  findingLawSays: Pack
  findingMeans: Pack
  ladderTitle: Pack
  step1Title: Pack
  step2Title: Pack
  step3Title: Pack
  copy: Pack
  copied: Pack
  edit: Pack
  saveChanges: Pack
  regenerate: Pack
  discard: Pack
  stale: Pack
  update: Pack
  errorTitle: Pack
  errorBody: Pack
  retry: Pack
  offlineBanner: Pack
  newChat: Pack
  stopHeadline: Pack
  stopWhy: Pack
  dlsaTitle: Pack
  dlsaState: Pack
  dlsaDistrict: Pack
  dlsaFind: Pack
  dlsaUnavailable: Pack
  dlsaPlaceholderNote: Pack
  tellMore: Pack
  treatmentLabel: Pack
  treatmentInverted: Pack
  treatmentLight: Pack
  classifyPending: Pack
  tierHardStop: Pack
  tierCaution: Pack
  tierProceed: Pack
  langLabel: Pack
  themeLabel: Pack
  back: Pack
  openNotice: Pack
  noticeReviewTitle: Pack
  noticeConsent: Pack
  noticePrepare: Pack
  noticeFinalTitle: Pack
  noticeCopyAll: Pack
  cautionTitle: Pack
  restatePrefix: Pack
  qWhen: Pack
  ans30: Pack
  ans1to2: Pack
  ans2plus: Pack
  ansNotSure: Pack
}

export const UI: UiStrings = {
  roleLine: { en: 'Legal information companion', hi: 'कानूनी जानकारी साथी', mr: 'कायदेशीर माहिती सोबती', ta: 'சட்ட தகவல் துணை', ur: 'قانونی معلومات کا ساتھی' },
  protoTag: { en: 'Prototype · mock data · not a lawyer', hi: 'प्रोटोटाइप · नमूना डेटा · वकील नहीं', mr: 'प्रोटोटाइप · नमुना डेटा · वकील नाही', ta: 'மாதிரிவடிவம் · போலி தரவு · வழக்கறிஞர் அல்ல', ur: 'پروٹوٹائپ · نمونہ ڈیٹا · وکیل نہیں' },
  greeting: { en: 'Good day. What has been happening?', hi: 'नमस्ते। क्या हुआ है?', mr: 'नमस्कार। काय झाले आहे?', ta: 'வணக்கம். என்ன நடந்தது?', ur: 'خوش آمدید۔ کیا ہوا ہے؟' },
  greetingSub: {
    en: 'Tell me about a consumer problem, or show me an official notice. I will explain things in plain words and help you pick the next step — carefully.',
    hi: 'उपभोक्ता समस्या बताइए, या कोई सरकारी नोटिस दिखाइए। मैं सरल भाषा में समझाऊँगा और सावधानी से अगला कदम चुनने में मदद करूँगा।',
    mr: 'ग्राहक समस्या सांगा, किंवा शासकीय जाहीरनामा दाखवा. मी सोप्या भाषेत समजावेन आणि पुढचा पाय निवडण्यात मदत करेन.',
    ta: 'நுகர்வோர் பிரச்சனையைச் சொல்லுங்கள், அல்லது அரசு அறिवிப்பைக் காட்டுங்கள். எளிய மொழியில் விளக்கி, கவனமாக அடுத்த படியைத் தேர்ந்தெடுக்க உதவுவேன்.',
    ur: 'کسٹمر کی مشکل بتائیں، یا کوئی سرکاری نوٹس دکھائیں۔ میں سادہ الفاظ میں سمجھاؤں گا اور احتیاط سے اگلا قدم چننے میں مدد کروں گا۔',
  },
  chipDefective: { en: 'I got a defective product', hi: 'मुझे खराब उत्पाद मिला', mr: 'मला खराब वस्तू मिळाली', ta: 'கெட்ட பொருள் கிடைத்தது', ur: 'مجھے خراب مصنوعات ملی' },
  chipNotice: { en: 'I received an official notice', hi: 'मुझे एक सरकारी नोटिस मिला है', mr: 'मला शासकीय जाहीरनामा मिळाला आहे', ta: 'எனக்கு அரசு அறிவிப்பு வந்துள்ளது', ur: 'مجھے ایک سرکاری نوٹس ملا ہے' },
  chipThreat: { en: 'A seller is threatening me', hi: 'विक्रेता मुझे धमकी दे रहा है', mr: 'विक्रेता मला धमकी देत आहे', ta: 'விற்பவர் என்னை மிரட்டுகிறார்', ur: 'دکاندار مجھے دھمکی دے رہا ہے' },
  chipOther: { en: 'Something else', hi: 'कुछ और', mr: 'काहीतरी दुसरे', ta: 'வேறு ஏதோ', ur: 'کچھ اور' },
  composerPlaceholder: { en: 'Describe your problem…', hi: 'अपनी समस्या लिखिए…', mr: 'तुमची समस्या लिहा…', ta: 'உங்கள் பிரச்சனையை எழுதுங்கள்…', ur: 'اپنی مشکل لکھیں…' },
  composerSend: { en: 'Send', hi: 'भेजें', mr: 'पाठवा', ta: 'அனுப்பு', ur: 'بھیجیں' },
  composerAttach: { en: 'Attach a document', hi: 'दस्तावेज़ जोड़ें', mr: 'दस्तऐवज जोडा', ta: 'ஆவணம் இணைக்க', ur: 'دستاویز لگائیں' },
  attachTitle: { en: 'Attach (mock tray)', hi: 'जोड़ें (नमूना)', mr: 'जोडा (नमुना)', ta: 'இணைக்க (போலி)', ur: 'لگائیں (نمونہ)' },
  attachHint: {
    en: 'File upload is disabled in this prototype. These prepared documents stand in for real uploads.',
    hi: 'इस प्रोटोटाइप में फ़ाइल अपलोड बंद है। ये तैयार दस्तावेज़ असली अपलोड की जगह लेते हैं।',
    mr: 'या प्रोटोटाइपमध्ये फाइल अपलोड बंद आहे. या तयार दस्तऐवज खऱ्या अपलोडची जागा घेतात.',
    ta: 'இந்த மாதிரியில் கோப்பு பதிவேற்றம் முடக்கப்பட்டுள்ளது. இந்த தயார் ஆவணங்கள் உண்மையான பதிவேற்றத்திற்கு பதிலாக நிற்கின்றன.',
    ur: 'اس پروٹوٹائپ میں فائل اپلوڈ بند ہے۔ یہ تیار دستاویزیں اصل اپلوڈ کی جگہ لیتی ہیں۔',
  },
  attachDocBill: { en: 'bill-homekart.pdf (mock)', hi: 'बिल-homekart.pdf (नमूना)', mr: 'बिल-homekart.pdf (नमुना)', ta: 'பில்-homekart.pdf (போலி)', ur: 'بل-homekart.pdf (نمونہ)' },
  attachDocPhoto: { en: 'photo-when-opened.jpg (mock)', hi: 'फ़ोटो-खोलते-समय.jpg (नमूना)', mr: 'फोटो-उघडताना.jpg (नमुना)', ta: 'புகைப்படம்-திறந்தபோது.jpg (போலி)', ur: 'تصویر-کھولتے-وقت.jpg (نمونہ)' },
  stageReading: { en: 'Reading what you wrote', hi: 'आपका संदेश पढ़ रहा हूँ', mr: 'तुमचा संदेश वाचत आहे', ta: 'நீங்கள் எழுதியதைப் படிக்கிறேன்', ur: 'آپ کا پیغام پڑھ رہا ہوں' },
  stageChecking: { en: 'Checking the rules', hi: 'नियम जाँच रहा हूँ', mr: 'नियम तपासत आहे', ta: 'விதிகளைச் சரிபார்க்கிறேன்', ur: 'قاعدے جانچ رہا ہوں' },
  stageWriting: { en: 'Preparing the answer', hi: 'उत्तर तैयार कर रहा हूँ', mr: 'उत्तर तयार करत आहे', ta: 'பதில் தயார் செய்கிறேன்', ur: 'جواب تیار کر رہا ہوں' },
  confClear: { en: 'Clear', hi: 'स्पष्ट', mr: 'स्पष्ट', ta: 'தெளிவு', ur: 'واضح' },
  confClearDesc: { en: 'Fits a well-established situation.', hi: 'यह एक आम, स्थापित स्थिति है।', mr: 'ही एक सामान्य, स्थापित स्थिती आहे.', ta: 'இது நிலையான, நன்கு அறியப்பட்ட நிலை.', ur: 'یہ ایک عام، مستحکم صورت حال ہے۔' },
  confLikely: { en: 'Likely — please confirm', hi: 'संभव — पुष्टि करें', mr: 'संभव — खात्री करा', ta: 'இருக்கலாம் — உறுதிப்படுத்துங்கள்', ur: 'ممکن — تصدیق کریں' },
  confLikelyDesc: { en: 'Depends on a fact you should check.', hi: 'एक ऐसे तथ्य पर निर्भर है जो आप जाँच लें।', mr: 'एका अशा वस्तुस्थितीवर अवलंबून आहे जी तुम्ही तपासावी.', ta: 'நீங்கள் சரிபார்க்க வேண்டிய ஒரு உண்மையைச் சார்ந்தது.', ur: 'ایک ایسے حقیقت پر منحصر ہے جو آپ جانچ لیں۔' },
  confUnsure: { en: 'Not sure', hi: 'पक्का नहीं', mr: 'नक्की नाही', ta: 'உறுதியில்லை', ur: 'یقین نہیں' },
  confUnsureDesc: { en: 'Please check this with a human helper.', hi: 'किसी मानव सहायक से जाँच लें।', mr: 'एखाद्या मानवी मदतनीसाकडे तपासा.', ta: 'மனித உதவியாளரிடம் சரிபார்க்கவும்.', ur: 'کسی انسانی مددگار سے جانچ لیں۔' },
  badgeVerified: { en: 'Verified against source', hi: 'स्रोत से जाँचा गया', mr: 'स्रोतापासून तपासले', ta: 'மூலத்தில் சரிபார்க்கப்பட்டது', ur: 'ماخذ سے جانچا گیا' },
  badgePrototype: { en: 'Prototype content, not yet verified', hi: 'प्रोटोटाइप सामग्री — अभी जाँचा नहीं गया', mr: 'प्रोटोटाइप साहित्य — अजून तपासले नाही', ta: 'மாதிரி உள்ளடக்கம் — இன்னும் சரிபார்க்கப்படவில்லை', ur: 'پروٹوٹائپ مواد — ابھی جانچا نہیں گیا' },
  reasoningTitle: { en: 'What I checked', hi: 'मैंने क्या जाँचा', mr: 'मी काय तपासले', ta: 'நான் என்ன சரிபார்த்தேன்', ur: 'میں نے کیا جانچا' },
  simulatedTag: { en: 'Simulated in prototype', hi: 'प्रोटोटाइप में अनुकरित', mr: 'प्रोटोटाइपमध्ये नक्कल', ta: 'மாதிரியில் உருவகம்', ur: 'پروٹوٹائپ میں نقل شدہ' },
  findingWhatHappened: { en: 'What happened', hi: 'क्या हुआ', mr: 'काय झाले', ta: 'என்ன நடந்தது', ur: 'کیا ہوا' },
  findingLawSays: { en: 'What the law generally says', hi: 'कानून आम तौर पर क्या कहता है', mr: 'कायदा साधारणपणे काय म्हणतो', ta: 'சட்டம் பொதுவாக என்ன சொல்கிறது', ur: 'قانون عام طور پر کیا کہتا ہے' },
  findingMeans: { en: 'What this means for you', hi: 'आपके लिए इसका मतलब', mr: 'तुमच्यासाठी याचा अर्थ', ta: 'உங்களுக்கு இதன் பொருள்', ur: 'آپ کے لیے اس کا مطلب' },
  ladderTitle: { en: 'Next steps — lowest risk first', hi: 'अगले कदम — पहले कम जोखिम', mr: 'पुढची पावले — आधी कमी धोका', ta: 'அடுத்த படிகள் — முதலில் குறைந்த ஆபத்து', ur: 'اگلے قدم — پہلے کم خطرہ' },
  step1Title: { en: 'Message the seller first', hi: 'पहले विक्रेता को संदेश भेजें', mr: 'आधी विक्रेत्याला संदेश पाठवा', ta: 'முதலில் விற்பவருக்கு செய்தி அனுப்புங்கள்', ur: 'پہلے دکاندار کو پیغام بھیجیں' },
  step2Title: { en: 'Call the national consumer helpline', hi: 'राष्ट्रीय उपभोक्ता हेल्पलाइन पर कॉल करें', mr: 'राष्ट्रीय ग्राहक हेल्पलाइनवर कॉल करा', ta: 'தேசிய நுகர்வோர் உதவி எண்ணை அழையுங்கள்', ur: 'قومی کسٹمر ہیلپ لائن پر کال کریں' },
  step3Title: { en: 'Send a formal demand notice', hi: 'औपचारिक माँग-पत्र भेजें', mr: 'औपचारिक मागणी-पत्र पाठवा', ta: 'முறையான கோரிக்கை அறிவிப்பை அனுப்புங்கள்', ur: 'رسمی مطالبہ نوٹس بھیجیں' },
  copy: { en: 'Copy', hi: 'कॉपी', mr: 'कॉपी', ta: 'நகலெடு', ur: 'کاپی' },
  copied: { en: 'Copied', hi: 'कॉपी हो गया', mr: 'कॉपी झाले', ta: 'நகலெடுக்கப்பட்டது', ur: 'کاپی ہو گیا' },
  edit: { en: 'Edit', hi: 'संपादित करें', mr: 'संपादन करा', ta: 'திருத்து', ur: 'ترمیم' },
  saveChanges: { en: 'Save changes', hi: 'बदलाव सहेजें', mr: 'बदल सेव्ह करा', ta: 'மாற்றங்களைச் சேமி', ur: 'تبدیلیاں محفوظ کریں' },
  regenerate: { en: 'Regenerate', hi: 'दोबारा बनाएँ', mr: 'पुन्हा तयार करा', ta: 'மீண்டும் உருவாக்கு', ur: 'دوبارہ بنائیں' },
  discard: { en: 'Discard', hi: 'हटाएँ', mr: 'काढून टाका', ta: 'நிராகரி', ur: 'ہٹائیں' },
  stale: { en: 'Out of date', hi: 'पुराना हो गया', mr: 'जुने झाले', ta: 'காலாவதியானது', ur: 'پرانا ہو گیا' },
  update: { en: 'Update', hi: 'अपडेट करें', mr: 'अपडेट करा', ta: 'புதுப்பி', ur: 'اپڈیٹ کریں' },
  errorTitle: { en: 'I could not finish that', hi: 'यह पूरा नहीं हो सका', mr: 'हे पूर्ण झाले नाही', ta: 'இதை முடிக்க முடியவில்லை', ur: 'یہ مکمل نہ ہو سکا' },
  errorBody: { en: 'Something failed while preparing the answer. Nothing was sent anywhere — try again.', hi: 'उत्तर तैयार करते समय कुछ गड़बड़ हुई। कुछ भी कहीं नहीं भेजा गया — फिर कोशिश करें।', mr: 'उत्तर तयार करताना काही चुकले. काहीही कोठेतरी पाठवले नाही — पुन्हा प्रयत्न करा.', ta: 'பதிலைத் தயாரிக்கும்போது ஏதோ தவறு ஏற்பட்டது. எதுவும் எங்கும் அனுப்பப்படவில்லை — மீண்டும் முயற்சிக்கவும்.', ur: 'جواب تیار کرتے وقت کچھ غلط ہوئی۔ کچھ بھی کہیں نہیں بھیجا گیا — دوبارہ کوشش کریں۔' },
  retry: { en: 'Retry', hi: 'फिर कोशिश करें', mr: 'पुन्हा प्रयत्न करा', ta: 'மீண்டும் முயற்சி', ur: 'دوبارہ کوشش' },
  offlineBanner: { en: 'You are offline. This prototype needs no connection; a real build would queue your messages.', hi: 'आप ऑफ़लाइन हैं। इस प्रोटोटाइप को कनेक्शन नहीं चाहिए; असली ऐप आपके संदेश कतार में रखता।', mr: 'तुम्ही ऑफलाइन आहात. या प्रोटोटाइपला कनेक्शन लागत नाही; खरी अॅप तुमचे संदेश रांगेत ठेवते.', ta: 'நீங்கள் ஆஃப்லைனில் இருக்கிறீர்கள். இந்த மாதிரிக்கு இணைப்பு தேவையில்லை; உண்மையான செயலி உங்கள் செய்திகளை வரிசையில் வைக்கும்.', ur: 'آپ آف لائن ہیں۔ اس پروٹوٹائپ کو کنکشن نہیں چاہیے؛ اصل ایپ آپ کے پیغامات قطار میں رکھتی۔' },
  newChat: { en: 'New conversation', hi: 'नई बातचीत', mr: 'नवी संभाषण', ta: 'புதிய உரையாடல்', ur: 'نئی گفتگو' },
  stopHeadline: { en: 'I am going to stop here', hi: 'मैं यहीं रुक रहा हूँ', mr: 'मी इथे थांबत आहे', ta: 'நான் இங்கே நிற்கிறேன்', ur: 'میں یہیں رک رہا ہوں' },
  stopWhy: {
    en: 'This kind of matter can seriously affect your position if handled by an automated tool. A person should look at it — not because you did anything wrong, but because the stakes are high.',
    hi: 'इस तरह के मामले में गलती आपकी स्थिति गंभीर रूप से प्रभावित कर सकती है। इसे कोई व्यक्ति देखे — आपने कुछ गलत नहीं किया है, बस जोखिम ऊँचा है।',
    mr: 'या प्रकारच्या बाबीत चुक तुमची स्थिती गंभीरपणे बाधित करू शकते. ही एखाद्या व्यक्तीने पाहावी — तुम्ही काही चुकीचे केले नाही, फक्त जोखीम मोठी आहे.',
    ta: 'இந்த வகை விஷயங்களில் தவறு உங்கள் நிலையை கடுமையாக பாதிக்கும். ஒரு மனிதர் இதைப் பார்க்க வேண்டும் — நீங்கள் தவறு செய்யவில்லை, ஆபத்து பெரியது.',
    ur: 'اس قسم کے معاملے میں غلطی آپ کی پوزیشن پر سخت اثر ڈال سکتی ہے۔ اسے کوئی انسان دیکھے — آپ نے کوئی غلطی نہیں کی، بس خطرہ بہت بڑا ہے۔',
  },
  dlsaTitle: { en: 'Contact your District Legal Services Authority', hi: 'अपने ज़िला विधिक सेवा प्राधिकरण से संपर्क करें', mr: 'तुमच्या जिल्हा विधी सेवा प्राधिकरणाशी संपर्क करा', ta: 'உங்கள் மாவட்ட சட்ட சேவை ஆணையத்தை தொடர்பு கொள்ளுங்கள்', ur: 'اپنے ضلع قانونی خدمات ادارے سے رابطہ کریں' },
  dlsaState: { en: 'State', hi: 'राज्य', mr: 'राज्य', ta: 'மாநிலம்', ur: 'ریاست' },
  dlsaDistrict: { en: 'District', hi: 'ज़िला', mr: 'जिल्हा', ta: 'மாவட்டம்', ur: 'ضلع' },
  dlsaFind: { en: 'Find help', hi: 'मदद खोजें', mr: 'मदत शोधा', ta: 'உதவியைத் தேடு', ur: 'مدد تلاش کریں' },
  dlsaUnavailable: { en: 'DLSA info unavailable', hi: 'DLSA की जानकारी उपलब्ध नहीं', mr: 'DLSA माहिती उपलब्ध नाही', ta: 'DLSA தகவல் கிடைக்கவில்லை', ur: 'DLSA کی معلومات دستیاب نہیں' },
  dlsaPlaceholderNote: { en: 'Prototype placeholder — real contact details to be verified before use.', hi: 'प्रोटोटाइप प्लेसहोल्डर — असली संपर्क विवरण उपयोग से पहले जाँचे जाएँगे।', mr: 'प्रोटोटाइप प्लेसहोल्डर — खरी संपर्क माहिती वापरण्यापूर्वी तपासली जाईल.', ta: 'மாதிரி நிரப்புக்குறி — உண்மையான தொடர்பு விவரங்கள் பயன்படுத்தும் முன் சரிபார்க்கப்படும்.', ur: 'پروٹوٹائپ جگہ بھرنے والا — اصل رابطہ کی تفصیلات استعمال سے پہلے جانچی جائیں گی۔' },
  tellMore: { en: 'Tell me more — this may be a consumer matter', hi: 'और बताइए — शायद यह उपभोक्ता मामला हो', mr: 'आणखी सांगा — कदाचित हा ग्राहक बाब असेल', ta: 'இன்னும் சொல்லுங்கள் — இது நுகர்வோர் விஷயமாக இருக்கலாம்', ur: 'اور بتائیں — شاید یہ کسٹمر معاملہ ہو' },
  treatmentLabel: { en: 'View', hi: 'दृश्य', mr: 'दृश्य', ta: 'காட்சி', ur: 'منظر' },
  treatmentInverted: { en: 'Inverted', hi: 'उल्टा', mr: 'विरुद्ध', ta: 'தலைகீழ்', ur: 'الٹ' },
  treatmentLight: { en: 'Light', hi: 'हल्का', mr: 'हलके', ta: 'ஒளி', ur: 'روشنی' },
  classifyPending: { en: 'Classifying your matter', hi: 'आपका मामला परख रहा हूँ', mr: 'तुमची बाब तपासत आहे', ta: 'உங்கள் விஷயத்தை வகைப்படுத்துகிறேன்', ur: 'آپ کا معاملہ پرکھ رہا ہوں' },
  tierHardStop: { en: 'Outside safe scope', hi: 'सुरक्षित दायरे से बाहर', mr: 'सुरक्षित व्याप्तीबाहेर', ta: 'பாதுகாப்பு வரம்பிற்கு வெளியே', ur: 'محفوظ دائرے سے باہر' },
  tierCaution: { en: 'Needs care', hi: 'सावधानी चाहिए', mr: 'सावधानता लागते', ta: 'கவனம் தேவை', ur: 'احتیاط چاہیے' },
  tierProceed: { en: 'Consumer matter', hi: 'उपभोक्ता मामला', mr: 'ग्राहक बाब', ta: 'நுகர்வோர் விஷயம்', ur: 'کسٹمر معاملہ' },
  langLabel: { en: 'Language', hi: 'भाषा', mr: 'भाषा', ta: 'மொழி', ur: 'زبان' },
  themeLabel: { en: 'Theme', hi: 'थीम', mr: 'थीम', ta: 'தீம்', ur: 'تھیم' },
  back: { en: 'Back', hi: 'वापस', mr: 'मागे', ta: 'பின்செல்', ur: 'واپس' },
  openNotice: { en: 'Open demand notice', hi: 'माँग-पत्र खोलें', mr: 'मागणी-पत्र उघडा', ta: 'கோரிக்கை அறிவிப்பைத் திற', ur: 'مطالبہ نوٹس کھولیں' },
  noticeReviewTitle: { en: 'Review every detail', hi: 'हर विवरण जाँचें', mr: 'प्रत्येक तपशील तपासा', ta: 'ஒவ்வொரு விவரத்தையும் சரிபார்', ur: 'ہر تفصیل جانچیں' },
  noticeConsent: { en: 'I have read and checked every detail', hi: 'मैंने हर विवरण पढ़ और जाँच लिया है', mr: 'मी प्रत्येक तपशील वाचून तपासला आहे', ta: 'ஒவ்வொரு விவரத்தையும் படித்து சரிபார்த்தேன்', ur: 'میں نے ہر تفصیل پڑھ اور جانچ لی ہے' },
  noticePrepare: { en: 'Prepare final notice', hi: 'अंतिम पत्र तैयार करें', mr: 'अंतिम पत्र तयार करा', ta: 'இறுதி அறிவிப்பைத் தயார் செய்', ur: 'حتمی نوٹس تیار کریں' },
  noticeFinalTitle: { en: 'Your demand notice', hi: 'आपका माँग-पत्र', mr: 'तुमचे मागणी-पत्र', ta: 'உங்கள் கோரிக்கை அறிவிப்பு', ur: 'آپ کا مطالبہ نوٹس' },
  noticeCopyAll: { en: 'Copy notice', hi: 'पत्र कॉपी करें', mr: 'पत्र कॉपी करा', ta: 'அறிவிப்பை நகலெடு', ur: 'نوٹس کاپی کریں' },
  cautionTitle: { en: 'Time limits may apply', hi: 'समय-सीमा लागू हो सकती है', mr: 'वेळेची मर्यादा लागू असू शकते', ta: 'காலக்கெடு பொருந்தலாம்', ur: 'وقت کی حد لاگو ہو سکتی ہے' },
  restatePrefix: { en: 'So far I understand:', hi: 'अब तक मैं समझा हूँ:', mr: 'आतापर्यंत मला समजले:', ta: 'இதுவரை நான் புரிந்துகொண்டது:', ur: 'اب تک میں سمجھا:' },
  qWhen: { en: 'When did you buy it?', hi: 'आपने यह कब खरीदा?', mr: 'तुम्ही हे केव्हा विकत घेतले?', ta: 'இதை எப்போது வாங்கினீர்கள்?', ur: 'آپ نے یہ کب خریدا؟' },
  ans30: { en: 'Within 30 days', hi: 'पिछले 30 दिनों में', mr: 'लग्नच्या 30 दिवसांत', ta: 'கடந்த 30 நாட்களில்', ur: 'پچھلے 30 دنوں میں' },
  ans1to2: { en: '1 to 2 years ago', hi: '1–2 साल पहले', mr: '1–2 वर्षांपूर्वी', ta: '1–2 ஆண்டுகளுக்கு முன்', ur: '1–2 سال پہلے' },
  ans2plus: { en: 'More than 2 years ago', hi: '2 साल से पहले', mr: '2 वर्षांहून अधिक पूर्वी', ta: '2 ஆண்டுகளுக்கு முன்', ur: '2 سال سے پہلے' },
  ansNotSure: { en: 'Not sure', hi: 'याद नहीं', mr: 'आठवत नाही', ta: 'நினைவில்லை', ur: 'یاد نہیں' },
}

export type UiKey = keyof UiStrings

export function t(lang: LangCode, key: UiKey): string {
  return UI[key][lang]
}
