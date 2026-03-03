import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-rose-500 p-1.5 rounded-lg text-white shadow-lg shadow-rose-200 animate-pulse">
          <Swords size={20} />
        </div>
        <h2 className="text-2xl font-black text-zinc-900 font-display flex items-center gap-3">
          Battle Arena
          <span className="text-[8px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full animate-bounce">LIVE</span>
        </h2>
      </div>

      <div className="glass p-6 rounded-[2rem] relative overflow-hidden youth-gradient">
        <div className="flex flex-col gap-8 items-center relative">
          {/* Party A */}
          <div className="w-full flex flex-col items-center text-center space-y-4 relative z-10">
            <select 
              value={partyA.id} 
              onChange={(e) => setPartyA(parties.find(p => p.id === e.target.value)!)}
              className="bg-white/50 backdrop-blur-sm border border-zinc-200 rounded-full px-3 py-1.5 text-[10px] font-bold outline-none focus:ring-2 focus:ring-emerald-500 w-full"
            >
              {parties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            
            <motion.div 
              animate={isBoostingA ? { scale: 1.1, rotate: -5 } : { scale: 1 }}
              className="relative"
            >
              <div className="w-20 h-20 rounded-full border-4 overflow-hidden bg-white shadow-xl" style={{ borderColor: partyA.color }}>
                <img src={partyA.image} alt={partyA.name} className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-md">
                <Zap className="text-yellow-500" size={14} fill="currentColor" />
              </div>
            </motion.div>

            <div className="space-y-0.5">
              <h4 className="text-2xl font-black font-display" style={{ color: partyA.color }}>{countA.toLocaleString()}</h4>
              <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Points</p>
            </div>

            <button 
              onClick={() => handleBoost(partyA.id, 'A')}
              disabled={cooldownA > 0}
              className={`w-full py-3 rounded-xl font-black text-white text-xs shadow-lg transition-all flex items-center justify-center gap-2 group relative overflow-hidden ${
                cooldownA > 0 ? 'opacity-50 cursor-not-allowed grayscale' : 'active:scale-95 hover:brightness-110'
              }`}
              style={{ backgroundColor: partyA.color }}
            >
              {cooldownA > 0 ? (
                <>
                  <Clock size={16} className="animate-spin" />
                  {cooldownA}s
                </>
              ) : (
                <>
                  <Zap size={16} className="group-hover:animate-bounce" />
                  BOOST
                </>
              )}
            </button>
          </div>

          {/* VS Divider & Vertical Progress */}
          <div className="relative py-4 w-full flex justify-center">
            {/* Background Track */}
            <div className="absolute top-0 bottom-0 w-1.5 bg-zinc-100 rounded-full overflow-hidden flex flex-col">
              <motion.div 
                animate={{ height: `${percentA}%` }}
                className="w-full transition-all duration-500"
                style={{ backgroundColor: partyA.color }}
              />
              <motion.div 
                animate={{ height: `${100 - percentA}%` }}
                className="w-full transition-all duration-500"
                style={{ backgroundColor: partyB.color }}
              />
            </div>
            
            <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-black text-sm shadow-xl border-2 border-white animate-pulse z-20 relative">
              VS
            </div>
          </div>

          {/* Party B */}
          <div className="w-full flex flex-col items-center text-center space-y-4 relative z-10">
            <motion.div 
              animate={isBoostingB ? { scale: 1.1, rotate: 5 } : { scale: 1 }}
              className="relative"
            >
              <div className="w-20 h-20 rounded-full border-4 overflow-hidden bg-white shadow-xl" style={{ borderColor: partyB.color }}>
                <img src={partyB.image} alt={partyB.name} className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -top-1 -left-1 bg-white rounded-full p-1 shadow-md">
                <Shield className="text-blue-500" size={14} fill="currentColor" />
              </div>
            </motion.div>

            <div className="space-y-0.5">
              <h4 className="text-2xl font-black font-display" style={{ color: partyB.color }}>{countB.toLocaleString()}</h4>
              <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Points</p>
            </div>

            <button 
              onClick={() => handleBoost(partyB.id, 'B')}
              disabled={cooldownB > 0}
              className={`w-full py-3 rounded-xl font-black text-white text-xs shadow-lg transition-all flex items-center justify-center gap-2 group relative overflow-hidden ${
                cooldownB > 0 ? 'opacity-50 cursor-not-allowed grayscale' : 'active:scale-95 hover:brightness-110'
              }`}
              style={{ backgroundColor: partyB.color }}
            >
              {cooldownB > 0 ? (
                <>
                  <Clock size={16} className="animate-spin" />
                  {cooldownB}s
                </>
              ) : (
                <>
                  <Zap size={16} className="group-hover:animate-bounce" />
                  BOOST
                </>
              )}
            </button>

            <select 
              value={partyB.id} 
              onChange={(e) => setPartyB(parties.find(p => p.id === e.target.value)!)}
              className="bg-white/50 backdrop-blur-sm border border-zinc-200 rounded-full px-3 py-1.5 text-[10px] font-bold outline-none focus:ring-2 focus:ring-emerald-500 w-full"
            >
              {parties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/30 backdrop-blur-md rounded-full border border-white/20 text-[8px] font-black uppercase tracking-widest text-zinc-600">
            <Trophy size={12} className="text-amber-500" />
            Leading: {countA > countB ? partyA.name : partyB.name}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleArena;
