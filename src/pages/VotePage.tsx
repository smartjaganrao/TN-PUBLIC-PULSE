import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { districts } from '../data/districts';
import { parties, Party } from '../data/parties';
import { submitVote, hasVotedLocally } from '../services/voteService';
import { CheckCircle2, AlertCircle, Share2, Copy, Check, ArrowLeft, ArrowRight, User, Loader2, Vote } from 'lucide-react';
import confetti from 'canvas-confetti';

const VotePage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [nickname, setNickname] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (hasVotedLocally()) {
      setError(t.alreadyVoted);
    }
  }, [t.alreadyVoted]);

  const handleVote = async () => {
    if (!selectedDistrict || !selectedParty) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await submitVote({
        nickname: nickname.trim() || undefined,
        district: selectedDistrict,
        party: selectedParty.id
      });
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#046A38', '#FFD700', '#FFFFFF']
      });
      
      setShowSuccess(true);
    } catch (err: any) {
      if (err.message === 'ALREADY_VOTED') {
        setError(t.alreadyVoted);
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

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[2rem] p-10 shadow-xl border border-zinc-100"
        >
          <div className="bg-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 size={56} className="text-[#046A38] animate-bounce" />
          </div>
          <h2 className="text-4xl font-black mb-4 font-display">{t.voteSuccess}</h2>
          <p className="text-zinc-500 mb-8">{t.shareMessage}</p>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={shareResults}
              className="bg-[#25D366] text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Share2 size={20} />
              {t.whatsapp}
            </button>
            <button
              onClick={copyLink}
              className="bg-zinc-100 text-zinc-700 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
              {copied ? 'Copied!' : t.copyLink}
            </button>
            <button
              onClick={() => navigate('/results')}
              className="text-[#046A38] font-bold py-2 mt-4"
            >
              {t.viewResults}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12 space-y-4">
        <Link to="/" className="text-zinc-500 hover:text-zinc-800 font-bold text-xs flex items-center gap-2 transition-colors uppercase tracking-widest">
          <ArrowLeft size={14} />
          Back to Home
        </Link>
        <h2 className="text-5xl font-black text-zinc-900 font-display tracking-tight">{t.startVoting}</h2>
        <p className="text-zinc-500 max-w-xl font-medium">{t.disclaimer}</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-3xl mb-12 flex items-center gap-4 shadow-sm"
        >
          <div className="bg-red-100 p-2 rounded-full">
            <AlertCircle size={24} />
          </div>
          <p className="font-bold">{error}</p>
        </motion.div>
      )}

      <div className="space-y-16">
        {/* Step 1: Basic Info */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-black">1</div>
            <h3 className="text-2xl font-black font-display">Your Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 font-display">
                {t.nickname}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Tamilan"
                  disabled={!!error}
                  className="w-full bg-white border border-zinc-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-[#046A38] focus:border-transparent outline-none transition-all disabled:opacity-50 font-medium shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 font-display">
                {t.selectDistrict} *
              </label>
              <div className="relative">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!!error}
                  className="w-full bg-white border border-zinc-200 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-[#046A38] focus:border-transparent outline-none transition-all disabled:opacity-50 appearance-none font-medium shadow-sm"
                >
                  <option value="">-- {t.selectDistrict} --</option>
                  {districts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                  <ArrowRight size={20} className="rotate-90" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Party Selection */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-black">2</div>
            <h3 className="text-2xl font-black font-display">{t.selectParty}</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {parties.map((party) => (
              <button
                key={party.id}
                onClick={() => setSelectedParty(party)}
                disabled={!!error}
                className={`relative overflow-hidden rounded-[2.5rem] border-2 transition-all duration-500 group ${
                  selectedParty?.id === party.id
                    ? 'border-[#046A38] bg-emerald-50/30 ring-8 ring-[#046A38]/5 shadow-2xl scale-[1.02]'
                    : 'border-white bg-white hover:border-zinc-200 shadow-sm hover:shadow-xl'
                } disabled:opacity-50`}
              >
                <div className="aspect-[4/3] w-full relative overflow-hidden p-8">
                  <img 
                    src={party.image} 
                    alt={party.name}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  {selectedParty?.id === party.id && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 bg-[#046A38]/10 flex items-center justify-center backdrop-blur-[2px]"
                    >
                      <div className="bg-[#046A38] text-white p-4 rounded-full shadow-2xl">
                        <CheckCircle2 size={40} />
                      </div>
                    </motion.div>
                  )}
                </div>
                
                <div className="p-6 bg-white border-t border-zinc-50 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: party.color }}
                    />
                    <span className="text-2xl font-black text-zinc-900 tracking-tight font-display">
                      {party.name}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-12 flex flex-col items-center gap-8">
          <button
            onClick={handleVote}
            disabled={!selectedDistrict || !selectedParty || isSubmitting || !!error}
            className="w-full max-w-xl bg-[#046A38] text-white py-6 rounded-full font-black text-2xl shadow-2xl shadow-emerald-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={28} />
                  Processing...
                </>
              ) : (
                <>
                  <Vote size={28} />
                  {t.confirmVote}
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>

          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
            <Link to="/results" className="hover:text-[#046A38] transition-colors">Skip to Results</Link>
            <div className="w-1 h-1 bg-zinc-300 rounded-full" />
            <Link to="/forum" className="hover:text-[#046A38] transition-colors">Join Discussion</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotePage;
