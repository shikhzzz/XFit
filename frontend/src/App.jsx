import React, { createContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import Dashboard from './components/Dashboard';
import MealLogger from './components/MealLogger';
import MealPlanner from './components/MealPlanner';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Navigation from './components/Navigation';
import Chatbot from './components/Chatbot';
import Onboarding from './components/Onboarding';

// Create Contexts
export const ThemeContext = createContext();
export const UserContext = createContext();

const defaultProfile = {
  name: 'Alex',
  age: 25,
  gender: 'Male',
  height: 175,
  weight: 70,
  goal: 'Maintenance',
  activityLevel: 'Moderate',
  bmr: 1675,
  tdee: 2596,
  dailyCalories: 2500,
  bmi: '22.9',
  dietType: 'None (Standard)',
  macros: { protein: 30, carbs: 40, fats: 30 },
  isOnboarded: false
};

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Initialize Profile from LocalStorage or default
  const [profile, setProfile] = useState(() => {
     const saved = localStorage.getItem('xfit_profile');
     return saved ? JSON.parse(saved) : defaultProfile;
  });

  const updateProfile = (data) => {
     setProfile(data);
     localStorage.setItem('xfit_profile', JSON.stringify(data));
  };

  const completeOnboarding = (data) => {
     updateProfile({ ...profile, ...data, isOnboarded: true });
  };

  // Apply dark theme class
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <UserContext.Provider value={{ profile, updateProfile }}>
        
        {/* Onboarding Wizard Gate */}
        {!profile.isOnboarded ? (
           <Onboarding onComplete={completeOnboarding} />
        ) : (
           <div className="min-h-screen overflow-x-hidden relative flex flex-col">
              <div className="mesh-bg"></div>
              
              {/* Top Navbar */}
              <motion.nav 
                initial={{ y: -100 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="fixed top-0 w-full z-40 border-b border-[var(--border-color)]"
                style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
              >
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-x-teal to-x-purple flex items-center justify-center font-black text-white shadow-lg text-xs">X</div>
                    <span className="font-extrabold text-lg tracking-tight text-[var(--text-main)]">XFit <span className="text-x-teal font-semibold text-xs">AI</span></span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex text-[10px] font-bold px-3 py-1.5 rounded-full border border-[var(--border-color)] items-center gap-2 bg-[var(--bg-input)] shadow-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-x-teal opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-x-teal"></span>
                      </span>
                      <span className="text-[var(--text-main)]">ROCm Active</span>
                    </div>
                    <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-[var(--bg-input)] transition-colors border border-transparent hover:border-[var(--border-color)]">
                      {darkMode ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-indigo-500" />}
                    </button>
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[var(--border-color)]">
                       <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${profile.name}`} alt="avatar" className="w-full h-full object-cover bg-x-purple/20" />
                    </div>
                  </div>
                </div>
              </motion.nav>

              {/* Main Content Workspace */}
              <main className="flex-1 pt-24 pb-24 px-4 max-w-4xl mx-auto w-full">
                <AnimatePresence mode="wait">
                   {activeTab === 'home' && (
                       <motion.div key="home" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                           <div className="text-center mb-8 relative">
                               <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">Accelerate your <span className="animate-shimmer">Fitness.</span></h1>
                               <p className="text-[var(--text-muted)] text-sm font-medium">Welcome back, {profile.name}!</p>
                           </div>
                           <Dashboard isDark={darkMode} />
                           <MealPlanner isDark={darkMode} />
                       </motion.div>
                   )}

                   {activeTab === 'log' && (
                       <motion.div key="log" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="h-full">
                           <MealLogger isDark={darkMode} />
                       </motion.div>
                   )}

                   {activeTab === 'profile' && (
                       <motion.div key="profile" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                           <Profile />
                       </motion.div>
                   )}

                   {activeTab === 'settings' && (
                       <motion.div key="settings" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                           <Settings />
                       </motion.div>
                   )}
                </AnimatePresence>
              </main>

              {/* Chat & Nav */}
              <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
              <Navigation activeTab={activeTab} setActiveTab={setActiveTab} toggleChat={() => setIsChatOpen(!isChatOpen)} />
           </div>
        )}
      </UserContext.Provider>
    </ThemeContext.Provider>
  )
}

export default App;
