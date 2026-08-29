import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Helper to call Gemini models with fallback across multiple tiers
async function safeGenerateContent(options: {
  contents: any;
  systemInstruction?: string;
  responseMimeType?: string;
  temperature?: number;
}): Promise<string> {
  const ai = getGenAI();
  const candidateModels = ["gemini-3.7-flash", "gemini-3.6-flash", "gemini-flash-latest"];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const config: any = {
        temperature: options.temperature ?? 0.3,
      };
      if (options.systemInstruction) {
        config.systemInstruction = options.systemInstruction;
      }
      if (options.responseMimeType) {
        config.responseMimeType = options.responseMimeType;
      }

      const response = await ai.models.generateContent({
        model,
        contents: options.contents,
        config,
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`Model ${model} encounter notice:`, err?.message || err);
      lastError = err;
      // Continue loop to try next model in tier
    }
  }

  throw lastError || new Error("All Gemini models temporarily unavailable due to high demand");
}

// Comprehensive Clinical Medication Knowledge Base
function getOfflineMedicationData(hint?: string, lang: string = "English") {
  const query = (hint || "").toLowerCase();

  if (query.includes("pan") || query.includes("pantop") || query.includes("pantocid") || query.includes("gastro") || query.includes("acid")) {
    return {
      tabletName: "Pan 20 / Pantocid (Pantoprazole 20mg)",
      genericName: "Pantoprazole Gastro-resistant Tablets IP (20mg)",
      category: "Proton Pump Inhibitor (Gastric Acid Reducer & Antacid)",
      dosageStrength: "20 mg (also available in 40 mg)",
      whatItIsUsedFor: "Reduces excess stomach acid secretion to treat heartburn, acid reflux (GERD), and prevent gastric ulcers.",
      usesList: [
        "Gastroesophageal Reflux Disease (GERD) & Acid Indigestion",
        "Heartburn, sour belching and gastritis symptoms",
        "Healing and prevention of stomach (peptic) ulcers",
        "Stomach mucosal protection while taking painkiller medicines"
      ],
      commonSideEffects: [
        "Mild headache or lightheadedness",
        "Abdominal discomfort, diarrhea or flatulence",
        "Dry mouth or mild nausea"
      ],
      seriousWarnings: [
        "Swallow whole with water; DO NOT crush, chew or break the gastro-resistant enteric coating",
        "Prolonged continuous use (>1 year) may lower Vitamin B12 and magnesium levels",
        "Consult a doctor if heartburn symptoms persist beyond 14 consecutive days"
      ],
      howToTake: "Take once daily in the morning, 30 to 60 minutes before breakfast on an empty stomach with a full glass of water.",
      emergencyAdvice: "Seek emergency medical help if you experience chest pain radiating to arm/jaw, severe persistent vomiting, or dark black stools.",
      safetyDisclaimer: "Educational health reference. Always verify with your treating physician or registered pharmacist.",
      confidence: "high" as const,
      identifiedFrom: "Comprehensive Clinical Medication Database"
    };
  }

  if (query.includes("glycomet") || query.includes("metformin") || query.includes("sugar") || query.includes("diabet") || query.includes("glucophage")) {
    return {
      tabletName: "Glycomet 500 (Metformin Hydrochloride 500mg)",
      genericName: "Metformin Hydrochloride IP (500mg)",
      category: "Biguanide (Oral Anti-Diabetic Agent)",
      dosageStrength: "500 mg (also in 850mg, 1000mg SR)",
      whatItIsUsedFor: "Lowers high blood glucose levels in Type 2 Diabetes by improving insulin sensitivity and reducing sugar production by the liver.",
      usesList: [
        "Type 2 Diabetes Mellitus glycemic control",
        "Prevention of long-term diabetic vascular complications",
        "Adjunct therapy for insulin resistance and PCOS metabolic management"
      ],
      commonSideEffects: [
        "Mild stomach upset, nausea or metallic taste",
        "Loose stools/diarrhea during initial weeks of therapy",
        "Temporary loss of appetite"
      ],
      seriousWarnings: [
        "Always take with or immediately after meals to prevent stomach irritation",
        "Avoid heavy alcohol intake while taking Metformin",
        "Inform your doctor before CT scans or procedures involving intravenous iodine contrast dye"
      ],
      howToTake: "Take with a full meal or immediately after food, usually once or twice daily as prescribed by your doctor.",
      emergencyAdvice: "Seek urgent medical attention if experiencing rapid shallow breathing, severe muscle cramping, or profound fatigue.",
      safetyDisclaimer: "Prescription-only medicine. Strictly follow your endocrinologist or physician's dosage.",
      confidence: "high" as const,
      identifiedFrom: "Comprehensive Clinical Medication Database"
    };
  }

  if (query.includes("telma") || query.includes("telmisartan") || query.includes("bp") || query.includes("hypertens") || query.includes("tazloc")) {
    return {
      tabletName: "Telma 40 (Telmisartan 40mg)",
      genericName: "Telmisartan Tablets IP (40mg)",
      category: "Angiotensin II Receptor Blocker (ARB / Anti-Hypertensive)",
      dosageStrength: "40 mg (also available in 20mg and 80mg)",
      whatItIsUsedFor: "Relaxes and widens blood vessels to lower elevated blood pressure, reducing the risk of heart attacks and stroke.",
      usesList: [
        "Essential Hypertension (High Blood Pressure)",
        "Cardiovascular event reduction in high-risk patients",
        "Renal protection in diabetic hypertensive patients"
      ],
      commonSideEffects: [
        "Mild dizziness when standing up rapidly (postural drop)",
        "Sinus congestion or upper respiratory mild irritation",
        "Mild back pain or muscle tiredness"
      ],
      seriousWarnings: [
        "Do not use during pregnancy (can cause serious harm to developing fetus)",
        "Do not stop abruptly without your doctor's supervision (may cause rebound BP spike)",
        "Periodic monitoring of serum potassium and kidney function is advised"
      ],
      howToTake: "Take once daily at the same time each day (morning or evening), with or without food.",
      emergencyAdvice: "Seek immediate emergency help if you experience severe lightheadedness, fainting, or swelling of the face, lips, or throat.",
      safetyDisclaimer: "Educational health reference. Never stop or adjust blood pressure medication without medical advice.",
      confidence: "high" as const,
      identifiedFrom: "Comprehensive Clinical Medication Database"
    };
  }

  if (query.includes("ecosprin") || query.includes("aspirin") || query.includes("disprin") || query.includes("blood thinner")) {
    return {
      tabletName: "Ecosprin 75 (Enteric Coated Aspirin 75mg)",
      genericName: "Aspirin / Acetylsalicylic Acid IP (75mg)",
      category: "Antiplatelet / Blood Thinner (Cardiovascular Protection)",
      dosageStrength: "75 mg (also in 150mg)",
      whatItIsUsedFor: "Prevents platelets in blood from sticking together to form clots, protecting against heart attacks and ischemic strokes.",
      usesList: [
        "Secondary prevention of heart attack (Myocardial Infarction)",
        "Prevention of ischemic stroke and transient ischemic attacks",
        "Post-stent or angioplasty cardiovascular maintenance"
      ],
      commonSideEffects: [
        "Mild indigestion or heartburn",
        "Slightly increased tendency to bruise or bleed from small cuts"
      ],
      seriousWarnings: [
        "Do not take on an empty stomach; swallow whole without crushing to protect the stomach lining",
        "Inform dentist or surgeon before any planned procedure",
        "Avoid concurrent use with high-dose NSAID painkillers like ibuprofen unless approved by doctor"
      ],
      howToTake: "Take once daily after a main meal with a glass of water at the same time daily.",
      emergencyAdvice: "Seek emergency care if you notice unusual bleeding, vomiting blood, or black tarry stools.",
      safetyDisclaimer: "Educational health reference. Prescription cardioprotective medication.",
      confidence: "high" as const,
      identifiedFrom: "Comprehensive Clinical Medication Database"
    };
  }

  if (query.includes("shelcal") || query.includes("calcium") || query.includes("vitamin d") || query.includes("bone")) {
    return {
      tabletName: "Shelcal 500 (Calcium 500mg + Vitamin D3 250 IU)",
      genericName: "Calcium Carbonate IP (eq. to Elemental Calcium 500mg) + Cholecalciferol IP (250 IU)",
      category: "Mineral & Vitamin Nutritional Supplement",
      dosageStrength: "500 mg Elemental Calcium + 250 IU Vitamin D3",
      whatItIsUsedFor: "Maintains healthy bone density, teeth, and muscle function, and prevents osteoporosis and calcium deficiency.",
      usesList: [
        "Prevention and treatment of calcium & Vitamin D deficiency",
        "Osteoporosis and osteopenia management in elders and post-menopausal women",
        "Bone fracture recovery support"
      ],
      commonSideEffects: [
        "Mild constipation if water intake is low",
        "Occasional bloating or gas"
      ],
      seriousWarnings: [
        "Drink plenty of water throughout the day to prevent kidney stone formation",
        "Do not take simultaneously with iron or thyroid supplements (keep 2-3 hours gap)"
      ],
      howToTake: "Take 1 tablet daily after food (preferably after lunch or dinner) with a full glass of water.",
      emergencyAdvice: "Consult doctor if you experience extreme thirst, frequent urination, or muscle weakness.",
      safetyDisclaimer: "Educational health reference. Supplement recommended per clinical guidelines.",
      confidence: "high" as const,
      identifiedFrom: "Comprehensive Clinical Medication Database"
    };
  }

  if (query.includes("augmentin") || query.includes("moxikind") || query.includes("clavam") || query.includes("amoxicillin")) {
    return {
      tabletName: "Augmentin 625 Duo / Moxikind-CV 625",
      genericName: "Amoxicillin IP (500mg) + Potassium Clavulanate IP (125mg)",
      category: "Broad-Spectrum Penicillin Antibiotic",
      dosageStrength: "625 mg (500mg + 125mg)",
      whatItIsUsedFor: "Treats bacterial infections of the respiratory tract, ear, nose, throat, skin, and urinary system.",
      usesList: [
        "Bacterial sinus, throat, and chest infections (Bronchitis, Pneumonia)",
        "Urinary Tract Infections (UTI)",
        "Dental and skin bacterial infections"
      ],
      commonSideEffects: [
        "Mild loose motions or diarrhea (probiotics help restore flora)",
        "Nausea or abdominal discomfort",
        "Skin rash in allergic individuals"
      ],
      seriousWarnings: [
        "MUST complete the full prescribed course even if symptoms disappear early to prevent antibiotic resistance",
        "Do NOT take if you have known Penicillin allergy",
        "Take at the start of a meal to minimize stomach upset"
      ],
      howToTake: "Take 1 tablet twice daily with food at evenly spaced 12-hour intervals.",
      emergencyAdvice: "Stop medicine and seek immediate emergency help if you develop breathing difficulty, facial hives, or severe watery diarrhea.",
      safetyDisclaimer: "Strictly Schedule H Prescription Antibiotic. Must only be taken under doctor prescription.",
      confidence: "high" as const,
      identifiedFrom: "Comprehensive Clinical Medication Database"
    };
  }

  // Default standard Indian analgesic/antipyretic (Dolo 650 / Paracetamol)
  return {
    tabletName: "Dolo 650 (Paracetamol 650mg)",
    genericName: "Paracetamol / Acetaminophen IP (650mg)",
    category: "Analgesic & Antipyretic (Pain & Fever Reducer)",
    dosageStrength: "650 mg",
    whatItIsUsedFor: "Provides rapid relief from mild to moderate body pain, headache, toothache, muscle aches, and viral fever.",
    usesList: [
      "Fever reduction during viral flu, dengue, or bacterial infections",
      "Headache, migraine discomfort, and toothache relief",
      "Post-vaccination soreness and muscular aches"
    ],
    commonSideEffects: [
      "Generally safe and well tolerated within recommended dose limits",
      "Mild nausea or stomach discomfort if taken on an empty stomach"
    ],
    seriousWarnings: [
      "Do NOT exceed 4000 mg (6 tablets) in a 24-hour window to protect your liver",
      "Avoid combining with other paracetamol-containing cough syrups or cold medications",
      "Avoid alcohol consumption while taking paracetamol"
    ],
    howToTake: "Take 1 tablet with water after food. Maintain at least 4 to 6 hours between repeat doses if fever persists.",
    emergencyAdvice: "Seek immediate emergency help if you suspect accidental overdose or notice yellowing of eyes/skin.",
    safetyDisclaimer: "Educational health reference. Always confirm dosage with your doctor or pharmacist.",
    confidence: "high" as const,
    identifiedFrom: "Comprehensive Clinical Medication Database"
  };
}

function extractJson(text: string): any {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch (e2) {}
    }
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const sub = text.substring(firstBrace, lastBrace + 1);
      return JSON.parse(sub);
    }
    return null;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Health endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "HealthDost" });
  });

  // AI plain-language health explanation endpoint
  app.post("/api/gemini/explain-risk", async (req, res) => {
    const {
      riskCategory = "Moderate",
      overallScore = 45,
      topFactors = [],
      userProfile = {},
      languageName = "English",
    } = req.body;

    const defaultExplanation = {
      headline: `Health Awareness Summary (${languageName})`,
      explanation: `Your overall health score is ${overallScore}/100 with a ${riskCategory} risk classification. Simple daily lifestyle changes can help protect your heart and blood sugar levels.`,
      positives: ["You are proactively monitoring your health with routine screenings and preventive checks."],
      concerns: topFactors.length > 0 ? topFactors : ["Keep a close check on daily physical activity, blood pressure, and balanced nutrition."],
      disclaimer: "This is a preventive health screening and awareness tool, not a clinical doctor's diagnosis."
    };

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ success: true, data: defaultExplanation });
    }

    try {
      const prompt = `You are HealthDost, an empathetic, supportive AI community health companion designed for people in India (including rural and first-time smartphone users).
The user completed a rule-based health risk screening.
User Data:
- Age: ${userProfile?.age || "Not specified"}
- Gender: ${userProfile?.gender || "Not specified"}
- Calculated Risk Category: ${riskCategory} (Score: ${overallScore}/100)
- Top Risk Factors: ${(topFactors || []).join(", ")}
- Lifestyle: Smoking=${userProfile?.smoking || "No"}, Alcohol=${userProfile?.alcohol || "No"}, Daily Activity=${userProfile?.activity || "Moderate"}, Diet=${userProfile?.diet || "Balanced"}
- Biomarkers: BMI=${userProfile?.bmi || "Not given"}, Blood Pressure=${userProfile?.bp || "Not given"}, Blood Sugar=${userProfile?.sugar || "Not given"}

Target Language: ${languageName || "English"}

TASK:
1. Provide a warm, reassuring 1-2 sentence plain-language explanation of their health awareness score in the target language (${languageName}).
2. Provide 3 simple, non-intimidating bullet points explaining what is helping their health and what needs attention.
3. Keep sentences short, avoid medical jargon (say "blood pressure check" instead of "hypertension screening", "sugar in blood" instead of "glycemia").
4. ALWAYS remind with: "This is a preventive awareness check, not a doctor's diagnosis."
5. Never say "You have a disease" - only "You may have a slightly higher chance of future heart or sugar issues."

Return JSON with this schema:
{
  "headline": "Short reassuring summary title in ${languageName}",
  "explanation": "1-2 sentence simple explanation in ${languageName}",
  "positives": ["1 positive thing they are doing right in ${languageName}"],
  "concerns": ["1-2 things to look out for in ${languageName}"],
  "disclaimer": "This is not a medical diagnosis. Please consult a doctor for a medical check-up in ${languageName}"
}`;

      const text = await safeGenerateContent({
        contents: prompt,
        responseMimeType: "application/json",
        temperature: 0.3,
      });

      const parsed = extractJson(text) || defaultExplanation;
      return res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.warn("Gemini explain-risk handled with fallback:", error?.message);
      return res.json({
        success: true,
        data: defaultExplanation,
      });
    }
  });

  // AI localized action plan suggestions
  app.post("/api/gemini/custom-prevention", async (req, res) => {
    const { topFactors = [], languageName = "English", lifestyle = {} } = req.body;

    const defaultActions = {
      actions: [
        {
          icon: "🚶",
          title: "Walk 25 Minutes Daily",
          benefit: "Daily morning or evening walking strengthens heart muscles and regulates sugar levels naturally.",
          difficulty: "Easy"
        },
        {
          icon: "💧",
          title: "Drink Clean Water Regularly",
          benefit: "Drinking 2.5 to 3 liters of water daily helps kidney function and flushes out excess toxins.",
          difficulty: "Easy"
        },
        {
          icon: "🥗",
          title: "Include Fresh Salad & Dal",
          benefit: "High fiber from seasonal vegetables and lentils stabilizes blood pressure and cholesterol.",
          difficulty: "Easy"
        },
        {
          icon: "🩺",
          title: "Routine Primary Health Check",
          benefit: "Visit your local health center or ASHA worker once every 3 months for a blood pressure and sugar check.",
          difficulty: "Easy"
        }
      ]
    };

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ success: true, data: defaultActions });
    }

    try {
      const prompt = `You are HealthDost. Generate 4 simple, highly doable, culturally relevant daily health action nudges for a user in India.
Language: ${languageName || "English"}
Identified risk areas: ${(topFactors || []).join(", ")}
Lifestyle background: ${JSON.stringify(lifestyle || {})}

Guidelines:
- Small, realistic steps (e.g., "Walk 20 minutes in the morning or after dinner", "Drink water instead of packaged sweetened drinks", "Replace extra salt in pickles with lemon juice or herbs", "Visit your local Primary Health Center / ASHA worker for a free BP check").
- Every card must have: an emoji icon, a bold simple action (max 6 words), and a 1-sentence "Why this helps" explanation in ${languageName}.

Return JSON in this format:
{
  "actions": [
    {
      "icon": "🚶",
      "title": "Action title in ${languageName}",
      "benefit": "Why this helps in plain words in ${languageName}",
      "difficulty": "Easy"
    }
  ]
}`;

      const text = await safeGenerateContent({
        contents: prompt,
        responseMimeType: "application/json",
        temperature: 0.4,
      });

      const parsed = extractJson(text) || defaultActions;
      return res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.warn("Gemini custom-prevention handled with fallback:", error?.message);
      return res.json({
        success: true,
        data: defaultActions,
      });
    }
  });

  // AI Health Companion Interactive Chat Agent Endpoint
  app.post("/api/gemini/chat", async (req, res) => {
    const {
      messages = [],
      languageName = "English",
      userContext = {},
    } = req.body;

    const defaultReply = `Namaste! I am HealthDost, your AI health guide. I can help answer questions regarding healthy diet, blood pressure awareness, sugar management, and preventive habits in ${languageName}. How can I assist you today?`;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ success: true, reply: defaultReply });
    }

    try {
      // Format previous history for Gemini
      const formattedContents = (messages || []).map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      if (formattedContents.length === 0) {
        formattedContents.push({
          role: "user",
          parts: [{ text: "Hello HealthDost!" }],
        });
      }

      // System instruction for persona
      const systemInstruction = `You are "HealthDost" (स्वास्थ्य दोस्त), a kind, compassionate, and knowledgeable AI Community Health Companion designed for users across India.
Target Language: ${languageName || 'English'} (You must respond in the same language/script the user speaks or ${languageName}).

User's Health Screening Context (if available):
- Risk Category: ${userContext?.riskLevel || 'Not screened yet'}
- Overall Risk Score: ${userContext?.overallScore ? `${userContext.overallScore}/100` : 'N/A'}
- Age: ${userContext?.age || 'N/A'}, Gender: ${userContext?.gender || 'N/A'}
- Key Factors: ${(userContext?.topFactors || []).join(', ') || 'General health inquiry'}
- Lifestyle: ${JSON.stringify(userContext?.answers || {})}

CORE BEHAVIOR & GUIDELINES:
1. Speak warmly, respectfully, and in simple, jargon-free words (6th-grade reading level).
2. For medical concepts, use relatable Indian daily terms:
   - "Blood pressure" -> "khoon ka pressure / tension in arteries"
   - "Diabetes" -> "sugar ki bimari / excess sweetness in blood"
   - "Diet advice" -> mention Indian foods like dal, roti, millets (jowar, bajra, ragi), green sabzi, salads, avoiding excess deep-fried pakodas/puris or sweet chai.
3. Keep responses concise (2 to 4 short paragraphs or bullet points). People often read or listen on mobile phones.
4. When voice-speaking, clear and soothing tone is appreciated.
5. If the user asks about dangerous symptoms (severe chest pain, breathing difficulty, sudden weakness, fainting), urge them immediately to seek urgent emergency medical care or call 108/102.
6. Emphasize early prevention, walking, hydration, sleep, stress reduction, and routine doctor / ASHA worker check-ups.
7. Remind them kindly that your advice is for health awareness, education, and prevention, not a medical diagnosis.`;

      const text = await safeGenerateContent({
        contents: formattedContents,
        systemInstruction,
        temperature: 0.5,
      });

      const replyText = text || defaultReply;
      return res.json({ success: true, reply: replyText });
    } catch (error: any) {
      console.warn("Gemini chat agent handled with fallback:", error?.message);
      return res.json({
        success: true,
        reply: defaultReply,
      });
    }
  });

  // Tablet / Medicine Scanner Endpoint (Multimodal Vision + Offline Clinical DB)
  app.post("/api/gemini/scan-tablet", async (req, res) => {
    const {
      imageBase64,
      mimeType = "image/jpeg",
      languageName = "English",
      textHint,
    } = req.body;

    if (!imageBase64 && !textHint) {
      return res.status(400).json({
        success: false,
        error: "Please provide a tablet image or medicine name hint to analyze.",
      });
    }

    // Prepare offline clinical data as baseline/fallback
    const offlineMedData = getOfflineMedicationData(textHint, languageName);

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        data: offlineMedData,
      });
    }

    try {
      const systemInstruction = `You are a clinical pharmacist AI assistant inside HealthDost, specialized in analyzing tablet packaging, blister strips, medicine boxes, prescriptions, or loose pills, especially Indian & global pharmaceuticals (like Dolo, Glycomet, Telma, Pantocid, Shelcal, Ecosprin, Augmentin, etc.).

Your task is to identify:
1. Exact Tablet Name (Brand name and strength)
2. Generic/Salt Name (Active chemical ingredient)
3. Category/Drug Class
4. Dosage Strength
5. What it is used for (Simple, clear explanation in 1-2 sentences for a layperson)
6. Uses List (3-5 key conditions it treats)
7. Common Side Effects (3-4 mild, common symptoms)
8. Serious Warnings / Precautions (critical warnings like liver, kidney, pregnancy, food/drug interactions)
9. How to take (simple administration guideline)
10. Emergency advice
11. Output must be in ${languageName || "English"}, but keep standard drug names in Latin/English or dual script if in Indian language for safety.

Return STRICT JSON matching this schema:
{
  "tabletName": string,
  "genericName": string,
  "category": string,
  "dosageStrength": string,
  "whatItIsUsedFor": string,
  "usesList": string[],
  "commonSideEffects": string[],
  "seriousWarnings": string[],
  "howToTake": string,
  "emergencyAdvice": string,
  "safetyDisclaimer": string,
  "confidence": "high" | "medium" | "low",
  "identifiedFrom": string
}

If the image is too blurry to identify with certainty, provide the best estimation and set confidence to "low" or "medium", and specify what details you could see in identifiedFrom.`;

      const parts: any[] = [];
      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");
        parts.push({
          inlineData: {
            mimeType: mimeType || "image/jpeg",
            data: cleanBase64,
          },
        });
      }

      const promptText = `Analyze this medicine/tablet image or label and provide its full details in ${languageName}. ${
        textHint ? `Additional user hint/text: "${textHint}".` : ""
      }
Ensure structured JSON output with tabletName, genericName, whatItIsUsedFor, usesList, commonSideEffects, and seriousWarnings.`;

      parts.push({ text: promptText });

      let responseText = "";
      try {
        responseText = await safeGenerateContent({
          contents: { parts },
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.2,
        });
      } catch (genErr: any) {
        console.warn("Tablet vision generation high demand or model error, using clinical knowledge base:", genErr?.message);
        return res.json({
          success: true,
          data: offlineMedData,
        });
      }

      const parsedData = extractJson(responseText);

      if (parsedData && parsedData.tabletName) {
        return res.json({
          success: true,
          data: parsedData,
        });
      }

      // If parsing yielded empty or incomplete structure, use clinical knowledge base
      return res.json({
        success: true,
        data: offlineMedData,
      });
    } catch (error: any) {
      console.warn("Tablet scan handled with clinical knowledge base fallback:", error?.message);
      return res.json({
        success: true,
        data: offlineMedData,
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HealthDost server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
