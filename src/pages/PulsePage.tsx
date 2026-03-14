import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Swords, ArrowLeft, TrendingUp, Zap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import BattleArena from '../components/BattleArena';

const PulsePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16 space-y-12 sm:space-y-20">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 font-black text-[10px] uppercase tracking-widest transition-all mb-4">
            <ArrowLeft size={12} />
            Back to Home
          </Link>
          <h1 className="text-5xl sm:text-8xl font-black text-zinc-900 font-display tracking-tighter leading-none">
            Community <span className="text-indigo-600">Pulse</span>
          </h1>
          <p className="text-zinc-500 max-w-2xl font-medium text-sm sm:text-xl leading-relaxed mt-6">
            The real-time heartbeat of Tamil Nadu. Who is the best leader? Join the live battle and talk to supporters from all parties in our open community chat.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Battle Arena - Who is Best? */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-[3rem] border border-zinc-100 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-[50px] -mr-16 -mt-16" />
            <BattleArena />
            
            <div className="mt-8 p-6 bg-rose-50 rounded-3xl border border-rose-100">
              <div className="flex items-center gap-3 mb-2">
                <Zap size={16} className="text-rose-600" />
                <h4 className="text-xs font-black uppercase tracking-widest text-rose-900">Battle Rules</h4>
              </div>
              <p className="text-[10px] font-bold text-rose-800/70 leading-relaxed">
                Boost your party to show support! Points are real-time. Every boost helps your leader climb the community leaderboard.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900 p-8 rounded-[3rem] text-white shadow-2xl space-y-6"
          >
            <div className="flex items-center gap-3">
              <TrendingUp size={20} className="text-indigo-400" />
              <h4 className="text-sm font-black uppercase tracking-widest">Live Insights</h4>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Chatters</span>
                <span className="text-lg font-black text-indigo-400">1.2k</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Shouts</span>
                <span className="text-lg font-black text-emerald-400">45k</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Comment Section - Talk to each other */}
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-8 sm:p-12 rounded-[3rem] border border-zinc-100 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-black font-display tracking-tight text-zinc-900">Live Discussion</h3>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Both parties members talking to each other</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-2xl border border-indigo-100">
                <Users size={16} className="text-indigo-600" />
                <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Open Forum</span>
              </div>
            </div>
            <CommentSection />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PulsePage;
