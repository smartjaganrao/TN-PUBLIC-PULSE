import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { districts } from '../data/districts';
import { parties, Party } from '../data/parties';
import PartyImage from '../components/PartyImage';
import { submitVote, hasVotedForPartyLocally, getVotedPartiesLocally } from '../services/voteService';
import { CheckCircle2, AlertCircle, Share2, Copy, Check, ArrowLeft, ArrowRight, User, Loader2, Vote, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

const VotePage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [nickname, setNickname] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [selectedAlliance, setSelectedAlliance] = useState('RULING');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [votedParties, setVotedParties] = useState<string[]>([]);

  useEffect(() => {
    setVotedParties(getVotedPartiesLocally());
  }, []);

  const [districtSearch, setDistrictSearch] = useState('');
  const filteredDistricts = districts.filter(d => 
    d.toLowerCase().includes(districtSearch.toLowerCase())
  ).slice(0, 8);

  const handleVote = async () => {
    if (!selectedDistrict || !selectedParty) {
      setError('Please select both a district and a party.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitVote({
        nickname: nickname.trim() || null,
        district: selectedDistrict,
        party: selectedParty.id
      });
      
      setVotedParties(prev => [...prev, selectedParty.id]);
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#046A38', '#FFD700', '#FFFFFF']
      });
      
      setShowSuccess(true);
    } catch (err: any) {
      if (err.message === 'ALREADY_VOTED_FOR_PARTY') {
        setError("You have already voted for this party!");
      } else {
        setError('Something went wrong. Please try again later.');
        console.error(err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareResults = () => {
    const text = `${t.shareMessage} ${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-zinc-900 text-white rounded-[3rem] p-10 sm:p-16 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -mr-32 -mt-32" />
          
          <div className="relative z-10">
            <div className="bg-emerald-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(16,185,129,0.4)]">
              <CheckCircle2 size={56} className="text-white animate-bounce" />
            </div>
            <h2 className="text-4xl sm:text-6xl font-black mb-4 font-display tracking-tighter">VOTE RECORDED!</h2>
            <p className="text-emerald-400 font-black uppercase tracking-[0.3em] text-[10px] mb-8">You are now part of the revolution</p>
            
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 mb-10 border border-white/10">
              <p className="text-zinc-400 text-sm sm:text-lg font-medium mb-6">
                "The power of youth is the common wealth for the entire world."
              </p>
              <h4 className="text-xl font-black font-display mb-2">WANT TO SEE THE FULL TRENDS?</h4>
              <p className="text-zinc-500 text-xs sm:text-sm font-medium">Share this with 3 friends to help make the pulse more accurate!</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={shareResults}
                className="bg-[#25D366] text-white py-5 rounded-full font-black text-lg flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-green-500/20"
              >
                <Share2 size={24} />
                Share on WhatsApp
              </button>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setSelectedParty(null);
                }}
                className="bg-white/10 text-white py-5 rounded-full font-black text-lg flex items-center justify-center gap-3 hover:bg-white/20 transition-all border border-white/10"
              >
                <Vote size={24} />
                Vote for Another
              </button>
            </div>

            <button
              onClick={() => navigate('/results')}
              className="mt-12 text-zinc-500 hover:text-white font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 mx-auto group"
            >
              Skip to Results <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
      <div className="mb-6 text-center">
        <h2 className="text-4xl sm:text-6xl font-black text-zinc-900 font-display tracking-tighter mb-2">
          SHARE YOUR <span className="text-[#046A38]">VOICE</span>
        </h2>
        <p className="text-zinc-500 font-bold text-sm sm:text-base uppercase tracking-widest">One step. One vote. Total impact.</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-50 border border-rose-100 text-rose-700 p-6 rounded-3xl mb-12 flex items-center gap-4 shadow-sm max-w-2xl mx-auto"
        >
          <AlertCircle size={24} />
          <p className="font-bold">{error}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Identity & District */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-zinc-100 shadow-xl space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 font-display flex items-center gap-2">
                <User size={14} /> {t.nickname}
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. YoungTamilan"
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-[#046A38]/10 focus:border-[#046A38] outline-none transition-all font-black text-base shadow-inner"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 font-display flex items-center gap-2">
                <MapPin size={14} /> {t.selectDistrict}
              </label>
              <input
                type="text"
                value={districtSearch}
                onChange={(e) => setDistrictSearch(e.target.value)}
                placeholder="Search district..."
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-3 focus:ring-4 focus:ring-[#046A38]/10 focus:border-[#046A38] outline-none transition-all font-bold text-sm shadow-inner mb-2"
              />
              <div className="flex flex-wrap gap-1.5">
                {(districtSearch ? filteredDistricts : districts.slice(0, 8)).map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDistrict(d)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                      selectedDistrict === d
                        ? 'bg-[#046A38] text-white shadow-lg scale-105'
                        : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              {selectedDistrict && (
                <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                  <span className="text-[#046A38] font-black text-xs uppercase tracking-widest">Selected: {selectedDistrict}</span>
                  <button onClick={() => setSelectedDistrict('')} className="text-[#046A38] hover:scale-110 transition-transform">
                    <CheckCircle2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button for Desktop */}
          <div className="hidden lg:block">
            <button
              onClick={handleVote}
              disabled={!selectedParty || !selectedDistrict || isSubmitting}
              className="w-full bg-[#046A38] text-white py-8 rounded-[2.5rem] font-black text-2xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex flex-col items-center justify-center gap-2 group"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={32} />
              ) : (
                <>
                  <Vote size={32} className="group-hover:rotate-12 transition-transform" />
                  <span>{t.confirmVote}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Party Selection */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[3rem] border border-zinc-100 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] -mr-32 -mt-32" />
            
            {/* Alliance Tabs */}
            <div className="relative z-10 flex p-1 bg-zinc-100 rounded-2xl mb-8">
              {[
                { id: 'RULING', label: 'Ruling', color: 'bg-rose-500' },
                { id: 'OPPOSITION', label: 'Opposition', color: 'bg-emerald-500' },
                { id: 'ALTERNATIVES', label: 'Others', color: 'bg-amber-500' }
              ].map((alliance) => (
                <button
                  key={alliance.id}
                  onClick={() => setSelectedAlliance(alliance.id)}
                  className={`flex-1 py-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
                    selectedAlliance === alliance.id
                      ? 'bg-white text-zinc-900 shadow-md'
                      : 'text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  {alliance.label}
                </button>
              ))}
            </div>

            <div className="relative z-10">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {parties.filter(p => p.axis === selectedAlliance).map((party) => {
                  const alreadyVoted = votedParties.includes(party.id);
                  return (
                    <button
                      key={party.id}
                      onClick={() => !alreadyVoted && setSelectedParty(party)}
                      disabled={alreadyVoted}
                      className={`relative p-3 rounded-2xl border-2 transition-all duration-300 group ${
                        selectedParty?.id === party.id
                          ? 'border-[#046A38] bg-emerald-50 shadow-lg scale-105'
                          : alreadyVoted
                          ? 'border-zinc-200 bg-zinc-100 opacity-60 cursor-not-allowed'
                          : 'border-transparent bg-zinc-50 hover:border-zinc-200'
                      }`}
                    >
                      <div className="aspect-square w-full mb-2">
                        <PartyImage 
                          src={party.image} 
                          alt={party.name} 
                          className={`w-full h-full ${alreadyVoted ? 'grayscale' : ''}`} 
                          fallbackText={party.name}
                        />
                      </div>
                      <p className="text-[8px] sm:text-[10px] font-black text-zinc-900 font-display tracking-tight leading-none truncate">{party.name}</p>
                      {selectedParty?.id === party.id && (
                        <div className="absolute -top-1 -right-1 bg-[#046A38] text-white p-1 rounded-full shadow-lg">
                          <Check size={10} />
                        </div>
                      )}
                      {alreadyVoted && (
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/10 rounded-2xl">
                          <span className="bg-zinc-900 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest">Voted</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit Button for Mobile */}
          <div className="lg:hidden">
            <button
              onClick={handleVote}
              disabled={!selectedParty || !selectedDistrict || isSubmitting}
              className="w-full bg-[#046A38] text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Vote />}
              {t.confirmVote}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotePage;
