import React, { useState } from 'react';
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  Printer,
  Smartphone,
  ShieldCheck,
  Heart,
  QrCode,
} from 'lucide-react';
import { RiskCalculationResult, LanguageCode, UserAnswers } from '../types';
import { TRANSLATIONS } from '../data/languages';

interface ShareModalProps {
  result: RiskCalculationResult;
  userAnswers: UserAnswers;
  language: LanguageCode;
  onClose: () => void;
  onDownloadCanvas: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  result,
  userAnswers,
  language,
  onClose,
  onDownloadCanvas,
}) => {
  const [copied, setCopied] = useState(false);
  const t = TRANSLATIONS[language];

  const shareText = `🏥 *HealthDost Preventive Health Card*
Risk Level: ${result.riskLevel.toUpperCase()} (Score: ${result.overallScore}/100)
Top Factors: ${result.topRiskFactors.map((f) => f.title).join(', ')}
Prevention Steps:
1. Daily 20m Walking
2. Reduce excess salt & pickles
3. Check BP & Sugar at local clinic

⚠️ Not a medical diagnosis. Please consult a qualified doctor.`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Clipboard write failed');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'HealthDost Health Awareness Card',
          text: shareText,
          url: window.location.href,
        });
      } catch (e) {
        console.warn('Native share cancelled or failed');
      }
    } else {
      handleCopyText();
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#33332d]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-[#ffffff] rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-[#e5e5df] animate-in zoom-in-95 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#edece4] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#5a5a40]/10 text-[#5a5a40] flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cultural font-extrabold text-[#33332d] text-base sm:text-lg leading-tight">
                Share Health Card
              </h3>
              <p className="text-xs text-[#7a7960] font-medium">
                With family, doctor, or ASHA worker
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#7a7960] hover:text-[#33332d] bg-[#edece4] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Preview of the Card */}
        <div
          id="printable-summary-card"
          className="p-4 rounded-2xl bg-gradient-to-b from-[#faf9f5] to-[#f5f5f0] border border-[#e5e5df] mb-4 text-[#33332d]"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#edece4]">
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-[#f27d26] fill-[#f27d26]" />
              <span className="font-cultural font-bold text-sm text-[#33332d]">HealthDost Card</span>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                result.riskLevel === 'low'
                  ? 'bg-[#eef5f0] text-[#285037] border border-[#c2ded0]'
                  : result.riskLevel === 'moderate'
                  ? 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a]'
                  : 'bg-[#fff1ec] text-[#9a3412] border border-[#fdba74]'
              }`}
            >
              {result.riskLevel} Risk ({result.overallScore}/100)
            </span>
          </div>

          <div className="py-2.5 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#7a7960] font-medium">Top Focus Areas:</span>
              <span className="font-bold text-[#33332d] text-right">
                {result.topRiskFactors.slice(0, 2).map((f) => f.title).join(', ') || 'General Wellness'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7a7960] font-medium">Weight Meter (BMI):</span>
              <span className="font-bold text-[#33332d]">
                {result.bmiValue ? `${result.bmiValue} kg/m²` : 'Not recorded'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7a7960] font-medium">Recommended Action:</span>
              <span className="font-bold text-[#285037]">
                Daily 20m Walk & PHC Check
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#edece4] flex items-center justify-between text-[10px] text-[#7a7960] font-medium">
            <span>Non-diagnostic triage guide</span>
            <span className="font-bold text-[#5a5a40]">Scan / Consult Doctor</span>
          </div>
        </div>

        {/* Share Action Buttons */}
        <div className="space-y-2.5">
          {/* WhatsApp Direct Share */}
          <button
            id="share-whatsapp-btn"
            onClick={handleWhatsAppShare}
            className="w-full py-3 px-4 rounded-xl bg-[#285037] hover:bg-[#1e3c29] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <span>💬 Share via WhatsApp</span>
          </button>

          {/* Download Image Card */}
          <button
            id="share-download-image-btn"
            onClick={onDownloadCanvas}
            className="w-full py-2.5 px-4 rounded-xl bg-[#5a5a40] hover:bg-[#434330] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Card Image (PNG)</span>
          </button>

          {/* Copy Text Summary / Print */}
          <div className="grid grid-cols-2 gap-2">
            <button
              id="share-copy-text-btn"
              onClick={handleCopyText}
              className="py-2.5 px-3 rounded-xl border border-[#deded3] bg-[#faf9f5] hover:bg-[#edece4] text-[#33332d] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#285037]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>

            <button
              id="share-print-btn"
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-xl border border-[#deded3] bg-[#faf9f5] hover:bg-[#edece4] text-[#33332d] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#7a7960]" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Safety footer */}
        <div className="mt-4 pt-3 border-t border-[#edece4] text-[11px] text-[#7a7960] text-center">
          {t.disclaimerShort}
        </div>
      </div>
    </div>
  );
};
