import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Vote, BarChart3, Users, ChevronRight, AlertCircle, MessageSquare, Target, Trophy, Eye } from 'lucide-react';
import Countdown from '../components/Countdown';
import Banner from '../components/Banner';
import { getOverallResults, incrementVisitorCount, subscribeToVisitorCount } from '../services/voteService';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [visitorCount, setVisitorCount] = useState<number>(0);

  useEffect(() => {
    incrementVisitorCount();
    const unsubscribe = subscribeToVisitorCount((count) => {
      setVisitorCount(count);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const results = await getOverallResults();
        if (results && results.totalVotes) {
          setTotalVotes(results.totalVotes);
        } else {
          setTotalVotes(0);
        }
      } catch (e) {
        console.error("Data fetch error", e);
      }
    };
    fetchVotes();
  }, []);

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Hero Section - More Compact & High Impact */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#046A38] text-white px-4 rounded-b-[3rem] sm:rounded-b-[5rem] shadow-2xl">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-1/4 -left-1/4 w-full h-full bg-emerald-400 rounded-full blur-[160px]" 
          />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[8px] font-black uppercase tracking-[0.4em]">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live Community Pulse
            </div>
            <h2 className="text-5xl sm:text-[8rem] font-black mb-6 tracking-tighter leading-[0.85] font-display">
              {t.title}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-6">
              <Link to="/vote" className="btn-primary group w-full sm:w-auto px-10 py-4 text-lg">
                <Vote size={20} className="group-hover:rotate-12 transition-transform" />
                {t.startVoting}
              </Link>
              <Link to="/results" className="glass-dark px-10 py-4 rounded-full font-black text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-3 w-full sm:w-auto border border-white/20">
                <BarChart3 size={20} />
                {t.viewResults}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Banner Section - Overlapping Hero */}
      <div className="-mt-24 relative z-30">
        <Banner />
      </div>

      {/* Bento Dashboard Grid */}
      <div className="max-w-6xl mx-auto w-full px-4 relative z-20 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Live Stats Bento */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-4 glass p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center card-hover border border-white/50"
        >
          <div className="bg-[#046A38]/10 p-4 rounded-2xl mb-4 animate-float">
            <Users className="text-[#046A38]" size={32} />
          </div>
          <h3 className="text-zinc-400 text-[8px] font-black uppercase tracking-[0.3em] mb-2 font-display">
            {t.totalVotes}
          </h3>
          <p className="text-5xl font-black text-zinc-900 tracking-tighter font-display">
            {totalVotes.toLocaleString()}
          </p>
          <div className="mt-4 flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Pulse
          </div>
        </motion.div>

        {/* Quiz Bento */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-8 bg-zinc-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy size={120} />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[8px] font-black uppercase tracking-widest">
                <Target size={12} className="text-amber-400" />
                Challenge
              </div>
              <h3 className="text-3xl font-black font-display tracking-tight">Community Quiz</h3>
              <p className="text-zinc-400 text-sm font-medium max-w-md">Test your knowledge of Tamil Nadu's culture, history, and current affairs!</p>
            </div>
            <Link to="/game" className="mt-6 inline-flex items-center gap-2 bg-amber-400 text-zinc-900 px-8 py-3 rounded-full font-black text-sm hover:bg-white transition-all self-start">
              Play Now
              <ChevronRight size={18} />
            </Link>
          </div>
        </motion.div>

        {/* Forum Bento */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-7 bg-white border border-zinc-100 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group"
        >
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-50 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-zinc-900 text-white rounded-xl">
                <MessageSquare size={20} />
              </div>
              <h3 className="text-xl font-black font-display">Community Debate</h3>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">Join the discussion on infrastructure, education, culture, and social welfare. Let your voice be heard.</p>
            <Link to="/forum" className="inline-flex items-center gap-2 text-[#046A38] font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
              Enter Forum <ChevronRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Countdown Bento */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="md:col-span-5"
        >
          <Countdown />
        </motion.div>
      </div>

      {/* Trending / Features Section - More Compact */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { title: "Real-time", icon: "🔥", color: "bg-orange-50" },
            { title: "Anonymous", icon: "🛡️", color: "bg-blue-50" },
            { title: "Unbiased", icon: "⚖️", color: "bg-purple-50" },
            { title: "Viral", icon: "🚀", color: "bg-emerald-50" },
            { title: `${visitorCount.toLocaleString()} Visitors`, icon: "👁️", color: "bg-zinc-100" }
          ].map((item, i) => (
            <div key={i} className={`${item.color} p-6 rounded-3xl flex items-center gap-4 border border-black/5 hover:scale-105 transition-transform cursor-default`}>
              <span className="text-3xl">{item.icon}</span>
              <span className="font-black text-zinc-900 uppercase tracking-widest text-[10px]">{item.title}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
