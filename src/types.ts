export type LanguageCode = 'en' | 'hi' | 'te' | 'ta' | 'bn' | 'mr' | 'kn';

export interface LanguageOption {
  code: LanguageCode;
  nativeName: string;
  englishName: string;
  flagOrSymbol: string;
  speechCode: string;
}

export type RiskLevel = 'low' | 'moderate' | 'high';

export interface UserAnswers {
  hasEmergencySymptoms?: boolean;
  emergencyType?: string;
  ageGroup: 'under30' | '30to45' | '46to60' | 'above60' | '';
  gender: 'male' | 'female' | 'other' | '';
  activityLevel: 'active' | 'moderate' | 'low' | '';
  smoking: 'never' | 'occasional' | 'regular' | '';
  alcohol: 'never' | 'occasional' | 'regular' | '';
  dietQuality: 'balanced' | 'oily_sweet' | 'high_salt' | '';
  familyHistory: {
    diabetes: boolean;
    heartDisease: boolean;
    highBP: boolean;
    noneOrUnsure: boolean;
  };
  weightKg?: number;
  heightCm?: number;
  bmiSkipped?: boolean;
  bloodPressure: 'normal' | 'high' | 'unknown' | '';
  bloodSugar: 'normal' | 'high' | 'unknown' | '';
}

export interface RiskFactorItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  severity: 'low' | 'moderate' | 'high' | 'positive';
  impactPoints: number;
}

export interface RiskCalculationResult {
  overallScore: number; // 0 - 100
  riskLevel: RiskLevel;
  diabetesScore: number; // 0 - 100
  heartScore: number; // 0 - 100
  bmiValue: number | null;
  bmiCategory: 'underweight' | 'normal' | 'overweight' | 'obese' | null;
  topRiskFactors: RiskFactorItem[];
  protectiveFactors: RiskFactorItem[];
  plainLanguageSummary: string;
  isEmergency: boolean;
}

export interface ActionPlanItem {
  id: string;
  icon: string;
  title: string;
  benefit: string;
  category: 'diet' | 'activity' | 'checkup' | 'habit';
  difficulty: 'Very Easy' | 'Easy' | 'Moderate';
  remindEnabled?: boolean;
}

export interface SampleProfile {
  id: string;
  name: string;
  ageAndGender: string;
  riskLevel: RiskLevel;
  badge: string;
  tagline: string;
  answers: UserAnswers;
}

export interface ScannedTabletInfo {
  tabletName: string;
  genericName: string;
  category: string;
  dosageStrength: string;
  whatItIsUsedFor: string;
  usesList: string[];
  commonSideEffects: string[];
  seriousWarnings: string[];
  howToTake: string;
  emergencyAdvice: string;
  safetyDisclaimer: string;
  confidence: 'high' | 'medium' | 'low';
  identifiedFrom: string;
  scannedAt?: string;
  imageUrl?: string;
}

export type ClinicFacilityType =
  | 'all'
  | 'phc'
  | 'arogya_mandir'
  | 'chc'
  | 'district_hospital'
  | 'jan_aushadhi'
  | 'private_clinic';

export interface NearbyClinic {
  id: string;
  name: string;
  type: 'phc' | 'arogya_mandir' | 'chc' | 'district_hospital' | 'jan_aushadhi' | 'private_clinic' | 'diagnostic';
  typeLabel: string;
  address: string;
  locality: string;
  city?: string;
  state?: string;
  distanceKm: number;
  lat: number;
  lng: number;
  phone?: string;
  emergencyPhone?: string;
  isOpenNow: boolean;
  timing: string;
  rating?: number;
  reviewCount?: number;
  isGovt: boolean;
  isAyushmanAccepted: boolean;
  isEmergency24x7: boolean;
  services: string[];
  doctorAvailable: string;
  freeServices: string[];
  directionsUrl: string;
  badge?: string;
}

export interface UserLocationState {
  coords: {
    lat: number;
    lng: number;
  } | null;
  accuracy: number | null;
  localityName: string | null;
  isLoading: boolean;
  error: string | null;
  permissionGranted: boolean;
  isManualFallback: boolean;
}

