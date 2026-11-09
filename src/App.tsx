import React, { useState, useEffect } from 'react';
import { UserProfile, AvatarConfig, MeasurementRecord, SavedOutfit } from './types';
import { StorageService, DEFAULT_USER, DEFAULT_AVATAR_CONFIG } from './services/storage';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/auth/AuthModal';

// Pages
import { HomePage } from './pages/HomePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { AboutPage } from './pages/AboutPage';
import { DashboardPage } from './pages/DashboardPage';
import { MeasurementPage } from './pages/MeasurementPage';
import { AvatarPage } from './pages/AvatarPage';
import { TryOnStudioPage } from './pages/TryOnStudioPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(DEFAULT_AVATAR_CONFIG);
  const [measurements, setMeasurements] = useState<MeasurementRecord[]>([]);
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);

  // Auth modal
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Load persistent state on mount
  useEffect(() => {
    const auth = StorageService.isAuthenticated();
    setIsAuthenticated(auth);
    if (auth) {
      setCurrentUser(StorageService.getUser());
    } else {
      setCurrentUser(DEFAULT_USER);
    }
    setAvatarConfig(StorageService.getAvatarConfig());
    setMeasurements(StorageService.getMeasurements());
    setSavedOutfits(StorageService.getOutfits());
  }, []);

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: UserProfile) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setAvatarConfig(user.avatarConfig || DEFAULT_AVATAR_CONFIG);
    setCurrentRoute('dashboard');
  };

  const handleLogout = () => {
    StorageService.setAuthenticated(false);
    setIsAuthenticated(false);
    setCurrentRoute('home');
  };

  const handleRouteChange = (route: string) => {
    // If route requires auth and not authenticated, open login
    const protectedRoutes = ['dashboard', 'profile'];
    if (protectedRoutes.includes(route) && !isAuthenticated) {
      handleOpenAuth('login');
      return;
    }
    setCurrentRoute(route);
  };

  const handleSaveMeasurement = (record: MeasurementRecord) => {
    StorageService.saveMeasurement(record);
    const updated = StorageService.getMeasurements();
    setMeasurements(updated);
  };

  const handleDeleteMeasurement = (id: string) => {
    StorageService.deleteMeasurement(id);
    const updated = StorageService.getMeasurements();
    setMeasurements(updated);
  };

  const handleSaveOutfit = (outfit: SavedOutfit) => {
    StorageService.saveOutfit(outfit);
    const updated = StorageService.getOutfits();
    setSavedOutfits(updated);
  };

  const handleDeleteOutfit = (id: string) => {
    StorageService.deleteOutfit(id);
    const updated = StorageService.getOutfits();
    setSavedOutfits(updated);
  };

  const handleUpdateAvatarConfig = (config: AvatarConfig) => {
    setAvatarConfig(config);
    StorageService.saveAvatarConfig(config);
  };

  const handleUpdateUser = (user: UserProfile) => {
    setCurrentUser(user);
    StorageService.saveUser(user);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FC] text-[#15213D]">
      {/* Sticky Responsive Header */}
      <Navbar
        currentRoute={currentRoute}
        onRouteChange={handleRouteChange}
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <HomePage
            avatarConfig={avatarConfig}
            onRouteChange={handleRouteChange}
            onOpenAuth={handleOpenAuth}
            isAuthenticated={isAuthenticated}
          />
        )}

        {currentRoute === 'how-it-works' && (
          <HowItWorksPage
            onRouteChange={handleRouteChange}
            onOpenAuth={handleOpenAuth}
            isAuthenticated={isAuthenticated}
          />
        )}

        {currentRoute === 'features' && (
          <FeaturesPage
            onRouteChange={handleRouteChange}
            onOpenAuth={handleOpenAuth}
            isAuthenticated={isAuthenticated}
          />
        )}

        {currentRoute === 'about' && (
          <AboutPage
            onRouteChange={handleRouteChange}
            onOpenAuth={handleOpenAuth}
            isAuthenticated={isAuthenticated}
          />
        )}

        {currentRoute === 'dashboard' && currentUser && (
          <DashboardPage
            user={currentUser}
            measurements={measurements}
            savedOutfits={savedOutfits}
            avatarConfig={avatarConfig}
            onRouteChange={handleRouteChange}
          />
        )}

        {currentRoute === 'measure' && (
          <MeasurementPage
            user={currentUser || DEFAULT_USER}
            onSaveRecord={handleSaveMeasurement}
            onRouteChange={handleRouteChange}
          />
        )}

        {currentRoute === 'avatar' && (
          <AvatarPage
            avatarConfig={avatarConfig}
            onUpdateAvatarConfig={handleUpdateAvatarConfig}
            onRouteChange={handleRouteChange}
          />
        )}

        {currentRoute === 'try-on' && (
          <TryOnStudioPage
            avatarConfig={avatarConfig}
            latestMeasurements={measurements[0]?.measurements}
            onSaveOutfit={handleSaveOutfit}
            onRouteChange={handleRouteChange}
          />
        )}

        {currentRoute === 'history' && (
          <HistoryPage
            measurements={measurements}
            savedOutfits={savedOutfits}
            onDeleteMeasurement={handleDeleteMeasurement}
            onDeleteOutfit={handleDeleteOutfit}
            onRouteChange={handleRouteChange}
          />
        )}

        {currentRoute === 'profile' && currentUser && (
          <ProfilePage
            user={currentUser}
            avatarConfig={avatarConfig}
            onUpdateUser={handleUpdateUser}
            onLogout={handleLogout}
            onRouteChange={handleRouteChange}
          />
        )}
      </main>

      {/* Premium Footer */}
      <Footer onRouteChange={handleRouteChange} />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
