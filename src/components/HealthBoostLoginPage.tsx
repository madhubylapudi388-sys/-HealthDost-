import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Shield,
  Bot,
  Sparkles,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Activity,
  Apple,
  TrendingUp,
  MessageSquareHeart,
  ChevronRight,
  User,
  Stethoscope,
  X,
  Send,
  Check,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';
import { AppLogoIcon } from './AppLogo';

interface HealthBoostLoginPageProps {
  onSuccess: () => void;
  onOpenAiAgent?: () => void;
  onBackToApp?: () => void;
}

export const HealthBoostLoginPage: React.FC<HealthBoostLoginPageProps> = ({
  onSuccess,
  onOpenAiAgent,
  onBackToApp,
}) => {
  const { signIn, signUp, signInWithGoogle, signInAsGuest, resetPassword } = useAuth();

  // Mode: 'login' | 'signup'
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Input fields
  const [identifier, setIdentifier] = useState(''); // Email or Mobile
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // States
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Forgot Password Modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  // AI Feature detail modal
  const [selectedAiFeature, setSelectedAiFeature] = useState<{
    title: string;
    description: string;
    tag: string;
    details: string[];
    icon: React.ReactNode;
    color: string;
  } | null>(null);

  // Load remembered identifier on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('healthboost_remembered_user');
      if (savedUser) {
        setIdentifier(savedUser);
        setRememberMe(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!identifier.trim()) {
      setErrorMessage('Please enter your email or mobile number.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      if (rememberMe) {
        localStorage.setItem('healthboost_remembered_user', identifier.trim());
      } else {
        localStorage.removeItem('healthboost_remembered_user');
      }

      await signIn(identifier.trim(), password);
      setSuccessMessage('Welcome back! Logging you in...');
      setTimeout(() => {
        onSuccess();
      }, 500);
    } catch (err: any) {
      console.error('Login error:', err);
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
        setErrorMessage('Invalid email/mobile or password. Please verify and try again.');
      } else if (err.code === 'auth/too-many-requests') {
        setErrorMessage('Too many failed attempts. Please reset your password or wait a few minutes.');
      } else {
        setErrorMessage(err.message || 'Unable to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!identifier.trim()) {
      setErrorMessage('Please provide a valid email address or mobile number.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      if (rememberMe) {
        localStorage.setItem('healthboost_remembered_user', identifier.trim());
      }

      await signUp(identifier.trim(), password, fullName.trim(), selectedRole);
      setSuccessMessage('Account created successfully! Welcome to Health Boost.');
      setTimeout(() => {
        onSuccess();
      }, 600);
    } catch (err: any) {
      console.error('Sign up error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('An account with this email already exists. Please log in.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMessage('Password is too weak. Please use letters and numbers.');
      } else {
        setErrorMessage(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      setSuccessMessage('Signed in with Google!');
      setTimeout(() => {
        onSuccess();
      }, 500);
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      setErrorMessage('Google Sign-In cancelled or unavailable. You can continue as guest or use email.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGuestContinue = async () => {
    setErrorMessage(null);
    setGuestLoading(true);
    try {
      await signInAsGuest();
      onSuccess();
    } catch (err: any) {
      console.error('Guest login error:', err);
      setErrorMessage('Guest access encountered an issue. Please try again.');
    } finally {
      setGuestLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);

    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setForgotError('Please enter a valid email address.');
      return;
    }

    setForgotLoading(true);
    try {
      await resetPassword(forgotEmail.trim());
      setForgotSuccess(true);
    } catch (err: any) {
      console.error('Reset password error:', err);
      if (err.code === 'auth/user-not-found') {
        // For privacy/security, show sent message
        setForgotSuccess(true);
      } else {
        setForgotError(err.message || 'Unable to send reset email. Please try again.');
      }
    } finally {
      setForgotLoading(false);
    }
  };

  // 4 AI Feature Cards
  const aiFeatures = [
    {
      id: 'chat',
      title: 'AI Health Chat',
      description: 'Instant 24/7 symptom clarification and conversational clinical triage companion.',
      tag: 'Voice & Text',
      icon: <MessageSquareHeart className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
      bgLight: 'bg-blue-50 text-blue-700 border-blue-200',
      details: [
        'Voice-enabled conversational triage in 7 Indian languages',
        'Clinical symptom checking with emergency warning alerts',
        'Prescription reading & tablet identification assistance',
      ],
    },
    {
      id: 'insights',
      title: 'Personalized Health Insights',
      description: 'Predictive risk assessment for cardiovascular health, hypertension & diabetes.',
      tag: 'Predictive AI',
      icon: <Activity className="w-5 h-5" />,
      color: 'from-emerald-500 to-teal-500',
      bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      details: [
        'Non-invasive risk calculation based on WHO & ICMR epidemiological guidelines',
        'Personalized score breakdowns and risk factor radar analysis',
        'Targeted early prevention suggestions before chronic onset',
      ],
    },
    {
      id: 'diet',
      title: 'Smart Diet Suggestions',
      description: 'Culturally tailored nutritional advice, hydration reminders & sodium reduction.',
      tag: 'Nutrition AI',
      icon: <Apple className="w-5 h-5" />,
      color: 'from-amber-500 to-emerald-500',
      bgLight: 'bg-amber-50 text-amber-800 border-amber-200',
      details: [
        'Regional Indian diet adaptations (millet swaps, oil and salt moderation)',
        'Glycemic index awareness for pre-diabetic stability',
        'Actionable meal-timing nudges tailored to your lifestyle',
      ],
    },
    {
      id: 'habits',
      title: 'Health Habit Tracking',
      description: 'Daily activity streaks, medication reminders & gentle micro-habit nudges.',
      tag: 'Habit Engine',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'from-indigo-500 to-blue-600',
      bgLight: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      details: [
        'Progressive daily walking and hydration micro-commitments',
        'Encouraging streak milestones with downloadable health cards',
        'Exportable records for your doctor or ASHA community worker',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 relative overflow-x-hidden flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Background Decorative Ambient Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
        
        {/* Subtle decorative grid/cross symbols */}
        <div className="absolute top-12 right-12 text-blue-200/40 hidden lg:block">
          <Activity className="w-16 h-16 animate-pulse" />
        </div>
        <div className="absolute bottom-20 left-12 text-emerald-200/40 hidden lg:block">
          <Shield className="w-16 h-16" />
        </div>
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="transform hover:scale-105 transition-transform">
            <AppLogoIcon size="lg" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0284c7]">
                Health<span className="text-[#16a34a]">Dost</span> <span className="text-slate-800 font-extrabold text-base sm:text-lg">Boost</span>
              </h1>
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs">
                <Sparkles className="w-2.5 h-2.5 text-emerald-500" />
                AI Health
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Your AI Health Companion
            </p>
          </div>
        </div>

        {/* Top Right Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onBackToApp && (
            <button
              onClick={onBackToApp}
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Explore App
            </button>
          )}
          <button
            onClick={handleGuestContinue}
            disabled={guestLoading}
            className="text-xs sm:text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100/80 active:bg-blue-200 border border-blue-200/70 px-3.5 py-2 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            {guestLoading ? 'Connecting...' : 'Guest Access'}
          </button>
        </div>
      </header>

      {/* Main Content Area: Responsive Grid */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 w-full flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full max-w-6xl">
          
          {/* LEFT COLUMN: Hero & AI Feature Showcase (lg: 7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 flex flex-col justify-center space-y-6 sm:space-y-8"
          >
            {/* Value Proposition Badge */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs mb-3">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-slate-700">Next-Gen Intelligent Healthcare</span>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">v2.5 AI</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Empowering Your Wellness with <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">AI-Driven Care</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-xl leading-relaxed">
                Connect seamlessly with smart risk assessment, multimodal prescription scanning, regional dietary advice, and personalized 24/7 AI health guidance.
              </p>
            </div>

            {/* AI FEATURE PREVIEW SECTION */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-blue-100 text-blue-700">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                    Powered by AI Capabilities
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-400">Click to explore</span>
              </div>

              {/* 4 Feature Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {aiFeatures.map((feat, index) => (
                  <motion.div
                    key={feat.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => setSelectedAiFeature(feat)}
                    className="group relative bg-white hover:bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-md transition-all cursor-pointer text-left"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white bg-gradient-to-tr ${feat.color} shadow-xs group-hover:scale-110 transition-transform`}>
                        {feat.icon}
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                        {feat.tag}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors flex items-center justify-between">
                      <span>{feat.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </h4>

                    <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                      {feat.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Trust and Safety Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>End-to-End Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>WHO / ICMR Guideline Aligned</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-cyan-600" />
                <span>Multimodal Vision & Voice</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Modern Healthcare Login / Sign Up Card (lg: 5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 w-full"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-200/50 relative overflow-hidden">
              {/* Subtle top brand color accent line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-400" />

              {/* Mode Toggle Pills (Login / Sign Up) */}
              <div className="flex p-1 bg-slate-100/90 rounded-2xl mb-6 border border-slate-200/60">
                <button
                  type="button"
                  id="tab-btn-login"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    authMode === 'login'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </button>
                <button
                  type="button"
                  id="tab-btn-signup"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    authMode === 'signup'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Create Account</span>
                </button>
              </div>

              {/* Card Header Title */}
              <div className="mb-5">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {authMode === 'login' ? 'Welcome Back' : 'Join Health Boost'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {authMode === 'login'
                    ? 'Enter your credentials to access your health profile.'
                    : 'Get personalized insights and save your clinical history.'}
                </p>
              </div>

              {/* Error Alert */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                    <span className="flex-1 leading-snug">{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Alert */}
              <AnimatePresence>
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{successMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* MAIN FORM */}
              {authMode === 'login' ? (
                /* LOGIN FORM */
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Email / Mobile Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email or Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        {identifier.match(/^\+?[0-9]/) ? (
                          <Phone className="w-4 h-4" />
                        ) : (
                          <Mail className="w-4 h-4" />
                        )}
                      </div>
                      <input
                        id="login-identifier"
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="you@example.com or 9876543210"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-100 text-sm text-slate-900 placeholder:text-slate-400 outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(identifier.includes('@') ? identifier : '');
                          setForgotSuccess(false);
                          setForgotError(null);
                          setShowForgotModal(true);
                        }}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-11 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-100 text-sm text-slate-900 placeholder:text-slate-400 outline-hidden transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center justify-between pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        id="checkbox-remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded-md text-blue-600 border-slate-300 focus:ring-blue-500"
                      />
                      <span className="text-xs font-semibold text-slate-600">Remember Me</span>
                    </label>
                  </div>

                  {/* Large Modern Login Button */}
                  <button
                    id="btn-submit-login"
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:from-blue-800 active:to-blue-900 text-white font-extrabold text-sm shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transform active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Login to Health Boost</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* SIGN UP FORM */
                <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Dr. Priya Sharma / Amit Patel"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-100 text-sm text-slate-900 placeholder:text-slate-400 outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  {/* Email or Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email or Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-identifier"
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="you@example.com or 9876543210"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-100 text-sm text-slate-900 placeholder:text-slate-400 outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  {/* Role Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Account Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRole('patient')}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                          selectedRole === 'patient'
                            ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold shadow-2xs'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <User className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-[10px] leading-tight">Patient</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRole('asha_worker')}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                          selectedRole === 'asha_worker'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold shadow-2xs'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        <span className="text-[10px] leading-tight">ASHA Care</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRole('clinician')}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                          selectedRole === 'clinician'
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-800 font-bold shadow-2xs'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Stethoscope className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="text-[10px] leading-tight">Clinician</span>
                      </button>
                    </div>
                  </div>

                  {/* Password & Confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="signup-password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min 6 chars"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-blue-600 text-xs text-slate-900 outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Confirm
                      </label>
                      <div className="relative">
                        <input
                          id="signup-confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat pass"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-blue-600 text-xs text-slate-900 outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Create Account Submit */}
                  <button
                    id="btn-submit-signup"
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 hover:opacity-95 text-white font-extrabold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transform active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating Profile...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Sign Up</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* DIVIDER */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-slate-400 font-bold tracking-wider">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* SECONDARY AUTH BUTTONS */}
              <div className="space-y-2.5">
                {/* Continue with Google */}
                <button
                  id="btn-google-auth"
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm shadow-2xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 group"
                >
                  <svg className="w-4 h-4 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
                </button>

                {/* Continue as Guest */}
                <button
                  id="btn-guest-auth"
                  type="button"
                  onClick={handleGuestContinue}
                  disabled={guestLoading}
                  className="w-full py-2.5 px-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>{guestLoading ? 'Starting Session...' : 'Continue as Guest'}</span>
                </button>
              </div>

              {/* Bottom Switch Link */}
              <div className="mt-5 text-center">
                {authMode === 'login' ? (
                  <p className="text-xs text-slate-500">
                    Don’t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signup');
                        setErrorMessage(null);
                      }}
                      className="font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setErrorMessage(null);
                      }}
                      className="font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      Log In
                    </button>
                  </p>
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Modern Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Health Boost Platform • AI-Assisted Clinical Triage</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-800 cursor-pointer">Privacy Protocol</span>
          <span>•</span>
          <span className="hover:text-slate-800 cursor-pointer">Clinical Guidelines</span>
          <span>•</span>
          <span className="hover:text-slate-800 cursor-pointer">Help & FAQ</span>
        </div>
      </footer>

      {/* FORGOT PASSWORD MODAL */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xl relative"
            >
              <button
                onClick={() => setShowForgotModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Reset Your Password
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-4 leading-relaxed">
                Enter the email address registered with your Health Boost account and we’ll send you a password recovery link.
              </p>

              {forgotError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{forgotError}</span>
                </div>
              )}

              {forgotSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Reset Link Dispatched</span>
                  </div>
                  <p>
                    If an account exists for <span className="font-bold">{forgotEmail}</span>, a password reset link has been sent. Please check your inbox and spam folders.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="w-full mt-3 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 text-sm text-slate-900 outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {forgotLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Recovery Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI FEATURE DRILL-DOWN MODAL */}
      <AnimatePresence>
        {selectedAiFeature && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedAiFeature(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-gradient-to-tr ${selectedAiFeature.color} shadow-md`}>
                  {selectedAiFeature.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      {selectedAiFeature.title}
                    </h3>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                      {selectedAiFeature.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Health Boost Core AI Module
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                {selectedAiFeature.description}
              </p>

              <div className="space-y-2 mb-6">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Key Capabilities
                </h4>
                {selectedAiFeature.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{detail}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAiFeature(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Close
                </button>
                {onOpenAiAgent && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAiFeature(null);
                      onOpenAiAgent();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Bot className="w-4 h-4" />
                    <span>Try AI Assistant Now</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
