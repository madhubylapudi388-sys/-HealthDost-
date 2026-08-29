import React, { useState } from 'react';
import { X, LogIn, UserPlus, Shield, User, Stethoscope, Heart, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';
import { LanguageCode } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  language,
  initialMode = 'signin',
}) => {
  const { signIn, signUp, signInAsGuest } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email.trim(), password);
        setSuccessMsg('Signed in successfully!');
      } else {
        if (!name.trim()) {
          setError('Please provide your name or title.');
          setLoading(false);
          return;
        }
        await signUp(email.trim(), password, name.trim(), role);
        setSuccessMsg('Account registered successfully!');
      }
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please check your credentials.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'Authentication error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInAsGuest();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Guest login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="auth-modal-card"
        className="w-full max-w-md glass-modal rounded-3xl p-6 sm:p-7 relative shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-white/80 transition-colors cursor-pointer border border-transparent hover:border-white/80"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/80 text-slate-800 flex items-center justify-center mx-auto mb-3 shadow-xs border border-white/80">
            {mode === 'signin' ? <LogIn className="w-6 h-6 text-sky-600" /> : <Shield className="w-6 h-6 text-teal-600" />}
          </div>
          <h2 className="font-cultural text-xl sm:text-2xl font-extrabold text-slate-900">
            {mode === 'signin' ? 'Sign In to HealthDost' : 'Create an Account'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {mode === 'signin'
              ? 'Access saved health records & clinical assessments'
              : 'Save long-term health history & track cardiovascular risk'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-white/50 p-1 rounded-2xl border border-white/80 mb-5 shadow-2xs backdrop-blur-xs">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-white text-slate-900 shadow-xs border border-white/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-slate-900 shadow-xs border border-white/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error / Success Feedback */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-300 text-red-700 text-xs font-semibold flex items-center gap-2 backdrop-blur-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2 backdrop-blur-xs">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name / Title
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Rajesh Kumar / Sunita Devi"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-slate-900 outline-hidden transition-all placeholder:text-slate-400"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-slate-900 outline-hidden transition-all placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-slate-900 outline-hidden transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Role selection for Authorization */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Account Type & Permissions
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  className={`p-2 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    role === 'patient'
                      ? 'border-2 border-slate-800 bg-white/90 text-slate-900 font-bold shadow-xs'
                      : 'border border-white/80 bg-white/40 text-slate-600 hover:bg-white/70'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="text-[11px] leading-tight">Patient / Citizen</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('asha_worker')}
                  className={`p-2 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    role === 'asha_worker'
                      ? 'border-2 border-rose-500 bg-rose-50/90 text-rose-950 font-bold shadow-xs'
                      : 'border border-white/80 bg-white/40 text-slate-600 hover:bg-white/70'
                  }`}
                >
                  <Heart className="w-4 h-4 text-rose-600" />
                  <span className="text-[11px] leading-tight">ASHA Worker</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('clinician')}
                  className={`p-2 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    role === 'clinician'
                      ? 'border-2 border-emerald-500 bg-emerald-50/90 text-emerald-950 font-bold shadow-xs'
                      : 'border border-white/80 bg-white/40 text-slate-600 hover:bg-white/70'
                  }`}
                >
                  <Stethoscope className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] leading-tight">Clinician / Doctor</span>
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-black hover:to-slate-900 active:scale-98 text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 border border-white/20"
          >
            {loading
              ? 'Processing...'
              : mode === 'signin'
              ? 'Sign In to Account'
              : 'Complete Registration'}
          </button>
        </form>

        {/* Guest fallback option */}
        <div className="mt-4 pt-4 border-t border-slate-200/60 text-center">
          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={loading}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 hover:underline cursor-pointer"
          >
            Continue as Guest Citizen without password →
          </button>
        </div>
      </div>
    </div>
  );
};
