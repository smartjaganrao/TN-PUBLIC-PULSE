import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { districts } from '../data/districts';
import { parties, Party } from '../data/parties';
import PartyImage from '../components/PartyImage';
import { submitVote, hasVotedLocally } from '../services/voteService';
import { CheckCircle2, AlertCircle, Share2, Copy, Check, ArrowLeft, ArrowRight, User, Loader2, Vote, MapPin } from 'lucide-react';
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
  const [step, setStep] = useState(1);
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
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Compact Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link to="/" className="text-zinc-400 hover:text-zinc-800 font-black text-[10px] flex items-center gap-2 transition-all uppercase tracking-widest">
            <ArrowLeft size={12} />
            Back
          </Link>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 font-display tracking-tight">Share Your Voice</h2>
        </div>
        
        {/* Step Indicator */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-zinc-100 shadow-sm">
          {[1, 2].map((s) => (
            <div 
              key={s}
              className={`h-2 w-12 rounded-full transition-all duration-500 ${
                step >= s ? 'bg-[#046A38] shadow-lg shadow-emerald-100' : 'bg-zinc-100'
              }`}
            />
          ))}
          <span className="ml-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Step {step}/2</span>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl mb-8 flex items-center gap-3 shadow-sm"
        >
          <AlertCircle size={18} />
          <p className="text-xs font-bold">{error}</p>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 font-display">
                    {t.nickname}
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="e.g. Tamilan"
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-xl pl-12 pr-4 py-4 focus:ring-4 focus:ring-[#046A38]/10 focus:border-[#046A38] outline-none transition-all font-bold shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 font-display">
                    {t.selectDistrict} *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-xl pl-12 pr-4 py-4 focus:ring-4 focus:ring-[#046A38]/10 focus:border-[#046A38] outline-none transition-all appearance-none font-bold shadow-inner"
                    >
                      <option value="">-- Select --</option>
                      {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!selectedDistrict}
                className="w-full bg-zinc-900 text-white py-5 rounded-full font-black text-lg shadow-xl hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
              >
                Next Step
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="space-y-12">
              {[
                { id: 'RULING', label: 'Ruling Front (SPA)', color: 'text-rose-600' },
                { id: 'OPPOSITION', label: 'Opposition Front (AIADMK/NDA)', color: 'text-emerald-600' },
                { id: 'ALTERNATIVES', label: 'Alternatives & Others', color: 'text-amber-600' }
              ].map((axis) => (
                <div key={axis.id} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={`h-1 w-12 rounded-full bg-current ${axis.color}`} />
                    <h3 className={`text-xl font-black font-display uppercase tracking-widest ${axis.color}`}>{axis.label}</h3>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {parties.filter(p => p.axis === axis.id).map((party) => (
                      <button
                        key={party.id}
                        onClick={() => setSelectedParty(party)}
                        className={`relative p-6 rounded-[2rem] border-2 transition-all duration-300 group ${
                          selectedParty?.id === party.id
                            ? 'border-[#046A38] bg-emerald-50 shadow-2xl scale-[1.05]'
                            : 'border-white bg-white hover:border-zinc-100 shadow-sm'
                        }`}
                      >
                        <div className="aspect-square w-full mb-4">
                          <PartyImage 
                            src={party.image} 
                            alt={party.name} 
                            className="w-full h-full" 
                            fallbackText={party.name}
                          />
                        </div>
                        <p className="text-xs sm:text-lg font-black text-zinc-900 font-display tracking-tight leading-none">{party.name}</p>
                        {selectedParty?.id === party.id && (
                          <div className="absolute top-3 right-3 bg-[#046A38] text-white p-1 rounded-full shadow-lg">
                            <Check size={12} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-white border border-zinc-200 text-zinc-900 py-5 rounded-full font-black text-lg hover:bg-zinc-50 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleVote}
                disabled={!selectedParty || isSubmitting}
                className="flex-[2] bg-[#046A38] text-white py-5 rounded-full font-black text-xl shadow-2xl shadow-emerald-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Vote />}
                {t.confirmVote}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VotePage;
