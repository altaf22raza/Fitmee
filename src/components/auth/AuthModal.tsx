import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { StorageService, DEFAULT_USER } from '../../services/storage';
import {
  X,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup';
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // OTP flow state
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'signup' && (!fullName.trim() || !email.trim())) {
      setErrorMsg('Please enter your full name and email address.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter a valid mobile number.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const code = '582914';
      setGeneratedOtp(code);
      setOtpStep(true);
      setSuccessMsg(`Verification code sent to ${phone} (Demo Code: ${code})`);
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (otpCode.trim() !== generatedOtp && otpCode.trim() !== '123456') {
      setErrorMsg('Invalid verification code. Please check and try again.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const existingUser = StorageService.getUser();
      const user: UserProfile = {
        ...existingUser,
        name: fullName || existingUser.name,
        email: email || existingUser.email,
        phone: phone || existingUser.phone
      };
      StorageService.saveUser(user);
      StorageService.setAuthenticated(true);
      onSuccess(user);
      onClose();
    }, 500);
  };

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMsg('Please provide your full name.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const existingUser = StorageService.getUser();
      const user: UserProfile = {
        ...existingUser,
        name: mode === 'signup' ? fullName : existingUser.name,
        email: email.trim(),
        phone: phone || existingUser.phone
      };
      StorageService.saveUser(user);
      StorageService.setAuthenticated(true);
      onSuccess(user);
      onClose();
    }, 500);
  };

  const handleInstantDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      StorageService.saveUser(DEFAULT_USER);
      StorageService.setAuthenticated(true);
      onSuccess(DEFAULT_USER);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E4E9F2] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 pb-4 bg-gradient-to-b from-[#F5F7FC] to-white border-b border-[#F1F4F9]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#101C3A] text-white flex items-center justify-center font-bold text-sm">
                F
              </div>
              <span className="text-base font-bold text-[#101C3A]">
                Fit<span className="text-[#3569FF]">Me</span> Account
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1 bg-[#E4E9F2]/60 p-1 rounded-xl mt-5">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setOtpStep(false);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-[#101C3A] shadow-xs'
                  : 'text-[#66738D] hover:text-[#101C3A]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setOtpStep(false);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-white text-[#101C3A] shadow-xs'
                  : 'text-[#66738D] hover:text-[#101C3A]'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 pt-4 space-y-4">
          {errorMsg && (
            <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Login Method Toggle (Password vs OTP) */}
          {mode === 'login' && !otpStep && (
            <div className="flex items-center justify-end text-xs text-[#66738D]">
              <button
                type="button"
                onClick={() => setLoginMethod(loginMethod === 'password' ? 'otp' : 'password')}
                className="text-[#3569FF] hover:underline font-medium"
              >
                {loginMethod === 'password' ? 'Login via Mobile OTP' : 'Login via Password'}
              </button>
            </div>
          )}

          {otpStep ? (
            /* OTP Verification Screen */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1 text-center py-2">
                <ShieldCheck className="w-8 h-8 text-[#3569FF] mx-auto" />
                <h3 className="text-sm font-bold text-[#101C3A]">Enter Verification Code</h3>
                <p className="text-xs text-[#66738D]">
                  Enter the 6-digit code sent to your mobile phone
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="e.g. 582914"
                  className="w-full text-center text-xl tracking-widest font-mono py-2.5 px-4 bg-[#F5F7FC] border border-[#E4E9F2] rounded-xl focus:border-[#3569FF] focus:bg-white outline-hidden font-bold"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[#66738D]">
                <button
                  type="button"
                  onClick={() => setOtpStep(false)}
                  className="hover:text-[#101C3A]"
                >
                  Change phone number
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOtpCode('582914');
                    setSuccessMsg('Filled demo code: 582914');
                  }}
                  className="text-[#3569FF] font-medium hover:underline"
                >
                  Use Demo OTP
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#3569FF] hover:bg-[#2554db] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </button>
            </form>
          ) : loginMethod === 'otp' ? (
            /* OTP Phone Input Form */
            <form onSubmit={handleSendOtp} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-[#101C3A] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Altaf Raza"
                      className="w-full text-xs py-2.5 px-3 bg-[#F5F7FC] border border-[#E4E9F2] rounded-xl focus:border-[#3569FF] focus:bg-white outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#101C3A] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="altaf33raza@gmail.com"
                      className="w-full text-xs py-2.5 px-3 bg-[#F5F7FC] border border-[#E4E9F2] rounded-xl focus:border-[#3569FF] focus:bg-white outline-hidden"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-[#101C3A] mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full text-xs py-2.5 pl-9 pr-3 bg-[#F5F7FC] border border-[#E4E9F2] rounded-xl focus:border-[#3569FF] focus:bg-white outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#3569FF] hover:bg-[#2554db] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Sending code...' : 'Send Verification OTP'}
              </button>
            </form>
          ) : (
            /* Email & Password Form */
            <form onSubmit={handleSubmitPassword} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-[#101C3A] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Altaf Raza"
                    className="w-full text-xs py-2.5 px-3 bg-[#F5F7FC] border border-[#E4E9F2] rounded-xl focus:border-[#3569FF] focus:bg-white outline-hidden"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#101C3A] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-xs py-2.5 pl-9 pr-3 bg-[#F5F7FC] border border-[#E4E9F2] rounded-xl focus:border-[#3569FF] focus:bg-white outline-hidden"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-[#101C3A] mb-1">
                    Mobile Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 234-5678"
                      className="w-full text-xs py-2.5 pl-9 pr-3 bg-[#F5F7FC] border border-[#E4E9F2] rounded-xl focus:border-[#3569FF] focus:bg-white outline-hidden"
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-[#101C3A]">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setErrorMsg('Password reset link sent to registered email.')}
                      className="text-[11px] text-[#3569FF] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs py-2.5 pl-9 pr-9 bg-[#F5F7FC] border border-[#E4E9F2] rounded-xl focus:border-[#3569FF] focus:bg-white outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-[#101C3A] mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs py-2.5 pl-9 pr-3 bg-[#F5F7FC] border border-[#E4E9F2] rounded-xl focus:border-[#3569FF] focus:bg-white outline-hidden"
                    />
                  </div>
                </div>
              )}

              {mode === 'login' && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#E4E9F2] text-[#3569FF] focus:ring-[#3569FF]"
                  />
                  <label htmlFor="remember" className="text-xs text-[#66738D]">
                    Remember me on this browser
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#3569FF] hover:bg-[#2554db] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading
                  ? 'Processing...'
                  : mode === 'login'
                  ? 'Sign In to FitMe'
                  : 'Complete Registration'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Mode Login for instant evaluation */}
          <div className="pt-3 border-t border-[#F1F4F9]">
            <button
              type="button"
              onClick={handleInstantDemoLogin}
              className="w-full py-2 px-3 bg-[#F5F7FC] hover:bg-[#E4E9F2] text-[#101C3A] border border-[#E4E9F2] rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#3569FF]" />
              <span>Instant Test Drive with Demo Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
