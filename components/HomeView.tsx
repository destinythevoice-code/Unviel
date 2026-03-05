
import React from 'react';
import { RenovationHero } from './RenovationHero';

interface HomeViewProps {
  onSearch: (query: string) => void;
  onNavigate: (tab: 'renovate' | 'search' | 'contractors') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSearch, onNavigate }) => {
  return (
    <div className="animate-in fade-in duration-700">
      <RenovationHero onSearch={onSearch} />
      
      {/* Introduction & Instructions */}
      <section className="py-24 bg-white dark:bg-stone-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-stone-100 tracking-tight transition-colors">
              Unveil the Potential
            </h2>
            <div className="w-24 h-1 bg-emerald-800 dark:bg-emerald-600 mx-auto rounded-full"></div>
            <p className="text-stone-500 dark:text-stone-400 max-w-2xl mx-auto font-light text-lg transition-colors">
              Empowering First-Time Homebuyers and Investors to visualize property value beyond the listing photo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="group space-y-6 text-center md:text-left">
              <div className="w-16 h-16 bg-stone-50 dark:bg-stone-900 rounded-[1.5rem] flex items-center justify-center text-emerald-800 dark:text-emerald-500 shadow-sm group-hover:bg-emerald-800 dark:group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 mx-auto md:mx-0">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 transition-colors">1. Discover</h3>
              <p className="text-stone-500 dark:text-stone-400 font-light leading-relaxed transition-colors">
                Browse our real-time feed of GeorgiaMLS.com listings. Identify properties with "good bones" but dated interiors in high-growth neighborhoods.
              </p>
              <button 
                onClick={() => onNavigate('search')}
                className="text-emerald-800 dark:text-emerald-500 font-bold text-[10px] uppercase tracking-widest hover:translate-x-2 transition-transform inline-flex items-center gap-2"
              >
                Search Listings <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>

            {/* Step 2 */}
            <div className="group space-y-6 text-center md:text-left">
              <div className="w-16 h-16 bg-stone-50 dark:bg-stone-900 rounded-[1.5rem] flex items-center justify-center text-emerald-800 dark:text-emerald-500 shadow-sm group-hover:bg-emerald-800 dark:group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 mx-auto md:mx-0">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 transition-colors">2. Visualize</h3>
              <p className="text-stone-500 dark:text-stone-400 font-light leading-relaxed transition-colors">
                Upload photos of any room. Our AI spatial engine transforms spaces using luxury styles while preserving the architectural footprint.
              </p>
              <button 
                onClick={() => onNavigate('renovate')}
                className="text-emerald-800 dark:text-emerald-500 font-bold text-[10px] uppercase tracking-widest hover:translate-x-2 transition-transform inline-flex items-center gap-2"
              >
                Start Your Vision <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>

            {/* Step 3 */}
            <div className="group space-y-6 text-center md:text-left">
              <div className="w-16 h-16 bg-stone-50 dark:bg-stone-900 rounded-[1.5rem] flex items-center justify-center text-emerald-800 dark:text-emerald-500 shadow-sm group-hover:bg-emerald-800 dark:group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 mx-auto md:mx-0">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 transition-colors">3. Connect</h3>
              <p className="text-stone-500 dark:text-stone-400 font-light leading-relaxed transition-colors">
                Instantly connect with verified contractors in your city to get accurate quotes and move from vision to physical reality.
              </p>
              <button 
                onClick={() => onNavigate('contractors')}
                className="text-emerald-800 dark:text-emerald-500 font-bold text-[10px] uppercase tracking-widest hover:translate-x-2 transition-transform inline-flex items-center gap-2"
              >
                Find Local Pros <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-24 bg-stone-50 dark:bg-stone-900 border-y border-stone-200 dark:border-stone-800 overflow-hidden transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-emerald-100 dark:bg-emerald-900/20 rounded-full blur-3xl opacity-50"></div>
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-stone-800 aspect-square lg:aspect-auto lg:h-[600px] transition-colors">
                <img 
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200" 
                  alt="Modern Georgia Home" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 to-transparent"></div>
                <div className="absolute bottom-12 left-12 right-12 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Featured Vision</p>
                  <h4 className="text-3xl font-bold tracking-tight mb-4">Buckhead Historic Flip</h4>
                  <div className="flex gap-4">
                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl">
                      <p className="text-[8px] uppercase tracking-widest font-bold opacity-70">Projected Value</p>
                      <p className="text-lg font-bold">+$180k</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl">
                      <p className="text-[8px] uppercase tracking-widest font-bold opacity-70">Reno Cost</p>
                      <p className="text-lg font-bold">$65k</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <div className="space-y-4">
                <span className="text-emerald-800 dark:text-emerald-500 font-bold text-[10px] uppercase tracking-[0.3em]">The Renovation Roadmap</span>
                <h2 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-stone-100 leading-tight transition-colors">
                  Bridge the Gap Between <br/>
                  <span className="text-emerald-800 dark:text-emerald-500 italic font-serif">Potential and Profit</span>
                </h2>
                <p className="text-lg text-stone-600 dark:text-stone-400 font-light leading-relaxed transition-colors">
                  Most buyers can't see past dated carpet and yellowed paint. Unveil gives you a competitive edge by visualizing high-ROI modern transformations in seconds.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 flex-shrink-0 bg-emerald-800 dark:bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg shadow-emerald-900/20 transition-all">A</div>
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-stone-100 text-lg transition-colors">For First-Time Buyers</h4>
                    <p className="text-stone-500 dark:text-stone-400 font-light text-sm transition-colors">Don't be intimidated by "diamond in the rough" listings. Use Unveil to confirm your dream home is hiding underneath.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 flex-shrink-0 bg-stone-900 dark:bg-stone-800 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg shadow-stone-900/20 transition-all">B</div>
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-stone-100 text-lg transition-colors">For Seasoned Investors</h4>
                    <p className="text-stone-500 dark:text-stone-400 font-light text-sm transition-colors">Rapidly validate renovation budgets and ROI metrics for any listing on the GeorgiaMLS.com portal.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  onClick={() => onNavigate('renovate')}
                  className="bg-emerald-800 dark:bg-emerald-600 text-white px-10 py-5 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-900 dark:hover:bg-emerald-700 transition shadow-xl"
                >
                  Create Your First Vision
                </button>
                <button 
                  onClick={() => onNavigate('search')}
                  className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 px-10 py-5 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-stone-50 dark:hover:bg-stone-750 transition shadow-sm"
                >
                  Browse GeorgiaMLS.com
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Georgia Market Statistics */}
      <section className="py-24 bg-white dark:bg-stone-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight transition-colors">Market Momentum</h2>
            <p className="text-stone-400 dark:text-stone-500 uppercase text-[10px] font-bold tracking-[0.2em] transition-colors">Live Insights powered by Unveil Intelligence</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 bg-stone-50 dark:bg-stone-900 rounded-[2rem] border border-stone-100 dark:border-stone-800 hover:border-emerald-200 dark:hover:border-emerald-700 transition-all">
              <p className="text-stone-400 dark:text-stone-500 text-[9px] font-bold uppercase tracking-widest mb-1">Avg Equity Gain</p>
              <p className="text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tighter transition-colors">22%</p>
              <p className="text-emerald-700 dark:text-emerald-500 text-[10px] font-bold mt-2">Post-Renovation</p>
            </div>
            <div className="p-8 bg-stone-50 dark:bg-stone-900 rounded-[2rem] border border-stone-100 dark:border-stone-800 hover:border-emerald-200 dark:hover:border-emerald-700 transition-all">
              <p className="text-stone-400 dark:text-stone-500 text-[9px] font-bold uppercase tracking-widest mb-1">Active Listings</p>
              <p className="text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tighter transition-colors">12.4k</p>
              <p className="text-emerald-700 dark:text-emerald-500 text-[10px] font-bold mt-2">Georgia Total</p>
            </div>
            <div className="p-8 bg-stone-50 dark:bg-stone-900 rounded-[2rem] border border-stone-100 dark:border-stone-800 hover:border-emerald-200 dark:hover:border-emerald-700 transition-all">
              <p className="text-stone-400 dark:text-stone-500 text-[9px] font-bold uppercase tracking-widest mb-1">Fixer Potential</p>
              <p className="text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tighter transition-colors">1,240</p>
              <p className="text-emerald-700 dark:text-emerald-500 text-[10px] font-bold mt-2">High ROI Matches</p>
            </div>
            <div className="p-8 bg-stone-50 dark:bg-stone-900 rounded-[2rem] border border-stone-100 dark:border-stone-800 hover:border-emerald-200 dark:hover:border-emerald-700 transition-all">
              <p className="text-stone-400 dark:text-stone-500 text-[9px] font-bold uppercase tracking-widest mb-1">Avg Time to Value</p>
              <p className="text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tighter transition-colors">4.5mo</p>
              <p className="text-emerald-700 dark:text-emerald-500 text-[10px] font-bold mt-2">Project Completion</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
