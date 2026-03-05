
import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { RoomType, RenoStyle, RenovationVision } from '../types';
import { transformImage, searchListings, searchContractors, Contractor, SearchFilters, ListingProperty } from '../services/geminiService';

export interface VisionBoardHandle {
  triggerSearch: (query: string) => void;
}

const GEORGIA_CITIES = [
  "Acworth", "Albany", "Alpharetta", "Athens", "Atlanta", "Augusta", "Austell", "Baconton", "Bainbridge", "Barnesville",
  "Baxley", "Berkeley Lake", "Blackshear", "Blairsville", "Blakely", "Bloomingdale", "Blue Ridge", "Bogart", "Bowdon", "Braselton",
  "Bremen", "Brookhaven", "Brooklet", "Brunswick", "Buchanan", "Buford", "Byron", "Cairo", "Calhoun", "Camilla",
  "Canton", "Carrollton", "Cartersville", "Cedartown", "Centerville", "Chamblee", "Chatsworth", "Chickamauga", "Clarkston", "Claxton",
  "Clayton", "Cleveland", "Colquitt", "Columbus", "Comer", "Commerce", "Conyers", "Cordele", "Cornelia", "Covington",
  "Cumming", "Cusseta", "Cuthbert", "Dacula", "Dahlonega", "Dallas", "Dalton", "Darien", "Dawson", "Dawsonville",
  "Decatur", "Demorest", "Donalsonville", "Douglas", "Douglasville", "Dublin", "Duluth", "Dunwoody", "East Point", "Eastman",
  "Eatonton", "Edison", "Elberton", "Ellaville", "Ellijay", "Emerson", "Enigma", "Euharlee", "Fairburn", "Fairmount",
  "Fayetteville", "Fitzgerald", "Flowery Branch", "Folkston", "Forest Park", "Forsyth", "Fort Gaines", "Fort Oglethorpe", "Fort Valley", "Franklin",
  "Gainesville", "Garden City", "Glennville", "Grayson", "Greensboro", "Griffin", "Grovetown", "Guyton", "Hahira", "Hamilton",
  "Hampton", "Hapeville", "Harlem", "Hartwell", "Hawkinsville", "Hazlehurst", "Helen", "Hephzibah", "Hiawassee", "Hinesville",
  "Hiram", "Holly Springs", "Homerville", "Hoschton", "Hull", "Jackson", "Jasper", "Jefferson", "Jeffersonville", "Jesup",
  "Johns Creek", "Jonesboro", "Kennesaw", "Kingsland", "LaFayette", "LaGrange", "Lake City", "Lakeland", "Lakeview Estates", "Lavonia",
  "Lawrenceville", "Leesburg", "Lenox", "Lexington", "Lilburn", "Lincolnton", "Lithonia", "Locust Grove", "Loganville", "Lookout Mountain",
  "Louisville", "Lovejoy", "Ludowici", "Lyons", "Mableton", "Macon", "Madison", "Manchester", "Marietta", "McDonough",
  "McRae-Helena", "Meigs", "Metter", "Midway", "Milledgeville", "Millen", "Milton", "Monroe", "Montezuma", "Monticello",
  "Morgan", "Morrow", "Moultrie", "Mountain City", "Mount Zion", "Nahunta", "Nashville", "Nelson", "Newnan", "Nicholls",
  "Norcross", "Norman Park", "Oakwood", "Ocilla", "Oglethorpe", "Omega", "Oxford", "Palmetto", "Panthersville", "Peachtree City",
  "Peachtree Corners", "Pearson", "Pelham", "Pembroke", "Pendergrass", "Perry", "Pine Lake", "Pine Mountain", "Pooler", "Port Wentworth",
  "Powder Springs", "Quitman", "Ray City", "Rebecca", "Reed Creek", "Reidsville", "Remerton", "Resaca", "Reynolds", "Rhine",
  "Riceboro", "Richland", "Richmond Hill", "Ringgold", "Riverdale", "Riverside", "Roberta", "Robins AFB", "Rockmart", "Rome",
  "Rossville", "Roswell", "Royston", "Rutledge", "Saint Marys", "Saint Simons", "Sale City", "Sandersville", "Sandy Springs", "Sardis",
  "Savannah", "Screven", "Senoia", "Shady Dale", "Sharon", "Sharpsburg", "Shellman", "Shiloh", "Siloam", "Skidaway Island",
  "Sky Valley", "Smithville", "Smyrna", "Snellville", "Social Circle", "Soperton", "Sparks", "Sparta", "Springfield", "Statenville",
  "Statesboro", "Statham", "Stillmore", "Stockbridge", "Stonecrest", "Stone Mountain", "Sugar Hill", "Summerville", "Sumner", "Sunnyside",
  "Sunny Side", "Suwanee", "Swainsboro", "Sylvania", "Sylvester", "Talbotton", "Talking Rock", "Tallapoosa", "Tallulah Falls", "Talmo",
  "Tarrytown", "Taylorsville", "Temple", "Tennga", "Tennille", "Thomaston", "Thomasville", "Thomson", "Thunderbolt", "Tifton",
  "Tiger", "Tignall", "Toccoa", "Toomsboro", "Trenton", "Trion", "Tucker", "Tunnel Hill", "Turin", "Twin City",
  "Tybee Island", "Tyrone", "Unadilla", "Union City", "Union Point", "Uvalda", "Valdosta", "Varnell", "Vernonburg", "Vidalia",
  "Vienna", "Villa Rica", "Waco", "Wadley", "Walnut Grove", "Walthourville", "Warm Springs", "Warner Robins", "Warrenton", "Warwick",
  "Washington", "Watkinsville", "Waverly Hall", "Waycross", "Waynesboro", "West Point", "Whigham", "White", "White Plains", "Whitesburg",
  "Willacoochee", "Williamson", "Wilmington Island", "Winder", "Winterville", "Woodbine", "Woodbury", "Woodstock", "Woodville", "Wrens",
  "Wrightsville", "Yatesville", "Young Harris", "Zebulon"
].map(city => city + ", GA");

const SPECIALTIES = [
  "General Contractor", "Kitchen & Bath", "Roofing", "Landscaping", "Interior Design", 
  "Flooring", "Electrical", "Plumbing", "HVAC", "Historic Restoration", "Smart Home Integration"
];

export const VisionBoard = forwardRef<VisionBoardHandle, { activeTab: string; onTabChange: (tab: any) => void }>((props, ref) => {
  const { activeTab, onTabChange } = props;
  
  // Listings Search States
  const [listingQuery, setListingQuery] = useState('');
  const [listingFilters, setListingFilters] = useState<SearchFilters>({
    minPrice: '', maxPrice: '', beds: '', baths: '', propertyType: 'Any', sortBy: 'Newest'
  });
  const [listingResults, setListingResults] = useState<{ text: string; properties: ListingProperty[] } | null>(null);
  const [isSearchingListings, setIsSearchingListings] = useState(false);

  // Contractors Search States
  const [contractorType, setContractorType] = useState('General Contractor');
  const [contractorCity, setContractorCity] = useState('Atlanta, GA');
  const [contractorSort, setContractorSort] = useState('Highest Rated');
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [isSearchingContractors, setIsSearchingContractors] = useState(false);

  // Vision / Renovate States
  const [preview, setPreview] = useState<string | null>(null);
  const [roomType, setRoomType] = useState<RoomType>(RoomType.LIVING_ROOM);
  const [style, setStyle] = useState<RenoStyle>(RenoStyle.MODERN);
  const [notes, setNotes] = useState('');
  const [isProcessingVision, setIsProcessingVision] = useState(false);
  const [vision, setVision] = useState<RenovationVision | null>(null);
  const [savedVisions, setSavedVisions] = useState<RenovationVision[]>([]);
  
  // Comparison Slider States
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const boardSectionRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('unveil_saved_visions');
    if (saved) setSavedVisions(JSON.parse(saved));
  }, []);

  useImperativeHandle(ref, () => ({
    triggerSearch: (query: string) => {
      setListingQuery(query);
      executeListingSearch(query, listingFilters);
      boardSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }));

  // Logic: Listings Search
  const executeListingSearch = async (query: string, filters: SearchFilters) => {
    if (!query.trim()) return;
    setIsSearchingListings(true);
    try {
      const results = await searchListings(query, filters);
      setListingResults(results);
    } catch (error) {
      console.error("Listing search failed", error);
    } finally {
      setIsSearchingListings(false);
    }
  };

  const handleListingFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeListingSearch(listingQuery, listingFilters);
  };

  // Logic: Contractor Search
  const handleContractorSearch = async () => {
    setIsSearchingContractors(true);
    try {
      const results = await searchContractors(contractorType, contractorCity, contractorSort);
      setContractors(results);
    } catch (error) {
      console.error("Contractor search failed", error);
    } finally {
      setIsSearchingContractors(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'contractors' && contractors.length === 0) {
      handleContractorSearch();
    }
  }, [activeTab]);

  // Logic: Vision Transformation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleGenerateVision = async () => {
    if (!preview) return;
    setIsProcessingVision(true);
    try {
      const result = await transformImage(preview, roomType, style, notes);
      const newVision: RenovationVision = {
        id: Math.random().toString(36).substr(2, 9),
        originalImage: preview,
        transformedImage: result.imageUrl,
        roomType,
        style,
        estimatedCostRange: result.costEstimate,
        aiDescription: result.description,
        timestamp: Date.now(),
      };
      setVision(newVision);
      setSliderPosition(50);
      const updatedSaved = [newVision, ...savedVisions].slice(0, 20);
      setSavedVisions(updatedSaved);
      localStorage.setItem('unveil_saved_visions', JSON.stringify(updatedSaved));
    } catch (error) {
      console.error("Vision generation failed", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsProcessingVision(false);
    }
  };

  const resetVision = () => {
    setVision(null);
    setPreview(null);
    setNotes('');
  };

  // Comparison Slider Drag Logic
  useEffect(() => {
    const handleMove = (clientX: number) => {
      if (!sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const position = (x / rect.width) * 100;
      setSliderPosition(Math.min(Math.max(position, 0), 100));
    };
    const onMouseMove = (e: MouseEvent) => isDragging && handleMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => isDragging && handleMove(e.touches[0].clientX);
    const stopDragging = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', stopDragging);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', stopDragging);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', stopDragging);
    };
  }, [isDragging]);

  return (
    <div ref={boardSectionRef} className="max-w-7xl mx-auto px-4 py-12 min-h-[70vh]">
      
      {/* 1. LISTINGS PAGE TAB */}
      {activeTab === 'search' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight transition-colors">Official Georgia MLS Search</h2>
            <p className="text-stone-500 dark:text-stone-400 max-w-2xl mx-auto font-light transition-colors">Directly query the market for fixer-uppers and investment opportunities.</p>
          </div>

          <div className="bg-white dark:bg-stone-900 p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-stone-100 dark:border-stone-800 space-y-10 transition-colors">
            {/* Primary Search Bar */}
            <form onSubmit={handleListingFormSubmit} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/20 to-amber-500/20 rounded-[2rem] blur opacity-50"></div>
              <div className="relative flex items-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-[1.8rem] p-1.5 focus-within:ring-2 focus-within:ring-emerald-700/30 transition-all">
                <div className="pl-6 text-emerald-800 dark:text-emerald-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Address, City, Zip or Neighborhood..."
                  className="flex-grow bg-transparent border-none text-stone-900 dark:text-stone-100 placeholder-stone-400 py-4 px-6 focus:ring-0 focus:outline-none text-lg font-medium transition-colors"
                  value={listingQuery}
                  onChange={(e) => setListingQuery(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={isSearchingListings}
                  className="bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-10 py-4 rounded-[1.4rem] font-bold text-sm uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/10 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSearchingListings ? 'Searching...' : 'Search Listings'}
                </button>
              </div>
            </form>

            {/* Filter Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 pt-4 border-t border-stone-100 dark:border-stone-800 transition-colors">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest ml-1">Min Price</label>
                <input 
                  type="text" placeholder="$0"
                  value={listingFilters.minPrice}
                  onChange={(e) => setListingFilters({...listingFilters, minPrice: e.target.value})}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-800 dark:focus:ring-emerald-600 outline-none text-sm dark:text-stone-100 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest ml-1">Max Price</label>
                <input 
                  type="text" placeholder="$1M+"
                  value={listingFilters.maxPrice}
                  onChange={(e) => setListingFilters({...listingFilters, maxPrice: e.target.value})}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-800 dark:focus:ring-emerald-600 outline-none text-sm dark:text-stone-100 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest ml-1">Beds / Baths</label>
                <div className="flex gap-2">
                  <select 
                    value={listingFilters.beds}
                    onChange={(e) => setListingFilters({...listingFilters, beds: e.target.value})}
                    className="w-1/2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-3 focus:ring-2 focus:ring-emerald-800 dark:focus:ring-emerald-600 outline-none text-sm dark:text-stone-100 transition-colors"
                  >
                    <option value="">Beds</option>
                    {[1,2,3,4,5].map(n => <option key={n} value={n+"+"}>{n}+</option>)}
                  </select>
                  <select 
                    value={listingFilters.baths}
                    onChange={(e) => setListingFilters({...listingFilters, baths: e.target.value})}
                    className="w-1/2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-3 focus:ring-2 focus:ring-emerald-800 dark:focus:ring-emerald-600 outline-none text-sm dark:text-stone-100 transition-colors"
                  >
                    <option value="">Baths</option>
                    {[1,2,3,4,5].map(n => <option key={n} value={n+"+"}>{n}+</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest ml-1">Property Type</label>
                <select 
                  value={listingFilters.propertyType}
                  onChange={(e) => setListingFilters({...listingFilters, propertyType: e.target.value})}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-800 dark:focus:ring-emerald-600 outline-none text-sm dark:text-stone-100 transition-colors"
                >
                  <option value="Any">Any Type</option>
                  <option value="Single Family">Single Family</option>
                  <option value="Condo">Condo/Townhome</option>
                  <option value="Multi-Family">Multi-Family</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleListingFormSubmit}
                  disabled={isSearchingListings}
                  className="w-full py-3 bg-stone-900 dark:bg-stone-800 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-800 dark:hover:bg-stone-750 transition shadow-md"
                >
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Sorting & Attribution */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] font-bold text-stone-400 dark:text-stone-600 uppercase tracking-[0.2em] transition-colors">Source: GeorgiaMLS.com</span>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-stone-500 dark:text-stone-600 uppercase tracking-widest transition-colors">Sort:</span>
                <select 
                  value={listingFilters.sortBy}
                  onChange={(e) => setListingFilters({...listingFilters, sortBy: e.target.value})}
                  className="bg-transparent border-none text-[10px] font-bold text-emerald-800 dark:text-emerald-500 uppercase tracking-widest focus:ring-0 cursor-pointer transition-colors"
                >
                  <option value="Newest">Newest</option>
                  <option value="Price Low to High">Price (Low-High)</option>
                  <option value="Price High to Low">Price (High-Low)</option>
                  <option value="Investment Potential">Investment Potential</option>
                </select>
              </div>
            </div>
          </div>

          {/* Listing Results Grid */}
          {listingResults && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Left Column: Properties */}
              <div className="lg:col-span-8 space-y-8">
                <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight ml-2 transition-colors">Market Matches</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {listingResults.properties.map((prop, idx) => (
                    <div key={idx} className="bg-white dark:bg-stone-900 rounded-[2rem] shadow-xl overflow-hidden border border-stone-100 dark:border-stone-800 group hover:scale-[1.02] transition-all flex flex-col">
                      <div className="h-56 relative overflow-hidden">
                        <img src={prop.image} alt={prop.address} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-stone-900/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-emerald-800 dark:text-emerald-500 shadow-sm border border-white/50 dark:border-stone-800/50 uppercase tracking-[0.1em] transition-colors">
                          {prop.price}
                        </div>
                      </div>
                      <div className="p-8 flex-grow flex flex-col">
                        <h4 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2 truncate transition-colors">{prop.address}</h4>
                        <div className="flex gap-4 mb-4 text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest transition-colors">
                          <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            {prop.beds} Beds
                          </span>
                          <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM4 10h16M10 4v16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            {prop.baths} Baths
                          </span>
                        </div>
                        <p className="text-sm text-stone-500 dark:text-stone-400 font-light line-clamp-2 mb-6 italic transition-colors">"{prop.description}"</p>
                        <div className="mt-auto pt-4 border-t border-stone-50 dark:border-stone-800 flex gap-3 transition-colors">
                          <a 
                            href={prop.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-grow py-3 bg-stone-900 dark:bg-stone-800 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest text-center hover:bg-stone-800 dark:hover:bg-stone-750 transition shadow-lg shadow-black/10"
                          >
                            View Portal
                          </a>
                          <button 
                            onClick={() => { setPreview(prop.image); onTabChange('renovate'); }}
                            className="px-6 py-3 bg-emerald-800 dark:bg-emerald-600 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-emerald-700 dark:hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/10"
                          >
                            Unveil
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: AI Analysis Sidebar */}
              <div className="lg:col-span-4 space-y-8">
                <div className="sticky top-28 space-y-6">
                  <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight transition-colors">Market Analysis</h3>
                  <div className="bg-emerald-950 dark:bg-emerald-900/20 p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden transition-colors border border-transparent dark:border-emerald-800/30">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <span className="relative z-10 text-[9px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-4 block">AI Insight Summary</span>
                    <p className="relative z-10 text-xl font-light italic leading-relaxed text-stone-100">
                      "{listingResults.text}"
                    </p>
                    <div className="relative z-10 mt-10 pt-6 border-t border-emerald-800/40 space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">
                        <span>Source</span>
                        <span className="text-white dark:text-stone-200">GeorgiaMLS.com Grounded</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">
                        <span>Reliability</span>
                        <span className="text-white dark:text-stone-200">98.2% Accuracy</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-stone-900 p-8 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 shadow-xl space-y-6 transition-colors">
                    <h4 className="text-[10px] font-bold text-stone-900 dark:text-stone-100 uppercase tracking-widest transition-colors">Renovation Tips</h4>
                    <ul className="space-y-4">
                      {[
                        "Focus on open-concept kitchen flow.",
                        "Luxury vinyl plank (LVP) for high durability.",
                        "Energy-efficient window upgrades."
                      ].map((tip, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-stone-500 dark:text-stone-400 font-light transition-colors">
                          <span className="text-emerald-800 dark:text-emerald-500 mt-0.5">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. CONTRACTORS PAGE TAB */}
      {activeTab === 'contractors' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight transition-colors">Find Specialized Professionals</h2>
            <p className="text-stone-500 dark:text-stone-400 max-w-2xl mx-auto font-light transition-colors">From historic restoration to ultra-modern kitchens, connect with the right team for your vision.</p>
          </div>

          <div className="bg-white dark:bg-stone-900 p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-stone-100 dark:border-stone-800 space-y-10 transition-colors">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest ml-1">Trade or Specialty</label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-emerald-600/10 rounded-2xl blur opacity-30 group-hover:opacity-100 transition"></div>
                  <div className="relative flex items-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-4 py-1.5 focus-within:ring-2 focus-within:ring-emerald-700/30 transition-all">
                    <svg className="w-5 h-5 text-emerald-800 dark:text-emerald-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
                    </svg>
                    <select
                      value={contractorType}
                      onChange={(e) => setContractorType(e.target.value)}
                      className="flex-grow bg-transparent border-none text-stone-900 dark:text-stone-100 py-3 px-4 focus:ring-0 focus:outline-none text-sm font-semibold appearance-none transition-colors"
                    >
                      {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest ml-1">Location (City)</label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-amber-600/10 rounded-2xl blur opacity-30 group-hover:opacity-100 transition"></div>
                  <div className="relative flex items-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-4 py-1.5 focus-within:ring-2 focus-within:ring-emerald-700/30 transition-all">
                    <svg className="w-5 h-5 text-emerald-800 dark:text-emerald-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <select
                      value={contractorCity}
                      onChange={(e) => setContractorCity(e.target.value)}
                      className="flex-grow bg-transparent border-none text-stone-900 dark:text-stone-100 py-3 px-4 focus:ring-0 focus:outline-none text-sm font-semibold appearance-none transition-colors"
                    >
                      {GEORGIA_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-stone-100 dark:border-stone-800 gap-6 transition-colors">
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest ml-1">Order Results</label>
                  <select 
                    value={contractorSort}
                    onChange={(e) => setContractorSort(e.target.value)}
                    className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-2 text-[10px] font-bold text-emerald-800 dark:text-emerald-500 uppercase tracking-widest focus:ring-2 focus:ring-emerald-800 dark:focus:ring-emerald-600 outline-none transition-colors"
                  >
                    <option value="Highest Rated">Highest Rated</option>
                    <option value="Most Active">Most Active</option>
                    <option value="Nearest">Nearest</option>
                  </select>
                </div>
                <button onClick={handleContractorSearch} className="mt-auto px-8 py-2 bg-stone-900 dark:bg-stone-800 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-800 dark:hover:bg-stone-750 transition shadow-md">
                  Apply Filters
                </button>
              </div>

              <button 
                onClick={handleContractorSearch}
                disabled={isSearchingContractors}
                className="w-full md:w-auto bg-emerald-800 dark:bg-emerald-600 hover:bg-emerald-900 dark:hover:bg-emerald-700 text-white px-12 py-4 rounded-[1.4rem] font-bold text-sm uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/10 dark:shadow-emerald-900/40 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSearchingContractors ? 'Finding Experts...' : 'Search Pros'}
              </button>
            </div>
          </div>

          {/* Contractor Cards */}
          {isSearchingContractors ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white dark:bg-stone-900 rounded-[2.5rem] shadow-xl overflow-hidden border border-stone-100 dark:border-stone-800 animate-pulse h-96"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {contractors.map((c) => (
                <div key={c.id} className="bg-white dark:bg-stone-900 rounded-[2.5rem] shadow-xl overflow-hidden border border-stone-100 dark:border-stone-800 group hover:scale-[1.02] transition-all flex flex-col">
                  <div className="h-64 relative">
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                    <div className="absolute top-6 right-6 bg-white/95 dark:bg-stone-900/95 backdrop-blur px-4 py-2 rounded-full text-[11px] font-bold text-emerald-800 dark:text-emerald-500 shadow-xl border border-white/50 dark:border-stone-800/50 uppercase tracking-[0.1em] transition-colors">
                      ★ {c.rating} / 5.0
                    </div>
                  </div>
                  <div className="p-10 flex flex-col flex-grow">
                    <div className="mb-6">
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-2 block">{c.specialty}</span>
                      <h4 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2 leading-tight transition-colors">{c.name}</h4>
                      <p className="text-sm text-stone-500 dark:text-stone-400 flex items-center font-medium transition-colors">
                        <svg className="w-4 h-4 mr-2 text-stone-300 dark:text-stone-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {c.location}
                      </p>
                    </div>
                    <p className="text-gray-600 dark:text-stone-400 font-light text-lg mb-10 leading-relaxed line-clamp-3 italic transition-colors">"{c.description}"</p>
                    <div className="mt-auto flex flex-col gap-4">
                      <button className="w-full py-5 bg-emerald-800 dark:bg-emerald-600 text-white font-bold rounded-2xl text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/10 dark:shadow-emerald-900/40 hover:bg-emerald-900 dark:hover:bg-emerald-700">
                        Request Vision Review
                      </button>
                      <button className="w-full py-4 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold rounded-2xl text-[10px] uppercase tracking-widest border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-750 transition-colors">
                        View Portfolio
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. VISION (RENOVATE) PAGE TAB */}
      {activeTab === 'renovate' && (
        <div className="max-w-7xl mx-auto space-y-16">
          {!vision ? (
            <div className="space-y-16 animate-in fade-in duration-500">
              <div className="text-center max-w-2xl mx-auto">
                <h3 className="text-4xl font-extrabold text-stone-900 dark:text-stone-100 mb-6 tracking-tight transition-colors">Create Your Spatial Vision</h3>
                <p className="text-stone-500 dark:text-stone-400 font-light text-lg transition-colors">Choose a property from the market or upload your own photo to begin the transformation.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Step 1: Selection */}
                <div className="lg:col-span-7 bg-white dark:bg-stone-900 p-10 rounded-[2.5rem] shadow-xl border border-stone-100 dark:border-stone-800 flex flex-col space-y-10 transition-colors">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 transition-colors">1. Property Selection</h3>
                    <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-500 rounded-full text-[10px] font-bold uppercase tracking-widest">Select Path</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
                    <div onClick={() => onTabChange('search')} className="bg-emerald-50/40 dark:bg-emerald-900/10 border-2 border-emerald-100 dark:border-emerald-800/30 rounded-[2rem] p-10 flex flex-col justify-between group hover:border-emerald-300 dark:hover:border-emerald-600 transition-all cursor-pointer">
                      <div className="w-14 h-14 bg-white dark:bg-stone-800 rounded-2xl flex items-center justify-center text-emerald-800 dark:text-emerald-500 shadow-sm mb-8 transition-colors">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-3 transition-colors">Find a Listing</h4>
                        <p className="text-stone-500 dark:text-stone-400 text-sm font-light mb-8 transition-colors">Search the official GA MLS to identify high-potential fixer-uppers.</p>
                      </div>
                      <button className="w-full py-4 bg-white dark:bg-stone-800 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-500 rounded-2xl text-[10px] font-bold uppercase tracking-widest group-hover:bg-emerald-800 dark:group-hover:bg-emerald-600 group-hover:text-white transition-all">Explore Listings</button>
                    </div>

                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all p-10 h-full min-h-[350px] ${
                        preview ? 'border-transparent shadow-2xl bg-stone-50 dark:bg-stone-800' : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100 dark:hover:bg-stone-800 hover:border-emerald-300 dark:hover:border-emerald-600'
                      }`}
                    >
                      {preview ? (
                        <div className="relative w-full h-full rounded-2xl overflow-hidden group">
                          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-bold text-[10px] uppercase tracking-widest">Replace Selection</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center space-y-6">
                          <div className="w-14 h-14 bg-white dark:bg-stone-800 rounded-2xl flex items-center justify-center text-stone-400 dark:text-stone-600 shadow-sm mx-auto transition-colors">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight transition-colors">Direct Upload</p>
                            <p className="text-stone-400 dark:text-stone-600 mt-2 font-light text-sm transition-colors">Drop property photo here.</p>
                          </div>
                        </div>
                      )}
                      <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                    </div>
                  </div>
                </div>

                {/* Step 2: Design */}
                <div className="lg:col-span-5 bg-white dark:bg-stone-900 p-10 rounded-[2.5rem] shadow-xl border border-stone-100 dark:border-stone-800 flex flex-col space-y-10 transition-colors">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 transition-colors">2. Design Parameters</h3>
                    <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-500 rounded-full text-[10px] font-bold uppercase tracking-widest">Configure</span>
                  </div>

                  <div className="space-y-6">
                    <label className="block text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">Room Categorization</label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.values(RoomType).map((type) => (
                        <button
                          key={type}
                          onClick={() => setRoomType(type)}
                          className={`py-3 px-4 text-[10px] font-bold uppercase tracking-widest rounded-xl border transition-all ${
                            roomType === type ? 'bg-emerald-800 dark:bg-emerald-600 text-white border-emerald-800 dark:border-emerald-600 shadow-lg' : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-emerald-300 dark:hover:border-emerald-600'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="block text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">Aesthetic Style</label>
                    <select
                      value={style}
                      onChange={(e) => setStyle(e.target.value as RenoStyle)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl py-4 px-5 focus:ring-2 focus:ring-emerald-700 dark:focus:ring-emerald-600 outline-none font-bold text-xs text-stone-700 dark:text-stone-200 uppercase tracking-widest appearance-none transition-colors bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-no-repeat bg-[right_1.2rem_center]"
                    >
                      {Object.values(RenoStyle).map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="space-y-6 flex-grow">
                    <label className="block text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">Specific Vision Notes</label>
                    <textarea
                      placeholder="e.g. Remove wall between kitchen and living room, add marble island..."
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl py-4 px-5 h-32 focus:ring-2 focus:ring-emerald-700 dark:focus:ring-emerald-600 outline-none font-light text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 resize-none transition-colors"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <button
                    disabled={!preview || isProcessingVision}
                    onClick={handleGenerateVision}
                    className={`w-full py-6 rounded-2xl text-white font-bold text-sm uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-3 ${
                      !preview || isProcessingVision ? 'bg-stone-300 dark:bg-stone-800 cursor-not-allowed text-stone-500' : 'bg-emerald-800 dark:bg-emerald-600 hover:bg-emerald-900 dark:hover:bg-emerald-700 shadow-emerald-900/10 dark:shadow-emerald-900/40'
                    }`}
                  >
                    {isProcessingVision ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Unveiling potential...</span>
                      </>
                    ) : 'Generate Vision'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-stone-100 dark:border-stone-800 pb-12 transition-colors">
                <div>
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-[0.2em] mb-4 block">Transformation Report</span>
                  <h2 className="text-5xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight transition-colors">Your Future {vision.roomType}</h2>
                </div>
                <button onClick={resetVision} className="px-10 py-4 bg-emerald-800 dark:bg-emerald-600 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-900 dark:hover:bg-emerald-700 transition shadow-lg shadow-emerald-900/10 dark:shadow-emerald-900/40">New Transformation</button>
              </div>

              <div className="max-w-5xl mx-auto">
                <div 
                  ref={sliderRef}
                  className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-[16/9] cursor-ew-resize select-none border-8 border-white dark:border-stone-800 group transition-colors"
                  onMouseDown={() => setIsDragging(true)}
                  onTouchStart={() => setIsDragging(true)}
                >
                  <img src={vision.originalImage} alt="Before" className="absolute inset-0 w-full h-full object-cover grayscale-[10%]" />
                  <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
                    <img src={vision.transformedImage} alt="After" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-y-0 w-1 bg-white shadow-2xl z-10" style={{ left: `${sliderPosition}%`, transform: `translateX(-50%)` }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white dark:bg-stone-900 rounded-full shadow-2xl flex items-center justify-center border-4 border-emerald-800 dark:border-emerald-600 ring-8 ring-white/20 dark:ring-stone-800/20 transition-all">
                      <svg className="w-8 h-8 text-emerald-800 dark:text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 12h8M8 12l3-3m-3 3l3 3m8-3l-3-3m3 3l-3 3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="bg-white dark:bg-stone-900 p-12 rounded-[3rem] shadow-xl border border-stone-100 dark:border-stone-800 col-span-2 space-y-6 transition-colors">
                  <h4 className="text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight transition-colors">AI Vision Insight</h4>
                  <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-xl font-light italic transition-colors">"{vision.aiDescription}"</p>
                </div>
                <div className="bg-emerald-950 dark:bg-stone-900 p-12 rounded-[3rem] shadow-2xl text-white flex flex-col justify-between transition-colors border border-transparent dark:border-stone-800">
                  <div>
                    <p className="text-[10px] text-stone-400 dark:text-stone-500 mb-4 uppercase tracking-widest font-bold">Estimated Investment</p>
                    <p className="text-6xl font-extrabold text-white dark:text-emerald-500 tracking-tighter transition-colors">{vision.estimatedCostRange}</p>
                  </div>
                  <button onClick={() => onTabChange('contractors')} className="mt-12 w-full bg-emerald-800 dark:bg-emerald-600 text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 dark:hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/10 dark:shadow-emerald-900/40">Find Pros in Georgia</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. SAVED VISIONS PAGE TAB */}
      {activeTab === 'saved' && (
        <div className="space-y-12 animate-in fade-in duration-500">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h3 className="text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight transition-colors">Vision Gallery</h3>
              <p className="text-stone-500 dark:text-stone-400 font-light mt-2 transition-colors">Access and manage your portfolio of potential transformations.</p>
            </div>
            <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest transition-colors">{savedVisions.length} Saved Projects</span>
          </div>
          
          {savedVisions.length === 0 ? (
            <div className="text-center py-40 bg-stone-50 dark:bg-stone-900 rounded-[3rem] border-2 border-dashed border-stone-200 dark:border-stone-800 transition-colors">
              <p className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4 transition-colors">Gallery is Empty</p>
              <button onClick={() => onTabChange('renovate')} className="px-10 py-4 bg-emerald-800 dark:bg-emerald-600 text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-900 dark:hover:bg-emerald-700 transition shadow-lg shadow-emerald-900/10 dark:shadow-emerald-900/40">Start First Vision</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {savedVisions.map((v) => (
                <div key={v.id} className="bg-white dark:bg-stone-900 rounded-[2.5rem] shadow-xl overflow-hidden border border-stone-100 dark:border-stone-800 group flex flex-col hover:scale-[1.02] transition-all">
                  <div className="h-64 relative overflow-hidden cursor-pointer" onClick={() => { setVision(v); onTabChange('renovate'); }}>
                    <img src={v.transformedImage} alt={v.style} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="p-10 flex-grow flex flex-col">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-500 uppercase tracking-widest block mb-2 transition-colors">{v.roomType}</span>
                    <h4 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-6 transition-colors">{v.style}</h4>
                    <div className="mt-auto space-y-4">
                      <button className="w-full py-4 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-500 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-100 dark:hover:bg-emerald-900/20 transition-colors">View Full Details</button>
                      <button className="w-full py-4 bg-stone-900 dark:bg-stone-800 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-800 dark:hover:bg-stone-750 transition shadow-lg shadow-black/10">Connect with Agent</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
