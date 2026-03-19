import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Header from './Header';
import Footer from './Footer';
import { incrementVisitorCount } from '../services/voteService';

const Layout: React.FC = () => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    incrementVisitorCount();
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F0]">
      <Header />
      <main className={`flex-grow ${location.pathname === '/' ? 'pt-0' : 'pt-20 sm:pt-32'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
