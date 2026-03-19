import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Languages, Menu, X, ChevronRight, Users } from 'lucide-react';
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

  const navLinks = [
    { path: '/vote', label: 'Vote' },
    { path: '/results', label: 'Trends' },
    { path: '/pulse', label: 'Community Pulse' },
    { path: '/forum', label: 'Debate' },
    { path: '/game', label: 'Quiz' },
    { path: '/blog', label: 'Blog' },
    { path: '/shop', label: 'Supporter Shop' },
  ];

  const isHomePage = location.pathname === '/';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled 
          ? 'py-3 bg-white/90 backdrop-blur-lg shadow-lg text-zinc-900 border-b border-zinc-200' 
          : isHomePage 
            ? 'py-6 bg-transparent text-white max-lg:bg-white max-lg:text-zinc-900 max-lg:py-4 max-lg:shadow-sm'
            : 'py-4 bg-white/80 backdrop-blur-md text-zinc-900 border-b border-zinc-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-4 group relative">
            <img 
              src="/logo.png" 
              alt="Tamil Pulse Logo" 
              className="h-16 sm:h-32 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            {(location.pathname === '/results' || location.pathname === '/') && (
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
          <button 
            className={`lg:hidden p-2 rounded-xl transition-colors ${
              (isScrolled || !isHomePage) ? 'bg-zinc-100 text-zinc-900' : 'bg-white/10 text-white max-lg:bg-zinc-100 max-lg:text-zinc-900'
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[110] bg-white lg:hidden flex flex-col"
          >
            <div className="p-6 flex justify-between items-center border-b border-zinc-100">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
                <img 
                  src="/logo.png" 
                  alt="Tamil Pulse Logo" 
                  className="h-24 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </Link>
              <button 
                className="p-3 rounded-2xl bg-zinc-100 text-zinc-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 px-6 py-12 flex flex-col justify-center gap-8 overflow-y-auto">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <Link 
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between text-5xl font-black text-zinc-900 font-display tracking-tighter group"
                  >
                    {link.label}
                    <ChevronRight size={32} className="text-zinc-200 group-hover:text-[#046A38] transition-colors" />
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="p-8 border-t border-zinc-100 bg-zinc-50/50">
              <button
                onClick={() => {
                  setLanguage(language === 'en' ? 'ta' : 'en');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-3 py-5 rounded-3xl bg-zinc-900 text-white font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
              >
                <Languages size={18} />
                Switch to {language === 'en' ? 'தமிழ்' : 'English'}
              </button>
              <p className="text-center text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mt-8">
                © 2026 Tamil Pulse
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
