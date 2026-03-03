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
    <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-sm border border-zinc-100 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
        <Vote size={120} />
      </div>
      <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-center font-display">
        {t.countdownTitle}
      </h3>
      <div className="grid grid-cols-4 gap-3 sm:gap-6">
        {units.map((unit, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <motion.div 
              key={unit.value}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-zinc-50 w-full aspect-square flex items-center justify-center rounded-3xl border border-zinc-100 mb-3 shadow-inner group-hover:border-emerald-100 transition-colors"
            >
              <span className="text-2xl sm:text-5xl font-black text-zinc-900 font-display tracking-tighter">
                {unit.value.toString().padStart(2, '0')}
              </span>
            </motion.div>
            <span className="text-[10px] sm:text-xs text-zinc-400 font-black uppercase tracking-widest">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Countdown;
