import React from 'react';
import { X, FileText, CheckCircle, AlertTriangle, ShieldCheck, Activity, Dna, Download } from 'lucide-react';
import { RiskCalculationResult, UserAnswers, LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/languages';

interface DetailedReportModalProps {
  result: RiskCalculationResult;
  userAnswers: UserAnswers;
  language: LanguageCode;
  onClose: () => void;
  onPrint: () => void;
}

export const DetailedReportModal: React.FC<DetailedReportModalProps> = ({
  result,
  userAnswers,
  language,
  onClose,
  onPrint,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="fixed inset-0 z-50 bg-[#33332d]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-[#ffffff] rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-[#e5e5df] my-6 animate-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#edece4]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#5a5a40] text-white flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cultural text-lg sm:text-xl font-extrabold text-[#33332d] leading-tight">
                Detailed Technical Health Audit
              </h2>
              <p className="text-xs text-[#7a7960] font-medium">
                Rule-Based Clinical Risk Breakdown & Input Audit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#7a7960] hover:text-[#33332d] bg-[#edece4] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="overflow-y-auto py-4 space-y-6 flex-1 pr-1">
          {/* Risk Metrics Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-[#faf9f5] p-3 rounded-2xl border border-[#e5e5df] text-center">
              <div className="text-[11px] font-bold text-[#7a7960] uppercase">
                Overall Score
              </div>
              <div className="text-2xl font-black text-[#33332d] mt-1 font-cultural">
                {result.overallScore}
                <span className="text-xs text-[#7a7960] font-normal">/100</span>
              </div>
              <div className="text-[11px] font-bold text-[#285037] uppercase mt-0.5">
                {result.riskLevel} Risk
              </div>
            </div>

            <div className="bg-[#faf9f5] p-3 rounded-2xl border border-[#e5e5df] text-center">
              <div className="text-[11px] font-bold text-[#7a7960] uppercase">
                Diabetes Index
              </div>
              <div className="text-2xl font-black text-[#92400e] mt-1 font-cultural">
                {result.diabetesScore}
                <span className="text-xs text-[#7a7960] font-normal">/100</span>
              </div>
              <div className="text-[11px] font-semibold text-[#7a7960] mt-0.5">
                Glucose Factor
              </div>
            </div>

            <div className="bg-[#faf9f5] p-3 rounded-2xl border border-[#e5e5df] text-center">
              <div className="text-[11px] font-bold text-[#7a7960] uppercase">
                Cardio Index
              </div>
              <div className="text-2xl font-black text-[#9a3412] mt-1 font-cultural">
                {result.heartScore}
                <span className="text-xs text-[#7a7960] font-normal">/100</span>
              </div>
              <div className="text-[11px] font-semibold text-[#7a7960] mt-0.5">
                Vascular Load
              </div>
            </div>
          </div>

          {/* Raw User Inputs Audit Table */}
          <div className="border border-[#e5e5df] rounded-2xl overflow-hidden">
            <div className="bg-[#edece4] px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#5a5a40]">
              User Submitted Parameters
            </div>
            <div className="divide-y divide-[#edece4] text-xs sm:text-sm">
              <div className="grid grid-cols-2 px-4 py-2.5 bg-[#ffffff]">
                <span className="font-semibold text-[#7a7960]">Age Bracket</span>
                <span className="font-bold text-[#33332d] capitalize">
                  {userAnswers.ageGroup || 'Not provided'}
                </span>
              </div>
              <div className="grid grid-cols-2 px-4 py-2.5 bg-[#faf9f5]">
                <span className="font-semibold text-[#7a7960]">Biological Sex</span>
                <span className="font-bold text-[#33332d] capitalize">
                  {userAnswers.gender || 'Not specified'}
                </span>
              </div>
              <div className="grid grid-cols-2 px-4 py-2.5 bg-[#ffffff]">
                <span className="font-semibold text-[#7a7960]">Physical Activity</span>
                <span className="font-bold text-[#33332d] capitalize">
                  {userAnswers.activityLevel || 'Moderate'}
                </span>
              </div>
              <div className="grid grid-cols-2 px-4 py-2.5 bg-[#faf9f5]">
                <span className="font-semibold text-[#7a7960]">Tobacco / Smoking</span>
                <span className="font-bold text-[#33332d] capitalize">
                  {userAnswers.smoking || 'Never'}
                </span>
              </div>
              <div className="grid grid-cols-2 px-4 py-2.5 bg-[#ffffff]">
                <span className="font-semibold text-[#7a7960]">Alcohol Intake</span>
                <span className="font-bold text-[#33332d] capitalize">
                  {userAnswers.alcohol || 'Never'}
                </span>
              </div>
              <div className="grid grid-cols-2 px-4 py-2.5 bg-[#faf9f5]">
                <span className="font-semibold text-[#7a7960]">Diet Type</span>
                <span className="font-bold text-[#33332d] capitalize">
                  {userAnswers.dietQuality || 'Balanced'}
                </span>
              </div>
              <div className="grid grid-cols-2 px-4 py-2.5 bg-[#ffffff]">
                <span className="font-semibold text-[#7a7960]">Calculated BMI</span>
                <span className="font-bold text-[#33332d]">
                  {result.bmiValue ? `${result.bmiValue} kg/m² (${result.bmiCategory})` : 'Skipped by user'}
                </span>
              </div>
              <div className="grid grid-cols-2 px-4 py-2.5 bg-[#faf9f5]">
                <span className="font-semibold text-[#7a7960]">Blood Pressure History</span>
                <span className="font-bold text-[#33332d] capitalize">
                  {userAnswers.bloodPressure || 'Unscreened'}
                </span>
              </div>
              <div className="grid grid-cols-2 px-4 py-2.5 bg-[#ffffff]">
                <span className="font-semibold text-[#7a7960]">Blood Sugar History</span>
                <span className="font-bold text-[#33332d] capitalize">
                  {userAnswers.bloodSugar || 'Unscreened'}
                </span>
              </div>
            </div>
          </div>

          {/* Factor Weight Matrix */}
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#5a5a40] mb-2 font-cultural">
              Contributing Factors (Transparent Weight Matrix)
            </div>
            <div className="space-y-2">
              {result.topRiskFactors.map((f) => (
                <div
                  key={f.id}
                  className="p-3 bg-[#faf9f5] rounded-xl border border-[#e5e5df] flex items-center justify-between text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span>{f.icon}</span>
                    <span className="font-bold text-[#33332d]">{f.title}</span>
                  </div>
                  <span className="font-black text-[#9a3412] bg-[#fff1ec] px-2 py-0.5 rounded-md border border-[#fdba74]">
                    +{f.impactPoints} pts
                  </span>
                </div>
              ))}
              {result.protectiveFactors.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-[#eef5f0] rounded-xl border border-[#c2ded0] flex items-center justify-between text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span>{p.icon}</span>
                    <span className="font-bold text-[#285037]">{p.title}</span>
                  </div>
                  <span className="font-black text-[#285037] bg-white px-2 py-0.5 rounded-md border border-[#c2ded0]">
                    {p.impactPoints} pts (Protective)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Disclaimer in Report */}
          <div className="p-3 bg-[#fef3c7]/70 rounded-xl border border-[#fde68a] text-xs text-[#92400e] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
            <span>
              <strong>Clinical Note:</strong> This summary is an epidemiological awareness heuristic designed for early lifestyle prevention and primary care triage. It is not an invasive diagnostic tool.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#edece4] flex items-center justify-between gap-3">
          <button
            onClick={onPrint}
            className="py-2.5 px-4 rounded-xl bg-[#5a5a40] hover:bg-[#434330] text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Summary Report</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl border border-[#deded3] hover:bg-[#edece4] text-[#33332d] font-bold text-xs sm:text-sm cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
