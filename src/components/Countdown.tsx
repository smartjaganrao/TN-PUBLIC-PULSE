import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Vote } from 'lucide-react';

const Countdown: React.FC = () => {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Target date: May 2026 (approximate)
    const targetDate = new Date('2026-05-01T00:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const units = [
    { label: t.days, value: timeLeft.days },
    { label: t.hours, value: timeLeft.hours },
    { label: t.minutes, value: timeLeft.minutes },
    { label: t.seconds, value: timeLeft.seconds }
  ];

  return (
    <div className="bg-zinc-900 text-white rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden group border border-white/5">
      <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
        <Vote size={120} />
      </div>
      <h3 className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-center font-display">
        The Final Countdown
      </h3>
      <div className="grid grid-cols-4 gap-3 sm:gap-6">
        {units.map((unit, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <motion.div 
              key={unit.value}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white/5 w-full aspect-square flex items-center justify-center rounded-3xl border border-white/10 mb-3 backdrop-blur-md group-hover:border-emerald-500/30 transition-colors"
            >
              <span className="text-2xl sm:text-5xl font-black text-white font-display tracking-tighter">
                {unit.value.toString().padStart(2, '0')}
              </span>
            </motion.div>
            <span className="text-[10px] sm:text-xs text-zinc-500 font-black uppercase tracking-widest">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Countdown;
