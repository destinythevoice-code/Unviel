
import React, { useState, useEffect, useRef } from 'react';

interface RenovationHeroProps {
  onSearch: (query: string) => void;
}

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=2000", // Modern Luxury Mansion
  "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&q=80&w=2000", // Modern City Skyline
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2000", // Stunning Luxury Kitchen
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000", // Contemporary Exterior
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=2000", // Sunset Luxury Estate
  "https://images.unsplash.com/photo-1449156003053-96432b638f07?auto=format&fit=crop&q=80&w=2000"  // Renovated Living Space
];

const GA_SUGGESTIONS = [
  "Atlanta, GA", "Savannah, GA", "Buckhead, Atlanta", "Midtown Atlanta", 
  "Alpharetta, GA", "Marietta, GA", "Athens, GA", "Augusta, GA", 
  "Columbus, GA", "Macon, GA", "Sandy Springs, GA", "Roswell, GA",
  "Fixer upper in Atlanta", "Investment properties Savannah", 
  "Modern homes in Buckhead", "Historic homes in Athens"
];

export const RenovationHero: React.FC<RenovationHeroProps> = ({ onSearch }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = GA_SUGGESTIONS.filter(s => 
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-emerald-950">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        {HERO_IMAGES.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-[2500ms] ease-in-out ${
              index === currentImageIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transitionProperty: 'opacity, transform',
            }}
          />
        ))}
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60 z-10" />
        <div className="absolute inset-0 bg-emerald-900/10 mix-blend-overlay z-10" />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <span className="inline-block px-5 py-2 bg-emerald-500/20 backdrop-blur-xl text-emerald-300 text-[10px] font-bold uppercase tracking-[0.25em] rounded-full mb-8 border border-emerald-400/30 shadow-2xl">
            AI-Driven Spatial Visualization
          </span>
          <h1 className="text-5xl tracking-tight font-extrabold text-white sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
            <span className="block mb-2">Unveil the Potential</span>
            <span className="block text-amber-400/90 italic font-serif">of Any Property</span>
          </h1>
          <p className="mt-8 max-w-2xl mx-auto text-lg text-stone-100 sm:text-xl md:mt-10 font-light leading-relaxed drop-shadow-md">
            Instantly visualize renovations for any Georgia listing. See the hidden value in fixer-uppers and estates before you invest.
          </p>

          {/* Search Interface */}
          <div className="mt-12 max-w-3xl mx-auto relative" ref={dropdownRef}>
            <form onSubmit={handleSubmit} className="relative group">
              {/* Outer Glow Effect */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-600 to-amber-500 rounded-[2.2rem] blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-300" />
              
              <div className="relative flex items-center bg-white/95 backdrop-blur-2xl border border-white/40 rounded-[2rem] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
                <div className="pl-6 text-emerald-800">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Enter a Georgia address or city..."
                  className="flex-grow bg-transparent border-none text-stone-900 placeholder-stone-500 py-5 px-6 focus:ring-0 focus:outline-none text-lg font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                />
                <button
                  type="submit"
                  className="bg-emerald-800 hover:bg-emerald-700 text-white px-10 py-5 rounded-[1.5rem] font-bold text-sm uppercase tracking-[0.15em] transition-all shadow-xl active:scale-95 m-1"
                >
                  Unveil
                </button>
              </div>
            </form>

            {/* Suggestions Overlay */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white/98 backdrop-blur-2xl border border-stone-100 rounded-[2rem] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="py-5 text-left">
                  <div className="px-8 pb-3 text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">Regional Quick Search</div>
                  {filteredSuggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(s)}
                      className="w-full text-left px-8 py-4 hover:bg-emerald-50/80 text-stone-700 font-semibold transition-colors border-l-4 border-transparent hover:border-emerald-700 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-6 flex justify-center space-x-8 text-[11px] uppercase tracking-[0.2em] font-bold text-white/40">
              <span className="hover:text-white transition-colors cursor-pointer">Atlanta</span>
              <span className="text-emerald-500/50 hidden sm:inline">•</span>
              <span className="hover:text-white transition-colors cursor-pointer">Savannah</span>
              <span className="text-emerald-500/50 hidden sm:inline">•</span>
              <span className="hover:text-white transition-colors cursor-pointer">Buckhead</span>
              <span className="text-emerald-500/50 hidden sm:inline">•</span>
              <span className="hover:text-white transition-colors cursor-pointer">Alpharetta</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
