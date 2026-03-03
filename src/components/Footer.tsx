import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Twitter, Facebook, Instagram, Mail, ExternalLink, ShieldCheck } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-20 pb-10 px-4 mt-auto relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-[#046A38]/10 blur-[120px] rounded-full -mb-32" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2 space-y-6">
            <div className="flex flex-col">
              <h3 className="text-white font-black text-2xl tracking-tighter font-display">{t.title}</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-black mt-1">{t.subtitle}</p>
            </div>
            <p className="text-sm leading-relaxed max-w-md font-medium">
              A community-driven prediction engine for the 2026 Tamil Nadu Assembly Elections. 
              Join thousands of citizens in shaping the future discourse.
            </p>
            <div className="flex items-center gap-4">
              {[Twitter, Facebook, Instagram, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-[#046A38] hover:text-white transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Navigation</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/" className="text-sm hover:text-white transition-colors flex items-center gap-2 group">
                Home
                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link to="/vote" className="text-sm hover:text-white transition-colors flex items-center gap-2 group">
                {t.startVoting}
                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link to="/results" className="text-sm hover:text-white transition-colors flex items-center gap-2 group">
                {t.viewResults}
                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link to="/forum" className="text-sm hover:text-white transition-colors flex items-center gap-2 group">
                People's Manifesto
                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </nav>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Legal</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <ShieldCheck size={16} className="text-emerald-500" />
                100% Anonymous
              </div>
              <p className="text-xs leading-relaxed italic opacity-60">
                {t.disclaimer}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest">
            <span className="text-zinc-600">© 2026 TN Public Pulse</span>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <Link to="/admin" className="text-zinc-800 hover:text-zinc-600 transition-colors">Admin</Link>
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
            Built for the People of Tamil Nadu
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
