import React from 'react';
import { Home, Database, MessageSquare, User, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navigation({ activeTab, setActiveTab, toggleChat }) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'log', icon: Database, label: 'Food Log' },
    { id: 'chat', icon: MessageSquare, label: 'Chatbot', action: toggleChat },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' }
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full z-40 px-4 pb-4 pt-2 bg-gradient-to-t from-[var(--bg-main)] to-transparent pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl flex justify-between items-center px-2 py-2 shadow-2xl relative">
          {navItems.map((item) => {
            const isActive = activeTab === item.id && item.id !== 'chat';
            return (
              <button
                key={item.id}
                onClick={() => item.action ? item.action() : setActiveTab(item.id)}
                className="relative flex-1 flex flex-col items-center justify-center py-2 z-10 transition-colors"
                style={{ color: isActive ? 'var(--text-main)' : 'var(--text-muted)' }}
              >
                {isActive && (
                  <motion.div
                    layoutId="navBubble"
                    className="absolute inset-0 bg-[var(--bg-input)] rounded-xl border border-[var(--border-color)] shadow-sm"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <item.icon className="w-5 h-5 mb-1 relative z-10" />
                <span className="text-[10px] font-bold relative z-10">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
