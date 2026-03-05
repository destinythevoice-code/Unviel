
import React from 'react';

export type TabType = 'home' | 'renovate' | 'search' | 'contractors' | 'saved' | 'profile';

interface LayoutProps {
  children: React.ReactNode;
  onTabChange: (tab: TabType) => void;
  activeTab: TabType;
  userName?: string;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onTabChange, activeTab, userName = "User", isDarkMode, toggleTheme }) => {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'renovate', label: 'Vision' },
    { id: 'search', label: 'Listings' },
    { id: 'contractors', label: 'Contractors' },
    { id: 'saved', label: 'Saved' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcf9] dark:bg-stone-950 transition-colors duration-300">
      
      <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex flex-col cursor-pointer" onClick={() => onTabChange('home')}>
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-emerald-800 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/10">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tighter uppercase">UNVEIL</span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-emerald-700 dark:text-emerald-500 ml-1 hidden sm:block">Visionary Real Estate</span>
            </div>
            
            <nav className="hidden md:flex space-x-8 text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-[0.2em]">
              {tabs.map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`transition-colors hover:text-emerald-800 dark:hover:text-emerald-400 relative py-2 ${activeTab === tab.id ? 'text-emerald-800 dark:text-emerald-400' : ''}`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-800 dark:bg-emerald-400 rounded-full"></span>
                  )}
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-6">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:text-emerald-800 dark:hover:text-emerald-400 transition-all shadow-sm"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              <button 
                onClick={() => onTabChange('profile')}
                className={`flex items-center space-x-3 group px-3 py-1.5 rounded-full transition-all ${activeTab === 'profile' ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'hover:bg-stone-50 dark:hover:bg-stone-800'}`}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-bold text-stone-900 dark:text-stone-100 leading-none">{userName}</p>
                  <p className="text-[8px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mt-0.5">Profile</p>
                </div>
                <div className="w-10 h-10 bg-stone-100 dark:bg-stone-800 rounded-full border-2 border-white dark:border-stone-700 shadow-sm flex items-center justify-center text-stone-400 dark:text-stone-500 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 overflow-hidden transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="md:hidden border-t border-stone-100 dark:border-stone-800 overflow-x-auto bg-white dark:bg-stone-900 transition-colors">
          <div className="flex space-x-6 px-4 py-3 whitespace-nowrap scrollbar-hide">
            {tabs.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${activeTab === tab.id ? 'text-emerald-800 dark:text-emerald-400' : 'text-stone-400 dark:text-stone-600'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tighter uppercase transition-colors">UNVEIL</span>
              <span className="text-[9px] uppercase tracking-[0.2em] font-medium text-stone-400 dark:text-stone-600">Visionary Real Estate AI</span>
            </div>
            <p className="text-stone-400 dark:text-stone-600 text-xs">© 2025 Unveil Technologies. Powered by GeorgiaMLS.com Data.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
