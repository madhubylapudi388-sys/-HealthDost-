import React, { useEffect, useState } from 'react';
import {
  FileText,
  Calendar,
  Activity,
  Heart,
  TrendingDown,
  Trash2,
  AlertTriangle,
  User,
  Shield,
  ArrowRight,
  Sparkles,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StoredAssessment } from '../types/auth';
import {
  getUserAssessments,
  getAllAssessmentsForWorker,
  deleteAssessment,
} from '../services/dbService';
import { LanguageCode } from '../types';

interface HealthHistoryDashboardProps {
  language: LanguageCode;
  onBackToHome: () => void;
  onOpenAuthModal: () => void;
}

export const HealthHistoryDashboard: React.FC<HealthHistoryDashboardProps> = ({
  language,
  onBackToHome,
  onOpenAuthModal,
}) => {
  const { user, userProfile, updateRole } = useAuth();
  const [assessments, setAssessments] = useState<StoredAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'high' | 'moderate' | 'low'>('all');

  const isHealthWorker =
    userProfile?.role === 'asha_worker' || userProfile?.role === 'clinician';

  const loadData = async () => {
    if (!user) {
      setAssessments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (isHealthWorker) {
        const records = await getAllAssessmentsForWorker();
        setAssessments(records);
      } else {
        const records = await getUserAssessments(user.uid);
        setAssessments(records);
      }
    } catch (error) {
      console.error('Failed to load assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user, userProfile?.role]);

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (window.confirm('Delete this assessment record from your history?')) {
      await deleteAssessment(id);
      setAssessments((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const filteredAssessments = assessments.filter((item) => {
    const matchSearch =
      item.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.plainLanguageSummary?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRisk = roleFilter === 'all' || item.riskLevel === roleFilter;
    return matchSearch && matchRisk;
  });

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 flex flex-col animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="w-full bg-[#ffffff] rounded-3xl p-5 sm:p-7 border border-[#e5e5df] shadow-xs mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-[#edece4] text-[#5a5a40]">
                <FileText className="w-5 h-5" />
              </span>
              <h1 className="font-cultural text-xl sm:text-2xl font-extrabold text-[#33332d]">
                {isHealthWorker ? 'Clinical Assessments & Registry' : 'My Saved Health Records'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#66655c]">
              {isHealthWorker
                ? `Authorized as ${
                    userProfile?.role === 'asha_worker' ? 'ASHA Community Worker' : 'Clinician'
                  } — Cloud database synchronized`
                : 'Persistent cloud history of your diabetes and heart risk checkups'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!user ? (
              <button
                onClick={onOpenAuthModal}
                className="px-4 py-2 rounded-xl bg-[#5a5a40] hover:bg-[#434330] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Sign In to Save History
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {/* Switcher Role Simulator */}
                <select
                  value={userProfile?.role || 'patient'}
                  onChange={(e) => updateRole(e.target.value as any)}
                  className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-[#e5e5df] bg-[#faf9f5] text-[#33332d] cursor-pointer"
                  title="Simulate Role Authorization"
                >
                  <option value="patient">Role: Citizen (Self only)</option>
                  <option value="asha_worker">Role: ASHA Worker (Community)</option>
                  <option value="clinician">Role: Clinician (Full Access)</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Not Logged In Prompt */}
      {!user && (
        <div className="w-full bg-[#faf9f5] rounded-3xl p-6 sm:p-8 border border-dashed border-[#e5e5df] text-center mb-6">
          <Shield className="w-10 h-10 text-[#7a7960] mx-auto mb-2" />
          <h3 className="text-base font-bold text-[#33332d] mb-1">
            Cloud Persistence & History
          </h3>
          <p className="text-xs text-[#66655c] max-w-md mx-auto mb-4">
            Sign in or create a free account to securely store your risk scores, BMI logs, and lifestyle action progress across devices in Firestore.
          </p>
          <button
            onClick={onOpenAuthModal}
            className="px-6 py-2.5 rounded-xl bg-[#5a5a40] hover:bg-[#434330] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            Sign In or Register Now
          </button>
        </div>
      )}

      {/* Logged in View */}
      {user && (
        <>
          {/* Filter & Search Bar */}
          <div className="w-full bg-[#ffffff] rounded-2xl p-3 border border-[#e5e5df] shadow-xs mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#7a7960] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search assessments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#e5e5df] bg-[#faf9f5] focus:bg-[#ffffff] text-[#33332d] outline-hidden"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              <span className="text-xs font-semibold text-[#7a7960] shrink-0">Filter:</span>
              {(['all', 'low', 'moderate', 'high'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setRoleFilter(lvl)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize ${
                    roleFilter === lvl
                      ? 'bg-[#5a5a40] text-white shadow-xs'
                      : 'bg-[#faf9f5] hover:bg-[#edece4] text-[#55554d] border border-[#e5e5df]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* List of Assessments */}
          {loading ? (
            <div className="py-12 text-center text-xs font-bold text-[#7a7960]">
              Loading database records from Firestore...
            </div>
          ) : filteredAssessments.length === 0 ? (
            <div className="w-full bg-[#ffffff] rounded-3xl p-8 border border-[#e5e5df] text-center">
              <Activity className="w-8 h-8 text-[#7a7960] mx-auto mb-2" />
              <h3 className="text-sm font-bold text-[#33332d] mb-1">No Assessments Found</h3>
              <p className="text-xs text-[#66655c] mb-4">
                You have not completed or saved any health check assessments yet.
              </p>
              <button
                onClick={onBackToHome}
                className="px-4 py-2 rounded-xl bg-[#5a5a40] text-white text-xs font-bold"
              >
                Start New Health Check
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAssessments.map((record) => {
                const isLow = record.riskLevel === 'low';
                const isMod = record.riskLevel === 'moderate';
                const isHigh = record.riskLevel === 'high';

                const badgeBg = isLow
                  ? 'bg-[#eef5f0] text-[#285037] border-[#c2ded0]'
                  : isMod
                  ? 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]'
                  : 'bg-[#fff1ec] text-[#9a3412] border-[#fdba74]';

                const formattedDate = new Date(record.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={record.id}
                    className="w-full bg-[#ffffff] rounded-2xl p-4 border border-[#e5e5df] hover:border-[#5a5a40] shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-extrabold text-sm border shrink-0 ${badgeBg}`}
                      >
                        <span>{record.overallScore}</span>
                        <span className="text-[9px] uppercase font-bold tracking-tighter">
                          {record.riskLevel}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#33332d]">
                            {record.patientName || 'Health Checkup'}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeBg}`}
                          >
                            {record.riskLevel.toUpperCase()} RISK
                          </span>
                        </div>

                        <p className="text-xs text-[#66655c] mt-0.5 line-clamp-1">
                          {record.plainLanguageSummary}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-[#7a7960] mt-1.5 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formattedDate}
                          </span>
                          {record.bmiValue && (
                            <span>BMI: {record.bmiValue.toFixed(1)} ({record.bmiCategory})</span>
                          )}
                          {isHealthWorker && record.userEmail && (
                            <span className="text-[#5a5a40]">ID: {record.userId.slice(0, 6)}...</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="p-2 rounded-xl text-[#7a7960] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Bottom Home Action */}
      <div className="mt-6 text-center">
        <button
          onClick={onBackToHome}
          className="px-5 py-2.5 rounded-2xl bg-[#edece4] hover:bg-[#deded3] text-[#33332d] font-bold text-xs transition-all cursor-pointer"
        >
          ← Back to Main Health Check
        </button>
      </div>
    </div>
  );
};
