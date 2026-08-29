import { LanguageCode, RiskLevel, UserAnswers, RiskFactorItem } from '../types';

export type UserRole = 'patient' | 'asha_worker' | 'clinician';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  phoneNumber?: string;
  preferredLanguage?: LanguageCode;
}

export interface StoredAssessment {
  id?: string;
  userId: string;
  userEmail?: string;
  patientName: string;
  overallScore: number;
  riskLevel: RiskLevel;
  diabetesScore: number;
  heartScore: number;
  bmiValue: number | null;
  bmiCategory: string | null;
  answers: UserAnswers;
  topRiskFactors: RiskFactorItem[];
  plainLanguageSummary: string;
  createdAt: string;
  notes?: string;
}
