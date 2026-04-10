import React, { useContext, useState } from 'react';
import { UserContext } from '../App';
import { Camera, Save, Activity, Target, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  const { profile, updateProfile } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const calculateMetrics = (data) => {
    // Simple BMR (Mifflin-St Jeor) assuming Metric
    let bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age;
    bmr += (data.gender === 'Male' ? 5 : -161);
    
    // Activity multiplier
    const multipliers = { 'Sedentary': 1.2, 'Light': 1.375, 'Moderate': 1.55, 'Very Active': 1.725 };
    const tdee = bmr * (multipliers[data.activityLevel] || 1.2);
    
    // Goal offset
    let target = tdee;
    if(data.goal === 'Weight Loss') target -= 500;
    if(data.goal === 'Muscle Gain') target += 500;
    
    const bmi = data.weight / ((data.height / 100) ** 2);
    return { bmr: Math.round(bmr), tdee: Math.round(tdee), dailyCalories: Math.round(target), bmi: bmi.toFixed(1) };
  };

  const handleSave = () => {
    const metrics = calculateMetrics(formData);
    updateProfile({ ...formData, ...metrics });
    setIsEditing(false);
  };

  return (
    <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* Header Profile Card */}
      <div className="card-glass relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-x-purple to-x-teal opacity-20"></div>
         <div className="relative z-10 flex flex-col items-center pt-8">
            <div className="relative mb-4">
               <div className="w-24 h-24 rounded-full bg-[var(--bg-input)] border-4 border-[var(--bg-main)] shadow-xl overflow-hidden flex items-center justify-center">
                   <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${profile.name}`} alt="avatar" className="w-full h-full object-cover" />
               </div>
               <button className="absolute bottom-0 right-0 p-2 bg-x-teal text-navy rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform"><Camera className="w-4 h-4 text-black"/></button>
            </div>
            <h2 className="text-2xl font-black">{profile.name}</h2>
            <p className="text-[var(--text-muted)] font-medium text-sm">{profile.activityLevel} • {profile.goal}</p>
         </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-4">
          <div className="bg-[var(--bg-input)] rounded-2xl p-4 border border-[var(--border-color)] text-center">
             <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">BMI</p>
             <p className="text-xl font-bold mt-1 text-x-purple">{profile.bmi}</p>
          </div>
          <div className="bg-[var(--bg-input)] rounded-2xl p-4 border border-[var(--border-color)] text-center">
             <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">BMR</p>
             <p className="text-xl font-bold mt-1">{profile.bmr} <span className="text-[10px] font-normal">kcal</span></p>
          </div>
          <div className="bg-[var(--bg-input)] rounded-2xl p-4 border border-[var(--border-color)] text-center flex flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-x-teal/10"></div>
             <p className="text-[10px] uppercase font-bold text-x-teal tracking-wider relative z-10">Target</p>
             <p className="text-xl font-black mt-1 text-x-teal relative z-10">{profile.dailyCalories}</p>
          </div>
      </div>

      {/* Editor Form */}
      <div className="card-glass">
         <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold flex items-center gap-2"><Target className="w-5 h-5 text-x-purple"/> Profile Data</h3>
             <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className="flex items-center gap-1 text-sm font-semibold text-x-teal px-3 py-1.5 rounded-lg bg-x-teal/10 hover:bg-x-teal/20 transition-colors">
               {isEditing ? <><Save className="w-4 h-4"/> Save</> : <><Edit2 className="w-4 h-4"/> Edit</>}
             </button>
         </div>

         <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
               <div>
                  <label className="block text-[var(--text-muted)] font-bold mb-1 text-xs">Name</label>
                  <input type="text" disabled={!isEditing} value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-main)] disabled:opacity-50" />
               </div>
               <div>
                  <label className="block text-[var(--text-muted)] font-bold mb-1 text-xs">Gender</label>
                  <select disabled={!isEditing} value={formData.gender} onChange={e=>setFormData({...formData, gender: e.target.value})} className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-main)] disabled:opacity-50">
                     <option>Male</option><option>Female</option>
                  </select>
               </div>
               <div>
                  <label className="block text-[var(--text-muted)] font-bold mb-1 text-xs">Age</label>
                  <input type="number" disabled={!isEditing} value={formData.age} onChange={e=>setFormData({...formData, age: Number(e.target.value)})} className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-main)] disabled:opacity-50" />
               </div>
               <div>
                  <label className="block text-[var(--text-muted)] font-bold mb-1 text-xs">Height (cm)</label>
                  <input type="number" disabled={!isEditing} value={formData.height} onChange={e=>setFormData({...formData, height: Number(e.target.value)})} className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-main)] disabled:opacity-50" />
               </div>
               <div>
                  <label className="block text-[var(--text-muted)] font-bold mb-1 text-xs">Weight (kg)</label>
                  <input type="number" disabled={!isEditing} value={formData.weight} onChange={e=>setFormData({...formData, weight: Number(e.target.value)})} className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-main)] disabled:opacity-50" />
               </div>
               <div>
                  <label className="block text-[var(--text-muted)] font-bold mb-1 text-xs">Activity Level</label>
                  <select disabled={!isEditing} value={formData.activityLevel} onChange={e=>setFormData({...formData, activityLevel: e.target.value})} className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-main)] disabled:opacity-50 text-xs">
                     <option>Sedentary</option><option>Light</option><option>Moderate</option><option>Very Active</option>
                  </select>
               </div>
               <div className="col-span-2">
                  <label className="block text-[var(--text-muted)] font-bold mb-1 text-xs">Fitness Goal</label>
                  <select disabled={!isEditing} value={formData.goal} onChange={e=>setFormData({...formData, goal: e.target.value})} className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-[var(--text-main)] disabled:opacity-50 text-sm font-semibold">
                     <option>Weight Loss</option><option>Maintenance</option><option>Muscle Gain</option><option>Endurance</option>
                  </select>
               </div>
            </div>
         </div>
      </div>
      
      {/* Progress Cards */}
      <div className="grid grid-cols-2 gap-4">
         <div className="bg-[var(--bg-input)] rounded-2xl p-4 border border-[var(--border-color)] flex items-center justify-between">
             <div>
                <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">Streak</p>
                <p className="text-xl font-bold mt-1">12 <span className="text-[10px] font-normal">days</span></p>
             </div>
             <Activity className="w-8 h-8 text-orange-500 opacity-80" />
         </div>
         <div className="bg-[var(--bg-input)] rounded-2xl p-4 border border-[var(--border-color)] flex items-center justify-between">
             <div>
                <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">Workouts</p>
                <p className="text-xl font-bold mt-1">45</p>
             </div>
             <Target className="w-8 h-8 text-x-purple opacity-80" />
         </div>
      </div>
    </motion.div>
  );
}
