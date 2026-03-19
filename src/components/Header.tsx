import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Languages, Menu, X, ChevronRight, Users, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { subscribeToVisitorCount } from '../services/voteService';

const Header: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = subscribeToVisitorCount((count) => {
      setVisitorCount(count);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { path: '/vote', label: t.startVoting },
    { path: '/results', label: t.viewResults },
    { path: '/pulse', label: 'Pulse' },
    { path: '/forum', label: 'Debate' },
    { path: '/game', label: 'Quiz' },
  ];

  const isHomePage = location.pathname === '/';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${
        mobileMenuOpen
          ? 'h-screen bg-white'
          : isScrolled 
            ? 'py-3 bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-b border-zinc-100' 
            : isHomePage 
              ? 'py-6 bg-transparent text-white max-lg:bg-white max-lg:text-zinc-900 max-lg:py-4 max-lg:shadow-sm'
              : 'py-4 bg-white text-zinc-900 border-b border-zinc-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className={`flex justify-between items-center h-full ${mobileMenuOpen ? 'border-b border-zinc-100' : ''}`}>
          <Link to="/" className="flex items-center gap-4 group relative" onClick={() => setMobileMenuOpen(false)}>
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Tamil Pulse Logo" 
                className={`transition-all duration-500 object-contain ${
                  mobileMenuOpen ? 'h-12' : isScrolled ? 'h-10' : 'h-12 sm:h-20 lg:h-32'
                }`}
                referrerPolicy="no-referrer"
              />
              {!isScrolled && !mobileMenuOpen && (
                <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-500/10 to-indigo-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
            {(location.pathname === '/results' || location.pathname === '/') && !mobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500 text-[7px] sm:text-[9px] font-black text-white uppercase tracking-widest shadow-lg shadow-rose-500/20"
              >
                <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                {visitorCount > 0 ? `${visitorCount.toLocaleString()} Live` : 'Live'}
              </motion.div>
            )}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            <nav className="flex items-center gap-4 xl:gap-6">
              {navLinks.map(link => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`text-[11px] xl:text-xs font-black uppercase tracking-widest hover:opacity-100 transition-all relative group whitespace-nowrap ${
                    location.pathname === link.path 
                      ? 'opacity-100' 
                      : 'opacity-60 hover:translate-y-[-2px]'
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-current transition-all duration-300 ${
                    location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              ))}
            </nav>
            
            <div className="flex items-center gap-4 pl-4 xl:pl-6 border-l border-current/10">
              <button
                onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                className={`flex items-center gap-2 px-3 xl:px-4 py-2 rounded-full border transition-all text-[11px] xl:text-xs font-black uppercase tracking-widest whitespace-nowrap ${
                  (isScrolled || !isHomePage) 
                    ? 'border-zinc-200 hover:bg-zinc-100 text-zinc-900' 
                    : 'border-white/30 hover:bg-white/10 text-white'
                }`}
              >
                <Languages size={14} />
                {language === 'en' ? 'தமிழ்' : 'English'}
              </button>
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            {!mobileMenuOpen && (
              <button
                onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                className="p-2.5 rounded-xl bg-zinc-100 text-zinc-900 transition-colors"
              >
                <Languages size={20} />
              </button>
            )}
            <button 
              className={`p-3 rounded-2xl transition-all active:scale-95 touch-manipulation ${
                mobileMenuOpen 
                  ? 'bg-zinc-100 text-zinc-900' 
                  : (isScrolled || !isHomePage) 
                    ? 'bg-zinc-100 text-zinc-900' 
                    : 'bg-white/10 text-white max-lg:bg-zinc-100 max-lg:text-zinc-900'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-full left-0 right-0 h-[calc(100vh-100%)] bg-white lg:hidden flex flex-col overflow-hidden"
          >
            <div className="flex-1 px-6 py-8 flex flex-col gap-2 overflow-y-auto no-scrollbar">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-4">
                Navigation
              </p>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link 
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between py-4 px-6 rounded-2xl transition-all ${
                      location.pathname === link.path 
                        ? 'bg-[#046A38]/10 text-[#046A38]' 
                        : 'text-zinc-900 hover:bg-zinc-50'
                    }`}
                  >
                    <span className="text-2xl font-black uppercase tracking-tight">
                      {link.label}
                    </span>
                    <ChevronRight size={20} className={location.pathname === link.path ? 'text-[#046A38]' : 'text-zinc-300'} />
                  </Link>
                </motion.div>
              ))}

              <div className="mt-8 pt-8 border-t border-zinc-100">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-6">
                  Community
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    to="/pulse" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col gap-2 p-5 rounded-3xl bg-zinc-50 border border-zinc-100"
                  >
                    <Users size={20} className="text-[#046A38]" />
                    <span className="text-xs font-black uppercase tracking-wider">Pulse</span>
                  </Link>
                  <Link 
                    to="/forum" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col gap-2 p-5 rounded-3xl bg-zinc-50 border border-zinc-100"
                  >
                    <TrendingUp size={20} className="text-emerald-500" />
                    <span className="text-xs font-black uppercase tracking-wider">Debate</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-zinc-100 bg-zinc-50/50">
              <button
                onClick={() => {
                  setLanguage(language === 'en' ? 'ta' : 'en');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-zinc-900 text-white font-black uppercase tracking-widest text-[10px] shadow-xl active:scale-95 transition-all"
              >
                <Languages size={16} />
                Switch to {language === 'en' ? 'தமிழ்' : 'English'}
              </button>
              <div className="flex justify-center gap-6 mt-6">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Privacy</span>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Terms</span>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Contact</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
