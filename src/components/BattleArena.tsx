import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Zap, Shield, Trophy, Loader2, Clock } from 'lucide-react';
import { parties } from '../data/parties';
import { subscribeToShouts, postShout } from '../services/voteService';
import confetti from 'canvas-confetti';

const BattleArena: React.FC = () => {
  const [shouts, setShouts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [partyA, setPartyA] = useState(parties[0]);
  const [partyB, setPartyB] = useState(parties[1]);
  const [isBoostingA, setIsBoostingA] = useState(false);
  const [isBoostingB, setIsBoostingB] = useState(false);
  const [cooldownA, setCooldownA] = useState(0);
  const [cooldownB, setCooldownB] = useState(0);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToShouts((data) => {
      const map: Record<string, number> = {};
      data.forEach(s => map[s.partyId] = s.count);
      setShouts(map);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCooldownA(prev => Math.max(0, prev - 1));
      setCooldownB(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBoost = async (partyId: string, side: 'A' | 'B') => {
    if (side === 'A') {
      if (cooldownA > 0) return;
      setIsBoostingA(true);
      setCooldownA(5);
    } else {
      if (cooldownB > 0) return;
      setIsBoostingB(true);
      setCooldownB(5);
    }

    try {
      await postShout(partyId);
      // Optimistic update
      setShouts(prev => ({ ...prev, [partyId]: (prev[partyId] || 0) + 1 }));
      
      if (Math.random() > 0.8) {
        confetti({
          particleCount: 20,
          spread: 30,
          origin: { x: side === 'A' ? 0.25 : 0.75, y: 0.5 },
          colors: [parties.find(p => p.id === partyId)?.color || '#000']
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => {
        if (side === 'A') setIsBoostingA(false);
        else setIsBoostingB(false);
      }, 100);
    }
  };

  const countA = shouts[partyA.id] || 0;
  const countB = shouts[partyB.id] || 0;
  const total = countA + countB || 1;
  const percentA = (countA / total) * 100;

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-emerald-500" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-rose-500 p-2 rounded-lg text-white shadow-lg shadow-rose-200 animate-pulse">
          <Swords size={24} />
        </div>
        <h2 className="text-3xl font-black text-zinc-900 font-display flex items-center gap-3">
          Battle Arena
          <span className="text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded-full animate-bounce">LIVE FIGHT</span>
        </h2>
      </div>

      <div className="glass p-8 sm:p-12 rounded-[3rem] relative overflow-hidden youth-gradient">
        {/* Progress Bar / Tug of War */}
        <div className="absolute top-0 left-0 w-full h-2 bg-zinc-100 flex">
          <motion.div 
            animate={{ width: `${percentA}%` }}
            className="h-full transition-all duration-500"
            style={{ backgroundColor: partyA.color }}
          />
          <motion.div 
            animate={{ width: `${100 - percentA}%` }}
            className="h-full transition-all duration-500"
            style={{ backgroundColor: partyB.color }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-8 items-center">
          {/* Party A */}
          <div className="md:col-span-3 flex flex-col items-center text-center space-y-6">
            <select 
              value={partyA.id} 
              onChange={(e) => setPartyA(parties.find(p => p.id === e.target.value)!)}
              className="bg-white/50 backdrop-blur-sm border border-zinc-200 rounded-full px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {parties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            
            <motion.div 
              animate={isBoostingA ? { scale: 1.2, rotate: -5 } : { scale: 1 }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-full border-8 overflow-hidden bg-white shadow-2xl" style={{ borderColor: partyA.color }}>
                <img src={partyA.image} alt={partyA.name} className="w-full h-full object-contain p-4" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                <Zap className="text-yellow-500" size={20} fill="currentColor" />
              </div>
            </motion.div>

            <div className="space-y-1">
              <h4 className="text-4xl font-black font-display" style={{ color: partyA.color }}>{countA.toLocaleString()}</h4>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Battle Points</p>
            </div>

            <button 
              onClick={() => handleBoost(partyA.id, 'A')}
              disabled={cooldownA > 0}
              className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all flex items-center justify-center gap-2 group relative overflow-hidden ${
                cooldownA > 0 ? 'opacity-50 cursor-not-allowed grayscale' : 'active:scale-95 hover:brightness-110'
              }`}
              style={{ backgroundColor: partyA.color }}
            >
              {cooldownA > 0 ? (
                <>
                  <Clock size={20} className="animate-spin" />
                  COOLING DOWN ({cooldownA}s)
                  <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                    className="absolute bottom-0 left-0 h-1 bg-white/30"
                  />
                </>
              ) : (
                <>
                  <Zap size={20} className="group-hover:animate-bounce" />
                  BOOST {partyA.name}
                </>
              )}
            </button>
          </div>

          {/* VS Divider */}
          <div className="md:col-span-1 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-zinc-900 text-white flex items-center justify-center font-black text-2xl shadow-2xl border-4 border-white animate-pulse">
              VS
            </div>
          </div>

          {/* Party B */}
          <div className="md:col-span-3 flex flex-col items-center text-center space-y-6">
            <select 
              value={partyB.id} 
              onChange={(e) => setPartyB(parties.find(p => p.id === e.target.value)!)}
              className="bg-white/50 backdrop-blur-sm border border-zinc-200 rounded-full px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {parties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>

            <motion.div 
              animate={isBoostingB ? { scale: 1.2, rotate: 5 } : { scale: 1 }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-full border-8 overflow-hidden bg-white shadow-2xl" style={{ borderColor: partyB.color }}>
                <img src={partyB.image} alt={partyB.name} className="w-full h-full object-contain p-4" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -top-2 -left-2 bg-white rounded-full p-2 shadow-lg">
                <Shield className="text-blue-500" size={20} fill="currentColor" />
              </div>
            </motion.div>

            <div className="space-y-1">
              <h4 className="text-4xl font-black font-display" style={{ color: partyB.color }}>{countB.toLocaleString()}</h4>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Battle Points</p>
            </div>

            <button 
              onClick={() => handleBoost(partyB.id, 'B')}
              disabled={cooldownB > 0}
              className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all flex items-center justify-center gap-2 group relative overflow-hidden ${
                cooldownB > 0 ? 'opacity-50 cursor-not-allowed grayscale' : 'active:scale-95 hover:brightness-110'
              }`}
              style={{ backgroundColor: partyB.color }}
            >
              {cooldownB > 0 ? (
                <>
                  <Clock size={20} className="animate-spin" />
                  COOLING DOWN ({cooldownB}s)
                  <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                    className="absolute bottom-0 left-0 h-1 bg-white/30"
                  />
                </>
              ) : (
                <>
                  <Zap size={20} className="group-hover:animate-bounce" />
                  BOOST {partyB.name}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/30 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest text-zinc-600">
            <Trophy size={14} className="text-amber-500" />
            Top Contender: {countA > countB ? partyA.name : partyB.name} is leading the arena!
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleArena;
