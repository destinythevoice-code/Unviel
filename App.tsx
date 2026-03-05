
import React, { useRef, useState, useEffect } from 'react';
import { Layout, TabType } from './components/Layout';
import { HomeView } from './components/HomeView';
import { VisionBoard, VisionBoardHandle } from './components/VisionBoard';
import { ProfileView } from './components/ProfileView';
import { UserRole, UserProfile } from './types';

const App: React.FC = () => {
  const visionBoardRef = useRef<VisionBoardHandle>(null);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('unveil_theme');
    return saved === 'dark';
  });
  
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('unveil_profile');
    return saved ? JSON.parse(saved) : {
      id: Math.random().toString(36).substr(2, 9),
      name: "Guest User",
      role: UserRole.BUYER,
      email: "guest@unveil.ai",
      location: "Atlanta, GA",
      bio: "Interested in finding the perfect fixer-upper."
    };
  });

  useEffect(() => {
    localStorage.setItem('unveil_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('unveil_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('unveil_theme', 'light');
    }
  }, [isDarkMode]);

  const handleSearch = (query: string) => {
    setActiveTab('search');
    setTimeout(() => {
      visionBoardRef.current?.triggerSearch(query);
    }, 100);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setProfile(updated);
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <Layout 
      onTabChange={handleTabChange} 
      activeTab={activeTab} 
      userName={profile.name}
      isDarkMode={isDarkMode}
      toggleTheme={toggleTheme}
    >
      {activeTab === 'home' && (
        <HomeView onSearch={handleSearch} onNavigate={handleTabChange} />
      )}

      {activeTab === 'profile' && (
        <ProfileView profile={profile} onUpdate={handleUpdateProfile} />
      )}

      {activeTab !== 'home' && activeTab !== 'profile' && (
        <VisionBoard 
          ref={visionBoardRef} 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
        />
      )}
    </Layout>
  );
};

export default App;
