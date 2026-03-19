import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { districts } from '../data/districts';
import { constituenciesByDistrict } from '../data/constituencies';
import { parties } from '../data/parties';
import PartyImage from '../components/PartyImage';
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
import { Helmet } from 'react-helmet-async';
import { Trophy, MapPin, Globe, Loader2, Database, Trash2, ArrowLeft, Vote, Users, ChevronRight, Share2, Twitter, Facebook, MessageCircle, RefreshCw, Zap, TrendingUp, Download, Image as ImageIcon } from 'lucide-react';
import { clearAllData, subscribeToOverallResults, getDistrictResults, getConstituencyResults, getDemographicInsights } from '../services/voteService';
import ShareableResultCard from '../components/ShareableResultCard';
import { toPng } from 'html-to-image';
import { useMobile } from '../hooks/useMobile';

const ResultsPage: React.FC = () => {
  const { t } = useLanguage();
  const isMobile = useMobile(640);
  const [loading, setLoading] = useState(true);
  const [overallData, setOverallData] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');
  const [constituencySearch, setConstituencySearch] = useState('');
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showConstituencyDropdown, setShowConstituencyDropdown] = useState(false);
  const [districtData, setDistrictData] = useState<any>(null);
  const [constituencyData, setConstituencyData] = useState<any>(null);
  const [demographicInsights, setDemographicInsights] = useState<any>(null);
  const [districtLoading, setDistrictLoading] = useState(false);
  const [constituencyLoading, setConstituencyLoading] = useState(false);
  const [demographicsLoading, setDemographicsLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overall' | 'districts' | 'axis' | 'demographics'>('overall');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setShowDistrictDropdown(false);
        setShowConstituencyDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsGeneratingImage(true);
    try {
      // Small delay to ensure styles are applied
      await new Promise(resolve => setTimeout(resolve, 500));
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#09090b',
      });
      
      // Convert dataUrl to File object for sharing
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `tamil-pulse-results.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Tamil Pulse 2026 Trends',
          text: 'Check out the latest election trends on Tamil Pulse! 🗳️🔥',
        });
      } else {
        const link = document.createElement('a');
        link.download = `tamil-pulse-results-${new Date().getTime()}.png`;
        link.href = dataUrl;
        link.click();
        showToast("Shareable card generated! Ready for WhatsApp/Instagram.");
      }
    } catch (err) {
      console.error('Oops, something went wrong!', err);
      showToast("Failed to generate image. Please try again.");
    } finally {
      setIsGeneratingImage(false);
    }
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

  useEffect(() => {
    if (!selectedConstituency) {
      setConstituencyData(null);
      return;
    }

    const fetchConstituency = async () => {
      setConstituencyLoading(true);
      try {
        const data = await getConstituencyResults(selectedConstituency);
        setConstituencyData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setConstituencyLoading(false);
      }
    };
    fetchConstituency();
  }, [selectedConstituency]);

  useEffect(() => {
    if (activeTab === 'demographics') {
      const fetchDemographics = async () => {
        setDemographicsLoading(true);
        try {
          const data = await getDemographicInsights();
          setDemographicInsights(data);
        } catch (e) {
          console.error(e);
        } finally {
          setDemographicsLoading(false);
        }
      };
      fetchDemographics();
    }
  }, [activeTab]);

  const filteredDistricts = districts.filter(d => 
    d.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const availableConstituencies = selectedDistrict ? constituenciesByDistrict[selectedDistrict] || [] : [];
  const filteredConstituencies = availableConstituencies.filter(c =>
    c.toLowerCase().includes(constituencySearch.toLowerCase())
  );

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
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 space-y-8 sm:space-y-12 relative z-10">
      <Helmet>
        <title>Live Election Trends | Tamil Pulse 2026 Results</title>
        <meta name="description" content="View real-time election trends and community pulse results for the 2026 Tamil Nadu Assembly Elections. See which parties are leading across 38 districts." />
        <meta property="og:title" content="Live Election Trends | Tamil Pulse 2026 Results" />
        <meta property="og:description" content="View real-time election trends and community pulse results for the 2026 Tamil Nadu Assembly Elections. See which parties are leading across 38 districts." />
        <meta property="og:url" content={`${window.location.origin}/results`} />
      </Helmet>

      {/* Live Stats Ticker */}
      <div className="bg-zinc-900 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
        <div className="flex items-center whitespace-nowrap animate-marquee py-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Pulse: {overallData?.totalVotes?.toLocaleString() || 0} Votes</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy size={14} className="text-amber-400" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Leader: {overallLeader?.name || '---'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-indigo-400" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Trending: Chennai, Coimbatore</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={14} className="text-rose-400" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Youth Factor: {overallData ? Math.round(((overallData['TVK'] || 0) + (overallData['NTK'] || 0)) / overallData.totalVotes * 100) : 0}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

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
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500 text-[8px] font-black text-white uppercase tracking-widest shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse border border-rose-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              Live
            </div>
          </div>
        </div>

        {/* Tab Navigation - Dopamine Tabs */}
        <div className="bg-zinc-100/50 p-1 rounded-2xl border border-zinc-200/50 flex gap-1 overflow-x-auto no-scrollbar max-w-full backdrop-blur-sm">
          {[
            { id: 'overall', label: 'Global', icon: <Globe size={14} /> },
            { id: 'axis', label: 'Three-Axis', icon: <Zap size={14} /> },
            { id: 'demographics', label: 'Demographics', icon: <Users size={14} /> },
            { id: 'districts', label: 'Districts', icon: <MapPin size={14} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap overflow-hidden ${
                activeTab === tab.id 
                  ? 'text-white' 
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-white/50'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-zinc-900 shadow-lg"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tab.icon}
                <span className={isMobile ? 'hidden' : 'inline'}>{tab.label}</span>
                {isMobile && <span>{tab.label.substring(0, 3)}</span>}
                {activeTab === tab.id && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                  />
                )}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 self-end lg:self-auto">
          <button 
            onClick={handleDownloadImage}
            disabled={isGeneratingImage}
            className="p-3 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all active:scale-95 shadow-lg flex items-center gap-2 disabled:opacity-50"
            title="Download Shareable Card"
          >
            {isGeneratingImage ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
            <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Share Card</span>
          </button>
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

      {/* Hidden Shareable Card for Generation */}
      <ShareableResultCard 
        cardRef={cardRef}
        title={activeTab === 'districts' && selectedDistrict ? `${selectedDistrict} Results` : "Tamil Nadu 2026 Pulse"}
        subtitle={activeTab === 'districts' && selectedDistrict ? "Regional Community Trends" : "Global Community Trends"}
        data={activeTab === 'districts' && selectedDistrict ? districtData : overallData}
        totalVotes={activeTab === 'districts' && selectedDistrict ? (districtData?.totalVotes || 0) : (overallData?.totalVotes || 0)}
      />

      <AnimatePresence mode="wait">
        {activeTab === 'overall' && (
          <motion.div
            key="overall"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Overall Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100 group-hover:scale-110 transition-transform">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-2xl font-black text-zinc-900 font-display tracking-tight">{overallData?.totalVotes?.toLocaleString() || 0}</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Total Participants</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-100 group-hover:scale-110 transition-transform">
                  <Trophy size={20} />
                </div>
                <div>
                  <p className="text-2xl font-black text-zinc-900 font-display tracking-tight">{overallLeader?.name || '---'}</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Current Leader</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
                  <Zap size={20} />
                </div>
                <div>
                  <p className="text-2xl font-black text-zinc-900 font-display tracking-tight">
                    {overallChartData[0]?.votes > 0 ? Math.round((overallChartData[0].votes / overallData.totalVotes) * 100) : 0}%
                  </p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Dominance Gap</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-100 group-hover:scale-110 transition-transform">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-2xl font-black text-zinc-900 font-display tracking-tight">
                    {overallData ? Math.round(((overallData['TVK'] || 0) + (overallData['NTK'] || 0)) / overallData.totalVotes * 100) : 0}%
                  </p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Alternative Factor</p>
                </div>
              </div>
            </div>

            {/* Pulse Meter Section */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] -mr-32 -mt-32" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0 relative">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-zinc-100"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={502.6}
                      initial={{ strokeDashoffset: 502.6 }}
                      animate={{ strokeDashoffset: 502.6 - (502.6 * (overallData?.totalVotes || 0) / 10000) }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="text-[#046A38]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-black font-display tracking-tighter">
                      {Math.min(100, Math.round((overallData?.totalVotes || 0) / 100))}%
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Pulse Intensity</span>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-black font-display tracking-tight">Community Engagement Meter</h3>
                    <p className="text-sm text-zinc-500 font-medium">Real-time intensity of the 2026 political discourse based on community participation.</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                      <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Momentum</p>
                      <p className="text-lg font-black text-emerald-600 tracking-tight">High</p>
                    </div>
                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                      <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Volatility</p>
                      <p className="text-lg font-black text-amber-600 tracking-tight">Moderate</p>
                    </div>
                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                      <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Sentiment</p>
                      <p className="text-lg font-black text-indigo-600 tracking-tight">Positive</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main Leader Card */}
              <div className="lg:col-span-4 bg-zinc-900 text-white rounded-[2.5rem] p-8 flex flex-col items-center text-center justify-center relative overflow-hidden shadow-2xl min-h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#046A38]/40 to-transparent opacity-50" />
                {overallLeader && (
                  <div className="absolute inset-0 opacity-10">
                    <PartyImage src={overallLeader.image} alt="" className="w-full h-full blur-md object-cover" aria-hidden="true" />
                  </div>
                )}
                <div className="relative z-10 space-y-6">
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl inline-block border border-white/10 animate-float">
                    <Trophy className="text-amber-400 w-8 h-8" />
                  </div>
                  <p className="text-[8px] font-black uppercase tracking-[0.5em] text-emerald-400">State-wide Leader</p>
                  {overallLeader ? (
                    <>
                      <div className="relative">
                        <PartyImage 
                          src={overallLeader.image} 
                          alt={overallLeader.name} 
                          className="w-32 h-32 rounded-full border-4 border-white/10 mx-auto shadow-2xl bg-white p-2" 
                          fallbackText={overallLeader.name}
                        />
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
                    <p className="text-zinc-500 font-black uppercase tracking-widest text-[10px]">No Data</p>
                  )}
                </div>
              </div>

              {/* Chart & Insights Section */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm flex-1 flex flex-col gap-6">
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

                {/* Youth Pulse Insight */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap className="w-20 h-20" />
                  </div>
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-[8px] font-black uppercase tracking-widest">
                        <TrendingUp size={12} className="text-amber-300" />
                        Youth Pulse
                      </div>
                      <h4 className="text-2xl font-black font-display tracking-tight">The "New Contender" Factor</h4>
                      <p className="text-white/70 text-sm font-medium max-w-md">TVK and NTK are showing significant traction among digital-first voters. Their combined vote share is a key metric to watch.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center min-w-[150px]">
                      <p className="text-3xl font-black font-display">
                        {overallData ? Math.round(((overallData['TVK'] || 0) + (overallData['NTK'] || 0)) / overallData.totalVotes * 100) : 0}%
                      </p>
                      <p className="text-[8px] font-black uppercase tracking-widest text-white/60 mt-1">Combined Share</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trending Districts Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black font-display tracking-tight">Trending Districts</h3>
                <button 
                  onClick={() => setActiveTab('districts')}
                  className="text-[10px] font-black text-[#046A38] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                >
                  View All Districts <ChevronRight size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {['Chennai', 'Coimbatore', 'Madurai', 'Trichy'].map((districtName) => (
                  <motion.div 
                    key={districtName}
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm flex flex-col gap-4 group cursor-pointer"
                    onClick={() => {
                      setSelectedDistrict(districtName);
                      setActiveTab('districts');
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{districtName}</span>
                      <div className="flex items-center gap-1 text-[8px] font-black text-emerald-600 uppercase tracking-widest">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        Trending
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-[#046A38]/10 group-hover:text-[#046A38] transition-colors">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-zinc-900">High Engagement</p>
                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Community Pulse Active</p>
                      </div>
                    </div>
                    <div className="mt-2 w-full py-2.5 bg-zinc-50 group-hover:bg-zinc-900 group-hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-zinc-100 flex items-center justify-center gap-2">
                      Check Results <ChevronRight size={12} />
                    </div>
                  </motion.div>
                ))}
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
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Axis Responses:</span>
                  <span className="text-lg font-black text-zinc-900">{overallData?.totalVotes || 0}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <div className="h-[300px] sm:h-[400px] bg-white p-6 rounded-[2.5rem] border border-zinc-100 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Axis Distribution</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Live</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={formatAxisData(overallData)}
                          cx="50%"
                          cy="50%"
                          innerRadius={isMobile ? 60 : 80}
                          outerRadius={isMobile ? 100 : 130}
                          paddingAngle={8}
                          dataKey="votes"
                          stroke="none"
                        >
                          {formatAxisData(overallData).map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#18181b', 
                            border: 'none', 
                            borderRadius: '16px',
                            color: '#fff',
                            fontSize: '10px',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-6">
                  {formatAxisData(overallData).map((axis: any, i: number) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ x: 10, scale: 1.02 }}
                      className="bg-zinc-50 p-6 sm:p-8 rounded-[2rem] border border-zinc-100 shadow-sm flex flex-col xs:flex-row items-center justify-between gap-4 group cursor-default transition-all hover:bg-white hover:shadow-xl hover:border-zinc-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-6" style={{ backgroundColor: axis.color }}>
                          {axis.name.includes('Ruling') ? <Zap size={24} /> : axis.name.includes('Opposition') ? <TrendingUp size={24} /> : <Users size={24} />}
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-zinc-900 font-display tracking-tight">{axis.name}</h4>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{axis.description}</p>
                        </div>
                      </div>
                      <div className="text-center xs:text-right">
                        <p className="text-4xl font-black font-display tracking-tighter" style={{ color: axis.color }}>
                          {overallData?.totalVotes > 0 ? Math.round((axis.votes / overallData.totalVotes) * 100) : 0}%
                        </p>
                        <div className="flex items-center justify-center xs:justify-end gap-2 mt-1">
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{axis.votes.toLocaleString()} Votes</span>
                          <div className="w-1 h-1 rounded-full bg-zinc-300" />
                          <span className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">Pulse</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  title: 'Ruling Impact', 
                  desc: 'Measuring the "Dravidian Model" performance and anti-incumbency sentiment across the state.',
                  color: 'rose',
                  icon: <Zap size={18} />
                },
                { 
                  title: 'Opposition Strength', 
                  desc: 'Evaluating the consolidation of the opposition vote and grassroots campaign traction.',
                  color: 'emerald',
                  icon: <TrendingUp size={18} />
                },
                { 
                  title: 'Alternative Rise', 
                  desc: 'Quantifying the impact of TVK, NTK, and others among youth and first-time voters.',
                  color: 'amber',
                  icon: <Users size={18} />
                }
              ].map((insight, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`bg-${insight.color}-50 p-8 rounded-[2.5rem] border border-${insight.color}-100 shadow-sm relative overflow-hidden group`}
                >
                  <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${insight.color}-500/5 rounded-full blur-2xl group-hover:bg-${insight.color}-500/10 transition-colors`} />
                  <div className={`w-10 h-10 rounded-xl bg-${insight.color}-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-${insight.color}-200`}>
                    {insight.icon}
                  </div>
                  <h5 className={`text-[10px] font-black text-${insight.color}-600 uppercase tracking-[0.2em] mb-4`}>{insight.title}</h5>
                  <p className="text-zinc-800 text-sm font-medium leading-relaxed relative z-10">{insight.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'demographics' && (
          <motion.div
            key="demographics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] border border-zinc-100 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                <div>
                  <h3 className="text-3xl font-black font-display tracking-tight">Demographic Insights</h3>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Anonymous data segments showing voting patterns</p>
                </div>
                {demographicsLoading && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 rounded-xl border border-zinc-100">
                    <Loader2 className="animate-spin text-[#046A38]" size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Syncing...</span>
                  </div>
                )}
              </div>

              {demographicInsights ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Age Group Breakdown */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                        <Zap size={24} />
                      </div>
                      <div>
                        <h4 className="text-xl font-black font-display uppercase tracking-tight">Youth Pulse</h4>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Leading party by age segment</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(demographicInsights.ageGroups).map(([age, partyData]: [string, any]) => {
                        const topPartyId = Object.entries(partyData).sort((a: any, b: any) => b[1] - a[1])[0]?.[0];
                        const topParty = parties.find(p => p.id === topPartyId);
                        const totalAgeVotes = Object.values(partyData).reduce((a: any, b: any) => a + b, 0) as number;

                        return (
                          <motion.div 
                            key={age} 
                            whileHover={{ y: -5 }}
                            className="bg-zinc-50 p-6 rounded-[2rem] border border-zinc-100 flex flex-col gap-4"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">{age}</span>
                              <span className="text-[10px] font-black text-zinc-900 bg-white px-2 py-1 rounded-lg border border-zinc-100 shadow-sm">
                                {totalAgeVotes} Votes
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-100 p-2 flex-shrink-0 shadow-sm">
                                <PartyImage src={topParty?.image || ''} alt="" className="w-full h-full object-contain" fallbackText={topParty?.name || '?'} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="text-sm font-black text-zinc-900 truncate">{topParty?.name || 'No Data'}</h5>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex-1 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full transition-all duration-1000" 
                                      style={{ 
                                        width: `${totalAgeVotes > 0 ? (partyData[topPartyId] / totalAgeVotes) * 100 : 0}%`,
                                        backgroundColor: topParty?.color || '#141414'
                                      }} 
                                    />
                                  </div>
                                  <span className="text-[10px] font-black text-zinc-900">
                                    {totalAgeVotes > 0 ? Math.round((partyData[topPartyId] / totalAgeVotes) * 100) : 0}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Urban vs Rural Pulse */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100">
                        <Globe size={24} />
                      </div>
                      <div>
                        <h4 className="text-xl font-black font-display uppercase tracking-tight">Urban vs Rural</h4>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Geographic sentiment breakdown</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {Object.entries(demographicInsights.areas).map(([area, partyData]: [string, any]) => {
                        const topPartyId = Object.entries(partyData).sort((a: any, b: any) => b[1] - a[1])[0]?.[0];
                        const topParty = parties.find(p => p.id === topPartyId);
                        const totalAreaVotes = Object.values(partyData).reduce((a: any, b: any) => a + b, 0) as number;

                        return (
                          <motion.div 
                            key={area} 
                            whileHover={{ x: 10 }}
                            className="bg-zinc-50 p-6 rounded-[2rem] border border-zinc-100"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-sm font-black text-zinc-900 uppercase tracking-tight">{area}</span>
                              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{totalAreaVotes} Responses</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-100 p-2.5 flex-shrink-0 shadow-sm">
                                <PartyImage src={topParty?.image || ''} alt="" className="w-full h-full object-contain" fallbackText={topParty?.name || '?'} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-black text-zinc-700 uppercase tracking-widest">{topParty?.name || 'No Data'}</span>
                                  <span className="text-xs font-black text-zinc-900">
                                    {totalAreaVotes > 0 ? Math.round((partyData[topPartyId] / totalAreaVotes) * 100) : 0}%
                                  </span>
                                </div>
                                <div className="w-full h-3 bg-zinc-200 rounded-full overflow-hidden shadow-inner">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${totalAreaVotes > 0 ? (partyData[topPartyId] / totalAreaVotes) * 100 : 0}%` }}
                                    transition={{ duration: 1 }}
                                    className="h-full" 
                                    style={{ backgroundColor: topParty?.color || '#141414' }} 
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center">
                  <p className="text-zinc-400 font-black uppercase tracking-widest text-xs">No demographic data available yet</p>
                </div>
              )}
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
            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-100">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black font-display tracking-tight">Regional Pulse</h3>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Select a district or constituency</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative min-w-[220px] dropdown-container">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                    <MapPin size={16} />
                  </div>
                  <input
                    type="text"
                    value={selectedDistrict || districtSearch}
                    onChange={(e) => {
                      setDistrictSearch(e.target.value);
                      if (selectedDistrict) setSelectedDistrict('');
                      setShowDistrictDropdown(true);
                    }}
                    onFocus={() => setShowDistrictDropdown(true)}
                    placeholder="Search district..."
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl pl-12 pr-6 py-4 outline-none focus:ring-4 focus:ring-[#046A38]/10 font-bold text-zinc-700 shadow-sm transition-all"
                  />
                  <AnimatePresence>
                    {showDistrictDropdown && filteredDistricts.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-[100] top-full left-0 right-0 mt-3 bg-white border border-zinc-100 rounded-[2rem] shadow-2xl max-h-64 overflow-y-auto no-scrollbar p-2"
                      >
                        {filteredDistricts.map(d => (
                          <button
                            key={d}
                            onClick={() => {
                              setSelectedDistrict(d);
                              setDistrictSearch('');
                              setShowDistrictDropdown(false);
                              setSelectedConstituency('');
                            }}
                            className="w-full text-left px-6 py-4 hover:bg-zinc-50 rounded-xl font-bold text-sm text-zinc-700 transition-all flex items-center justify-between group"
                          >
                            {d}
                            <ChevronRight size={14} className="text-zinc-300 group-hover:text-zinc-900 transition-all" />
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative min-w-[220px] dropdown-container">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Zap size={16} />
                  </div>
                  <input
                    type="text"
                    value={selectedConstituency || constituencySearch}
                    onChange={(e) => {
                      setConstituencySearch(e.target.value);
                      if (selectedConstituency) setSelectedConstituency('');
                      setShowConstituencyDropdown(true);
                    }}
                    onFocus={() => setShowConstituencyDropdown(true)}
                    disabled={!selectedDistrict}
                    placeholder="Search constituency..."
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl pl-12 pr-6 py-4 outline-none focus:ring-4 focus:ring-[#046A38]/10 font-bold text-zinc-700 shadow-sm disabled:opacity-50 transition-all"
                  />
                  <AnimatePresence>
                    {showConstituencyDropdown && filteredConstituencies.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-[100] top-full left-0 right-0 mt-3 bg-white border border-zinc-100 rounded-[2rem] shadow-2xl max-h-64 overflow-y-auto no-scrollbar p-2"
                      >
                        {filteredConstituencies.map(c => (
                          <button
                            key={c}
                            onClick={() => {
                              setSelectedConstituency(c);
                              setConstituencySearch('');
                              setShowConstituencyDropdown(false);
                            }}
                            className="w-full text-left px-6 py-4 hover:bg-zinc-50 rounded-xl font-bold text-sm text-zinc-700 transition-all flex items-center justify-between group"
                          >
                            {c}
                            <ChevronRight size={14} className="text-zinc-300 group-hover:text-zinc-900 transition-all" />
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* District Results */}
              {selectedDistrict && (
                <div className={`${selectedConstituency ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-6`}>
                  <div className="flex items-center justify-between px-4">
                    <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest">District: {selectedDistrict}</h4>
                    {districtData && (
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        {districtData.totalVotes} Total Votes
                      </span>
                    )}
                  </div>
                  
                  <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-12">
                      <div className="md:col-span-5 bg-zinc-50 p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-zinc-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-200/20 blur-3xl -mr-12 -mt-12" />
                        {districtLoading ? (
                          <div className="flex flex-col items-center gap-3">
                            <Loader2 className="animate-spin text-[#046A38]" size={32} />
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Fetching District Data...</p>
                          </div>
                        ) : districtData ? (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6 relative z-10"
                          >
                            <div className="relative">
                              <div className="w-24 h-24 rounded-3xl bg-white shadow-2xl flex items-center justify-center p-4 mx-auto border border-zinc-100">
                                <PartyImage 
                                  src={getLeadingParty(districtData)?.image || ''} 
                                  alt="" 
                                  className="w-full h-full object-contain" 
                                  fallbackText={getLeadingParty(districtData)?.name[0] || '?'} 
                                />
                              </div>
                              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-xl border-4 border-zinc-50">
                                <Trophy size={16} className="text-amber-400" />
                              </div>
                            </div>
                            <div>
                              <p className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-1">Leading Party</p>
                              <h5 className="text-2xl font-black font-display tracking-tight text-zinc-900">{getLeadingParty(districtData)?.name || 'No Leader'}</h5>
                              <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border border-zinc-200 text-[10px] font-black text-zinc-600">
                                <Users size={12} />
                                {Math.round((formatChartData(districtData)[0]?.votes / districtData.totalVotes) * 100) || 0}% Lead
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="text-zinc-300">
                            <Database size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-widest">No Data Available</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="md:col-span-7 p-8 flex flex-col justify-center gap-6">
                        <div className="space-y-4">
                          {formatChartData(districtData).slice(0, 4).map((party: any, idx: number) => (
                            <div key={party.name} className="space-y-2">
                              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-zinc-500">{party.name}</span>
                                <span className="text-zinc-900">{party.votes}</span>
                              </div>
                              <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${districtData?.totalVotes > 0 ? (party.votes / districtData.totalVotes) * 100 : 0}%` }}
                                  transition={{ duration: 1, delay: idx * 0.1 }}
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: party.color }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        {formatChartData(districtData).length > 4 && (
                          <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest text-center">
                            + {formatChartData(districtData).length - 4} other parties
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Constituency Results */}
              {selectedConstituency && (
                <div className="lg:col-span-6 space-y-6">
                  <div className="flex items-center justify-between px-4">
                    <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Constituency: {selectedConstituency}</h4>
                    {constituencyData && (
                      <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                        {constituencyData.totalVotes} Total Votes
                      </span>
                    )}
                  </div>

                  <div className="bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[80px] -mr-32 -mt-32" />
                    <div className="grid grid-cols-1 md:grid-cols-12 relative z-10">
                      <div className="md:col-span-5 p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-white/5">
                        {constituencyLoading ? (
                          <div className="flex flex-col items-center gap-3">
                            <Loader2 className="animate-spin text-indigo-400" size={32} />
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Analyzing Pulse...</p>
                          </div>
                        ) : constituencyData ? (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                          >
                            <div className="relative">
                              <div className="w-24 h-24 rounded-3xl bg-white/5 backdrop-blur-xl shadow-2xl flex items-center justify-center p-4 mx-auto border border-white/10">
                                <PartyImage 
                                  src={getLeadingParty(constituencyData)?.image || ''} 
                                  alt="" 
                                  className="w-full h-full object-contain" 
                                  fallbackText={getLeadingParty(constituencyData)?.name[0] || '?'} 
                                />
                              </div>
                              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-xl border-4 border-zinc-900">
                                <Zap size={16} className="text-white" />
                              </div>
                            </div>
                            <div>
                              <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-1">Local Favorite</p>
                              <h5 className="text-2xl font-black font-display tracking-tight text-white">{getLeadingParty(constituencyData)?.name || 'No Leader'}</h5>
                              <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 text-[10px] font-black text-indigo-300">
                                <TrendingUp size={12} />
                                {Math.round((formatChartData(constituencyData)[0]?.votes / constituencyData.totalVotes) * 100) || 0}% Support
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="text-zinc-700">
                            <Database size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-widest">No Data</p>
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-7 p-8 flex flex-col justify-center gap-6">
                        <div className="space-y-4">
                          {formatChartData(constituencyData).slice(0, 4).map((party: any, idx: number) => (
                            <div key={party.name} className="space-y-2">
                              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-zinc-400">{party.name}</span>
                                <span className="text-white">{party.votes}</span>
                              </div>
                              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${constituencyData?.totalVotes > 0 ? (party.votes / constituencyData.totalVotes) * 100 : 0}%` }}
                                  transition={{ duration: 1, delay: idx * 0.1 }}
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: party.color }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        {formatChartData(constituencyData).length > 4 && (
                          <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest text-center">
                            + {formatChartData(constituencyData).length - 4} other parties
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!selectedDistrict && (
              <div className="bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-[2.5rem] p-20 text-center">
                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <MapPin className="text-zinc-300" size={40} />
                </div>
                <h4 className="text-xl font-black text-zinc-400 font-display uppercase tracking-widest">Select a district to begin</h4>
                <p className="text-zinc-400 text-sm mt-2">Deep-dive into local trends across Tamil Nadu</p>
              </div>
            )}
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
