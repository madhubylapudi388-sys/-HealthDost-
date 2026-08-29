import { LanguageOption, LanguageCode } from '../types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    nativeName: 'English',
    englishName: 'English',
    flagOrSymbol: 'EN',
    speechCode: 'en-IN',
  },
  {
    code: 'hi',
    nativeName: 'हिन्दी',
    englishName: 'Hindi',
    flagOrSymbol: 'अ',
    speechCode: 'hi-IN',
  },
  {
    code: 'te',
    nativeName: 'తెలుగు',
    englishName: 'Telugu',
    flagOrSymbol: 'తె',
    speechCode: 'te-IN',
  },
  {
    code: 'ta',
    nativeName: 'தமிழ்',
    englishName: 'Tamil',
    flagOrSymbol: 'த',
    speechCode: 'ta-IN',
  },
  {
    code: 'bn',
    nativeName: 'বাংলা',
    englishName: 'Bengali',
    flagOrSymbol: 'বা',
    speechCode: 'bn-IN',
  },
  {
    code: 'mr',
    nativeName: 'मराठी',
    englishName: 'Marathi',
    flagOrSymbol: 'म',
    speechCode: 'mr-IN',
  },
  {
    code: 'kn',
    nativeName: 'ಕನ್ನಡ',
    englishName: 'Kannada',
    flagOrSymbol: 'ಕ',
    speechCode: 'kn-IN',
  },
];

export interface TranslationStrings {
  appName: string;
  tagline: string;
  startCheck: string;
  trySample: string;
  guestFlowNotice: string;
  selectLanguage: string;
  stepOf: string;
  next: string;
  previous: string;
  skipStep: string;
  dontKnow: string;
  howToCheck: string;
  seeResults: string;
  disclaimerShort: string;
  disclaimerFull: string;
  voiceHelp: string;
  voicePlaying: string;
  voiceStop: string;
  riskLevels: {
    low: string;
    moderate: string;
    high: string;
  };
  resultHeader: string;
  whyThisResult: string;
  topFactors: string;
  protectiveFactorsTitle: string;
  actionPlanTitle: string;
  actionPlanSubtitle: string;
  remindMe: string;
  remindActive: string;
  saveReport: string;
  shareWithDoctor: string;
  detailedView: string;
  detailedViewHide: string;
  emergencyAlert: string;
  emergencyTitle: string;
  emergencyDesc: string;
  emergencyCallNow: string;
  communityStat: string;
  questions: {
    emergency: {
      title: string;
      subtitle: string;
      noSevere: string;
      yesChestPain: string;
      yesBreathing: string;
    };
    age: {
      title: string;
      subtitle: string;
      under30: string;
      age30to45: string;
      age46to60: string;
      above60: string;
    };
    gender: {
      title: string;
      subtitle: string;
      male: string;
      female: string;
      other: string;
    };
    activity: {
      title: string;
      subtitle: string;
      active: string;
      activeDesc: string;
      moderate: string;
      moderateDesc: string;
      low: string;
      lowDesc: string;
    };
    lifestyle: {
      title: string;
      subtitle: string;
      smokingTitle: string;
      alcoholTitle: string;
      dietTitle: string;
      never: string;
      sometimes: string;
      regular: string;
      dietBalanced: string;
      dietOilySweet: string;
      dietHighSalt: string;
    };
    familyHistory: {
      title: string;
      subtitle: string;
      diabetes: string;
      heart: string;
      bp: string;
      none: string;
    };
    biomarkers: {
      title: string;
      subtitle: string;
      height: string;
      weight: string;
      calcBmi: string;
      bpTitle: string;
      sugarTitle: string;
      normal: string;
      high: string;
      unsure: string;
      bmiNormal: string;
      bmiOverweight: string;
      bmiObese: string;
    };
  };
  actions: {
    walk: { title: string; benefit: string };
    salt: { title: string; benefit: string };
    water: { title: string; benefit: string };
    greens: { title: string; benefit: string };
    checkup: { title: string; benefit: string };
  };
}

export const TRANSLATIONS: Record<LanguageCode, TranslationStrings> = {
  en: {
    appName: 'HealthDost',
    tagline: 'Your friendly health awareness companion',
    startCheck: 'Start Free Health Check',
    trySample: '⚡ Try a Sample Check (Judge Demo)',
    guestFlowNotice: 'No login or password needed. 100% private on your phone.',
    selectLanguage: 'Choose Your Language / भाषा चुनें',
    stepOf: 'Step',
    next: 'Next Question',
    previous: 'Go Back',
    skipStep: "I don't know (Skip)",
    dontKnow: "I don't know this",
    howToCheck: 'How to check?',
    seeResults: 'Check My Health Score',
    disclaimerShort: 'This is not a medical diagnosis. Please see a doctor for a real check-up.',
    disclaimerFull: 'HealthDost is an awareness and early prevention guide. It does not replace a doctor or medical tests.',
    voiceHelp: 'Listen Aloud',
    voicePlaying: 'Reading Screen...',
    voiceStop: 'Stop Voice',
    riskLevels: {
      low: 'Low Risk',
      moderate: 'Moderate Risk',
      high: 'Higher Risk (Needs Attention)',
    },
    resultHeader: 'Your Health Awareness Score',
    whyThisResult: 'Why this result?',
    topFactors: 'Things needing attention',
    protectiveFactorsTitle: 'Good habits protecting you',
    actionPlanTitle: 'Your Simple 3-Step Action Plan',
    actionPlanSubtitle: 'Small everyday habits that make a big difference for your heart and health.',
    remindMe: 'Daily Reminder',
    remindActive: 'Reminder On 🔔',
    saveReport: 'Save Health Card (PDF/Image)',
    shareWithDoctor: 'Share with Family / Doctor',
    detailedView: 'Show Detailed Technical Report',
    detailedViewHide: 'Hide Detailed Report',
    emergencyAlert: '🚨 EMERGENCY ALERT',
    emergencyTitle: 'Please Seek Medical Help Immediately',
    emergencyDesc: 'Chest pain or severe shortness of breath can be a medical emergency. Do not wait for a test score.',
    emergencyCallNow: 'Call 108 / 112 (Ambulance)',
    communityStat: '8 out of 10 people who did this check took one small action to protect their health.',
    questions: {
      emergency: {
        title: 'Do you feel any severe symptoms right now?',
        subtitle: 'Please tell us how you are feeling at this moment.',
        noSevere: 'No, I feel fine right now',
        yesChestPain: 'Yes, severe chest pain or pressure',
        yesBreathing: 'Yes, sudden shortness of breath or dizziness',
      },
      age: {
        title: 'What is your age group?',
        subtitle: 'Tap the card that matches your age.',
        under30: 'Below 30 years (Young)',
        age30to45: '30 to 45 years',
        age46to60: '46 to 60 years',
        above60: '60+ years (Senior)',
      },
      gender: {
        title: 'What is your biological sex / gender?',
        subtitle: 'Helps us tailor heart and metabolic risk guides.',
        male: 'Male',
        female: 'Female',
        other: 'Other / Prefer not to say',
      },
      activity: {
        title: 'How much do you walk or move every day?',
        subtitle: 'Includes farming, walking, housework, or work.',
        active: 'Very Active (Daily 30+ min)',
        activeDesc: 'Brisk walking, farm work, manual work, cycling',
        moderate: 'Moderate (Few days a week)',
        moderateDesc: 'Light walking, casual movement, some household tasks',
        low: 'Mostly Sitting (Low movement)',
        lowDesc: 'Desk work, driving, resting most of the day',
      },
      lifestyle: {
        title: 'Everyday habits & food',
        subtitle: 'Select the options that best match your daily routine.',
        smokingTitle: 'Do you smoke bidi, cigarettes, or chew gutka?',
        alcoholTitle: 'Do you drink alcohol?',
        dietTitle: 'What type of food do you eat most days?',
        never: 'Never / No',
        sometimes: 'Sometimes / Occasionally',
        regular: 'Daily / Regularly',
        dietBalanced: 'Simple home-cooked (Roti, Dal, Sabzi, Rice)',
        dietOilySweet: 'Frequent fried snacks, sweets, or oily curries',
        dietHighSalt: 'High salt, pickles, papad, or packaged snacks',
      },
      familyHistory: {
        title: 'Has anyone in your close family had these?',
        subtitle: 'Parents, grandparents, brothers, or sisters.',
        diabetes: 'Diabetes (High sugar in blood)',
        heart: 'Heart attack or heart disease',
        bp: 'High Blood Pressure (BP)',
        none: 'None / Not sure',
      },
      biomarkers: {
        title: 'Optional: Body & Test Numbers',
        subtitle: 'You can easily skip any number you do not know.',
        height: 'Your Height',
        weight: 'Your Weight',
        calcBmi: 'Body Weight Meter (BMI)',
        bpTitle: 'Do you know your Blood Pressure (BP)?',
        sugarTitle: 'Do you know your Blood Sugar level?',
        normal: 'Normal / Under Control',
        high: 'High / On medication',
        unsure: "I don't know / Never checked",
        bmiNormal: 'Healthy weight for height',
        bmiOverweight: 'Slightly above recommended weight',
        bmiObese: 'High body weight',
      },
    },
    actions: {
      walk: {
        title: 'Walk 20 minutes daily after meals',
        benefit: 'Helps your body absorb blood sugar naturally and keeps heart vessels flexible.',
      },
      salt: {
        title: 'Reduce extra salt, pickles, and salty snacks',
        benefit: 'Lowers pressure on your heart and protects your kidneys.',
      },
      water: {
        title: 'Drink 6-8 glasses of water instead of sweet drinks',
        benefit: 'Reduces hidden sugar intake and boosts daily energy.',
      },
      greens: {
        title: 'Add green leafy vegetables & lentils to your plate',
        benefit: 'Provides natural fiber that slows down sugar spikes.',
      },
      checkup: {
        title: 'Get BP & Sugar checked at nearest clinic / PHC',
        benefit: 'A 5-minute quick test can spot risks years before problems start.',
      },
    },
  },
  hi: {
    appName: 'हेल्थ दोस्त (HealthDost)',
    tagline: 'आपका अपना स्वास्थ्य साथी',
    startCheck: 'मुफ़्त स्वास्थ्य जांच शुरू करें',
    trySample: '⚡ नमूना प्रोफ़ाइल देखें (डेमो)',
    guestFlowNotice: 'कोई पासवर्ड या लॉगिन नहीं। आपकी जानकारी आपके फोन पर सुरक्षित है।',
    selectLanguage: 'अपनी भाषा चुनें / Choose Language',
    stepOf: 'कदम',
    next: 'आगे बढ़ें',
    previous: 'पीछे जाएं',
    skipStep: 'मुझे नहीं पता (छोड़ें)',
    dontKnow: 'मुझे यह नहीं पता',
    howToCheck: 'कैसे जांचें?',
    seeResults: 'मेरा स्वास्थ्य स्कोर देखें',
    disclaimerShort: 'यह डॉक्टरी जांच नहीं है। कृपया असली जांच के लिए डॉक्टर से मिलें।',
    disclaimerFull: 'हेल्थ दोस्त केवल जागरूकता और बचाव के लिए है। यह डॉक्टर या लैब टेस्ट की जगह नहीं लेता।',
    voiceHelp: 'बोलकर सुनो',
    voicePlaying: 'पढ़ा जा रहा है...',
    voiceStop: 'आवाज रोकें',
    riskLevels: {
      low: 'कम जोखिम (सुरक्षित)',
      moderate: 'मध्यम जोखिम (सावधानी जरूरी)',
      high: 'अधिक जोखिम (ध्यान देने की जरूरत)',
    },
    resultHeader: 'आपका स्वास्थ्य जागरूकता स्कोर',
    whyThisResult: 'यह नतीजा क्यों आया?',
    topFactors: 'जिन बातों पर ध्यान देना है',
    protectiveFactorsTitle: 'आपकी अच्छी आदतें जो आपको बचा रही हैं',
    actionPlanTitle: 'आपके लिए 3 आसान उपाय',
    actionPlanSubtitle: 'रोजमर्रा की छोटी आदतें जो आपके दिल और शरीर को स्वस्थ रखती हैं।',
    remindMe: 'दैनिक याद दिलाएं',
    remindActive: 'रिमाइंडर चालू 🔔',
    saveReport: 'स्वास्थ्य कार्ड सहेजें (PDF/फोटो)',
    shareWithDoctor: 'परिवार या डॉक्टर को भेजें',
    detailedView: 'पूरी तकनीकी रिपोर्ट देखें',
    detailedViewHide: 'विस्तृत रिपोर्ट छिपाएं',
    emergencyAlert: '🚨 आपातकालीन सूचना (Emergency)',
    emergencyTitle: 'कृपया तुरंत डॉक्टर या अस्पताल जाएं',
    emergencyDesc: 'छाती में तेज दर्द या सांस लेने में भारी तकलीफ आपातकालीन हो सकती है। ऑनलाइन स्कोर का इंतजार न करें।',
    emergencyCallNow: 'एम्बुलेंस 108 / 112 पर कॉल करें',
    communityStat: 'जांच करने वाले 10 में से 8 लोगों ने अपनी सेहत के लिए एक अच्छी आदत अपनाई।',
    questions: {
      emergency: {
        title: 'क्या आपको अभी कोई गंभीर परेशानी महसूस हो रही है?',
        subtitle: 'कृपया बताएं कि आप इस समय कैसा महसूस कर रहे हैं।',
        noSevere: 'नहीं, मैं अभी ठीक महसूस कर रहा हूँ',
        yesChestPain: 'हाँ, छाती में तेज दर्द या भारीपन है',
        yesBreathing: 'हाँ, अचानक सांस फूलना या चक्कर आना',
      },
      age: {
        title: 'आपकी उम्र कितनी है?',
        subtitle: 'अपनी उम्र वाले विकल्प पर छुएं।',
        under30: '30 साल से कम (युवा)',
        age30to45: '30 से 45 साल',
        age46to60: '46 से 60 साल',
        above60: '60+ साल (वरिष्ठ)',
      },
      gender: {
        title: 'आपका लिंग क्या है?',
        subtitle: 'हृदय और स्वास्थ्य अनुमान में मदद करता है।',
        male: 'पुरुष (Male)',
        female: 'महिला (Female)',
        other: 'अन्य (Other)',
      },
      activity: {
        title: 'आप दिनभर में कितना चलते या मेहनत करते हैं?',
        subtitle: 'इसमें खेती, चलना, घर का काम या मजदूरी शामिल है।',
        active: 'बहुत सक्रिय (रोज 30+ मिनट तेज चलना या काम)',
        activeDesc: 'खेत का काम, तेज चलना, साइकिल चलाना',
        moderate: 'मध्यम (हफ्ते में कुछ दिन)',
        moderateDesc: 'सामान्य चलना-फिरना, घर के हल्के काम',
        low: 'ज्यादातर बैठना (कम चलना)',
        lowDesc: 'दुकान/कुर्सी पर बैठना, बहुत कम शारीरिक मेहनत',
      },
      lifestyle: {
        title: 'रोजमर्रा की आदतें और खान-पान',
        subtitle: 'अपनी दिनचर्या के अनुसार सही विकल्प चुनें।',
        smokingTitle: 'क्या आप बीड़ी, सिगरेट या गुटखा लेते हैं?',
        alcoholTitle: 'क्या आप शराब या मदिरा लेते हैं?',
        dietTitle: 'आप ज्यादातर किस तरह का खाना खाते हैं?',
        never: 'कभी नहीं / ना',
        sometimes: 'कभी-कभार',
        regular: 'रोजाना / नियमित',
        dietBalanced: 'सादा घर का खाना (दाल, रोटी, सब्जी, चावल)',
        dietOilySweet: 'ज्यादा तली-भुनी चीजें, मिठाई, तेल-मसाला',
        dietHighSalt: 'ज्यादा नमक, अचार, पापड़ या नमकीन',
      },
      familyHistory: {
        title: 'क्या आपके परिवार में किसी को ये बीमारियां रही हैं?',
        subtitle: 'माता-पिता, दादा-दादी या भाई-बहन।',
        diabetes: 'शुगर / मधुमेह (Diabetes)',
        heart: 'दिल की बीमारी या हार्ट अटैक',
        bp: 'हाई ब्लड प्रेशर (उच्च रक्तचाप)',
        none: 'किसी को नहीं / पता नहीं',
      },
      biomarkers: {
        title: 'वैकल्पिक: शरीर और जांच के आंकड़े',
        subtitle: 'अगर आपको नहीं पता तो आप आसानी से छोड़ सकते हैं।',
        height: 'आपकी लंबाई (Height)',
        weight: 'आपका वजन (Weight)',
        calcBmi: 'शरीर का वजन पैमाना (BMI)',
        bpTitle: 'क्या आपको अपना ब्लड प्रेशर (BP) पता है?',
        sugarTitle: 'क्या आपको अपना ब्लड शुगर पता है?',
        normal: 'सामान्य (Normal)',
        high: 'अधिक (High) / दवा ले रहे हैं',
        unsure: 'मुझे नहीं पता / कभी नहीं जांचा',
        bmiNormal: 'लंबाई के हिसाब से सही वजन',
        bmiOverweight: 'सामान्य से थोड़ा अधिक वजन',
        bmiObese: 'ज्यादा वजन',
      },
    },
    actions: {
      walk: {
        title: 'खाने के बाद रोज 20 मिनट टहलें',
        benefit: 'यह खून में शुगर को सामान्य रखने और दिल को मजबूत रखने में मदद करता है।',
      },
      salt: {
        title: 'अचार, पापड़ और ऊपर से नमक कम करें',
        benefit: 'यह ब्लड प्रेशर को नियंत्रित रखता है और नसों को आराम देता है।',
      },
      water: {
        title: 'मीठी चाय या कोल्ड ड्रिंक की जगह साफ पानी पिएं',
        benefit: 'यह शरीर में फालतू मीठा जाने से रोकता है।',
      },
      greens: {
        title: 'भोजन में हरी पत्तेदार सब्जियां और दालें बढ़ाएं',
        benefit: 'यह पेट को साफ रखता है और शरीर को ताकत देता है।',
      },
      checkup: {
        title: 'पास के स्वास्थ्य केंद्र (PHC) में BP और शुगर जांच कराएं',
        benefit: '5 मिनट की जांच से भविष्य की बड़ी परेशानी से बचा जा सकता है।',
      },
    },
  },
  te: {
    appName: 'హెల్త్ దోస్త్ (HealthDost)',
    tagline: 'మీ నమ్మకమైన ఆరోగ్య స్నేహితుడు',
    startCheck: 'ఉచిత ఆరోగ్య పరీక్ష ప్రారంభించండి',
    trySample: '⚡ డెమో ప్రొఫైల్ చూడండి',
    guestFlowNotice: 'లాగిన్ అవసరం లేదు. మీ వివరాలు మీ ఫోన్‌లోనే సురక్షితం.',
    selectLanguage: 'మీ భాషను ఎంచుకోండి',
    stepOf: 'దశ',
    next: 'ముందుకు వెళ్ళండి',
    previous: 'వెనుకకు',
    skipStep: 'నాకు తెలియదు (దాటవేయండి)',
    dontKnow: 'నాకు ఇది తెలియదు',
    howToCheck: 'ఎలా పరీక్షించాలి?',
    seeResults: 'నా ఆరోగ్య స్కోర్ చూడండి',
    disclaimerShort: 'ఇది వైద్య నిర్ధారణ కాదు. అసలైన పరీక్ష కోసం దయచేసి వైద్యుడిని సంప్రదించండి.',
    disclaimerFull: 'హెల్త్ దోస్త్ అవగాహన మరియు ముందస్తు జాగ్రత్తల కొరకు మాత్రమే. ఇది డాక్టర్ పరీక్షకు ప్రత్యామ్నాయం కాదు.',
    voiceHelp: 'వినండి (వాయిస్)',
    voicePlaying: 'చదువుతోంది...',
    voiceStop: 'వాయిస్ ఆపండి',
    riskLevels: {
      low: 'తక్కువ ప్రమాదం (సురక్షితం)',
      moderate: 'మధ్యస్థ ప్రమాదం (జాగ్రత్త అవసరం)',
      high: 'ఎక్కువ ప్రమాదం (శ్రద్ధ అవసరం)',
    },
    resultHeader: 'మీ ఆరోగ్య అవగాహన ఫలితం',
    whyThisResult: 'ఈ ఫలితం ఎందుకు వచ్చింది?',
    topFactors: 'శ్రద్ధ పెట్టాల్సిన విషయాలు',
    protectiveFactorsTitle: 'మిమ్మల్ని కాపాడుతున్న మంచి అలవాట్లు',
    actionPlanTitle: 'మీ కోసం 3 సులభమైన అలవాట్లు',
    actionPlanSubtitle: 'మీ గుండె మరియు శరీరాన్ని ఆరోగ్యంగా ఉంచే చిన్న రోజువారీ మార్పులు.',
    remindMe: 'రోజువారీ రిమైండర్',
    remindActive: 'రిమైండర్ ఆన్ 🔔',
    saveReport: 'హెల్త్ కార్డు సేవ్ చేయండి (PDF/ఫోటో)',
    shareWithDoctor: 'కుటుంబం లేదా డాక్టర్‌తో పంచుకోండి',
    detailedView: 'పూర్తి నివేదిక చూడండి',
    detailedViewHide: 'పూర్తి నివేదిక దాచండి',
    emergencyAlert: '🚨 అత్యవసర హెచ్చరిక (Emergency)',
    emergencyTitle: 'దయచేసి వెంటనే వైద్య సహాయం పొందండి',
    emergencyDesc: 'ఛాతీ నొప్పి లేదా తీవ్రమైన శ్వాస సమస్య ఉన్నప్పుడు వెంటనే ఆసుపత్రికి వెళ్ళాలి. ఆన్‌లైన్ స్కోర్ కోసం వేచి ఉండకండి.',
    emergencyCallNow: 'అంబులెన్స్ 108 / 112 కి కాల్ చేయండి',
    communityStat: 'ఈ పరీక్ష చేసిన 10 మందిలో 8 మంది మంచి ఆరోగ్యకరమైన అలవాటును ప్రారంభించారు.',
    questions: {
      emergency: {
        title: 'మీకు ప్రస్తుతం ఏదైనా తీవ్రమైన సమస్య ఉందా?',
        subtitle: 'ఈ క్షణంలో మీరు ఎలా ఉన్నారో చెప్పండి.',
        noSevere: 'లేదు, ప్రస్తుతం నేను బాగానే ఉన్నాను',
        yesChestPain: 'అవును, ఛాతీలో తీవ్రమైన నొప్పి లేదా బరువుగా ఉంది',
        yesBreathing: 'అవును, ఆకస్మిక శ్వాస తీసుకోవడంలో ఇబ్బంది లేదా కళ్ళు తిరగడం',
      },
      age: {
        title: 'మీ వయస్సు ఎంత?',
        subtitle: 'మీ వయస్సుకు సరిపోయే కార్డును నొక్కండి.',
        under30: '30 సంవత్సరాల కంటే తక్కువ (యువకులు)',
        age30to45: '30 నుండి 45 సంవత్సరాలు',
        age46to60: '46 నుండి 60 సంవత్సరాలు',
        above60: '60+ సంవత్సరాలు (పెద్దలు)',
      },
      gender: {
        title: 'మీ లింగం ఏమిటి?',
        subtitle: 'గుండె మరియు ఆరోగ్య అంచనా కోసం.',
        male: 'పురుషుడు (Male)',
        female: 'స్త్రీ (Female)',
        other: 'ఇతర (Other)',
      },
      activity: {
        title: 'మీరు రోజూ ఎంత నడుస్తారు లేదా కష్టపడతారు?',
        subtitle: 'వ్యవసాయం, నడక, ఇంటి పనులు లేదా శ్రమ.',
        active: 'చాలా చురుకుగా (రోజూ 30+ నిమిషాల పని లేదా నడక)',
        activeDesc: 'పొలం పనులు, వేగంగా నడవడం, సైక్లింగ్',
        moderate: 'మధ్యస్థం (వారంలో కొన్ని రోజులు)',
        moderateDesc: 'సాధారణ నడక, చిన్న పనులు',
        low: 'ఎక్కువగా కూర్చోవడం (తక్కువ శ్రమ)',
        lowDesc: 'కుర్చీలో కూర్చోవడం, చాలా తక్కువ కదలిక',
      },
      lifestyle: {
        title: 'రోజువారీ అలవాట్లు & ఆహారం',
        subtitle: 'మీ రోజువారీ దినచర్యకు సరిపోయేదాన్ని ఎంచుకోండి.',
        smokingTitle: 'మీరు బీడీ, సిగరెట్ లేదా గుట్కా తాగుతారా?',
        alcoholTitle: 'మీరు మద్యం తీసుకుంటారా?',
        dietTitle: 'మీరు ఎక్కువగా ఎలాంటి ఆహారం తింటారు?',
        never: 'ఎప్పుడూ లేదు / కాదు',
        sometimes: 'అప్పుడప్పుడు',
        regular: 'రోజూ / క్రమంగా',
        dietBalanced: 'ఇంటి సాధారణ భోజనం (పప్పు, అన్నం, కూర, రొట్టె)',
        dietOilySweet: 'ఎక్కువ నూనె, వేపుళ్ళు, మిఠాయిలు',
        dietHighSalt: 'ఎక్కువ ఉప్పు, పచ్చళ్ళు, అప్పడాలు',
      },
      familyHistory: {
        title: 'మీ కుటుంబంలో ఎవరికైనా ఈ సమస్యలు ఉన్నాయా?',
        subtitle: 'తల్లిదండ్రులు, తాతయ్య, నాయనమ్మ లేదా తోబుట్టువులు.',
        diabetes: 'షుగర్ వ్యాధి (Diabetes)',
        heart: 'గుండె జబ్బు లేదా గుండెపోటు',
        bp: 'హై బ్లడ్ ప్రెషర్ (High BP)',
        none: 'ఎవరికీ లేవు / తెలియదు',
      },
      biomarkers: {
        title: 'ఐచ్ఛికం: ఎత్తు, బరువు మరియు పరీక్షలు',
        subtitle: 'తెలియకపోతే మీరు సులభంగా దాటవేయవచ్చు.',
        height: 'మీ ఎత్తు (Height)',
        weight: 'మీ బరువు (Weight)',
        calcBmi: 'శరీర బరువు కొలత (BMI)',
        bpTitle: 'మీ రక్తపోటు (BP) మీకు తెలుసా?',
        sugarTitle: 'మీ బ్లడ్ షుగర్ స్థాయి మీకు తెలుసా?',
        normal: 'సాధారణం (Normal)',
        high: 'ఎక్కువ (High) / మందులు వాడుతున్నారు',
        unsure: 'నాకు తెలియదు / ఎప్పుడూ పరీక్షించలేదు',
        bmiNormal: 'ఎత్తుకు తగిన ఆరోగ్యకరమైన బరువు',
        bmiOverweight: 'కొద్దిగా ఎక్కువ బరువు',
        bmiObese: 'అధిక బరువు',
      },
    },
    actions: {
      walk: {
        title: 'భోజనం తర్వాత రోజూ 20 నిమిషాలు నడవండి',
        benefit: 'రక్తంలో చక్కెర స్థాయిని తగ్గించడంలో మరియు గుండెను బలంగా ఉంచడంలో సహాయపడుతుంది.',
      },
      salt: {
        title: 'పచ్చళ్ళు, అప్పడాలు మరియు అదనపు ఉప్పు తగ్గించండి',
        benefit: 'రక్తపోటును అదుపులో ఉంచుతుంది, గుండెకు భారం తగ్గిస్తుంది.',
      },
      water: {
        title: 'తీపి పానీయాల బదులు మంచి నీరు తాగండి',
        benefit: 'శరీరంలో అనవసరమైన చక్కెర చేరకుండా చూస్తుంది.',
      },
      greens: {
        title: 'ఆకుకూరలు మరియు పప్పు దినుసులు ఎక్కువగా తీసుకోండి',
        benefit: 'శరీరానికి మంచి బలాన్ని మరియు పోషకాలను అందిస్తుంది.',
      },
      checkup: {
        title: 'సమీప ప్రాథమిక ఆరోగ్య కేంద్రంలో BP, షుగర్ పరీక్షించుకోండి',
        benefit: '5 నిమిషాల చిన్న పరీక్ష భవిష్యత్తు సమస్యలను ముందే ఆపుతుంది.',
      },
    },
  },
  ta: {
    appName: 'ஹெல்த் தோஸ்த் (HealthDost)',
    tagline: 'உங்கள் அன்பான நல்வாழ்வுத் தோழன்',
    startCheck: 'இலவச பரிசோதனை தொடங்குக',
    trySample: '⚡ மாதிரி சுயவிவரம் (டெமோ)',
    guestFlowNotice: 'உள்நுழைவு தேவையில்லை. உங்கள் தகவல்கள் உங்கள் போனில் பாதுகாப்பாக இருக்கும்.',
    selectLanguage: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
    stepOf: 'படி',
    next: 'அடுத்த கேள்வி',
    previous: 'பின்செல்ல',
    skipStep: 'தெரியாது (தவிர்க்கவும்)',
    dontKnow: 'எனக்கு இது தெரியாது',
    howToCheck: 'எப்படி பரிசோதிப்பது?',
    seeResults: 'என் ஆரோக்கிய நிலையை பார்க்க',
    disclaimerShort: 'இது மருத்துவ பரிசோதனை அல்ல. உண்மையான பரிசோதனைக்கு மருத்துவரை அணுகவும்.',
    disclaimerFull: 'ஹெல்த் தோஸ்த் விழிப்புணர்வு மற்றும் தடுப்பு நடவடிக்கைகளுக்கான வழிகாட்டி மட்டுமே.',
    voiceHelp: 'ஒலி வடிவில் கேட்க',
    voicePlaying: 'வாசிக்கிறது...',
    voiceStop: 'ஒலியை நிறுத்து',
    riskLevels: {
      low: 'குறைந்த ஆபத்து (பாதுகாப்பானது)',
      moderate: 'மிதமான ஆபத்து (கவனம் தேவை)',
      high: 'அதிக ஆபத்து (உடனடி கவனம் தேவை)',
    },
    resultHeader: 'உங்கள் ஆரோக்கிய விழிப்புணர்வு முடிவு',
    whyThisResult: 'இந்த முடிவு ஏன் வந்தது?',
    topFactors: 'கவனிக்க வேண்டிய விஷயங்கள்',
    protectiveFactorsTitle: 'உங்களைப் பாதுகாக்கும் நல்ல பழக்கங்கள்',
    actionPlanTitle: 'உங்களுக்கான 3 எளிய வழிகள்',
    actionPlanSubtitle: 'உங்கள் இதயம் மற்றும் உடலை நலமாக வைக்கும் எளிய தினசரி பழக்கங்கள்.',
    remindMe: 'தினசரி நினைவூட்டல்',
    remindActive: 'நினைவூட்டல் ஆன் 🔔',
    saveReport: 'அறிக்கையை சேமிக்க (PDF/படம்)',
    shareWithDoctor: 'குடும்பத்தினர் அல்லது மருத்துவருடன் பகிர்க',
    detailedView: 'முழு விவர அறிக்கை பார்க்க',
    detailedViewHide: 'முழு அறிக்கை மறைக்க',
    emergencyAlert: '🚨 அவசர எச்சரிக்கை (Emergency)',
    emergencyTitle: 'உடனடியாக மருத்துவ உதவி பெறவும்',
    emergencyDesc: 'நெஞ்சு வலி அல்லது கடுமையான மூச்சுத் திணறல் இருந்தால் உடனே மருத்துவமனைக்குச் செல்லுங்கள்.',
    emergencyCallNow: 'ஆம்புலன்ஸ் 108 / 112 அழைக்கவும்',
    communityStat: 'பரிசோதித்த 10 பேரில் 8 பேர் ஒரு நல்ல ஆரோக்கிய பழக்கத்தைத் தொடங்கியுள்ளனர்.',
    questions: {
      emergency: {
        title: 'தற்போது உங்களுக்கு ஏதேனும் தீவிர உடல்நலக் குறைவு உள்ளதா?',
        subtitle: 'இந்த நேரத்தில் நீங்கள் எப்படி உணர்கிறீர்கள் என்று கூறுங்கள்.',
        noSevere: 'இல்லை, நான் இப்போது நலமாக உள்ளேன்',
        yesChestPain: 'ஆம், கடுமையான நெஞ்சு வலி அல்லது பாரம்',
        yesBreathing: 'ஆம், திடீர் மூச்சுத் திணறல் அல்லது தலைச்சுற்றல்',
      },
      age: {
        title: 'உங்கள் வயது என்ன?',
        subtitle: 'உங்கள் வயதுக்குரிய அட்டையைத் தொடவும்.',
        under30: '30 வயதுக்கு கீழ் (இளைஞர்)',
        age30to45: '30 முதல் 45 வயது',
        age46to60: '46 முதல் 60 வயது',
        above60: '60+ வயது (முதியவர்)',
      },
      gender: {
        title: 'உங்கள் பாலினம் என்ன?',
        subtitle: 'இதயம் மற்றும் உடல்நல மதிப்பீட்டிற்கு உதவும்.',
        male: 'ஆண் (Male)',
        female: 'பெண் (Female)',
        other: 'மற்றவை (Other)',
      },
      activity: {
        title: 'தினமும் எவ்வளவு தூரம் நடக்கிறீர்கள் அல்லது உழைக்கிறீர்கள்?',
        subtitle: 'விவசாயம், நடைபயிற்சி, வீட்டு வேலை அல்லது உடல் உழைப்பு.',
        active: 'மிகவும் சுறுசுறுப்பு (தினமும் 30+ நிமிடம் உழைப்பு)',
        activeDesc: 'வயல் வேலை, வேகமான நடை, சைக்கிள் ஓட்டுதல்',
        moderate: 'மிதமானது (வாரத்தில் சில நாட்கள்)',
        moderateDesc: 'சாதாரண நடை, வீட்டு வேலைகள்',
        low: 'அமர்ந்திருப்பது அதிகம் (குறைந்த உழைப்பு)',
        lowDesc: 'நாற்காலியில் அமர்வது, குறைந்த உடல் அசைவு',
      },
      lifestyle: {
        title: 'தினசரி பழக்கங்கள் & உணவு',
        subtitle: 'உங்கள் வழக்கத்திற்குப் பொருத்தமானதைத் தேர்வு செய்க.',
        smokingTitle: 'பீடி, சிகரெட் அல்லது குட்கா பயன்படுத்துகிறீர்களா?',
        alcoholTitle: 'மது அருந்தும் பழக்கம் உள்ளதா?',
        dietTitle: 'எந்த வகையான உணவை அதிகம் சாப்பிடுகிறீர்கள்?',
        never: 'இல்லை / ஒருபோதும் இல்லை',
        sometimes: 'எப்போதாவது',
        regular: 'தினமும் / வழக்கமாக',
        dietBalanced: 'எளிய வீட்டு உணவு (பருப்பு, சாதம், காய்கறி, ரொட்டி)',
        dietOilySweet: 'எண்ணெய் பலகாரங்கள், இனிப்புகள்',
        dietHighSalt: 'அதிக உப்பு, ஊறுகாய், அப்பளம்',
      },
      familyHistory: {
        title: 'உங்கள் குடும்பத்தில் யாருக்கேனும் இவை இருந்ததா?',
        subtitle: 'பெற்றோர், தாத்தா-பாட்டி, உடன்பிறப்புகள்.',
        diabetes: 'சர்க்கரை நோய் (Diabetes)',
        heart: 'இதய நோய் அல்லது மாரடைப்பு',
        bp: 'உயர் ரத்த அழுத்தம் (High BP)',
        none: 'யாருக்கும் இல்லை / தெரியாது',
      },
      biomarkers: {
        title: 'விருப்பத்தேர்வு: உயரம், எடை & பரிசோதனை',
        subtitle: 'தெரியவில்லை என்றால் தாராளமாக தவிர்க்கலாம்.',
        height: 'உங்கள் உயரம் (Height)',
        weight: 'உங்கள் எடை (Weight)',
        calcBmi: 'உடல் எடை அளவு (BMI)',
        bpTitle: 'உங்கள் ரத்த அழுத்தம் (BP) அளவு தெரியுமா?',
        sugarTitle: 'உங்கள் ரத்த சர்க்கரை அளவு தெரியுமா?',
        normal: 'சீரானது (Normal)',
        high: 'அதிகம் (High) / மாத்திரை உட்கொள்கிறேன்',
        unsure: 'எனக்குத் தெரியாது / பரிசோதித்ததில்லை',
        bmiNormal: 'உயரத்திற்கு ஏற்ற சரியான எடை',
        bmiOverweight: 'சற்று கூடுதல் எடை',
        bmiObese: 'அதிக உடல் எடை',
      },
    },
    actions: {
      walk: {
        title: 'உணவுக்குப் பின் தினமும் 20 நிமிடம் நடக்கவும்',
        benefit: 'சர்க்கரை அளவைக் கட்டுப்படுத்தவும் இதயத்தை வலுப்படுத்தவும் உதவும்.',
      },
      salt: {
        title: 'ஊறுகாய், அப்பளம் மற்றும் கூடுதல் உப்பைக் குறைக்கவும்',
        benefit: 'ரத்த அழுத்தத்தைக் கட்டுப்படுத்தி இதயத்தைப் பாதுகாக்கும்.',
      },
      water: {
        title: 'இனிப்பு பானங்களுக்குப் பதிலாக நல்ல தண்ணீர் குடிக்கவும்',
        benefit: 'தேவையற்ற சர்க்கரை சேர்வதைத் தடுக்கும்.',
      },
      greens: {
        title: 'கீரை மற்றும் பருப்பு வகைகளை அதிகம் சேர்க்கவும்',
        benefit: 'உடலுக்குத் தேவையான சத்துக்களை அளித்து சுறுசுறுப்பைத் தரும்.',
      },
      checkup: {
        title: 'அருகிலுள்ள ஆரம்ப சுகாதார நிலையத்தில் BP, சுகர் பரிசோதிக்கவும்',
        benefit: '5 நிமிட எளிய பரிசோதனை எதிர்கால பாதிப்புகளைத் தடுக்கும்.',
      },
    },
  },
  bn: {
    appName: 'হেলথ দোস্ত (HealthDost)',
    tagline: 'আপনার বিশ্বস্ত স্বাস্থ্য বন্ধু',
    startCheck: 'বিনামূল্যে স্বাস্থ্য পরীক্ষা শুরু করুন',
    trySample: '⚡ নমুনা প্রোফাইল দেখুন (ডেমো)',
    guestFlowNotice: 'কোনো পাসওয়ার্ড লাগবে না। তথ্য আপনার ফোনেই সুরক্ষিত থাকবে।',
    selectLanguage: 'আপনার ভাষা বেছে নিন',
    stepOf: 'ধাপ',
    next: 'পরবর্তী প্রশ্ন',
    previous: 'পেছনে যান',
    skipStep: 'জানা নেই (এড়িয়ে যান)',
    dontKnow: 'আমি এটি জানি না',
    howToCheck: 'কীভাবে পরীক্ষা করবেন?',
    seeResults: 'আমার স্বাস্থ্য স্কোর দেখুন',
    disclaimerShort: 'এটি কোনো ডাক্তারি রোগ নির্ণয় নয়। সঠিক পরীক্ষার জন্য ডাক্তারের পরামর্শ নিন।',
    disclaimerFull: 'হেলথ দোস্ত শুধুমাত্র সচেতনতা ও প্রতিরোধের জন্য তৈরি। এটি ডাক্তার বা ল্যাব টেস্টের বিকল্প নয়।',
    voiceHelp: 'কথা শুনুন (ভয়েস)',
    voicePlaying: 'পড়া হচ্ছে...',
    voiceStop: 'ভয়েস বন্ধ করুন',
    riskLevels: {
      low: 'কম ঝুঁকি (নিরাপদ)',
      moderate: 'মাঝারি ঝুঁকি (সতর্কতা প্রয়োজন)',
      high: 'বেশি ঝুঁকি (যত্ন নেওয়া জরুরি)',
    },
    resultHeader: 'আপনার স্বাস্থ্য সচেতনতার ফলাফল',
    whyThisResult: 'এই ফলাফল কেন এলো?',
    topFactors: 'যেসব বিষয়ে নজর দেওয়া দরকার',
    protectiveFactorsTitle: 'আপনার ভালো অভ্যাস যা সুরক্ষা দিচ্ছে',
    actionPlanTitle: 'আপনার জন্য ৩টি সহজ পরামর্শ',
    actionPlanSubtitle: 'ছোট ছোট দৈনন্দিন অভ্যাস যা আপনার হৃদয় ও শরীরকে সুস্থ রাখে।',
    remindMe: 'দৈনিক মনে করিয়ে দিন',
    remindActive: 'রিমাইন্ডার চালু 🔔',
    saveReport: 'স্বাস্থ্য কার্ড সংরক্ষণ করুন (PDF/ছবি)',
    shareWithDoctor: 'পরিবার বা ডাক্তারের সাথে শেয়ার করুন',
    detailedView: 'সম্পূর্ণ রিপোর্ট দেখুন',
    detailedViewHide: 'সম্পূর্ণ রিপোর্ট লুকান',
    emergencyAlert: '🚨 জরুরি সতর্কতা (Emergency)',
    emergencyTitle: 'অনুগ্রহ করে দ্রুত ডাক্তারের কাছে যান',
    emergencyDesc: 'বুকে তীব্র ব্যথা বা শ্বাসকষ্ট জরুরি চিকিৎসার সংকেত হতে পারে। অনলাইন স্কোরের অপেক্ষা করবেন না।',
    emergencyCallNow: 'অ্যাম্বুলেন্স ১০৮ / ১১২ তে কল করুন',
    communityStat: 'এই পরীক্ষা করা ১০ জনের মধ্যে ৮ জনই তাদের স্বাস্থ্যের জন্য একটি ভালো অভ্যাস গ্রহণ করেছেন।',
    questions: {
      emergency: {
        title: 'আপনার কি এখন কোনো তীব্র শারীরিক সমস্যা হচ্ছে?',
        subtitle: 'এই মুহূর্তে কেমন অনুভব করছেন তা জানান।',
        noSevere: 'না, আমি এখন ঠিক আছি',
        yesChestPain: 'হ্যাঁ, বুকে তীব্র ব্যথা বা চাপ অনুভূত হচ্ছে',
        yesBreathing: 'হ্যাঁ, হঠাৎ শ্বাসকষ্ট বা মাথা ঘোরা',
      },
      age: {
        title: 'আপনার বয়স কত?',
        subtitle: 'আপনার বয়সের কার্ডটিতে স্পর্শ করুন।',
        under30: '৩০ বছরের কম (তরুণ)',
        age30to45: '৩০ থেকে ৪৫ বছর',
        age46to60: '৪৬ থেকে ৬০ বছর',
        above60: '৬০+ বছর (প্রবীণ)',
      },
      gender: {
        title: 'আপনার লিঙ্গ কী?',
        subtitle: 'হৃদযন্ত্র এবং স্বাস্থ্য মূল্যায়নে সাহায্য করে।',
        male: 'পুরুষ (Male)',
        female: 'মহিলা (Female)',
        other: 'অন্যান্য (Other)',
      },
      activity: {
        title: 'আপনি প্রতিদিন কতটা হাঁটাচলা বা পরিশ্রম করেন?',
        subtitle: 'চাষবাস, হাঁটা, ঘরের কাজ বা শারীরিক পরিশ্রম।',
        active: 'খুব সক্রিয় (প্রতিদিন ৩০+ মিনিট পরিশ্রম বা হাঁটা)',
        activeDesc: 'জমির কাজ, দ্রুত হাঁটা, সাইকেল চালানো',
        moderate: 'মাঝারি (সপ্তাহে কয়েক দিন)',
        moderateDesc: 'স্বাভাবিক হাঁটাচলা, ঘরের কাজ',
        low: 'বেশিরভাগ সময় বসে থাকা (কম পরিশ্রম)',
        lowDesc: 'চেয়ারে বসে থাকা, খুব কম চলাফেরা',
      },
      lifestyle: {
        title: 'দৈনন্দিন অভ্যাস এবং খাদ্যাভ্যাস',
        subtitle: 'আপনার নিয়মিত রুটিনের সাথে মেলে এমন অপশন বাছুন।',
        smokingTitle: 'আপনি কি বিড়ি, সিগারেট বা গুটখা খান?',
        alcoholTitle: 'আপনি কি অ্যালকোহল গ্রহণ করেন?',
        dietTitle: 'আপনি সাধারণত কী ধরনের খাবার খান?',
        never: 'কখনই না / না',
        sometimes: 'মাঝে মাঝে',
        regular: 'নিয়মিত / প্রতিদিন',
        dietBalanced: 'সাধারণ ঘরের খাবার (ডাল, ভাত, সবজি, রুটি)',
        dietOilySweet: 'বেশি তেল-ভাজাভুজি, মিষ্টি',
        dietHighSalt: 'বেশি লবণ, আচার, পাঁপড় বা নোনতা',
      },
      familyHistory: {
        title: 'আপনার পরিবারের কারও কি এই রোগগুলি ছিল?',
        subtitle: 'পিতামাতা, দাদা-দাদি বা ভাই-বোন।',
        diabetes: 'ডায়াবেটিস / রক্তের সুগার (Diabetes)',
        heart: 'হৃদরোগ বা হার্ট অ্যাটাক',
        bp: 'উচ্চ রক্তচাপ (High BP)',
        none: 'কারও নেই / জানা নেই',
      },
      biomarkers: {
        title: 'ঐচ্ছিক: উচ্চতা, ওজন এবং পরীক্ষা',
        subtitle: 'জানা না থাকলে আপনি সহজেই এড়িয়ে যেতে পারেন।',
        height: 'আপনার উচ্চতা (Height)',
        weight: 'আপনার ওজন (Weight)',
        calcBmi: 'শরীরের ওজন সূচক (BMI)',
        bpTitle: 'আপনার রক্তচাপ (BP) জানা আছে কি?',
        sugarTitle: 'আপনার রক্তের সুগার জানা আছে কি?',
        normal: 'স্বাভাবিক (Normal)',
        high: 'বেশি (High) / ওষুধ খাচ্ছি',
        unsure: 'আমি জানি না / কখনও পরীক্ষা করিনি',
        bmiNormal: 'উচ্চতা অনুযায়ী সঠিক ওজন',
        bmiOverweight: 'স্বাভাবিকের চেয়ে কিছুটা বেশি ওজন',
        bmiObese: 'অতিরিক্ত ওজন',
      },
    },
    actions: {
      walk: {
        title: 'খাবারের পর প্রতিদিন ২০ মিনিট হাঁটুন',
        benefit: 'রক্তের শর্করা নিয়ন্ত্রণে রাখতে এবং হার্ট ভালো রাখতে সাহায্য করে।',
      },
      salt: {
        title: 'আচার, পাঁপড় ও কাঁচা লবণ খাওয়া কমান',
        benefit: 'রক্তচাপ স্বাভাবিক রাখে ও হার্টের ওপর চাপ কমায়।',
      },
      water: {
        title: 'মিষ্টি পানীয়ের বদলে পরিষ্কার জল পান করুন',
        benefit: 'অতিরিক্ত চিনি শরীরে যাওয়া আটকায়।',
      },
      greens: {
        title: 'খাবারে শাকসবজি ও ডালের পরিমাণ বাড়ান',
        benefit: 'শরীরকে সতেজ ও প্রয়োজনীয় পুষ্টি জোগায়।',
      },
      checkup: {
        title: 'নিকটবর্তী স্বাস্থ্য কেন্দ্রে BP ও সুগার পরীক্ষা করান',
        benefit: '৫ মিনিটের সহজ পরীক্ষা ভবিষ্যতের জটিলতা রোধ করে।',
      },
    },
  },
  mr: {
    appName: 'हेल्थ दोस्त (HealthDost)',
    tagline: 'तुमचा विश्वासू आरोग्य मित्र',
    startCheck: 'मोफत आरोग्य तपासणी सुरू करा',
    trySample: '⚡ नमुना प्रोफाइल पहा (डेमो)',
    guestFlowNotice: 'लॉगिनची गरज नाही. तुमची माहिती तुमच्या फोनवर सुरक्षित राहील.',
    selectLanguage: 'तुमची भाषा निवडा',
    stepOf: 'टप्पा',
    next: 'पुढे जा',
    previous: 'मागे या',
    skipStep: 'माहित नाही (सोडून द्या)',
    dontKnow: 'मला हे माहित नाही',
    howToCheck: 'कसे तपासावे?',
    seeResults: 'माझा आरोग्य स्कोअर पहा',
    disclaimerShort: 'हे डॉक्टरी निदान नाही. कृपया खऱ्या तपासणीसाठी डॉक्टरांचा सल्ला घ्या.',
    disclaimerFull: 'हेल्थ दोस्त केवळ जनजागृती व प्रतिबंधात्मक उपायांसाठी आहे. हे डॉक्टरांच्या तपासणीचा पर्याय नाही.',
    voiceHelp: 'ऐका (व्हॉइस)',
    voicePlaying: 'वाचत आहे...',
    voiceStop: 'आवाज थांबवा',
    riskLevels: {
      low: 'कमी धोका (सुरक्षित)',
      moderate: 'मध्यम धोका (काळजी आवश्यक)',
      high: 'जास्त धोका (लक्ष देणे गरजेचे)',
    },
    resultHeader: 'तुमचा आरोग्य जागरूकता स्कोअर',
    whyThisResult: 'हा निकाल का आला?',
    topFactors: 'लक्ष देण्यासारख्या गोष्टी',
    protectiveFactorsTitle: 'तुमचे रक्षण करणाऱ्या चांगल्या सवयी',
    actionPlanTitle: 'तुमच्यासाठी ३ सोपे उपाय',
    actionPlanSubtitle: 'तुमचे हृदय व शरीर निरोगी ठेवणारे सोपे दैनंदिन बदल.',
    remindMe: 'रोज आठवण करा',
    remindActive: 'रिमाइंडर चालू 🔔',
    saveReport: 'हेल्थ कार्ड सेव्ह करा (PDF/फोटो)',
    shareWithDoctor: 'कुटुंब किंवा डॉक्टरांशी शेअर करा',
    detailedView: 'सविस्तर अहवाल पहा',
    detailedViewHide: 'सविस्तर अहवाल लपवा',
    emergencyAlert: '🚨 आपत्कालीन इशारा (Emergency)',
    emergencyTitle: 'कृपया त्वरित वैद्यकीय मदत घ्या',
    emergencyDesc: 'छातीत तीव्र वेदना किंवा श्वास घेण्यास त्रास असल्यास त्वरित रुग्णालयात जा. ऑनलाइन स्कोअरची वाट पाहू नका.',
    emergencyCallNow: 'रुग्णवाहिका १०८ / ११२ वर कॉल करा',
    communityStat: 'तपासणी केलेल्या १० पैकी ८ जणांनी आरोग्यासाठी एक चांगली सवय अंगीकारली.',
    questions: {
      emergency: {
        title: 'तुम्हाला आता काही तीव्र त्रास होत आहे का?',
        subtitle: 'कृपया या क्षणी तुम्हाला कसे वाटत आहे ते सांगा.',
        noSevere: 'नाही, मला आता बरे वाटत आहे',
        yesChestPain: 'हो, छातीत तीव्र वेदना किंवा जडपणा आहे',
        yesBreathing: 'हो, अचानक श्वास घेण्यास त्रास किंवा चक्कर',
      },
      age: {
        title: 'तुमचे वय किती आहे?',
        subtitle: 'तुमच्या वयाचे कार्ड निवडा.',
        under30: '३० वर्षांपेक्षा कमी (तरुण)',
        age30to45: '३० ते ४५ वर्षे',
        age46to60: '४६ ते ६० वर्षे',
        above60: '६०+ वर्षे (ज्येष्ठ)',
      },
      gender: {
        title: 'तुमचे लिंग काय आहे?',
        subtitle: 'हृदय व आरोग्य अंदाजासाठी उपयुक्त.',
        male: 'पुरुष (Male)',
        female: 'स्त्री (Female)',
        other: 'इतर (Other)',
      },
      activity: {
        title: 'तुम्ही रोज किती चालता किंवा कष्ट करता?',
        subtitle: 'शेती, चालणे, घरातील काम किंवा शारीरिक मेहनत.',
        active: 'खूप सक्रिय (रोज ३०+ मिनिटे काम किंवा चालणे)',
        activeDesc: 'शेतातील काम, जलद चालणे, सायकल चालवणे',
        moderate: 'मध्यम (आठवड्यातून काही दिवस)',
        moderateDesc: 'साधे चालणे, घरातील कामे',
        low: 'जास्त वेळ बसणे (कमी हालचाल)',
        lowDesc: 'खुर्चीवर बसणे, खूप कमी शारीरिक श्रम',
      },
      lifestyle: {
        title: 'दैनंदिन सवयी आणि आहार',
        subtitle: 'तुमच्या नेहमीच्या सवयीनुसार पर्याय निवडा.',
        smokingTitle: 'तुम्ही विडी, सिगारेट किंवा गुटखा घेता का?',
        alcoholTitle: 'तुम्ही मद्यपान करता का?',
        dietTitle: 'तुम्ही सहसा कोणत्या प्रकारचे अन्न खाता?',
        never: 'कधीच नाही / नाही',
        sometimes: 'कधीतरी',
        regular: 'दररोज / नियमित',
        dietBalanced: 'साधे घरचे जेवण (वरण, भात, भाजी, पोळी/भाकरी)',
        dietOilySweet: 'तळलेले पदार्थ, मिठाई, मसालेदार',
        dietHighSalt: 'जास्त मीठ, लोणचे, पापड, फरसाण',
      },
      familyHistory: {
        title: 'तुमच्या कुटुंबात कोणाला हे आजार झाले होते का?',
        subtitle: 'आई-वडील, आजी-आजोबा, भाऊ-बहीण.',
        diabetes: 'मधुमेह / शुगर (Diabetes)',
        heart: 'हृदयविकार किंवा हार्ट अटॅक',
        bp: 'उच्च रक्तदाब (High BP)',
        none: 'कोणालाही नाही / माहित नाही',
      },
      biomarkers: {
        title: 'पर्यायी: उंची, वजन आणि चाचण्या',
        subtitle: 'माहित नसल्यास तुम्ही सहज सोडून देऊ शकता.',
        height: 'तुमची उंची (Height)',
        weight: 'तुमचे वजन (Weight)',
        calcBmi: 'शरीर वजन निर्देशांक (BMI)',
        bpTitle: 'तुम्हाला तुमचा रक्तदाब (BP) माहित आहे का?',
        sugarTitle: 'तुम्हाला तुमची ब्लड शुगर माहित आहे का?',
        normal: 'सामान्य (Normal)',
        high: 'जास्त (High) / औषधे घेत आहे',
        unsure: 'मला माहित नाही / कधी तपासले नाही',
        bmiNormal: 'उंचीनुसार योग्य वजन',
        bmiOverweight: 'सामान्य वजनापेक्षा थोडे जास्त',
        bmiObese: 'अतिरिक्त वजन',
      },
    },
    actions: {
      walk: {
        title: 'जेवणानंतर रोज २० मिनिटे चाला',
        benefit: 'रक्तातील साखर नियंत्रित ठेवण्यास आणि हृदय निरोगी ठेवण्यास मदत होते.',
      },
      salt: {
        title: 'लोणचे, पापड आणि वरून मीठ घेणे कमी करा',
        benefit: 'रक्तदाब नियंत्रणात राहतो आणि हृदयावरील ताण कमी होतो.',
      },
      water: {
        title: 'गोड पेयांपेक्षा साधे स्वच्छ पाणी प्या',
        benefit: 'अनावश्यक साखर शरीरात जाणे थांबते.',
      },
      greens: {
        title: 'आहारात पालेभाज्या आणि डाळी वाढवा',
        benefit: 'शरीराला आवश्यक पोषण आणि ऊर्जा मिळते.',
      },
      checkup: {
        title: 'जवळच्या प्राथमिक आरोग्य केंद्रात BP व शुगर तपासा',
        benefit: '५ मिनिटांची साधी तपासणी भविष्यातील आजार रोखू शकते.',
      },
    },
  },
  kn: {
    appName: 'ಹೆಲ್ತ್ ದೋಸ್ತ್ (HealthDost)',
    tagline: 'ನಿಮ್ಮ ಆತ್ಮೀಯ ಆರೋಗ್ಯ ಮಿತ್ರ',
    startCheck: 'ಉಚಿತ ಆರೋಗ್ಯ ತಪಾಸಣೆ ಪ್ರಾರಂಭಿಸಿ',
    trySample: '⚡ ಮಾದರಿ ಪ್ರೊಫೈಲ್ ನೋಡಿ (ಡೆಮೊ)',
    guestFlowNotice: 'ಲಾಗಿನ್ ಅಗತ್ಯವಿಲ್ಲ. ನಿಮ್ಮ ವಿವರಗಳು ನಿಮ್ಮ ಫೋನ್‌ನಲ್ಲೇ ಸುರಕ್ಷಿತ.',
    selectLanguage: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    stepOf: 'ಹಂತ',
    next: 'ಮುಂದೆ ಹೋಗಿ',
    previous: 'ಹಿಂದೆ',
    skipStep: 'ಗೊತ್ತಿಲ್ಲ (ಮುಂದೆ ಹೋಗಿ)',
    dontKnow: 'ನನಗೆ ಇದು ಗೊತ್ತಿಲ್ಲ',
    howToCheck: 'ಹೇಗೆ ಪರೀಕ್ಷಿಸುವುದು?',
    seeResults: 'ನನ್ನ ಆರೋಗ್ಯ ಸ್ಕೋರ್ ನೋಡಿ',
    disclaimerShort: 'ಇದು ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯವಲ್ಲ. ದಯವಿಟ್ಟು ನೈಜ ತಪಾಸಣೆಗಾಗಿ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    disclaimerFull: 'ಹೆಲ್ತ್ ದೋಸ್ತ್ ಕೇವಲ ಜಾಗೃತಿ ಮತ್ತು ಮುನ್ನೆಚ್ಚರಿಕೆಗಾಗಿ ಮಾತ್ರ. ಇದು ವೈದ್ಯರ ಪರೀಕ್ಷೆಗೆ ಪರ್ಯಾಯವಲ್ಲ.',
    voiceHelp: 'ಧ್ವನಿ ಕೇಳಿ (Voice)',
    voicePlaying: 'ಓದಲಾಗುತ್ತಿದೆ...',
    voiceStop: 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ',
    riskLevels: {
      low: 'ಕಡಿಮೆ ಅಪಾಯ (ಸುರಕ್ಷಿತ)',
      moderate: 'ಮಧ್ಯಮ ಅಪಾಯ (ಎಚ್ಚರಿಕೆ ಅಗತ್ಯ)',
      high: 'ಹೆಚ್ಚಿನ ಅಪಾಯ (ಗಮನ ಅಗತ್ಯ)',
    },
    resultHeader: 'ನಿಮ್ಮ ಆರೋಗ್ಯ ಜಾಗೃತಿ ಫಲಿತಾಂಶ',
    whyThisResult: 'ಈ ಫಲಿತಾಂಶ ಏಕೆ ಬಂತು?',
    topFactors: 'ಗಮನ ಹರಿಸಬೇಕಾದ ವಿಷಯಗಳು',
    protectiveFactorsTitle: 'ನಿಮ್ಮನ್ನು ರಕ್ಷಿಸುತ್ತಿರುವ ಉತ್ತಮ ಅಭ್ಯಾಸಗಳು',
    actionPlanTitle: 'ನಿಮಗಾಗಿ 3 ಸರಳ ಸಲಹೆಗಳು',
    actionPlanSubtitle: 'ನಿಮ್ಮ ಹೃದಯ ಮತ್ತು ದೇಹವನ್ನು ಆರೋಗ್ಯವಾಗಿಡುವ ಚಿಕ್ಕ ದೈನಂದಿನ ಬದಲಾವಣೆಗಳು.',
    remindMe: 'ದೈನಂದಿನ ಜ್ಞಾಪನೆ',
    remindActive: 'ಜ್ಞಾಪನೆ ಆನ್ ಆಗಿದೆ 🔔',
    saveReport: 'ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಸೇವ್ ಮಾಡಿ (PDF/ಚಿತ್ರ)',
    shareWithDoctor: 'ಕುಟುಂಬ ಅಥವಾ ವೈದ್ಯರೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ',
    detailedView: 'ಸಂಪೂರ್ಣ ವರದಿ ನೋಡಿ',
    detailedViewHide: 'ಸಂಪೂರ್ಣ ವರದಿ ಮರೆಮಾಡಿ',
    emergencyAlert: '🚨 ತುರ್ತು ಎಚ್ಚರಿಕೆ (Emergency)',
    emergencyTitle: 'ದಯವಿಟ್ಟು ತಕ್ಷಣ ವೈದ್ಯಕೀಯ ಸಹಾಯ ಪಡೆಯಿರಿ',
    emergencyDesc: 'ಎದೆ ನೋವು ಅಥವಾ ತೀವ್ರ ಉಸಿರಾಟದ ತೊಂದರೆ ಇದ್ದಲ್ಲಿ ತಕ್ಷಣ ಆಸ್ಪತ್ರೆಗೆ ಭೇಟಿ ನೀಡಿ.',
    emergencyCallNow: 'ಆಂಬ್ಯುಲೆನ್ಸ್ 108 / 112 ಗೆ ಕರೆ ಮಾಡಿ',
    communityStat: 'ಈ ಪರೀಕ್ಷೆ ಮಾಡಿದ 10 ರಲ್ಲಿ 8 ಜನರು ತಮ್ಮ ಆರೋಗ್ಯಕ್ಕಾಗಿ ಒಂದು ಒಳ್ಳೆಯ ಅಭ್ಯಾಸ ರೂಢಿಸಿಕೊಂಡಿದ್ದಾರೆ.',
    questions: {
      emergency: {
        title: 'ನಿಮಗೆ ಪ್ರಸ್ತುತ ಯಾವುದೇ ತೀವ್ರ ತೊಂದರೆ ಇದೆಯೇ?',
        subtitle: 'ಈ ಸಮಯದಲ್ಲಿ ನೀವು ಹೇಗಿದ್ದೀರಿ ಎಂದು ತಿಳಿಸಿ.',
        noSevere: 'ಇಲ್ಲ, ನಾನು ಈಗ ಆರಾಮವಾಗಿದ್ದೇನೆ',
        yesChestPain: 'ಹೌದು, ಎದೆಯಲ್ಲಿ ತೀವ್ರ ನೋವು ಅಥವಾ ಭಾರವಾದ ಭಾವನೆ',
        yesBreathing: 'ಹೌದು, ಹಠಾತ್ ಉಸಿರಾಟದ ತೊಂದರೆ ಅಥವಾ ತಲೆತಿರುಗುವಿಕೆ',
      },
      age: {
        title: 'ನಿಮ್ಮ ವಯಸ್ಸು ಎಷ್ಟು?',
        subtitle: 'ನಿಮ್ಮ ವಯಸ್ಸಿಗೆ ಸರಿಹೊಂದುವ ಕಾರ್ಡ್ ಆಯ್ಕೆಮಾಡಿ.',
        under30: '30 ವರ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ (ಯುವಕರು)',
        age30to45: '30 ರಿಂದ 45 ವರ್ಷಗಳು',
        age46to60: '46 ರಿಂದ 60 ವರ್ಷಗಳು',
        above60: '60+ ವರ್ಷಗಳು (ಹಿರಿಯರು)',
      },
      gender: {
        title: 'ನಿಮ್ಮ ಲಿಂಗ ಯಾವುದು?',
        subtitle: 'ಹೃದಯ ಮತ್ತು ಆರೋಗ್ಯ ಅಂದಾಜಿಗೆ ಸಹಕಾರಿ.',
        male: 'ಪುರುಷ (Male)',
        female: 'ಮಹಿಳೆ (Female)',
        other: 'ಇತರ (Other)',
      },
      activity: {
        title: 'ನೀವು ಪ್ರತಿದಿನ ಎಷ್ಟು ನಡೆಯುತ್ತೀರಿ ಅಥವಾ ಶ್ರಮಿಸುತ್ತೀರಿ?',
        subtitle: 'ಕೃಷಿ, ನಡಿಗೆ, ಮನೆ ಕೆಲಸ ಅಥವಾ ಶ್ರಮದಾಯಕ ಕೆಲಸ.',
        active: 'ತುಂಬಾ ಚಟುವಟಿಕೆ (ದಿನಕ್ಕೆ 30+ ನಿಮಿಷ ಶ್ರಮ/ನಡಿಗೆ)',
        activeDesc: 'ಹೊಲದ ಕೆಲಸ, ವೇಗದ ನಡಿಗೆ, ಸೈಕ್ಲಿಂಗ್',
        moderate: 'ಮಧ್ಯಮ (ವಾರದಲ್ಲಿ ಕೆಲವು ದಿನಗಳು)',
        moderateDesc: 'ಸಾಮಾನ್ಯ ನಡಿಗೆ, ಮನೆ ಕೆಲಸಗಳು',
        low: 'ಹೆಚ್ಚು ಕುಳಿತುಕೊಳ್ಳುವುದು (ಕಡಿಮೆ ಶ್ರಮ)',
        lowDesc: 'ಕುರ್ಚಿಯಲ್ಲಿ ಕುಳಿತುಕೊಳ್ಳುವುದು, ಕಡಿಮೆ ಚಲನೆ',
      },
      lifestyle: {
        title: 'ದೈನಂದಿನ ಅಭ್ಯಾಸಗಳು ಮತ್ತು ಆಹಾರ',
        subtitle: 'ನಿಮ್ಮ ದಿನಚರಿಗೆ ಹೊಂದುವ ಆಯ್ಕೆಯನ್ನು ಆರಿಸಿ.',
        smokingTitle: 'ನೀವು ಬೀಡಿ, ಸಿಗರೇಟ್ ಅಥವಾ ಗುಟ್ಕಾ ಸೇವಿಸುತ್ತೀರಾ?',
        alcoholTitle: 'ನೀವು ಮದ್ಯಪಾನ ಮಾಡುತ್ತೀರಾ?',
        dietTitle: 'ನೀವು ಸಾಮಾನ್ಯವಾಗಿ ಯಾವ ರೀತಿಯ ಆಹಾರ ಸೇವಿಸುತ್ತೀರಿ?',
        never: 'ಎಂದಿಗೂ ಇಲ್ಲ / ಇಲ್ಲ',
        sometimes: 'ಕೆಲವೊಮ್ಮೆ',
        regular: 'ಪ್ರತಿದಿನ / ನಿಯಮಿತವಾಗಿ',
        dietBalanced: 'ಸರಳ ಮನೆ ಊಟ (ಬೇಳೆ, ಅನ್ನ, ಪಲ್ಯ, ರೊಟ್ಟಿ/ಚಪಾತಿ)',
        dietOilySweet: 'ಹೆಚ್ಚು ಎಣ್ಣೆಯ ತಿಂಡಿಗಳು, ಸಿಹಿ ಪದಾರ್ಥಗಳು',
        dietHighSalt: 'ಹೆಚ್ಚು ಉಪ್ಪು, ಉಪ್ಪಿನಕಾಯಿ, ಹಪ್ಪಳ',
      },
      familyHistory: {
        title: 'ನಿಮ್ಮ ಕುಟುಂಬದಲ್ಲಿ ಯಾರಿಗಾದರೂ ಈ ಕಾಯಿಲೆಗಳು ಇದ್ದವೇ?',
        subtitle: 'ಪೋಷಕರು, ಅಜ್ಜ-ಅಜ್ಜಿ ಅಥವಾ ಒಡಹುಟ್ಟಿದವರು.',
        diabetes: 'ಮಧುಮೇಹ / ಶುಗರ್ (Diabetes)',
        heart: 'ಹೃದಯ ಕಾಯಿಲೆ ಅಥವಾ ಹಾರ್ಟ್ ಅಟ್ಯಾಕ್',
        bp: 'ಅಧಿಕ ರಕ್ತದೊತ್ತಡ (High BP)',
        none: 'ಯಾರಿಗೂ ಇಲ್ಲ / ಗೊತ್ತಿಲ್ಲ',
      },
      biomarkers: {
        title: 'ಐಚ್ಛಿಕ: ಎತ್ತರ, ತೂಕ ಮತ್ತು ಪರೀಕ್ಷೆಗಳು',
        subtitle: 'ತಿಳಿದಿಲ್ಲದಿದ್ದರೆ ನೀವು ಸುಲಭವಾಗಿ ಬಿಡಬಹುದು.',
        height: 'ನಿಮ್ಮ ಎತ್ತರ (Height)',
        weight: 'ನಿಮ್ಮ ತೂಕ (Weight)',
        calcBmi: 'ದೇಹ ತೂಕದ ಅಳತೆ (BMI)',
        bpTitle: 'ನಿಮ್ಮ ರಕ್ತದೊತ್ತಡ (BP) ತಿಳಿದಿದೆಯೇ?',
        sugarTitle: 'ನಿಮ್ಮ ರಕ್ತದ ಸಕ್ಕರೆ ಪ್ರಮಾಣ ತಿಳಿದಿದೆಯೇ?',
        normal: 'ಸಾಮಾನ್ಯ (Normal)',
        high: 'ಹೆಚ್ಚು (High) / ಮಾತ್ರೆ ಸೇವಿಸುತ್ತಿದ್ದೇನೆ',
        unsure: 'ನನಗೆ ಗೊತ್ತಿಲ್ಲ / ಎಂದೂ ಪರೀಕ್ಷಿಸಿಲ್ಲ',
        bmiNormal: 'ಎತ್ತರಕ್ಕೆ ತಕ್ಕ ಆರೋಗ್ಯಕರ ತೂಕ',
        bmiOverweight: 'ಸಾಮಾನ್ಯಕ್ಕಿಂತ ಸ್ವಲ್ಪ ಹೆಚ್ಚು ತೂಕ',
        bmiObese: 'ಅತಿಯಾದ ತೂಕ',
      },
    },
    actions: {
      walk: {
        title: 'ಊಟದ ನಂತರ ಪ್ರತಿದಿನ 20 ನಿಮಿಷ ನಡೆಯಿರಿ',
        benefit: 'ರಕ್ತದಲ್ಲಿ ಸಕ್ಕರೆ ನಿಯಂತ್ರಿಸಲು ಮತ್ತು ಹೃದಯವನ್ನು ಬಲಪಡಿಸಲು ಸಹಕಾರಿ.',
      },
      salt: {
        title: 'ಉಪ್ಪಿನಕಾಯಿ, ಹಪ್ಪಳ ಮತ್ತು ಹೆಚ್ಚುವರಿ ಉಪ್ಪು ಕಡಿಮೆ ಮಾಡಿ',
        benefit: 'ರಕ್ತದೊತ್ತಡವನ್ನು ನಿಯಂತ್ರಣದಲ್ಲಿಡುತ್ತದೆ, ಹೃದಯಕ್ಕೆ ರಕ್ಷಣೆ ನೀಡುತ್ತದೆ.',
      },
      water: {
        title: 'ಸಿಹಿ ಪಾನೀಯಗಳ ಬದಲಿಗೆ ಶುದ್ಧ ನೀರು ಕುಡಿಯಿರಿ',
        benefit: 'ಅನಗತ್ಯ ಸಕ್ಕರೆ ದೇಹ ಸೇರುವುದನ್ನು ತಡೆಯುತ್ತದೆ.',
      },
      greens: {
        title: 'ಆಹಾರದಲ್ಲಿ ಸೊಪ್ಪು ಮತ್ತು ಬೇಳೆಕಾಳುಗಳನ್ನು ಹೆಚ್ಚಿಸಿ',
        benefit: 'ದೇಹಕ್ಕೆ ಉತ್ತಮ ಶಕ್ತಿ ಮತ್ತು ಪೋಷಕಾಂಶಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ.',
      },
      checkup: {
        title: 'ಹತ್ತಿರದ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರದಲ್ಲಿ BP, ಶುಗರ್ ಪರೀಕ್ಷಿಸಿ',
        benefit: '5 ನಿಮಿಷಗಳ ಸಣ್ಣ ಪರೀಕ್ಷೆ ಭವಿಷ್ಯದ ದೊಡ್ಡ ಸಮಸ್ಯೆಗಳನ್ನು ತಡೆಯುತ್ತದೆ.',
      },
    },
  },
};
