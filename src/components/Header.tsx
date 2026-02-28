import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Languages, Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    { path: '/forum', label: 'Manifesto' },
  ];

  const isHomePage = location.pathname === '/';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled 
          ? 'py-3 bg-white/80 backdrop-blur-lg shadow-lg text-zinc-900 border-b border-zinc-200' 
          : isHomePage 
            ? 'py-6 bg-transparent text-white'
            : 'py-4 bg-white/50 backdrop-blur-md text-zinc-900 border-b border-zinc-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex flex-col group">
            <div className="flex items-center gap-2">
              <h1 className={`text-xl sm:text-2xl font-black tracking-tighter leading-none transition-colors ${
                isScrolled ? 'text-[#046A38]' : isHomePage ? 'text-white' : 'text-[#046A38]'
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
              (isScrolled || !isHomePage) ? 'text-zinc-500' : 'text-white/80'
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
            className="md:hidden p-2 rounded-xl bg-current/5"
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-zinc-200 overflow-hidden"
          >
            <div className="px-4 py-8 space-y-6">
              {navLinks.map(link => (
                <Link 
                  key={link.path}
                  to={link.path}
                  className="flex items-center justify-between text-2xl font-black text-zinc-900 font-display"
                >
                  {link.label}
                  <ChevronRight className="text-zinc-300" />
                </Link>
              ))}
              <div className="pt-6 border-t border-zinc-100">
                <button
                  onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-zinc-100 text-zinc-900 font-black uppercase tracking-widest text-sm"
                >
                  <Languages size={18} />
                  Switch to {language === 'en' ? 'தமிழ்' : 'English'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
