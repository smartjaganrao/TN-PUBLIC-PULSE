import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
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
import { Trophy, MapPin, Globe, Loader2, Database, Trash2, ArrowLeft, Vote, Users, ChevronRight, Share2, Twitter, Facebook, MessageCircle, RefreshCw, Zap, TrendingUp } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'overall' | 'districts' | 'axis' | 'social'>('overall');

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

  const fetchData = () => {
    setLoading(true);
    const unsubscribe = subscribeToOverallResults((data) => {
      setOverallData(data);
      setLoading(false);
    });
    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = fetchData();
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

  const formatAxisData = (data: any) => {
    if (!data) return [];
    const axisMap: any = {
      'RULING': { name: 'Ruling Front', votes: 0, color: '#FF0000', description: 'DMK-led Alliance (SPA)' },
      'OPPOSITION': { name: 'Opposition Front', votes: 0, color: '#008000', description: 'AIADMK/NDA/Others' },
      'ALTERNATIVES': { name: 'Alternatives', votes: 0, color: '#800000', description: 'TVK, NTK, MNM & Others' }
    };

    parties.forEach(p => {
      if (axisMap[p.axis]) {
        axisMap[p.axis].votes += (data[p.id] || 0);
      }
    });

    return Object.values(axisMap).sort((a: any, b: any) => b.votes - a.votes);
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
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 space-y-8 sm:space-y-12">
      {/* Header Section - More Compact */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link to="/" className="text-zinc-400 hover:text-zinc-800 font-black text-[10px] flex items-center gap-2 transition-all uppercase tracking-widest">
            <ArrowLeft size={12} />
            Back
          </Link>
          <div className="flex items-center gap-4">
            <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 font-display tracking-tight leading-none">
              Tamil <span className="text-[#046A38]">Pulse</span> Trends
            </h2>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500 text-[8px] font-black text-white uppercase tracking-widest shadow-lg shadow-rose-200 animate-pulse">
              <span className="w-1 h-1 rounded-full bg-white" />
              Live
            </div>
          </div>
        </div>

        {/* Tab Navigation - Dopamine Tabs */}
        <div className="bg-white p-1.5 rounded-2xl border border-zinc-100 shadow-sm flex gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'overall', label: 'Global', icon: <Globe size={14} /> },
            { id: 'axis', label: 'Three-Axis', icon: <Database size={14} /> },
            { id: 'districts', label: 'Districts', icon: <MapPin size={14} /> },
            { id: 'social', label: 'Social', icon: <MessageCircle size={14} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-zinc-900 text-white shadow-xl' 
                  : 'text-zinc-400 hover:bg-zinc-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleShare('whatsapp')}
            className="p-3 bg-[#25D366] text-white rounded-xl hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-green-100"
          >
            <Share2 size={18} />
          </button>
          <button 
            onClick={fetchData}
            className="p-3 bg-white border border-zinc-100 text-zinc-900 rounded-xl hover:bg-zinc-50 transition-all active:scale-95 shadow-sm"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overall' && (
          <motion.div
            key="overall"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Main Leader Bento Box */}
            <div className="lg:col-span-4 bg-zinc-900 text-white rounded-[2.5rem] p-8 flex flex-col items-center text-center justify-center relative overflow-hidden shadow-2xl min-h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#046A38]/40 to-transparent opacity-50" />
              {overallLeader && (
                <div className="absolute inset-0 opacity-10">
                  <img src={overallLeader.image} alt="" className="w-full h-full object-cover blur-md" aria-hidden="true" />
                </div>
              )}
              <div className="relative z-10 space-y-6">
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl inline-block border border-white/10 animate-float">
                  <Trophy className="text-amber-400" size={32} />
                </div>
                <p className="text-[8px] font-black uppercase tracking-[0.5em] text-emerald-400">Current Leader</p>
                {overallLeader ? (
                  <>
                    <div className="relative">
                      <img src={overallLeader.image} alt={overallLeader.name} className="w-32 h-32 rounded-full border-4 border-white/10 mx-auto shadow-2xl bg-white p-2" />
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full border-4 border-zinc-900 shadow-xl flex items-center justify-center text-white font-black text-sm" style={{ backgroundColor: overallLeader.color }}>
                        {overallLeader.name[0]}
                      </div>
                    </div>
                    <h3 className="text-5xl font-black tracking-tighter font-display leading-none">{overallLeader.name}</h3>
                    <div className="bg-white/5 backdrop-blur-md px-6 py-2 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/10">
                      {overallData.totalVotes} Total Votes
                    </div>
                  </>
                ) : (
                  <p className="text-zinc-500 font-black uppercase tracking-widest">No Data</p>
                )}
              </div>
            </div>

            {/* Stats Bento Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Chart Box */}
              <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Vote Distribution</h4>
                  <div className="flex items-center gap-2 text-[8px] font-black text-emerald-600 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </div>
                </div>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={overallChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} fontWeight={800} dy={10} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="votes" radius={[6, 6, 0, 0]} barSize={40}>
                        {overallChartData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Mini Stats */}
              <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100 flex flex-col justify-center gap-4 group">
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-4xl font-black text-zinc-900 font-display tracking-tighter">{overallData?.totalVotes?.toLocaleString() || 0}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Total Participants</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm flex items-center justify-between group">
                <div className="space-y-1">
                  <p className="text-2xl font-black text-zinc-900 font-display tracking-tight">
                    {overallChartData[0]?.votes > 0 ? Math.round((overallChartData[0].votes / overallData.totalVotes) * 100) : 0}%
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Dominance</p>
                </div>
                <div className="h-16 w-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={overallChartData} innerRadius={20} outerRadius={30} paddingAngle={5} dataKey="votes">
                        {overallChartData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Youth Pulse Insight */}
              <div className="md:col-span-2 bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Zap size={80} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[8px] font-black uppercase tracking-widest">
                      <TrendingUp size={12} className="text-amber-300" />
                      Youth Pulse
                    </div>
                    <h4 className="text-2xl font-black font-display tracking-tight">The "New Contender" Factor</h4>
                    <p className="text-white/70 text-sm font-medium max-w-md">TVK and NTK are showing significant traction among digital-first voters. Their combined vote share is a key metric to watch.</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center min-w-[150px]">
                    <p className="text-4xl font-black font-display">
                      {overallData ? Math.round(((overallData['TVK'] || 0) + (overallData['NTK'] || 0)) / overallData.totalVotes * 100) : 0}%
                    </p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/60 mt-1">Combined Share</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'axis' && (
          <motion.div
            key="axis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                <div>
                  <h3 className="text-3xl font-black font-display tracking-tight">Three-Axis Analysis</h3>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Aggregated community pulse by political fronts</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Axis Votes:</span>
                  <span className="text-lg font-black text-zinc-900">{overallData?.totalVotes || 0}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={formatAxisData(overallData)}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={8}
                        dataKey="votes"
                        stroke="none"
                      >
                        {formatAxisData(overallData).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '1rem' }}
                        itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '2rem', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-col justify-center gap-6">
                  {formatAxisData(overallData).map((axis: any, i: number) => (
                    <div key={i} className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100 flex items-center justify-between group hover:border-zinc-200 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-12 rounded-full" style={{ backgroundColor: axis.color }} />
                        <div>
                          <h4 className="text-lg font-black text-zinc-900">{axis.name}</h4>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{axis.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-zinc-900 font-display">
                          {overallData?.totalVotes > 0 ? Math.round((axis.votes / overallData.totalVotes) * 100) : 0}%
                        </p>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{axis.votes} Votes</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100">
                <h5 className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] mb-4">Ruling Impact</h5>
                <p className="text-zinc-800 text-sm font-medium leading-relaxed">Measuring the "Dravidian Model" performance and anti-incumbency sentiment across the state.</p>
              </div>
              <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100">
                <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-4">Opposition Strength</h5>
                <p className="text-zinc-800 text-sm font-medium leading-relaxed">Evaluating the consolidation of the opposition vote and grassroots campaign traction.</p>
              </div>
              <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100">
                <h5 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-4">Alternative Rise</h5>
                <p className="text-zinc-800 text-sm font-medium leading-relaxed">Quantifying the impact of TVK, NTK, and others among youth and first-time voters.</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'districts' && (
          <motion.div
            key="districts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-[2.5rem] border border-zinc-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-100">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black font-display">District Pulse</h3>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Select a district to see local trends</p>
                </div>
              </div>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-zinc-50 border border-zinc-100 rounded-xl px-6 py-3 outline-none focus:ring-4 focus:ring-[#046A38]/10 min-w-[250px] font-bold text-zinc-700 appearance-none shadow-sm"
              >
                <option value="">-- Select District --</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {selectedDistrict && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm flex flex-col items-center text-center justify-center min-h-[300px]">
                  {districtLoading ? (
                    <Loader2 className="animate-spin text-[#046A38]" size={32} />
                  ) : districtData ? (
                    <div className="space-y-6">
                      <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-2xl mx-auto" style={{ backgroundColor: getLeadingParty(districtData)?.color || '#141414' }}>
                        {getLeadingParty(districtData)?.name[0] || '?'}
                      </div>
                      <div>
                        <h4 className="text-3xl font-black font-display tracking-tight">{getLeadingParty(districtData)?.name || 'No Leader'}</h4>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-2">{districtData.totalVotes} Votes Cast</p>
                      </div>
                    </div>
                  ) : <p className="text-zinc-400 font-black uppercase tracking-widest text-xs">No votes in this district</p>}
                </div>
                <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm h-[300px]">
                  {districtData && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={formatChartData(districtData)}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" fontSize={10} axisLine={false} tickLine={false} width={80} fontWeight={800} />
                        <Bar dataKey="votes" radius={[0, 6, 6, 0]} barSize={30}>
                          {formatChartData(districtData).map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'social' && (
          <motion.div
            key="social"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            <div className="lg:col-span-3 space-y-6">
              <BattleArena />
            </div>
            <div className="lg:col-span-9 space-y-6">
              <CommentSection />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dopamine Footer Action */}
      <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
        <Link to="/vote" className="w-full sm:w-auto bg-[#046A38] text-white px-12 py-5 rounded-full font-black text-xl shadow-2xl shadow-emerald-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
          <Vote size={24} />
          Share Your Voice
        </Link>
        <Link to="/game" className="w-full sm:w-auto bg-amber-400 text-zinc-900 px-12 py-5 rounded-full font-black text-xl shadow-2xl shadow-amber-100 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
          <Trophy size={24} />
          Play Community Quiz
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
