import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, BookOpen, Zap, Shield, ExternalLink, ArrowLeft, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AffiliateProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  category: 'Books' | 'Gear' | 'Tech';
  link: string;
  image: string;
  rating: number;
}

const products: AffiliateProduct[] = [
  {
    id: '1',
    title: 'History of Tamil Nadu Politics',
    description: 'A comprehensive guide to the political landscape of TN from 1967 to present.',
    price: '₹499',
    category: 'Books',
    link: '#',
    image: 'https://picsum.photos/seed/book1/400/500',
    rating: 4.8
  },
  {
    id: '2',
    title: 'Leadership & Vision 2026',
    description: 'Analyzing the potential candidates and their visions for the future of the state.',
    price: '₹350',
    category: 'Books',
    link: '#',
    image: 'https://picsum.photos/seed/book2/400/500',
    rating: 4.5
  },
  {
    id: '3',
    title: 'High-Capacity Power Bank',
    description: 'Stay connected during rallies and community events with this 20,000mAh beast.',
    price: '₹1,499',
    category: 'Tech',
    link: '#',
    image: 'https://picsum.photos/seed/tech1/400/500',
    rating: 4.9
  },
  {
    id: '4',
    title: 'Premium Supporter Umbrella',
    description: 'Durable, windproof umbrella for outdoor political gatherings and campaigns.',
    price: '₹599',
    category: 'Gear',
    link: '#',
    image: 'https://picsum.photos/seed/gear1/400/500',
    rating: 4.2
  },
  {
    id: '5',
    title: 'Smartphone Gimbal Stabilizer',
    description: 'Capture professional-grade footage of community events and speeches.',
    price: '₹6,999',
    category: 'Tech',
    link: '#',
    image: 'https://picsum.photos/seed/tech2/400/500',
    rating: 4.7
  },
  {
    id: '6',
    title: 'Dravidian Movement: An Insight',
    description: 'Understanding the roots and evolution of the Dravidian ideology in TN.',
    price: '₹425',
    category: 'Books',
    link: '#',
    image: 'https://picsum.photos/seed/book3/400/500',
    rating: 4.6
  }
];

const AffiliatePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      {/* Hero Section */}
      <div className="bg-zinc-900 text-white pt-20 pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] -mr-48 -mt-48" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all mb-4">
              <ArrowLeft size={12} />
              Back to Home
            </Link>
            <h1 className="text-5xl sm:text-8xl font-black font-display tracking-tighter leading-none">
              SUPPORTER <span className="text-emerald-400">SHOP.</span>
            </h1>
            <p className="text-zinc-400 max-w-2xl font-medium text-sm sm:text-xl leading-relaxed">
              Essential resources, gear, and reading materials for the informed citizen. Support the community while staying prepared for the 2026 journey.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[2.5rem] overflow-hidden border border-zinc-100 shadow-xl hover:shadow-2xl transition-all group"
            >
              <div className="aspect-[4/5] relative overflow-hidden bg-zinc-100">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-zinc-900 shadow-sm">
                    {product.category}
                  </span>
                </div>
                <div className="absolute top-6 right-6">
                  <div className="flex items-center gap-1 px-2 py-1 bg-zinc-900/80 backdrop-blur-md rounded-lg text-[10px] font-black text-amber-400">
                    <Star size={10} fill="currentColor" />
                    {product.rating}
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-xl font-black font-display text-zinc-900 leading-tight">
                    {product.title}
                  </h3>
                  <span className="text-lg font-black text-emerald-600 shrink-0">
                    {product.price}
                  </span>
                </div>
                
                <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                  {product.description}
                </p>

                <div className="pt-4 flex items-center gap-3">
                  <a 
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-zinc-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-95"
                  >
                    View on Amazon <ExternalLink size={14} />
                  </a>
                  <button className="w-12 h-12 rounded-2xl border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
                    <Heart size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Affiliate Disclaimer */}
      <div className="max-w-3xl mx-auto px-4 mt-20 text-center">
        <div className="p-8 bg-zinc-100 rounded-[2rem] border border-zinc-200">
          <div className="flex justify-center mb-4">
            <Shield className="text-zinc-400" size={32} />
          </div>
          <h4 className="text-xs font-black uppercase tracking-widest text-zinc-900 mb-2">Affiliate Disclosure</h4>
          <p className="text-[10px] font-medium text-zinc-500 leading-relaxed">
            As an Amazon Associate, we earn from qualifying purchases. This means we may receive a small commission at no extra cost to you if you purchase through these links. These commissions help support the maintenance and hosting of the TN Pulse community platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AffiliatePage;
