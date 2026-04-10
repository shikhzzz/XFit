import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function MealPlanner({ isDark }) {
  const [goal, setGoal] = useState('maintenance');
  const [diet, setDiet] = useState('none');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [chartData, setChartData] = useState([]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPlan(null);
    try {
      const resp = await fetch(`http://localhost:8000/api/ai/plan_meals?goal=${goal}&diet_pref=${diet}`, { method: 'POST' });
      if (resp.ok) {
        const data = await resp.json();
        await new Promise(r => setTimeout(r, 600)); 
        setPlan(data);
        
        // Mock chart data generation based on the plan since the API doesn't return raw macros for the plan array yet
        const baseCals = goal === 'gain muscle' ? 2800 : goal === 'lose weight' ? 1800 : 2300;
        const mockCharts = data.plan.map((p, i) => ({
            day: p.day.substring(0, 3),
            cals: baseCals + (Math.random() * 300 - 150),
            protein: (baseCals * 0.3) / 4 + (Math.random()*20),
            carbs: (baseCals * 0.4) / 4,
            fats: (baseCals * 0.3) / 9
        }));
        setChartData(mockCharts);
      }
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDayColor = (idx) => {
      const colors = ['border-x-teal', 'border-x-purple', 'border-indigo-500'];
      return colors[idx % colors.length];
  }

  const getBgColor = (idx) => {
    const colors = ['bg-x-teal/10', 'bg-x-purple/10', 'bg-indigo-500/10'];
    return colors[idx % colors.length];
  }

  return (
    <div className="card-glass w-full h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-x-purple/20 rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.2)]">
          <Calendar className="w-6 h-6 text-x-purple" />
        </div>
        <h2 className="text-xl font-extrabold flex-1">Smart Planner</h2>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Goal Target</label>
            <select 
              className="input-field appearance-none cursor-pointer font-bold"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            >
              <option value="gain muscle">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
              <option value="lose weight">Fat Loss</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Dietary Pref</label>
            <select 
              className="input-field appearance-none cursor-pointer font-bold"
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
            >
              <option value="none">Standard</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Keto</option>
            </select>
          </div>
        </div>
        
        <button type="submit" disabled={loading} className="w-full relative overflow-hidden group bg-gradient-to-r from-[var(--bg-input)] to-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] py-3 rounded-xl font-bold shadow-sm hover:shadow-md transition-all pt bg-white/5 active:scale-95 disabled:opacity-50">
          <div className="absolute inset-0 w-1/4 h-full bg-x-purple/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-[400%] transition-transform duration-700"></div>
          {loading ? 'Synthesizing...' : 'Generate AI Plan'}
        </button>
      </form>

      <div className="flex-1">
          <AnimatePresence mode="wait">
             {loading && (
                 <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="space-y-3 mt-4">
                     {[1,2,3].map(i => (
                         <div key={i} className="h-16 rounded-xl bg-[var(--bg-input)] animate-pulse"></div>
                     ))}
                 </motion.div>
             )}

             {plan && !loading && (
                 <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="mt-2 text-sm flex flex-col gap-4">
                     <div className="space-y-3">
                         {plan.plan.map((dayPlan, idx) => (
                             <div key={idx} className={`p-4 rounded-xl border-l-4 ${getDayColor(idx)} bg-opacity-40 backdrop-blur-sm ${getBgColor(idx)}`}>
                                 <div className="flex justify-between items-center mb-2">
                                     <span className="font-extrabold text-[var(--text-main)]">{dayPlan.day}</span>
                                     <span className="badge bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)] flex items-center gap-1">
                                        ~{Math.round(chartData[idx]?.cals || 2500)} <span className="text-[10px] font-normal">KCAL</span>
                                     </span>
                                 </div>
                                 <ul className="space-y-1.5 text-[var(--text-muted)] font-medium text-xs">
                                     <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 text-[var(--border-color)] shrink-0"/> <span className="flex-1"><strong className="text-[var(--text-main)] font-semibold">Morning:</strong> {dayPlan.breakfast}</span></li>
                                     <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 text-[var(--border-color)] shrink-0"/> <span className="flex-1"><strong className="text-[var(--text-main)] font-semibold">Mid-day:</strong> {dayPlan.lunch}</span></li>
                                     <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 text-[var(--border-color)] shrink-0"/> <span className="flex-1"><strong className="text-[var(--text-main)] font-semibold">Evening:</strong> {dayPlan.dinner}</span></li>
                                 </ul>
                             </div>
                         ))}
                     </div>
                     
                     <div className="h-32 mt-2 pt-4 border-t border-[var(--border-color)]">
                         <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Predicted Macro Intake</p>
                         <ResponsiveContainer width="100%" height="80%">
                             <BarChart data={chartData}>
                                 <XAxis dataKey="day" hide />
                                 <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }}/>
                                 <Bar dataKey="protein" stackId="a" fill="#7C3AED" radius={[0,0,4,4]} />
                                 <Bar dataKey="carbs" stackId="a" fill="#00D4AA" />
                                 <Bar dataKey="fats" stackId="a" fill="#F59E0B" radius={[4,4,0,0]} />
                             </BarChart>
                         </ResponsiveContainer>
                     </div>
                 </motion.div>
             )}
          </AnimatePresence>
      </div>
    </div>
  );
}
