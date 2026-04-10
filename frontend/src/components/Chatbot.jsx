import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Bot, Zap } from 'lucide-react';
import { UserContext } from '../App';

export default function Chatbot({ isOpen, onClose }) {
  const { profile } = useContext(UserContext);
  const [messages, setMessages] = React.useState([
    { sender: 'ai', text: "Hi! I'm XFit AI. I can analyze your macros or suggest workouts." }
  ]);
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  React.useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    const userMsg = text.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const resp = await fetch('http://localhost:8000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          context: {
            name: profile.name,
            goal: profile.goal,
            calories_target: profile.dailyCalories,
            calories_consumed: 0 // Mocked for hackathon
          }
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        // Artificial delay for UX
        setTimeout(() => {
          setMessages(prev => [...prev, { sender: 'ai', text: data.response, latency: data.inference_time_ms }]);
          setIsTyping(false);
        }, 800);
      } else {
         setIsTyping(false);
      }
    } catch {
      setIsTyping(false);
    }
  };

  const quickReplies = [
    "What should I eat?",
    "Suggest a workout",
    "Calorie status?"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%', opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: '100%', opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed bottom-20 lg:bottom-24 right-4 left-4 lg:left-auto lg:w-96 bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
            style={{ height: '500px' }}
          >
            <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-input)]">
               <div className="flex items-center gap-2">
                 <div className="p-1.5 bg-x-teal/20 rounded-lg"><Bot className="w-5 h-5 text-x-teal" /></div>
                 <div>
                   <h3 className="font-bold text-[var(--text-main)] text-sm">XFit Assistant</h3>
                   <span className="text-[10px] text-x-teal flex items-center gap-1"><span className="w-1.5 h-1.5 bg-x-teal rounded-full animate-pulse"></span> Online (ROCm)</span>
                 </div>
               </div>
               <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-[var(--text-muted)]"><X className="w-5 h-5"/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
               {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${m.sender === 'user' ? 'bg-x-teal text-navy text-black font-medium rounded-tr-sm' : 'bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-main)] rounded-tl-sm'}`}>
                        <p className="text-sm">{m.text}</p>
                        {m.latency && <p className="text-[8px] opacity-50 mt-1 flex items-center gap-1"><Zap className="w-2 h-2"/> {m.latency}ms</p>}
                     </div>
                  </div>
               ))}
               {isTyping && (
                  <div className="flex justify-start">
                     <div className="bg-[var(--bg-input)] rounded-2xl px-4 py-3 rounded-tl-sm flex gap-1">
                        <motion.div animate={{y:[0,-5,0]}} transition={{repeat:Infinity, duration:0.6}} className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full"/>
                        <motion.div animate={{y:[0,-5,0]}} transition={{repeat:Infinity, duration:0.6, delay:0.2}} className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full"/>
                        <motion.div animate={{y:[0,-5,0]}} transition={{repeat:Infinity, duration:0.6, delay:0.4}} className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full"/>
                     </div>
                  </div>
               )}
               <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-main)]">
               <div className="flex gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
                  {quickReplies.map((qr, idx) => (
                     <button key={idx} onClick={() => handleSend(qr)} className="whitespace-nowrap px-3 py-1.5 rounded-full border border-x-teal/30 bg-x-teal/10 text-x-teal text-xs font-semibold hover:bg-x-teal/20 transition-colors">
                        {qr}
                     </button>
                  ))}
               </div>
               <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="relative">
                  <input type="text" value={input} onChange={e=>setInput(e.target.value)} placeholder="Message XFit AI..." className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl py-3 pl-4 pr-12 text-sm text-[var(--text-main)] outline-none focus:ring-1 focus:ring-x-teal" />
                  <button type="submit" disabled={!input.trim()} className="absolute right-2 top-2 p-1.5 bg-x-teal text-black rounded-lg disabled:opacity-50 hover:scale-105 active:scale-95 transition-all"><Send className="w-4 h-4"/></button>
               </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
