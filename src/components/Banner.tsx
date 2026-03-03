import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, ChevronRight, ChevronLeft, Vote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { parties } from '../data/parties';
import { getOverallResults } from '../services/voteService';

const Banner: React.FC = () => {
  const [trending, setTrending] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTrending = async () => {
      const results = await getOverallResults();
      const items: any[] = [];
      
      if (results) {
        const sorted = parties
          .map(p => ({
            ...p,
            votes: results[p.id] || 0,
            type: 'Trending Leader',
            description: `Leading the community pulse with ${results[p.id] || 0} opinions shared.`
          }))
          .sort((a, b) => b.votes - a.votes)
          .slice(0, 2);
        items.push(...sorted);
      }

      // Add some featured topics
      items.push({
        id: 'feat-1',
        name: 'Infrastructure Vision',
        type: 'Featured Debate',
        description: 'What should be the top priority for TN infrastructure in 2026?',
        image: 'https://images.unsplash.com/photo-1545143333-6382f1d5b893?auto=format&fit=crop&w=800&q=80',
        link: '/forum'
      });
      items.push({
        id: 'feat-2',
        name: 'Political IQ Challenge',
        type: 'Trending Quiz',
        description: 'Think you know TN politics? Prove it and earn your rank!',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
        link: '/game'
      });

      setTrending(items);
    };
    fetchTrending();
  }, []);

  useEffect(() => {
    if (trending.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % trending.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [trending]);

  if (trending.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto w-full px-4 mb-12">
      <div className="relative h-48 sm:h-64 rounded-[2.5rem] overflow-hidden bg-zinc-900 shadow-2xl group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="absolute inset-0 flex items-center p-8 sm:p-12"
          >
            <div className="absolute inset-0 opacity-20">
              <img 
                src={trending[currentIndex].image} 
                alt="" 
                className="w-full h-full object-cover blur-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8 w-full">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white p-4 shadow-2xl flex-shrink-0">
                <img 
                  src={trending[currentIndex].image} 
                  alt={trending[currentIndex].name} 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-3">
                  <TrendingUp size={12} />
                  {trending[currentIndex].type}
                </div>
                <h3 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tighter leading-none mb-2">
                  {trending[currentIndex].name}
                </h3>
                <p className="text-zinc-400 font-medium text-sm sm:text-lg">
                  {trending[currentIndex].description}
                </p>
              </div>

              <Link 
                to={trending[currentIndex].link || '/results'} 
                className="bg-white text-zinc-900 px-8 py-4 rounded-full font-black text-sm flex items-center gap-2 hover:bg-emerald-400 transition-all shadow-xl"
              >
                View Details
                <ChevronRight size={18} />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {trending.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                currentIndex === i ? 'w-8 bg-emerald-500' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
