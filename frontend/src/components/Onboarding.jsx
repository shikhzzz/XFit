import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Zap, Target } from 'lucide-react';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: '',
    goal: 'Maintenance',
    activityLevel: 'Moderate',
    targetCal: 2500
  });

  const variants = {
     enter: { x: 50, opacity: 0 },
     center: { x: 0, opacity: 1 },
     exit: { x: -50, opacity: 0 }
  };

  const handleNext = () => {
     if(step < 3) setStep(step + 1);
     else onComplete(data);
  }

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-main)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
         {/* Progress Bar */}
         <div className="flex gap-2 mb-8">
             <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-x-teal' : 'bg-[var(--border-color)]'}`}></div>
             <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-x-teal' : 'bg-[var(--border-color)]'}`}></div>
             <div className={`h-1 flex-1 rounded-full ${step >= 3 ? 'bg-x-teal' : 'bg-[var(--border-color)]'}`}></div>
         </div>

         <AnimatePresence mode="wait">
            {step === 1 && (
               <motion.div key="1" variants={variants} initial="enter" animate="center" exit="exit" className="bg-[var(--bg-card)] p-8 rounded-3xl border border-[var(--border-color)] shadow-2xl">
                  <div className="w-12 h-12 bg-x-teal/20 rounded-2xl flex items-center justify-center mb-6"><Zap className="w-6 h-6 text-x-teal"/></div>
                  <h1 className="text-3xl font-black mb-2 tracking-tight">Welcome to XFit.</h1>
                  <p className="text-[var(--text-muted)] mb-8">Let's personalize your AI fitness experience.</p>
                  
                  <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">First Name</label>
                  <input type="text" value={data.name} onChange={e=>setData({...data, name: e.target.value})} className="input-field mb-6 text-lg" placeholder="e.g. Alex" autoFocus />
                  
                  <button disabled={!data.name} onClick={handleNext} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
                     Continue <ChevronRight className="w-5 h-5"/>
                  </button>
               </motion.div>
            )}

            {step === 2 && (
               <motion.div key="2" variants={variants} initial="enter" animate="center" exit="exit" className="bg-[var(--bg-card)] p-8 rounded-3xl border border-[var(--border-color)] shadow-2xl">
                  <div className="w-12 h-12 bg-x-purple/20 rounded-2xl flex items-center justify-center mb-6"><Target className="w-6 h-6 text-x-purple"/></div>
                  <h1 className="text-3xl font-black mb-2 tracking-tight">Your Goal.</h1>
                  <p className="text-[var(--text-muted)] mb-8">Select your primary fitness objective.</p>
                  
                  <div className="space-y-3 mb-8">
                     {['Weight Loss', 'Maintenance', 'Muscle Gain'].map(goal => (
                         <button key={goal} onClick={()=>setData({...data, goal})} className={`w-full p-4 rounded-xl border text-left font-bold transition-all ${data.goal === goal ? 'border-x-purple bg-x-purple/10 text-x-purple' : 'border-[var(--border-color)] bg-[var(--bg-input)] hover:bg-[var(--border-color)]'}`}>
                             {goal}
                         </button>
                     ))}
                  </div>
                  
                  <button onClick={handleNext} className="w-full btn-primary bg-gradient-to-r from-x-purple to-indigo-600 flex items-center justify-center gap-2">
                     Continue <ChevronRight className="w-5 h-5"/>
                  </button>
               </motion.div>
            )}

            {step === 3 && (
               <motion.div key="3" variants={variants} initial="enter" animate="center" exit="exit" className="bg-[var(--bg-card)] p-8 rounded-3xl border border-[var(--border-color)] shadow-2xl text-center">
                  <div className="relative mb-8 mt-4">
                     <svg className="w-32 h-32 mx-auto transform -rotate-90">
                         <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-[var(--border-color)]" />
                         <motion.circle cx="64" cy="64" r="56" stroke="#00D4AA" strokeWidth="12" fill="transparent" strokeDasharray="351" strokeDashoffset="0" className="drop-shadow-lg" strokeLinecap="round" initial={{strokeDashoffset: 351}} animate={{strokeDashoffset: 0}} transition={{delay: 0.3, duration: 1.5}}/>
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-x-teal">{data.targetCal}</span>
                        <span className="text-[10px] font-bold text-[var(--text-muted)]">KCAL Goal</span>
                     </div>
                  </div>

                  <h1 className="text-2xl font-black mb-2">Analyzing Profile...</h1>
                  <p className="text-[var(--text-muted)] mb-8 text-sm">We've generated an initial baseline. You can adjust this in Settings anytime.</p>
                  
                  <button onClick={handleNext} className="w-full btn-primary flex items-center justify-center gap-2">
                     Launch XFit AI
                  </button>
               </motion.div>
            )}
         </AnimatePresence>

         <div className="text-center mt-6">
            <button onClick={() => onComplete(data)} className="text-[var(--text-muted)] font-semibold text-sm hover:text-[var(--text-main)] transition-colors">Skip Onboarding</button>
         </div>
      </div>
    </div>
  );
}
