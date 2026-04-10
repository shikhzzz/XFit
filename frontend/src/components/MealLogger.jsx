import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Zap, Database } from 'lucide-react';

export default function MealLogger({ isDark }) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description) return;
    
    setLoading(true);
    setResult(null);
    try {
      const resp = await fetch('http://localhost:8000/api/log_meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
      });
      if (resp.ok) {
        const res = await fetch('http://localhost:8000/api/ai/suggest_meal', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ description })
        });
        const data = await res.json();
        // Give skeleton a minimum time to render for visual feedback
        await new Promise(r => setTimeout(r, 600)); 
        setResult(data);
        setDescription('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getEmoji = (desc) => {
     const str = desc.toLowerCase();
     if(str.includes('egg')) return '🍳';
     if(str.includes('chicken')) return '🍗';
     if(str.includes('salad')) return '🥗';
     if(str.includes('steak') || str.includes('beef')) return '🥩';
     if(str.includes('avocado')) return '🥑';
     if(str.includes('toast') || str.includes('bread')) return '🍞';
     if(str.includes('milk') || str.includes('protein')) return '🥛';
     if(str.includes('apple')) return '🍎';
     if(str.includes('burger')) return '🍔';
     return '🍽️';
  }

  // Helper macro ring
  const MacroRing = ({ value, color, label }) => {
     const cap = Math.max(100, value);
     const strokeDash = (value / cap) * 113; // 113 is aprox circumference for r=18
     return (
        <div className="flex flex-col items-center">
            <div className="relative w-14 h-14 mb-1">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="28" cy="28" r="18" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-[var(--border-color)]" />
                    <circle cx="28" cy="28" r="18" stroke={color} strokeWidth="4" fill="transparent"
                      strokeDasharray="113" strokeDashoffset={113 - strokeDash}
                      className="transition-all duration-1000 ease-out drop-shadow-md" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-xs">{value}g</div>
            </div>
            <p className="text-xs font-bold text-[var(--text-muted)]">{label}</p>
        </div>
     );
  }

  return (
    <div className="card-glass w-full h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-x-teal/20 rounded-xl shadow-[0_0_15px_rgba(0,212,170,0.2)]">
          <Utensils className="w-6 h-6 text-x-teal" />
        </div>
        <h2 className="text-xl font-extrabold flex-1">Food Logger</h2>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 relative">
        <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">What did you eat?</label>
        <div className="relative">
            <input 
              type="text" 
              className="input-field input-pulse-focus pl-10 h-14 text-lg" 
              placeholder="e.g. Avocado toast with 3 eggs"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <span className="absolute left-3 top-4 text-xl opacity-70">🥑</span>
            <button 
                type="submit" 
                disabled={loading || !description} 
                className="absolute right-2 top-2 bg-gradient-to-r from-x-teal to-emerald-500 text-white p-2 rounded-lg font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
            >
                <Database className="w-5 h-5" />
            </button>
        </div>
      </form>

      <div className="flex-1 relative">
          <AnimatePresence mode="wait">
             {loading && (
                <motion.div 
                    key="skeleton"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="space-y-4"
                >
                   <div className="h-6 bg-[var(--bg-input)] rounded-full w-1/3 animate-pulse"></div>
                   <div className="flex justify-between mt-4">
                      <div className="w-16 h-16 bg-[var(--border-color)] rounded-full animate-pulse"></div>
                      <div className="w-16 h-16 bg-[var(--border-color)] rounded-full animate-pulse"></div>
                      <div className="w-16 h-16 bg-[var(--border-color)] rounded-full animate-pulse"></div>
                      <div className="w-16 h-16 bg-[var(--border-color)] rounded-full animate-pulse"></div>
                   </div>
                </motion.div>
             )}

             {result && !loading && (
                <motion.div 
                    key="result"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="bg-gradient-to-br from-[var(--bg-input)] to-transparent rounded-2xl p-5 border border-[var(--border-color)] shadow-sm"
                >
                   <div className="flex justify-between items-start mb-6">
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className="text-2xl">{getEmoji(result.description)}</span>
                             <h3 className="font-bold text-lg capitalize">{result.description}</h3>
                          </div>
                          <span className="text-xs font-medium text-x-teal flex items-center gap-1">
                              <Zap className="w-3 h-3" /> ROCm Inference: {result.inference_time_ms}ms
                          </span>
                       </div>
                       
                       <div className="text-right">
                           <div className="text-3xl font-black">{result.predicted_calories}</div>
                           <p className="text-xs font-bold text-[var(--text-muted)]">KCAL</p>
                       </div>
                   </div>

                   <div className="flex justify-around items-center pt-2 border-t border-[var(--border-color)]">
                       <MacroRing value={result.predicted_protein} color="#7C3AED" label="PRO" />
                       <MacroRing value={result.predicted_carbs} color="#00D4AA" label="CARB" />
                       <MacroRing value={result.predicted_fats} color="#F59E0B" label="FAT" />
                   </div>
                </motion.div>
             )}

             {!result && !loading && (
                 <div className="h-full flex items-center justify-center flex-col text-[var(--text-muted)] opacity-50 pb-6">
                     <Utensils className="w-12 h-12 mb-3" />
                     <p className="font-medium text-sm">Tell the AI what you consumed.</p>
                 </div>
             )}
          </AnimatePresence>
      </div>
    </div>
  );
}
