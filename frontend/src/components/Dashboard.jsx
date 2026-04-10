import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity } from 'lucide-react';

const mockTrendData = [
  { name: 'Mon', in: 2100, out: 2400 },
  { name: 'Tue', in: 1950, out: 2200 },
  { name: 'Wed', in: 2400, out: 2100 },
  { name: 'Thu', in: 2200, out: 2500 },
  { name: 'Fri', in: 2600, out: 2000 },
  { name: 'Sat', in: 2800, out: 2400 },
  { name: 'Sun', in: 2000, out: 2100 },
];

function CountUpAnimation({ endVal }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = endVal / (duration / 16);
    if(endVal === 0) return;
    const timer = setInterval(() => {
      start += increment;
      if (start >= endVal) {
        setCount(endVal);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [endVal]);
  return <>{Math.floor(count)}</>;
}

export default function Dashboard({ isDark }) {
  const [stats, setStats] = useState({
    calories_intake: 0,
    calories_burned: 0,
    meals_logged: 0,
    workouts_logged: 0
  });

  useEffect(() => {
    // Polling simulation
    const fetchDashboard = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/dashboard');
        if (response.ok) {
          const data = await response.json();
          // Update last day of trend map with fetched data to simulate real-time
          if(data.calories_intake > 0 || data.calories_burned > 0) {
              mockTrendData[6].in = 2000 + data.calories_intake;
              mockTrendData[6].out = 2100 + data.calories_burned;
          }
          setStats(data);
        }
      } catch (err) {}
    };
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 5000);
    return () => clearInterval(interval);
  }, []);

  const dailyGoal = 2500;
  const calSum = stats.calories_intake;
  const progressPercent = Math.min(100, Math.max(0, (calSum / dailyGoal) * 100));
  
  let progressColor = '#00D4AA'; // Green
  if(calSum > dailyGoal * 0.9 && calSum <= dailyGoal) progressColor = '#F59E0B'; // Amber
  if(calSum > dailyGoal) progressColor = '#EF4444'; // Red

  return (
    <div className="card-glass w-full">
      <div className="flex justify-between items-center mb-6 border-b border-[var(--border-color)] pb-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <div className="p-2 bg-x-teal/10 rounded-xl">
             <Activity className="w-6 h-6 text-x-teal" />
          </div>
          Performance Dashboard
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Circular Goal & Metrics */}
        <div className="lg:w-1/3 flex flex-col gap-4">
            
            {/* Circle Progress Segment */}
            <div className="bg-[var(--bg-input)] rounded-2xl p-6 border border-[var(--border-color)] flex items-center justify-between">
                <div>
                   <p className="text-[var(--text-muted)] text-sm font-bold uppercase tracking-widest mb-1">Daily Intake</p>
                   <div className="text-4xl font-black mb-2"><CountUpAnimation endVal={calSum} /></div>
                   <p className="text-xs font-medium text-[var(--text-muted)]">Goal: {dailyGoal} kcal</p>
                </div>
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-[var(--border-color)]" />
                    <circle 
                      cx="48" cy="48" r="40" stroke={progressColor} strokeWidth="8" fill="transparent"
                      strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * progressPercent) / 100}
                      className="transition-all duration-1000 ease-out" strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">
                    {Math.round(progressPercent)}%
                  </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border-color)]">
                <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider mb-1">Burned</p>
                <div className="text-2xl font-bold text-x-purple"><CountUpAnimation endVal={stats.calories_burned} /></div>
              </div>
              <div className="bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border-color)]">
                <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider mb-1">Meals</p>
                <div className="text-2xl font-bold"><CountUpAnimation endVal={stats.meals_logged} /></div>
              </div>
            </div>
        </div>

        {/* Right Side: Recharts 7 Day Trend */}
        <div className="lg:w-2/3 h-64 mt-4 lg:mt-0">
          <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider mb-4">7-Day Trend</p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} vertical={false} />
              <XAxis dataKey="name" stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Line type="monotone" dataKey="in" name="Intake" stroke="#00D4AA" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="out" name="Burned" stroke="#7C3AED" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
