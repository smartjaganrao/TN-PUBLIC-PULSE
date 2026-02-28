import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Vote, BarChart3, Users, ChevronRight, AlertCircle, MessageSquare } from 'lucide-react';
import Countdown from '../components/Countdown';
import { getOverallResults } from '../services/voteService';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const [totalVotes, setTotalVotes] = useState<number>(0);

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
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#046A38] text-white px-4 rounded-b-[4rem] sm:rounded-b-[8rem] shadow-2xl">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/4 -left-1/4 w-full h-full bg-emerald-400 rounded-full blur-[160px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1.1, 1, 1.1],
              opacity: [0.1, 0.12, 0.1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-emerald-300 rounded-full blur-[160px]" 
          />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-[0.4em]">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              2026 Election Prediction Engine
            </div>
            <h2 className="text-7xl sm:text-[10rem] font-black mb-8 tracking-tighter leading-[0.8] text-glow font-display">
              {t.title}
            </h2>
            <p className="text-xl sm:text-3xl opacity-70 mb-14 max-w-3xl mx-auto font-medium leading-tight">
              {t.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/vote" className="btn-primary group w-full sm:w-auto px-12 py-5 text-xl">
                <Vote size={28} className="group-hover:rotate-12 transition-transform" />
                {t.startVoting}
              </Link>
              <Link to="/results" className="glass-dark px-12 py-5 rounded-full font-black text-xl hover:bg-white/20 transition-all flex items-center justify-center gap-3 w-full sm:w-auto border border-white/20">
                <BarChart3 size={28} />
                {t.viewResults}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto w-full px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 -mt-24 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Countdown />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center card-hover"
        >
          <div className="bg-[#046A38]/10 p-5 rounded-3xl mb-6 animate-float">
            <Users className="text-[#046A38]" size={40} />
          </div>
          <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3 font-display">
            {t.totalVotes}
          </h3>
          <p className="text-6xl sm:text-7xl font-black text-zinc-900 tracking-tighter font-display">
            {totalVotes.toLocaleString()}
          </p>
          <div className="mt-4 flex items-center gap-2 text-emerald-600 font-bold text-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            Live Updates
          </div>
        </motion.div>
      </div>

      {/* People's Manifesto Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-zinc-900 text-white rounded-[3rem] p-10 sm:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#046A38]/20 rounded-full blur-[100px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -ml-32 -mb-32" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-widest">
                <MessageSquare size={14} className="text-emerald-400" />
                Community Discussion
              </div>
              <h2 className="text-5xl sm:text-6xl font-black font-display tracking-tight leading-[0.9]">
                What do you want from the <span className="text-emerald-400">CM in 2026?</span>
              </h2>
              <p className="text-xl text-zinc-400 font-medium leading-relaxed">
                Join the People's Manifesto forum. Discuss infrastructure, education, healthcare, and more. Let your voice be heard by the community.
              </p>
              <Link to="/forum" className="inline-flex items-center gap-3 bg-white text-zinc-900 px-10 py-5 rounded-full font-black text-lg hover:bg-emerald-400 hover:text-zinc-900 transition-all shadow-xl active:scale-95 group">
                Enter Forum
                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Infrastructure", icon: "🏗️" },
                { label: "Education", icon: "📚" },
                { label: "Healthcare", icon: "🏥" },
                { label: "Agriculture", icon: "🌾" }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl flex flex-col items-center text-center gap-3">
                  <span className="text-4xl">{item.icon}</span>
                  <span className="text-xs font-black uppercase tracking-widest opacity-60">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Districts / Viral Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <h3 className="text-3xl font-black flex items-center gap-3 font-display">
              <span className="w-12 h-2 bg-gradient-to-r from-[#046A38] to-emerald-500 rounded-full" />
              Pulse of TN
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Real-time Sentiment", desc: "See how the state is leaning district by district.", icon: "🔥" },
                { title: "100% Anonymous", desc: "Your vote is secure and private. No personal data stored.", icon: "🛡️" },
                { title: "Unbiased Platform", desc: "No party affiliation. Purely community driven.", icon: "⚖️" },
                { title: "Viral Prediction", desc: "Join thousands of others in predicting the next CM.", icon: "🚀" }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -5 }}
                  className="p-8 bg-white rounded-[2rem] border border-zinc-100 shadow-sm hover:border-emerald-500/30 transition-all group relative overflow-hidden"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h4 className="font-black text-xl text-zinc-900 mb-2 font-display">{item.title}</h4>
                  <p className="text-zinc-500 leading-relaxed">{item.desc}</p>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="glass p-10 rounded-[3rem] space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <AlertCircle size={80} />
            </div>
            <h4 className="font-black text-2xl font-display">Disclaimer</h4>
            <p className="text-zinc-500 leading-relaxed italic text-lg">
              {t.disclaimer}
            </p>
            <div className="pt-6 border-t border-zinc-100 text-[10px] uppercase tracking-[0.3em] font-black text-zinc-400">
              Entertainment Purposes Only
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
