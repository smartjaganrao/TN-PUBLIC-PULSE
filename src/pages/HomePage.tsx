import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Vote, BarChart3, Users, ChevronRight, AlertCircle, MessageSquare, Target, Trophy, Eye, Share2, Zap, ShoppingBag, BookOpen, ArrowRight } from 'lucide-react';
import Countdown from '../components/Countdown';
import Banner from '../components/Banner';
import LivePulseBanner from '../components/LivePulseBanner';
import { getOverallResults, incrementVisitorCount, subscribeToVisitorCount, getLatestBlogPosts, BlogPost } from '../services/voteService';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [showShareMotivation, setShowShareMotivation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowShareMotivation(true), 2000);
    return () => clearTimeout(timer);
  }, []);

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

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const posts = await getLatestBlogPosts(3);
        setLatestPosts(posts);
      } catch (e) {
        console.error(e);
      }
    };
    fetchLatestPosts();
  }, []);

  const handleShare = () => {
    const shareUrl = window.location.origin;
    const shareText = "I just shared my opinion on Tamil Pulse 2026! 🗳️ Join the digital revolution and see who's leading. 🔥 #TamilPulse2026";
    
    if (navigator.share) {
      navigator.share({
        title: 'Tamil Pulse 2026',
        text: shareText,
        url: shareUrl,
      });
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`, '_blank');
    }
  };

  return (
    <div className="flex flex-col gap-12 pb-20">
      <Helmet>
        <title>Tamil Pulse 2026 | TN Election Prediction & Community Hub</title>
        <meta name="description" content="Tamil Nadu's first real-time community pulse for the 2026 Assembly Elections. Vote, track live trends, and join the political discourse." />
        <meta property="og:title" content="Tamil Pulse 2026 | TN Election Prediction & Community Hub" />
        <meta property="og:description" content="Tamil Nadu's first real-time community pulse for the 2026 Assembly Elections. Vote, track live trends, and join the political discourse." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.origin} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {/* Hero Section - Viral & High Impact */}
      <section className="relative min-h-[65vh] sm:min-h-[75vh] flex items-center justify-center overflow-hidden bg-[#046A38] text-white px-4 rounded-b-[3rem] sm:rounded-b-[6rem] shadow-2xl">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute -top-1/4 -right-1/4 w-full h-full bg-emerald-300 rounded-full blur-[120px] sm:blur-[200px]" 
          />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10 py-20 sm:py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.9] sm:leading-[0.8] font-display">
              VOTE.<br />
              <span className="text-emerald-400">TREND.</span><br />
              SHARE.
            </h2>
            <p className="text-white/80 text-sm sm:text-xl font-medium max-w-2xl mx-auto mb-10 sm:mb-12 px-6">
              Tamil Nadu's first real-time community pulse. Don't just watch the news, <span className="text-white font-black underline decoration-emerald-400 decoration-4 underline-offset-4">be the news.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4 sm:px-6">
              <Link to="/vote" className="btn-primary group w-full sm:w-auto px-10 sm:px-14 py-4 sm:py-5 text-lg sm:text-xl shadow-[0_20px_50px_rgba(16,185,129,0.3)]">
                <Vote size={24} className="group-hover:rotate-12 transition-transform" />
                Cast Your Vote
              </Link>
              <Link to="/results" className="glass-dark px-10 sm:px-14 py-4 sm:py-5 rounded-full font-black text-lg sm:text-xl hover:bg-white/20 transition-all flex items-center justify-center gap-3 w-full sm:w-auto border border-white/20">
                <BarChart3 size={24} />
                Live Trends
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Live Status Bar - Top of Hero */}
        <div className="absolute top-0 left-0 right-0 py-3 bg-black/10 backdrop-blur-sm border-b border-white/5 flex justify-center items-center gap-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/60 z-20">
          <div className="flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Pulse: {visitorCount.toLocaleString()} Active</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div className="flex items-center gap-2">
            <Users size={12} className="text-white/40" />
            <span>Total Participation: {totalVotes.toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* Live Pulse Banner - Real-time Graph */}
      <div className="-mt-32 relative z-30">
        <LivePulseBanner />
      </div>

      {/* Viral Motivation Section */}
      <section className="max-w-6xl mx-auto w-full px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-zinc-900 rounded-[3rem] p-8 sm:p-12 text-white relative overflow-hidden border border-white/5"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] -mr-48 -mt-48" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight">Make it <span className="text-emerald-400">Viral.</span></h3>
              <p className="text-zinc-400 text-sm sm:text-lg max-w-md font-medium">
                The more people share, the more accurate the pulse. Invite your friends and let's show the world what the youth of TN thinks!
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4 text-emerald-400 font-black text-[10px] uppercase tracking-widest">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-8 h-8 rounded-full border-2 border-zinc-900" alt="" />
                  ))}
                </div>
                <span>+12.4k shared today</span>
              </div>
            </div>
            <button 
              onClick={handleShare}
              className="w-full md:w-auto bg-white text-zinc-900 px-12 py-5 rounded-full font-black text-xl flex items-center justify-center gap-3 hover:bg-emerald-400 hover:text-white transition-all active:scale-95 shadow-2xl"
            >
              <Share2 size={24} />
              Share Now
            </button>
          </div>
        </motion.div>
      </section>

      {/* Bento Dashboard Grid */}
      <div className="max-w-6xl mx-auto w-full px-4 relative z-20 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Share Your Voice Bento */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="md:col-span-8 bg-white rounded-[3rem] p-8 sm:p-12 border border-zinc-100 shadow-xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] -mr-32 -mt-32 group-hover:bg-emerald-500/10 transition-colors" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8">
            <div className="flex-1 space-y-6 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#046A38] text-[10px] font-black uppercase tracking-widest">
                <Target size={12} /> Action Required
              </div>
              <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tighter leading-none text-zinc-900">
                SHARE YOUR <span className="text-[#046A38]">VOICE.</span>
              </h3>
              <p className="text-zinc-500 font-bold text-lg">
                Cast your digital vote in seconds. No complex forms, just your opinion.
              </p>
              <Link to="/vote" className="inline-flex items-center gap-3 bg-zinc-900 text-white px-10 py-5 rounded-full font-black text-xl hover:bg-[#046A38] transition-all shadow-2xl active:scale-95">
                Start Now <ChevronRight size={24} />
              </Link>
            </div>
            <div className="w-full sm:w-48 aspect-square bg-zinc-50 rounded-[2.5rem] flex items-center justify-center border border-zinc-100 shadow-inner group-hover:rotate-6 transition-transform">
              <Vote size={80} className="text-[#046A38] opacity-20" />
            </div>
          </div>
        </motion.div>

        {/* Live Stats Bento */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="md:col-span-4 bg-white rounded-[3rem] p-8 border border-zinc-100 shadow-xl flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/5 blur-[50px] -ml-16 -mb-16" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                <Users size={24} className="text-zinc-400" />
              </div>
              <div className="flex flex-col items-end">
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                </div>
                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">
                  {visitorCount.toLocaleString()} Active
                </div>
              </div>
            </div>
            <h4 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Total Participation</h4>
            <div className="text-5xl font-black text-zinc-900 font-display tracking-tighter mb-4">
              {totalVotes.toLocaleString()}
            </div>
            <p className="text-zinc-500 text-xs font-bold">Votes recorded across all 38 districts in Tamil Nadu.</p>
          </div>
          <Link to="/results" className="relative z-10 mt-8 flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100 group-hover:bg-[#046A38] group-hover:text-white transition-all">
            <span className="text-[10px] font-black uppercase tracking-widest">Full Stats</span>
            <BarChart3 size={18} />
          </Link>
        </motion.div>
        {/* Quiz Bento */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="md:col-span-12 bg-zinc-900 rounded-[3rem] p-8 sm:p-12 text-white relative overflow-hidden group border border-white/5"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] -mr-48 -mt-48 group-hover:bg-amber-500/20 transition-colors" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-widest">
                <Trophy size={14} className="text-amber-400" /> Community Challenge
              </div>
              <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tighter leading-none">
                TN MASTERMIND <span className="text-amber-400">CHALLENGE.</span>
              </h3>
              <p className="text-zinc-400 text-sm sm:text-xl font-medium max-w-xl">
                Think you know TN politics better than your friends? Create a challenge, invite your squad, and see who tops the leaderboard!
              </p>
            </div>
            <Link to="/game" className="w-full md:w-auto bg-amber-400 text-zinc-900 px-12 py-5 rounded-full font-black text-xl flex items-center justify-center gap-3 hover:bg-white transition-all active:scale-95 shadow-2xl shadow-amber-400/20">
              Start Quiz <ChevronRight size={24} />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Community Pulse CTA */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-indigo-600 rounded-[3rem] p-8 sm:p-16 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] -mr-48 -mt-48" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-widest">
                <MessageSquare size={14} /> Live Interaction
              </div>
              <h3 className="text-3xl sm:text-6xl lg:text-7xl font-black font-display tracking-tighter leading-none">
                COMMUNITY <span className="text-indigo-300">PULSE.</span>
              </h3>
              <p className="text-indigo-100 text-sm sm:text-xl font-medium max-w-xl">
                Who is the best leader? Join the live battle arena and talk to supporters from all parties in real-time. The ultimate space for cross-party dialogue.
              </p>
            </div>
            <Link to="/pulse" className="w-full lg:w-auto bg-white text-indigo-600 px-12 py-6 rounded-full font-black text-2xl flex items-center justify-center gap-3 hover:bg-indigo-50 transition-all active:scale-95 shadow-2xl">
              Join the Pulse <Zap size={24} fill="currentColor" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h3 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-zinc-900">Election <span className="text-indigo-600">Insights.</span></h3>
            <p className="text-zinc-500 text-sm sm:text-lg font-medium mt-2">Expert analysis and deep dives into TN 2026.</p>
          </div>
          <Link to="/blog" className="hidden sm:flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:translate-x-2 transition-all">
            View All Posts <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestPosts.length > 0 ? (
            latestPosts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-zinc-100 shadow-xl hover:shadow-2xl transition-all flex flex-col"
              >
                <Link to={`/blog/${post.slug}`} className="relative aspect-video overflow-hidden">
                  <img
                    src={post.imageUrl || `https://picsum.photos/seed/${post.slug}/800/450`}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </Link>
                <div className="p-8 flex-1 flex flex-col">
                  <Link to={`/blog/${post.slug}`}>
                    <h4 className="text-xl font-black text-zinc-900 mb-4 group-hover:text-indigo-600 transition-colors font-display leading-tight">
                      {post.title}
                    </h4>
                  </Link>
                  <p className="text-zinc-500 text-sm line-clamp-2 mb-6 flex-1">
                    {post.excerpt}
                  </p>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest group/link"
                  >
                    Read More
                    <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))
          ) : (
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-zinc-100 animate-pulse rounded-[2.5rem] aspect-[4/5]" />
            ))
          )}
        </div>
        
        <Link to="/blog" className="sm:hidden mt-8 flex items-center justify-center gap-2 bg-zinc-900 text-white py-4 rounded-full font-black text-xs uppercase tracking-widest">
          View All Posts <ChevronRight size={16} />
        </Link>
      </section>

      {/* Supporter Shop CTA */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-zinc-900 rounded-[3rem] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] -mr-32 -mt-32 group-hover:bg-emerald-500/20 transition-all" />
            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-widest">
                <ShoppingBag size={14} /> Recommended Resources
              </div>
              <h3 className="text-4xl font-black font-display tracking-tight">Supporter <span className="text-emerald-400">Shop.</span></h3>
              <p className="text-zinc-400 text-sm font-medium max-w-md">
                Get the essential gear and reading materials for the 2026 journey. From political history books to rally essentials.
              </p>
            </div>
            <Link to="/shop" className="mt-8 inline-flex items-center gap-3 text-emerald-400 font-black text-xs uppercase tracking-widest hover:translate-x-2 transition-all">
              Browse the Shop <ChevronRight size={16} />
            </Link>
          </div>

          <div className="bg-white rounded-[3rem] p-8 sm:p-12 border border-zinc-100 shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] -mr-32 -mt-32 group-hover:bg-indigo-500/10 transition-all" />
            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-black uppercase tracking-widest text-indigo-600">
                <BookOpen size={14} /> Knowledge Base
              </div>
              <h3 className="text-4xl font-black font-display tracking-tight text-zinc-900">Election <span className="text-indigo-600">Insights.</span></h3>
              <p className="text-zinc-500 text-sm font-medium max-w-md">
                Deep dive into our blog for expert analysis, historical context, and data-driven predictions for Tamil Nadu.
              </p>
            </div>
            <Link to="/blog" className="mt-8 inline-flex items-center gap-3 text-indigo-600 font-black text-xs uppercase tracking-widest hover:translate-x-2 transition-all">
              Read the Blog <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { title: "Viral", icon: "🚀", color: "bg-orange-50" },
            { title: "Anonymous", icon: "🛡️", color: "bg-blue-50" },
            { title: "Unbiased", icon: "⚖️", color: "bg-purple-50" },
            { title: "Real-time", icon: "🔥", color: "bg-emerald-50" },
            { title: `${visitorCount.toLocaleString()} Active`, icon: "👁️", color: "bg-zinc-100" }
          ].map((item, i) => (
            <div key={i} className={`${item.color} p-6 rounded-3xl flex items-center gap-4 border border-black/5 hover:scale-105 transition-transform cursor-default shadow-sm`}>
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
