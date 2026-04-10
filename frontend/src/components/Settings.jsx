import React, { useContext } from 'react';
import { UserContext, ThemeContext } from '../App';
import { Settings as SettingsIcon, Bell, Monitor, Activity, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Settings() {
  const { profile, updateProfile } = useContext(UserContext);
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const handleMacroChange = (type, val) => {
    updateProfile({ ...profile, macros: { ...profile.macros, [type]: Number(val) } });
  }

  return (
    <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="max-w-2xl mx-auto space-y-6 pb-24">
       <div className="flex items-center gap-3 mb-8 border-b border-[var(--border-color)] pb-4">
           <div className="p-2 bg-[var(--bg-input)] rounded-xl border border-[var(--border-color)]">
               <SettingsIcon className="w-6 h-6 text-[var(--text-main)]" />
           </div>
           <h2 className="text-2xl font-black">Settings</h2>
       </div>

       {/* Macros Editor */}
       <div className="card-glass">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-x-teal"/> Macro Split Targets</h3>
          
          <div className="space-y-6">
             <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                   <span className="text-[var(--text-muted)]">Protein</span>
                   <span className="text-x-purple">{profile.macros.protein}%</span>
                </div>
                <input type="range" min="10" max="60" value={profile.macros.protein} onChange={e=>handleMacroChange('protein', e.target.value)} className="w-full accent-x-purple" />
             </div>
             <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                   <span className="text-[var(--text-muted)]">Carbs</span>
                   <span className="text-x-teal">{profile.macros.carbs}%</span>
                </div>
                <input type="range" min="10" max="70" value={profile.macros.carbs} onChange={e=>handleMacroChange('carbs', e.target.value)} className="w-full accent-x-teal" />
             </div>
             <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                   <span className="text-[var(--text-muted)]">Fats</span>
                   <span className="text-orange-500">{profile.macros.fats}%</span>
                </div>
                <input type="range" min="10" max="50" value={profile.macros.fats} onChange={e=>handleMacroChange('fats', e.target.value)} className="w-full accent-orange-500" />
             </div>
          </div>
          
          <div className="mt-4 p-3 bg-x-teal/10 rounded-xl text-xs font-medium text-x-teal border border-x-teal/20">
             Total: {profile.macros.protein + profile.macros.carbs + profile.macros.fats}% (Must equal 100% for planner accuracy)
          </div>
       </div>

       <div className="card-glass space-y-4">
           {/* Toggles */}
           <div className="flex justify-between items-center py-2 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-3">
                 <Monitor className="w-5 h-5 text-[var(--text-muted)]" />
                 <div><p className="font-bold text-sm">Dark Theme</p><p className="text-xs text-[var(--text-muted)]">Toggle application high-contrast</p></div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                <div className="w-11 h-6 bg-[var(--border-color)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-x-teal"></div>
              </label>
           </div>
           
           <div className="flex justify-between items-center py-2 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-3">
                 <Bell className="w-5 h-5 text-[var(--text-muted)]" />
                 <div><p className="font-bold text-sm">Push Notifications</p><p className="text-xs text-[var(--text-muted)]">Reminders for meals & workouts</p></div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={true} readOnly />
                <div className="w-11 h-6 bg-[var(--border-color)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-x-purple"></div>
              </label>
           </div>

           <div className="py-2">
              <label className="block text-[var(--text-muted)] font-bold mb-2 text-xs uppercase tracking-wider">Dietary Preference</label>
              <select value={profile.dietType} onChange={e=>updateProfile({...profile, dietType: e.target.value})} className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] font-semibold shadow-sm focus:ring-1 focus:ring-x-teal outline-none">
                 <option>None (Standard)</option><option>Vegetarian</option><option>Vegan</option><option>Keto</option><option>Paleo</option>
              </select>
           </div>
       </div>

       <button className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-red-500/20 text-red-500 font-bold bg-red-500/5 hover:bg-red-500/10 transition-colors">
          <LogOut className="w-4 h-4" /> Sign Out
       </button>
    </motion.div>
  );
}
