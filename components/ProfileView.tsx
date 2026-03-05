
import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] shadow-xl border border-stone-100 dark:border-stone-800 overflow-hidden transition-colors">
        <div className="h-48 bg-emerald-950 dark:bg-emerald-900 relative transition-colors">
          <div className="absolute -bottom-16 left-12">
            <div className="w-32 h-32 bg-white dark:bg-stone-800 rounded-3xl shadow-2xl p-2 transition-colors">
              <div className="w-full h-full bg-stone-100 dark:bg-stone-900 rounded-2xl flex items-center justify-center text-stone-300 dark:text-stone-700 overflow-hidden border border-stone-50 dark:border-stone-800 transition-colors">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 right-12 flex gap-3">
             <button 
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-all"
             >
              {isEditing ? 'Cancel' : 'Edit Profile'}
             </button>
             {isEditing && (
               <button 
                onClick={handleSave}
                className="px-6 py-2 bg-emerald-500 dark:bg-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/40"
               >
                Save Changes
               </button>
             )}
          </div>
        </div>

        <div className="pt-24 px-12 pb-12 transition-colors">
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-800 dark:focus:ring-emerald-600 outline-none font-medium dark:text-stone-100 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest ml-1">Account Type</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-800 dark:focus:ring-emerald-600 outline-none font-medium dark:text-stone-100 transition-colors"
                >
                  {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest ml-1">Company (Optional)</label>
                <input 
                  type="text" 
                  value={formData.company || ''}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-800 dark:focus:ring-emerald-600 outline-none font-medium dark:text-stone-100 transition-colors"
                  placeholder="e.g. Compass Real Estate"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest ml-1">Market Location</label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-800 dark:focus:ring-emerald-600 outline-none font-medium dark:text-stone-100 transition-colors"
                  placeholder="e.g. Atlanta, GA"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest ml-1">Bio / Profile Intro</label>
                <textarea 
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-xl px-4 py-3 h-24 focus:ring-2 focus:ring-emerald-800 dark:focus:ring-emerald-600 outline-none font-medium dark:text-stone-100 transition-colors resize-none"
                  placeholder="Tell clients or partners about your real estate expertise..."
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                <div>
                  <h3 className="text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight transition-colors">{profile.name}</h3>
                  <p className="text-stone-400 dark:text-stone-500 font-light mt-1 transition-colors">{profile.company || 'Private Account'} • {profile.location}</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-stone-900 dark:text-stone-100 uppercase tracking-[0.2em] border-b border-stone-100 dark:border-stone-800 pb-2 transition-colors">About</h4>
                  <p className="text-stone-600 dark:text-stone-400 font-light leading-relaxed transition-colors">
                    {profile.bio || "No bio provided. Complete your profile to connect with other users in the Unveil ecosystem."}
                  </p>
                </div>

                {profile.role === UserRole.AGENT && (
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold text-stone-900 dark:text-stone-100 uppercase tracking-[0.2em] border-b border-stone-100 dark:border-stone-800 pb-2 transition-colors">Recent Client Inquiries</h4>
                    <div className="space-y-4">
                      <div className="bg-stone-50 dark:bg-stone-800/50 p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-stone-100 dark:border-stone-700 flex items-center justify-center text-emerald-800 dark:text-emerald-500 font-bold transition-colors">JD</div>
                          <div>
                            <p className="text-sm font-bold text-stone-900 dark:text-stone-100 transition-colors">John Doe <span className="text-stone-400 dark:text-stone-500 font-normal">sent a vision</span></p>
                            <p className="text-[10px] text-stone-400 dark:text-stone-500 uppercase tracking-widest font-bold mt-0.5">Kitchen • Modern Farmhouse</p>
                          </div>
                        </div>
                        <button className="text-[10px] font-bold text-emerald-800 dark:text-emerald-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Review Vision</button>
                      </div>
                      <div className="bg-stone-50 dark:bg-stone-800/50 p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-stone-100 dark:border-stone-700 flex items-center justify-center text-emerald-800 dark:text-emerald-500 font-bold transition-colors">SM</div>
                          <div>
                            <p className="text-sm font-bold text-stone-900 dark:text-stone-100 transition-colors">Sarah Miller <span className="text-stone-400 dark:text-stone-500 font-normal">interested in listings</span></p>
                            <p className="text-[10px] text-stone-400 dark:text-stone-500 uppercase tracking-widest font-bold mt-0.5">Buckhead Fixer-Uppers</p>
                          </div>
                        </div>
                        <button className="text-[10px] font-bold text-emerald-800 dark:text-emerald-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Connect</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-8">
                <div className="bg-stone-50 dark:bg-stone-800/50 p-8 rounded-[2rem] border border-stone-100 dark:border-stone-800 transition-colors">
                  <h4 className="text-[10px] font-bold text-stone-900 dark:text-stone-100 uppercase tracking-[0.2em] mb-6 transition-colors">Account Status</h4>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[8px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1 transition-colors">Current Role</p>
                      <span className="inline-block px-4 py-1.5 bg-emerald-800 dark:bg-emerald-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest">
                        {profile.role}
                      </span>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1 transition-colors">Email</p>
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100 transition-colors">{profile.email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-950 dark:bg-emerald-900/30 p-8 rounded-[2rem] text-white transition-colors border border-transparent dark:border-emerald-800/30">
                  <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-4">Unveil Pro</h4>
                  <p className="text-xs text-stone-300 dark:text-stone-400 font-light leading-relaxed mb-6 transition-colors">
                    Connect directly with verified Agents in your market. Unveil Pro members get 2x faster spatial analysis.
                  </p>
                  <button className="w-full py-3 bg-white dark:bg-emerald-600 text-emerald-950 dark:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-50 dark:hover:bg-emerald-700 transition-colors shadow-xl shadow-emerald-900/40">
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
