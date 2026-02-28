import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { districts } from '../data/districts';
import { parties } from '../data/parties';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Link } from 'react-router-dom';
import { Trophy, MapPin, Globe, Loader2, Database, Trash2, ArrowLeft, Vote, Users, ChevronRight, Share2, Twitter, Facebook, MessageCircle } from 'lucide-react';
import { clearAllData, subscribeToOverallResults, getDistrictResults } from '../services/voteService';
import CommentSection from '../components/CommentSection';
import BattleArena from '../components/BattleArena';

const ResultsPage: React.FC = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [overallData, setOverallData] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districtData, setDistrictData] = useState<any>(null);
  const [districtLoading, setDistrictLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const shareUrl = window.location.origin + '/results';
  const shareMessage = "Check out the live Tamil Nadu 2026 election predictions! See who's leading district by district. 🗳️🔥";

  const handleShare = (platform: 'twitter' | 'facebook' | 'whatsapp') => {
    let url = '';
    const encodedMsg = encodeURIComponent(shareMessage);
    const encodedUrl = encodeURIComponent(shareUrl);

    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedMsg}&url=${encodedUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedMsg}%20${encodedUrl}`;
        break;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToOverallResults((data) => {
      setOverallData(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleClearData = () => {
    clearAllData();
    setSelectedDistrict('');
    showToast("Local flags cleared. Firestore data remains (requires admin access).");
  };

  useEffect(() => {
    if (!selectedDistrict) {
      setDistrictData(null);
      return;
    }

    const fetchDistrict = async () => {
      setDistrictLoading(true);
      try {
        const data = await getDistrictResults(selectedDistrict);
        setDistrictData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setDistrictLoading(false);
      }
    };
    fetchDistrict();
  }, [selectedDistrict]);

  const formatChartData = (data: any) => {
    if (!data) return [];
    return parties
      .map(p => ({
        name: p.name,
        votes: data[p.id] || 0,
        color: p.color
      }))
      .sort((a, b) => b.votes - a.votes);
  };

  const getLeadingParty = (data: any) => {
    if (!data) return null;
    let maxVotes = -1;
    let leader = null;
    parties.forEach(p => {
      if ((data[p.id] || 0) > maxVotes) {
        maxVotes = data[p.id] || 0;
        leader = p;
      }
    });
    return maxVotes > 0 ? leader : null;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#046A38] mb-4" size={48} />
        <p className="text-zinc-500 font-medium">{t.loading}</p>
      </div>
    );
  }

  const overallChartData = formatChartData(overallData);
  const overallLeader = getLeadingParty(overallData);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <Link to="/" className="text-zinc-500 hover:text-zinc-800 font-bold text-xs flex items-center gap-2 transition-colors uppercase tracking-widest">
            <ArrowLeft size={14} />
            Back to Home
          </Link>
          <h2 className="text-6xl font-black text-zinc-900 font-display tracking-tight leading-none">
            Live <span className="text-[#046A38]">Community Trends</span>
          </h2>
          <p className="text-zinc-500 max-w-xl font-medium">
            Real-time insights into the public sentiment across Tamil Nadu. Data is updated every time a new vote is cast.
          </p>

          {/* Share Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Share Results</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleShare('twitter')}
                className="p-3 bg-zinc-900 text-white rounded-2xl hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-zinc-200"
                title="Share on Twitter"
              >
                <Twitter size={18} />
              </button>
              <button 
                onClick={() => handleShare('facebook')}
                className="p-3 bg-[#1877F2] text-white rounded-2xl hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-blue-100"
                title="Share on Facebook"
              >
                <Facebook size={18} />
              </button>
              <button 
                onClick={() => handleShare('whatsapp')}
                className="p-3 bg-[#25D366] text-white rounded-2xl hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-green-100"
                title="Share on WhatsApp"
              >
                <MessageCircle size={18} />
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  showToast("Link copied to clipboard!");
                }}
                className="p-3 bg-white border border-zinc-100 text-zinc-400 rounded-2xl hover:bg-zinc-50 transition-all active:scale-95 shadow-sm"
                title="Copy Link"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Dev Tools Glass */}
        <div className="glass p-4 rounded-3xl flex flex-wrap gap-6 items-center border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Firebase: Online
            </span>
          </div>
          <div className="h-8 w-px bg-zinc-200 hidden sm:block" />
          <div className="flex gap-2">
            <button
              onClick={handleClearData}
              className="bg-rose-50 text-rose-600 border border-rose-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-95 flex items-center gap-2"
            >
              <Trash2 size={12} />
              Reset Local
            </button>
          </div>
        </div>
      </div>

      {/* Overall Results Section */}
      <section className="space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#046A38] text-white flex items-center justify-center shadow-lg shadow-emerald-200">
            <Globe size={24} />
          </div>
          <h3 className="text-3xl font-black text-zinc-900 font-display">{t.overallResults}</h3>
        </div>

        {overallData ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Leader Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-5 bg-zinc-900 text-white rounded-[3.5rem] p-12 shadow-2xl flex flex-col items-center text-center justify-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#046A38]/40 to-transparent opacity-50" />
              {overallLeader && (
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                  <img 
                    src={overallLeader.image} 
                    alt={overallLeader.name}
                    className="w-full h-full object-cover scale-125 blur-md"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              
              <div className="relative z-10 flex flex-col items-center w-full">
                <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl mb-10 border border-white/10 animate-float shadow-2xl">
                  <Trophy className="text-amber-400" size={56} />
                </div>
                
                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-400 mb-6 font-display">
                  {t.leadingParty}
                </h4>
                
                {overallLeader ? (
                  <>
                    <div className="relative mb-10">
                      <div className="w-48 h-48 rounded-full border-8 border-white/10 overflow-hidden shadow-2xl bg-white p-6">
                        <img 
                          src={overallLeader.image} 
                          alt={overallLeader.name}
                          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                        className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full border-4 border-zinc-900 shadow-2xl flex items-center justify-center text-white font-black text-2xl"
                        style={{ backgroundColor: overallLeader.color }}
                      >
                        {overallLeader.name[0]}
                      </motion.div>
                    </div>
                    <p className="text-8xl font-black mb-8 tracking-tighter text-glow font-display leading-none">{overallLeader.name}</p>
                    <div className="bg-white/5 backdrop-blur-md px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest border border-white/10">
                      {t.ifElectionToday}
                    </div>
                  </>
                ) : (
                  <p className="text-2xl opacity-50 font-black font-display uppercase tracking-widest">No votes yet</p>
                )}
              </div>
            </motion.div>

            {/* Charts Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 gap-8">
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-zinc-100 flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400">Vote Distribution</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Live Data</span>
                  </div>
                </div>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={overallChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        fontSize={10} 
                        axisLine={false} 
                        tickLine={false} 
                        fontFamily="Space Grotesk"
                        fontWeight={700}
                        dy={10}
                      />
                      <YAxis hide />
                      <Tooltip 
                        cursor={{ fill: '#f8f8f8' }}
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar 
                        dataKey="votes" 
                        radius={[12, 12, 0, 0]} 
                        barSize={60}
                        animationDuration={1500}
                        animationBegin={200}
                      >
                        {overallChartData.map((entry: any, index: number) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color} 
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-zinc-100 flex flex-col items-center justify-center text-center gap-6 group">
                  <div className="h-[200px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={overallChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={8}
                          dataKey="votes"
                          animationBegin={500}
                          animationDuration={1500}
                        >
                          {overallChartData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" className="hover:scale-105 transition-transform origin-center" />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-black text-zinc-900 font-display">{overallData.totalVotes}</span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Total</span>
                    </div>
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Market Share</p>
                </div>

                <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100 flex flex-col justify-center gap-4">
                  <div className="bg-emerald-500 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="text-4xl font-black text-zinc-900 font-display tracking-tighter">
                      {overallData.totalVotes.toLocaleString()}
                    </h4>
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-600 mt-1">Total Voices Recorded</p>
                  </div>
                  <div className="pt-4 border-t border-emerald-200/50 flex items-center gap-2 text-[10px] font-bold text-emerald-700">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    Updating in real-time
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-50 rounded-[3rem] p-20 text-center text-zinc-400 border-2 border-dashed border-zinc-200">
            <Vote size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-xl font-bold font-display uppercase tracking-widest">{t.noVotes}</p>
          </div>
        )}
      </section>

      {/* District Results Section */}
      <section className="space-y-10 pt-20 border-t border-zinc-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-100">
              <MapPin size={24} />
            </div>
            <h3 className="text-3xl font-black text-zinc-900 font-display">{t.districtResults}</h3>
          </div>

          <div className="relative group">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-white border border-zinc-200 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-[#046A38]/10 min-w-[280px] font-bold text-zinc-700 appearance-none shadow-sm transition-all hover:border-zinc-300"
            >
              <option value="">-- {t.selectDistrict} --</option>
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 group-hover:text-zinc-600 transition-colors">
              <ChevronRight size={20} className="rotate-90" />
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedDistrict ? (
            districtLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 gap-4"
              >
                <Loader2 className="animate-spin text-[#046A38]" size={48} />
                <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Fetching Data...</p>
              </motion.div>
            ) : districtData ? (
              <motion.div
                key="data"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                <div className="lg:col-span-4 bg-white p-10 rounded-[3rem] shadow-sm border border-zinc-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5">
                    <MapPin size={120} />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-8 font-display">
                    {selectedDistrict} Leader
                  </h4>
                  {getLeadingParty(districtData) ? (
                    <div className="space-y-8">
                      <div className="relative">
                        <div 
                          className="w-32 h-32 rounded-full flex items-center justify-center text-white text-5xl font-black shadow-2xl relative z-10"
                          style={{ backgroundColor: getLeadingParty(districtData)?.color }}
                        >
                          {getLeadingParty(districtData)?.name[0]}
                        </div>
                        <div className="absolute inset-0 bg-current opacity-20 blur-2xl rounded-full scale-150" style={{ color: getLeadingParty(districtData)?.color }} />
                      </div>
                      <div>
                        <p className="text-5xl font-black text-zinc-900 font-display tracking-tighter leading-none">{getLeadingParty(districtData)?.name}</p>
                        <div className="mt-6 flex items-center justify-center gap-4">
                          <div className="px-4 py-2 rounded-xl bg-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            {districtData.totalVotes} Votes
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-zinc-400 italic">No votes yet</p>
                  )}
                </div>

                <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] shadow-sm border border-zinc-100 h-[450px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={formatChartData(districtData)} margin={{ left: 20, right: 40, top: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        fontSize={12} 
                        axisLine={false} 
                        tickLine={false} 
                        width={100} 
                        fontFamily="Space Grotesk"
                        fontWeight={700}
                      />
                      <Tooltip 
                        cursor={{ fill: '#f8f8f8' }}
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="votes" radius={[0, 12, 12, 0]} barSize={40}>
                        {formatChartData(districtData).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="no-data"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-zinc-50 rounded-[3rem] p-20 text-center text-zinc-400 border-2 border-dashed border-zinc-200"
              >
                <p className="text-xl font-bold font-display uppercase tracking-widest">{t.noVotes} in {selectedDistrict}</p>
              </motion.div>
            )
          ) : (
            <motion.div 
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-zinc-50 rounded-[3rem] p-20 text-center text-zinc-400 border-2 border-dashed border-zinc-200"
            >
              <MapPin size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-xl font-bold font-display uppercase tracking-widest">{t.selectDistrictPrompt}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Community Interaction Section */}
      <section className="pt-20 border-t border-zinc-100 space-y-32">
        <BattleArena />
        <CommentSection />
      </section>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-20 border-t border-zinc-100">
        <Link to="/" className="text-zinc-500 hover:text-zinc-800 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 transition-all hover:-translate-x-1">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        <div className="hidden sm:block w-1.5 h-1.5 bg-zinc-300 rounded-full" />
        <Link to="/vote" className="btn-primary !py-5 !px-10 !text-lg w-full sm:w-auto shadow-emerald-100">
          <Vote size={24} />
          Cast Your Vote
        </Link>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-12 left-1/2 z-[200] bg-zinc-900 text-white px-8 py-4 rounded-2xl shadow-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 border border-white/10"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)] animate-pulse" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResultsPage;
