import React, { useState } from 'react';
import { UserProfile, AvatarConfig } from '../types';
import { StorageService } from '../services/storage';
import {
  User,
  Mail,
  Phone,
  Ruler,
  Lock,
  Trash2,
  RotateCcw,
  LogOut,
  Save,
  Check,
  ShieldCheck,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface ProfilePageProps {
  user: UserProfile;
  avatarConfig: AvatarConfig;
  onUpdateUser: (user: UserProfile) => void;
  onLogout: () => void;
  onRouteChange: (route: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  avatarConfig,
  onUpdateUser,
  onLogout,
  onRouteChange
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [heightCm, setHeightCm] = useState(user.heightCm || 175);
  const [genderPref, setGenderPref] = useState(user.gender);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name,
      email,
      phone,
      heightCm,
      gender: genderPref
    };
    StorageService.saveUser(updated);
    onUpdateUser(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordSuccess('Password successfully updated!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(''), 3000);
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset all saved measurements, outfits, and avatar to demo defaults?')) {
      StorageService.resetToDemoData();
      window.location.reload();
    }
  };

  return (
    <div className="py-8 md:py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#3569FF]">
          <span>Account Settings</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#66738D]">Preferences & Biometric Security</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#101C3A]">Profile & Settings</h1>
        <p className="text-xs sm:text-sm text-[#66738D]">
          Manage your personal details, calibration preferences, and account security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: User Summary Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E4E9F2] shadow-xs p-6 space-y-5 text-center">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-[#101C3A] text-white flex items-center justify-center text-3xl font-extrabold mx-auto shadow-md">
              {user.name.charAt(0)}
            </div>
            <div className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-white" title="Active">
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <h2 className="text-base font-bold text-[#101C3A]">{user.name}</h2>
            <p className="text-xs text-[#66738D]">{user.email}</p>
          </div>

          <div className="pt-4 border-t border-[#F1F4F9] text-xs text-[#66738D] space-y-2 text-left">
            <div className="flex justify-between">
              <span>Stature:</span>
              <span className="font-semibold text-[#101C3A]">{user.heightCm} cm</span>
            </div>
            <div className="flex justify-between">
              <span>Fit Preference:</span>
              <span className="font-semibold text-[#101C3A] capitalize">{user.gender}</span>
            </div>
            <div className="flex justify-between">
              <span>Member Since:</span>
              <span className="font-semibold text-[#101C3A]">{user.createdAt}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F1F4F9] space-y-2">
            <button
              onClick={() => onRouteChange('avatar')}
              className="w-full py-2.5 px-3 bg-[#F5F7FC] hover:bg-[#E4E9F2] text-[#101C3A] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#3569FF]" />
              <span>Configure 3D Avatar</span>
            </button>
            <button
              onClick={onLogout}
              className="w-full py-2 px-3 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Right Column: Profile Edit & Security Forms */}
        <div className="lg:col-span-8 space-y-6">
          {/* Edit Profile Form */}
          <div className="bg-white rounded-3xl border border-[#E4E9F2] shadow-xs p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F4F9]">
              <h2 className="text-sm font-bold text-[#101C3A]">Personal & Sizing Information</h2>
              {saveSuccess && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved successfully</span>
                </span>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#101C3A] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs py-2.5 px-3 bg-[#F5F7FC] border border-[#E4E9F2] rounded-xl focus:border-[#3569FF] outline-hidden font-medium"
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
                    className="w-full text-xs py-2.5 px-3 bg-[#F5F7FC] border border-[#E4E9F2] rounded-xl focus:border-[#3569FF] outline-hidden font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#101C3A] mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs py-2.5 px-3 bg-[#F5F7FC] border border-[#E4E9F2] rounded-xl focus:border-[#3569FF] outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#101C3A] mb-1">
                    Calibrated Height (cm)
                  </label>
                  <input
                    type="number"
                    min={120}
                    max={240}
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full text-xs py-2.5 px-3 bg-[#F5F7FC] border border-[#E4E9F2] rounded-xl focus:border-[#3569FF] outline-hidden font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#101C3A] mb-1.5">
                  Apparel Styling Category Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['unisex', 'menswear', 'womenswear'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGenderPref(g)}
                      className={`py-2 text-xs font-medium rounded-xl border capitalize transition-colors ${
                        genderPref === g
                          ? 'border-[#3569FF] bg-blue-50/50 text-[#101C3A] font-bold'
                          : 'border-[#E4E9F2] bg-[#F5F7FC] text-[#66738D]'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#3569FF] hover:bg-[#2554db] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-3xl border border-[#E4E9F2] shadow-xs p-6 sm:p-8 space-y-5">
            <h2 className="text-sm font-bold text-[#101C3A] pb-3 border-b border-[#F1F4F9]">
              Change Password
            </h2>

            {passwordError && (
              <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl">
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#101C3A] mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs py-2.5 px-3 bg-[#F5F7FC] border border-[#E4E9F2] rounded-xl outline-hidden focus:border-[#3569FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#101C3A] mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs py-2.5 px-3 bg-[#F5F7FC] border border-[#E4E9F2] rounded-xl outline-hidden focus:border-[#3569FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#101C3A] mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs py-2.5 px-3 bg-[#F5F7FC] border border-[#E4E9F2] rounded-xl outline-hidden focus:border-[#3569FF]"
                  />
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#101C3A] hover:bg-[#1E293B] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

          {/* Danger Zone & Reset */}
          <div className="bg-white rounded-3xl border border-rose-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-700">
              <AlertTriangle className="w-4 h-4" />
              <h2 className="text-xs font-bold uppercase tracking-wider">Data Management</h2>
            </div>
            <p className="text-xs text-[#66738D]">
              Reset demo data or purge local biometric cache to return to initial factory settings.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetDemoData}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#101C3A] text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default Demo State</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
