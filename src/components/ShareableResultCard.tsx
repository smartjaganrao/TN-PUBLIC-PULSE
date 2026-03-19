import React from 'react';
import { parties } from '../data/parties';
import PartyImage from './PartyImage';
import { Trophy, TrendingUp, Zap, ShieldCheck, Star } from 'lucide-react';

interface ShareableResultCardProps {
  title: string;
  subtitle: string;
  data: any;
  totalVotes: number;
  cardRef: React.RefObject<HTMLDivElement>;
}

const ShareableResultCard: React.FC<ShareableResultCardProps> = ({ 
  title, 
  subtitle, 
  data, 
  totalVotes,
  cardRef 
}) => {
  if (!data) return null;

  const sortedData = parties
    .map(p => ({
      ...p,
      votes: data[p.id] || 0,
      percentage: totalVotes > 0 ? Math.round(((data[p.id] || 0) / totalVotes) * 100) : 0
    }))
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 5);

  const leader = sortedData[0];

  return (
    <div className="fixed -left-[9999px] top-0">
      <div 
        ref={cardRef}
        className="w-[1080px] h-[1920px] bg-[#09090b] text-white p-20 flex flex-col relative overflow-hidden font-sans"
        style={{ 
          backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.25) 0%, transparent 70%), radial-gradient(circle at 0% 100%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial-gradient(circle at 100% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)' 
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />

        {/* Header */}
        <div className="flex justify-between items-start mb-24 relative z-10">
          <div className="flex items-center gap-8">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Tamil Pulse" 
                className="h-40 w-auto object-contain brightness-0 invert"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-4 -right-4 bg-emerald-500 text-white p-2 rounded-full shadow-xl">
                <Star size={24} fill="currentColor" />
              </div>
            </div>
            <div>
              <h1 className="text-7xl font-black font-display tracking-tighter leading-none">
                TAMIL <span className="text-emerald-400">PULSE</span>
              </h1>
              <p className="text-2xl font-black text-emerald-500/80 uppercase tracking-[0.4em] mt-3">2026 ELECTION HUB</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-6">
            <div className="px-8 py-3 rounded-full bg-rose-500 text-2xl font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl shadow-rose-500/40">
              <span className="w-4 h-4 rounded-full bg-white animate-pulse" />
              Live Trends
            </div>
            <p className="text-zinc-500 font-black text-2xl uppercase tracking-widest">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-20 relative z-10">
          <div className="space-y-6">
            <h2 className="text-[120px] font-black font-display tracking-tighter leading-[0.9] text-white">
              {title.toUpperCase()}
            </h2>
            <div className="h-2 w-48 bg-emerald-500 rounded-full" />
            <p className="text-5xl font-bold text-zinc-400 tracking-tight">{subtitle}</p>
          </div>

          {/* Leader Spotlight */}
          <div className="bg-white/5 backdrop-blur-3xl rounded-[5rem] p-20 border border-white/10 flex items-center gap-20 relative group shadow-2xl">
            {/* Verified Badge */}
            <div className="absolute -top-8 -left-8 bg-emerald-500 text-white px-10 py-4 rounded-3xl font-black text-3xl uppercase tracking-widest shadow-2xl shadow-emerald-500/50 flex items-center gap-4 z-20">
              <ShieldCheck size={40} />
              Verified Pulse
            </div>
            
            <div className="absolute top-0 right-0 p-16 opacity-10">
              <Trophy size={200} className="text-amber-400" />
            </div>
            
            <div className="relative">
              <div className="w-80 h-80 rounded-full bg-white p-6 shadow-2xl relative z-10">
                <PartyImage 
                  src={leader.image} 
                  alt={leader.name} 
                  className="w-full h-full"
                  fallbackText={leader.name}
                />
              </div>
              <div 
                className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full border-[12px] border-[#09090b] shadow-2xl flex items-center justify-center text-white font-black text-5xl"
                style={{ backgroundColor: leader.color }}
              >
                {leader.percentage}%
              </div>
            </div>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-2xl font-black uppercase tracking-widest">
                <Trophy size={32} />
                Current Leader
              </div>
              <h3 className="text-[100px] font-black font-display tracking-tighter leading-none">{leader.name}</h3>
              <p className="text-4xl font-bold text-zinc-400 uppercase tracking-widest">Leading with {leader.votes.toLocaleString()} opinions</p>
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-12">
            <div className="flex items-center justify-between px-10">
              <h4 className="text-4xl font-black text-zinc-500 uppercase tracking-[0.25em]">Vote Distribution</h4>
              <div className="flex items-center gap-4 text-3xl font-black text-emerald-400 uppercase tracking-widest">
                <Zap size={32} />
                {totalVotes.toLocaleString()} Total Participants
              </div>
            </div>
            <div className="space-y-8">
              {sortedData.map((party, idx) => (
                <div key={party.id} className="bg-white/5 rounded-[3rem] p-10 flex items-center gap-10 border border-white/5 hover:bg-white/10 transition-all">
                  <div className="w-24 h-24 rounded-[2rem] bg-white/10 flex items-center justify-center text-4xl font-black text-zinc-500">
                    0{idx + 1}
                  </div>
                  <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-end">
                      <span className="text-5xl font-black tracking-tight">{party.name}</span>
                      <span className="text-5xl font-black text-emerald-400">{party.percentage}%</span>
                    </div>
                    <div className="h-8 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${party.percentage}%`,
                          backgroundColor: party.color,
                          boxShadow: `0 0 40px ${party.color}60`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-24 pt-20 border-t border-white/10 flex justify-between items-center relative z-10">
          <div className="space-y-4">
            <p className="text-4xl font-black text-white tracking-tight">Join the Wave at <span className="text-emerald-400">tamilpulse.in</span></p>
            <p className="text-2xl font-bold text-zinc-500 uppercase tracking-[0.2em]">Tamil Nadu's #1 Digital Election Hub</p>
          </div>
          <div className="flex items-center gap-10">
            <div className="text-right">
              <p className="text-2xl font-black text-zinc-500 uppercase tracking-widest mb-3">Scan to Vote</p>
              <div className="w-40 h-40 bg-white rounded-3xl p-3 shadow-2xl">
                {/* Mock QR Code */}
                <div className="w-full h-full bg-zinc-900 rounded-2xl flex items-center justify-center">
                  <TrendingUp size={64} className="text-emerald-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-40 -left-40 w-[40rem] h-[40rem] bg-emerald-500/10 blur-[200px] rounded-full" />
        <div className="absolute top-1/2 -right-60 w-[50rem] h-[50rem] bg-indigo-500/5 blur-[250px] rounded-full" />
      </div>
    </div>
  );
};

export default ShareableResultCard;
