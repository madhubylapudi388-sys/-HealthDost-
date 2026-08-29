import { UserAnswers, RiskCalculationResult, RiskFactorItem, RiskLevel } from '../types';

export function calculateRisk(answers: UserAnswers): RiskCalculationResult {
  // Unconditional emergency check
  if (answers.hasEmergencySymptoms) {
    return {
      overallScore: 100,
      riskLevel: 'high',
      diabetesScore: 0,
      heartScore: 0,
      bmiValue: null,
      bmiCategory: null,
      topRiskFactors: [],
      protectiveFactors: [],
      plainLanguageSummary: 'Emergency medical attention required immediately.',
      isEmergency: true,
    };
  }

  let totalPoints = 0;
  let diabetesPoints = 0;
  let heartPoints = 0;

  const topRiskFactors: RiskFactorItem[] = [];
  const protectiveFactors: RiskFactorItem[] = [];

  // 1. Age
  if (answers.ageGroup === 'above60') {
    totalPoints += 25;
    diabetesPoints += 20;
    heartPoints += 28;
    topRiskFactors.push({
      id: 'age_senior',
      title: 'Age 60+ Years',
      description: 'Blood vessels naturally stiffen with age and metabolism slows down.',
      icon: '⏳',
      severity: 'high',
      impactPoints: 25,
    });
  } else if (answers.ageGroup === '46to60') {
    totalPoints += 18;
    diabetesPoints += 16;
    heartPoints += 18;
    topRiskFactors.push({
      id: 'age_mid',
      title: 'Age 46–60 Years',
      description: 'Metabolic changes start becoming common during this age range.',
      icon: '⏳',
      severity: 'moderate',
      impactPoints: 18,
    });
  } else if (answers.ageGroup === '30to45') {
    totalPoints += 8;
    diabetesPoints += 8;
    heartPoints += 8;
  } else if (answers.ageGroup === 'under30') {
    protectiveFactors.push({
      id: 'young_age',
      title: 'Young Age (<30 years)',
      description: 'Your younger age gives you strong natural cardiovascular resilience.',
      icon: '🌱',
      severity: 'positive',
      impactPoints: -5,
    });
  }

  // 2. Physical Activity
  if (answers.activityLevel === 'low') {
    totalPoints += 16;
    diabetesPoints += 18;
    heartPoints += 16;
    topRiskFactors.push({
      id: 'sedentary',
      title: 'Low Daily Movement',
      description: 'Sitting most of the day reduces natural blood sugar absorption and slows circulation.',
      icon: '🪑',
      severity: 'high',
      impactPoints: 16,
    });
  } else if (answers.activityLevel === 'moderate') {
    totalPoints += 6;
    diabetesPoints += 6;
    heartPoints += 6;
  } else if (answers.activityLevel === 'active') {
    protectiveFactors.push({
      id: 'active_movement',
      title: 'Daily Active Movement',
      description: 'Walking 30+ minutes daily helps regulate glucose and strengthens your heart muscle.',
      icon: '🚶',
      severity: 'positive',
      impactPoints: -10,
    });
  }

  // 3. Habits: Smoking & Tobacco
  if (answers.smoking === 'regular') {
    totalPoints += 20;
    heartPoints += 25;
    topRiskFactors.push({
      id: 'smoking_regular',
      title: 'Regular Tobacco / Smoking',
      description: 'Nicotine and smoke constrict blood vessels and increase plaque build-up.',
      icon: '🚭',
      severity: 'high',
      impactPoints: 20,
    });
  } else if (answers.smoking === 'occasional') {
    totalPoints += 8;
    heartPoints += 10;
    topRiskFactors.push({
      id: 'smoking_occasional',
      title: 'Occasional Tobacco Use',
      description: 'Even occasional smoke harms arterial lining over time.',
      icon: '🚬',
      severity: 'moderate',
      impactPoints: 8,
    });
  } else if (answers.smoking === 'never') {
    protectiveFactors.push({
      id: 'no_tobacco',
      title: 'Tobacco-Free Lifestyle',
      description: 'Keeping clear of smoke keeps your lungs and arteries clean.',
      icon: '🫁',
      severity: 'positive',
      impactPoints: -5,
    });
  }

  // Alcohol
  if (answers.alcohol === 'regular') {
    totalPoints += 10;
    heartPoints += 12;
    topRiskFactors.push({
      id: 'alcohol_regular',
      title: 'Regular Alcohol Consumption',
      description: 'Frequent alcohol can elevate resting blood pressure and strain the liver.',
      icon: '🍷',
      severity: 'moderate',
      impactPoints: 10,
    });
  }

  // Diet
  if (answers.dietQuality === 'high_salt') {
    totalPoints += 10;
    heartPoints += 14;
    topRiskFactors.push({
      id: 'diet_salt',
      title: 'High Salt & Pickles in Food',
      description: 'Excess sodium makes the body retain fluid, raising pressure inside blood vessels.',
      icon: '🧂',
      severity: 'moderate',
      impactPoints: 10,
    });
  } else if (answers.dietQuality === 'oily_sweet') {
    totalPoints += 10;
    diabetesPoints += 14;
    topRiskFactors.push({
      id: 'diet_sweet',
      title: 'Frequent Sweets & Fried Snacks',
      description: 'Refined sugar and trans fats trigger rapid insulin spikes and weight gain.',
      icon: '🍩',
      severity: 'moderate',
      impactPoints: 10,
    });
  } else if (answers.dietQuality === 'balanced') {
    protectiveFactors.push({
      id: 'diet_home',
      title: 'Simple Home-Cooked Meals',
      description: 'Wholesome lentils, vegetables, and grains provide essential fiber and steady energy.',
      icon: '🥗',
      severity: 'positive',
      impactPoints: -5,
    });
  }

  // 4. Family History
  let famPoints = 0;
  if (answers.familyHistory.diabetes) {
    famPoints += 12;
    diabetesPoints += 20;
    topRiskFactors.push({
      id: 'fam_diabetes',
      title: 'Family History of Diabetes',
      description: 'Having a parent or sibling with high blood sugar doubles genetic predisposition.',
      icon: '🩸',
      severity: 'moderate',
      impactPoints: 12,
    });
  }
  if (answers.familyHistory.heartDisease) {
    famPoints += 14;
    heartPoints += 20;
    topRiskFactors.push({
      id: 'fam_heart',
      title: 'Family History of Heart Trouble',
      description: 'Early heart conditions in family members warrant regular preventive check-ups.',
      icon: '❤️',
      severity: 'moderate',
      impactPoints: 14,
    });
  }
  if (answers.familyHistory.highBP) {
    famPoints += 8;
    heartPoints += 12;
    topRiskFactors.push({
      id: 'fam_bp',
      title: 'Family History of High Blood Pressure',
      description: 'Tendency towards high blood pressure often runs in families.',
      icon: '🩺',
      severity: 'moderate',
      impactPoints: 8,
    });
  }
  totalPoints += Math.min(famPoints, 26);

  // 5. BMI calculation
  let bmiValue: number | null = null;
  let bmiCategory: 'underweight' | 'normal' | 'overweight' | 'obese' | null = null;

  if (answers.heightCm && answers.weightKg && !answers.bmiSkipped) {
    const heightInMeters = answers.heightCm / 100;
    bmiValue = Number((answers.weightKg / (heightInMeters * heightInMeters)).toFixed(1));

    if (bmiValue < 18.5) {
      bmiCategory = 'underweight';
      totalPoints += 4;
    } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
      bmiCategory = 'normal';
      protectiveFactors.push({
        id: 'bmi_healthy',
        title: `Healthy Weight (BMI ${bmiValue})`,
        description: 'Your body weight is well balanced with your height.',
        icon: '⚖️',
        severity: 'positive',
        impactPoints: -5,
      });
    } else if (bmiValue >= 25 && bmiValue <= 29.9) {
      bmiCategory = 'overweight';
      totalPoints += 10;
      diabetesPoints += 12;
      heartPoints += 10;
      topRiskFactors.push({
        id: 'bmi_overweight',
        title: `Above Recommended Weight (BMI ${bmiValue})`,
        description: 'Extra body weight places added load on joints, heart, and pancreas.',
        icon: '⚖️',
        severity: 'moderate',
        impactPoints: 10,
      });
    } else if (bmiValue >= 30) {
      bmiCategory = 'obese';
      totalPoints += 18;
      diabetesPoints += 20;
      heartPoints += 18;
      topRiskFactors.push({
        id: 'bmi_obese',
        title: `High Body Weight (BMI ${bmiValue})`,
        description: 'Significantly elevated weight is strongly linked with insulin resistance.',
        icon: '⚖️',
        severity: 'high',
        impactPoints: 18,
      });
    }
  }

  // 6. Blood Pressure
  if (answers.bloodPressure === 'high') {
    totalPoints += 18;
    heartPoints += 24;
    topRiskFactors.push({
      id: 'bp_elevated',
      title: 'Known High Blood Pressure',
      description: 'Persistent high pressure strains blood vessels and requires regular doctor monitoring.',
      icon: '🩺',
      severity: 'high',
      impactPoints: 18,
    });
  } else if (answers.bloodPressure === 'normal') {
    protectiveFactors.push({
      id: 'bp_healthy',
      title: 'Normal Blood Pressure',
      description: 'Your heart is pumping at healthy resting pressure levels.',
      icon: '💓',
      severity: 'positive',
      impactPoints: -5,
    });
  }

  // 7. Blood Sugar
  if (answers.bloodSugar === 'high') {
    totalPoints += 20;
    diabetesPoints += 30;
    topRiskFactors.push({
      id: 'sugar_elevated',
      title: 'Known High Blood Sugar',
      description: 'Elevated glucose requires dietary guidance and routine physician review.',
      icon: '🩸',
      severity: 'high',
      impactPoints: 20,
    });
  } else if (answers.bloodSugar === 'normal') {
    protectiveFactors.push({
      id: 'sugar_healthy',
      title: 'Normal Blood Sugar Level',
      description: 'Your glucose regulation is currently in a safe range.',
      icon: '🌟',
      severity: 'positive',
      impactPoints: -5,
    });
  }

  // Clamp scores between 5 and 95
  const overallScore = Math.min(Math.max(totalPoints, 6), 96);
  const diabetesScore = Math.min(Math.max(diabetesPoints, 5), 95);
  const heartScore = Math.min(Math.max(heartPoints, 5), 95);

  let riskLevel: RiskLevel = 'low';
  if (overallScore >= 60) {
    riskLevel = 'high';
  } else if (overallScore >= 30) {
    riskLevel = 'moderate';
  } else {
    riskLevel = 'low';
  }

  // Sort top factors by impact
  topRiskFactors.sort((a, b) => b.impactPoints - a.impactPoints);

  // Generate plain language summary
  let plainLanguageSummary = '';
  if (riskLevel === 'low') {
    plainLanguageSummary = 'Your current lifestyle and risk profile look encouraging! Small daily habits can keep your heart and body strong for years.';
  } else if (riskLevel === 'moderate') {
    const factorNames = topRiskFactors.slice(0, 2).map((f) => f.title.toLowerCase());
    plainLanguageSummary = `You may have a moderate chance of future health issues, mainly influenced by ${factorNames.join(' and ') || 'daily routine factors'}. Small prevention steps can bring this right down.`;
  } else {
    const factorNames = topRiskFactors.slice(0, 2).map((f) => f.title.toLowerCase());
    plainLanguageSummary = `Your answers suggest several risk factors including ${factorNames.join(' and ') || 'lifestyle elements'}. We recommend speaking with a local doctor or ASHA worker for a simple check-up.`;
  }

  return {
    overallScore,
    riskLevel,
    diabetesScore,
    heartScore,
    bmiValue,
    bmiCategory,
    topRiskFactors: topRiskFactors.slice(0, 4),
    protectiveFactors: protectiveFactors.slice(0, 3),
    plainLanguageSummary,
    isEmergency: false,
  };
}
