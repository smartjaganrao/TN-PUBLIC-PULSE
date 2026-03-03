import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Languages, Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Header: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/vote', label: t.startVoting },
    { path: '/results', label: t.viewResults },
    { path: '/forum', label: 'Debate' },
    { path: '/game', label: 'Quiz' },
    { path: '/blog', label: 'Insights' },
  ];

  const isHomePage = location.pathname === '/';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled 
          ? 'py-3 bg-white/90 backdrop-blur-lg shadow-lg text-zinc-900 border-b border-zinc-200' 
          : isHomePage 
            ? 'py-6 bg-transparent text-white max-md:bg-white max-md:text-zinc-900 max-md:py-4 max-md:shadow-sm'
            : 'py-4 bg-white/80 backdrop-blur-md text-zinc-900 border-b border-zinc-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex flex-col group">
            <div className="flex items-center gap-2">
              <h1 className={`text-xl sm:text-2xl font-black tracking-tighter leading-none transition-colors ${
                isScrolled ? 'text-[#046A38]' : isHomePage ? 'text-white max-md:text-[#046A38]' : 'text-[#046A38]'
              }`}>
                {t.title}
              </h1>
              {location.pathname === '/results' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500 text-[8px] font-black text-white uppercase tracking-widest"
                >
                  <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                  Live
                </motion.div>
              )}
            </div>
            <p className={`text-[8px] sm:text-[10px] opacity-60 mt-1 uppercase tracking-[0.3em] font-black transition-colors ${
              (isScrolled || !isHomePage) ? 'text-zinc-500' : 'text-white/80 max-md:text-zinc-500'
            }`}>
              {t.subtitle}
            </p>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              {navLinks.map(link => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`text-xs font-black uppercase tracking-widest hover:opacity-100 transition-all relative group ${
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
            
            <div className="flex items-center gap-4 pl-8 border-l border-current/10">
              <button
                onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-xs font-black uppercase tracking-widest ${
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
            className={`md:hidden p-2 rounded-xl transition-colors ${
              (isScrolled || !isHomePage) ? 'bg-zinc-100 text-zinc-900' : 'bg-white/10 text-white max-md:bg-zinc-100 max-md:text-zinc-900'
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
            className="fixed inset-0 z-[110] bg-white md:hidden flex flex-col"
          >
            <div className="p-6 flex justify-between items-center border-b border-zinc-100">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex flex-col">
                <h1 className="text-xl font-black text-[#046A38] tracking-tighter leading-none">
                  {t.title}
                </h1>
                <p className="text-[8px] text-zinc-500 uppercase tracking-[0.3em] font-black mt-1">
                  {t.subtitle}
                </p>
              </Link>
              <button 
                className="p-3 rounded-2xl bg-zinc-100 text-zinc-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 px-6 py-12 flex flex-col justify-center gap-8">
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
                © 2026 Tamil Nadu Public Pulse
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
