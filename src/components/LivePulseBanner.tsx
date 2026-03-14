import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, ChevronRight, Share2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { parties } from '../data/parties';
import { subscribeToOverallResults } from '../services/voteService';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

const LivePulseBanner: React.FC = () => {
  const [results, setResults] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    const unsubscribe = subscribeToOverallResults((data) => {
      setResults(data);
    });
    return () => {
      window.removeEventListener('resize', checkMobile);
      unsubscribe();
    };
  }, []);

  const chartData = parties
    .map(p => ({
      name: p.name,
      votes: results ? (results[p.id] || 0) : 0,
      color: p.color
    }))
    .sort((a, b) => b.votes - a.votes);

  const totalVotes = results?.totalVotes || 0;

  return (
    <div className="max-w-6xl mx-auto w-full px-4 mb-12">
      <div className="relative bg-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -mr-32 -mt-32" />
        
        <div className="relative z-10 p-6 sm:p-10 flex flex-col lg:flex-row items-center gap-8 sm:gap-12">
          {/* Left Content */}
          <div className="flex-1 space-y-4 sm:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] sm:text-[10px] font-black text-emerald-400 uppercase tracking-widest">
              <Zap size={12} className="animate-pulse" />
              Real-Time Community Pulse
            </div>
            <h3 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tighter leading-none">
              Who's <span className="text-emerald-400">Winning</span> the Digital Wave?
            </h3>
            <p className="text-zinc-400 font-medium text-sm sm:text-lg max-w-xl">
              Join {totalVotes.toLocaleString()} others in shaping the future. Every opinion counts in this live pulse of Tamil Nadu.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              <Link 
                to="/vote" 
                className="bg-emerald-500 text-white px-8 py-3 sm:py-4 rounded-full font-black text-xs sm:text-sm flex items-center gap-2 hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20"
              >
                Cast Your Vote
                <ChevronRight size={18} />
              </Link>
              <Link 
                to="/results" 
                className="bg-white/5 text-white border border-white/10 px-8 py-3 sm:py-4 rounded-full font-black text-xs sm:text-sm flex items-center gap-2 hover:bg-white/10 transition-all"
              >
                Full Analytics
              </Link>
            </div>
          </div>

          {/* Right Chart */}
          <div className="w-full lg:w-[400px] h-[200px] sm:h-[250px] bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 relative group">
            <div className="absolute top-4 right-6 flex items-center gap-1.5 text-[8px] font-black text-emerald-400 uppercase tracking-widest">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
              Live
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.slice(0, 4)}>
                <XAxis 
                  dataKey="name" 
                  fontSize={8} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#a1a1aa', fontWeight: 700 }}
                  dy={10}
                />
                <Bar dataKey="votes" radius={[4, 4, 0, 0]} barSize={isMobile ? 25 : 35}>
                  {chartData.slice(0, 4).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff' }}
                  itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePulseBanner;
