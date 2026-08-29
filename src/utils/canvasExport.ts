import { RiskCalculationResult, UserAnswers, LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';

export function downloadHealthCardPNG(
  result: RiskCalculationResult,
  userAnswers: UserAnswers,
  language: LanguageCode
) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set high resolution card (800 x 1000)
  canvas.width = 800;
  canvas.height = 1000;

  // 1. Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 1000);
  bgGrad.addColorStop(0, '#FFFFFF');
  bgGrad.addColorStop(1, '#F0FDF4');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 800, 1000);

  // Outer border
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, 768, 968);

  // Top header banner
  ctx.fillStyle = '#065F46'; // Emerald 800
  ctx.fillRect(20, 20, 760, 120);

  // Header Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText('HealthDost • Health Awareness Card', 45, 75);

  ctx.fillStyle = '#A7F3D0';
  ctx.font = '18px sans-serif';
  ctx.fillText('Early Prevention & Wellness Guide for Community & Family', 45, 110);

  // Date and timestamp
  ctx.fillStyle = '#64748B';
  ctx.font = '16px sans-serif';
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  ctx.fillText(`Generated Date: ${dateStr}`, 45, 180);

  // Risk Score Box
  const riskBoxY = 210;
  let riskColor = '#10B981';
  let riskBg = '#ECFDF5';
  let riskLabel = 'LOW RISK';
  if (result.riskLevel === 'high') {
    riskColor = '#EF4444';
    riskBg = '#FEF2F2';
    riskLabel = 'HIGHER RISK (NEEDS ATTENTION)';
  } else if (result.riskLevel === 'moderate') {
    riskColor = '#F59E0B';
    riskBg = '#FFFBEB';
    riskLabel = 'MODERATE RISK';
  }

  ctx.fillStyle = riskBg;
  ctx.fillRect(45, riskBoxY, 710, 140);
  ctx.strokeStyle = riskColor;
  ctx.lineWidth = 3;
  ctx.strokeRect(45, riskBoxY, 710, 140);

  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('HEALTH AWARENESS SCORE', 70, riskBoxY + 45);

  ctx.fillStyle = riskColor;
  ctx.font = 'bold 48px sans-serif';
  ctx.fillText(`${result.overallScore}/100`, 70, riskBoxY + 105);

  ctx.fillStyle = '#1E293B';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(riskLabel, 260, riskBoxY + 95);

  // User Parameters Table
  const tableY = 380;
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('Summary of Reported Details', 45, tableY);

  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(45, tableY + 15, 710, 160);
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.strokeRect(45, tableY + 15, 710, 160);

  ctx.fillStyle = '#475569';
  ctx.font = '16px sans-serif';

  // Row 1
  ctx.fillText(`• Age: ${userAnswers.ageGroup || 'N/A'}`, 65, tableY + 50);
  ctx.fillText(`• Gender: ${userAnswers.gender || 'N/A'}`, 400, tableY + 50);

  // Row 2
  ctx.fillText(`• Activity: ${userAnswers.activityLevel || 'Moderate'}`, 65, tableY + 90);
  ctx.fillText(`• Smoking/Tobacco: ${userAnswers.smoking || 'Never'}`, 400, tableY + 90);

  // Row 3
  const bmiText = result.bmiValue ? `${result.bmiValue} kg/m²` : 'Skipped';
  ctx.fillText(`• BMI (Weight Meter): ${bmiText}`, 65, tableY + 130);
  ctx.fillText(`• Blood Pressure: ${userAnswers.bloodPressure || 'Unscreened'}`, 400, tableY + 130);

  // Prevention Guidance Box
  const planY = 580;
  ctx.fillStyle = '#065F46';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('Recommended Daily Prevention Actions', 45, planY);

  const actions = [
    '1. Walk 20 minutes daily after meals (morning or evening)',
    '2. Cut down extra salt, pickles, and salty packaged snacks',
    '3. Drink 6-8 glasses of water daily instead of sweet drinks',
    '4. Visit nearest Primary Health Centre (PHC) for BP & Sugar check',
  ];

  ctx.fillStyle = '#1E293B';
  ctx.font = '17px sans-serif';
  actions.forEach((act, idx) => {
    ctx.fillText(act, 65, planY + 40 + idx * 36);
  });

  // Doctor Review Section
  const docY = 770;
  ctx.fillStyle = '#F1F5F9';
  ctx.fillRect(45, docY, 710, 90);
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 1;
  ctx.strokeRect(45, docY, 710, 90);

  ctx.fillStyle = '#334155';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('Doctor / Primary Health Worker Review Notes:', 60, docY + 28);
  ctx.fillStyle = '#64748B';
  ctx.font = '14px sans-serif';
  ctx.fillText('BP: _______ / _______  |  Fasting Sugar: _______ mg/dL  |  Sign: ____________', 60, docY + 65);

  // Mandatory Safety Disclaimer Footer
  ctx.fillStyle = '#DC2626';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('⚠️ MANDATORY MEDICAL NOTICE:', 45, 900);

  ctx.fillStyle = '#475569';
  ctx.font = '13px sans-serif';
  ctx.fillText(
    'This is a non-diagnostic awareness heuristic for lifestyle prevention. It does NOT replace clinical evaluation.',
    45,
    925
  );
  ctx.fillText(
    'In case of emergency chest pain or shortness of breath, immediately call 108 or visit nearest hospital.',
    45,
    948
  );

  // Export to download trigger
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `HealthDost_Card_${dateStr.replace(/\s+/g, '_')}.png`;
  link.href = dataUrl;
  link.click();
}
