import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Swords, ArrowLeft, TrendingUp, Zap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import CommentSection from '../components/CommentSection';
import BattleArena from '../components/BattleArena';

const PulsePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] relative overflow-hidden">
      {/* Background Patterns */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-rose-500/5 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-24 space-y-16 sm:space-y-24 relative z-10">
        <Helmet>
          <title>Community Pulse | Tamil Pulse 2026 Battle Arena</title>
          <meta name="description" content="Join the live political discourse in Tamil Nadu. Discuss, debate, and share your views in the Tamil Pulse Battle Arena." />
          <meta property="og:title" content="Community Pulse | Tamil Pulse 2026 Battle Arena" />
          <meta property="og:description" content="Join the live political discourse in Tamil Nadu. Discuss, debate, and share your views in the Tamil Pulse Battle Arena." />
          <meta property="og:url" content={`${window.location.origin}/pulse`} />
        </Helmet>

        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 font-black text-[10px] uppercase tracking-widest transition-all mb-4 group">
              <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <h1 className="text-5xl sm:text-9xl font-black text-zinc-900 font-display tracking-tighter leading-none">
              Community <span className="text-indigo-600">Pulse</span>
            </h1>
            <p className="text-zinc-500 max-w-2xl mx-auto font-medium text-sm sm:text-xl leading-relaxed">
              The real-time heartbeat of Tamil Nadu. Who is the best leader? Join the live battle and talk to supporters from all parties in our open community chat.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Battle Arena & Stats */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 sm:p-10 rounded-[3rem] border border-zinc-100 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 blur-[60px] -mr-24 -mt-24 group-hover:bg-rose-500/10 transition-colors" />
              <div className="relative z-10">
                <BattleArena />
                
                <div className="mt-10 p-6 bg-rose-50/50 rounded-3xl border border-rose-100/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-200">
                      <Zap size={16} />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-rose-900">Battle Rules</h4>
                  </div>
                  <p className="text-[11px] font-bold text-rose-800/70 leading-relaxed">
                    Boost your party to show support! Points are real-time. Every boost helps your leader climb the community leaderboard.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-zinc-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[40px] -mb-16 -mr-16" />
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                    <TrendingUp size={24} className="text-indigo-400" />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest">Live Insights</h4>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-white/5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Active Chatters</span>
                      <span className="text-xs text-zinc-400 font-medium">Real-time presence</span>
                    </div>
                    <span className="text-3xl font-black text-indigo-400 tabular-nums">1.2k</span>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Total Shouts</span>
                      <span className="text-xs text-zinc-400 font-medium">Community engagement</span>
                    </div>
                    <span className="text-3xl font-black text-emerald-400 tabular-nums">45k</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Discussion */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-8 sm:p-16 rounded-[3rem] border border-zinc-100 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                <div>
                  <h3 className="text-4xl font-black font-display tracking-tight text-zinc-900">Live Discussion</h3>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Supporters from all parties talking to each other
                  </p>
                </div>
                <div className="flex items-center gap-3 px-5 py-3 bg-indigo-50 rounded-2xl border border-indigo-100 self-start">
                  <Users size={18} className="text-indigo-600" />
                  <span className="text-[11px] font-black text-indigo-900 uppercase tracking-widest">Open Forum</span>
                </div>
              </div>
              <CommentSection />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PulsePage;
