import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Clock, User, ArrowRight, Loader2, Calendar } from 'lucide-react';
import { getBlogPosts, BlogPost } from '../services/voteService';

const BlogListPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Political Analysis & Insights | TN Pulse 2026 Blog';
    const fetchPosts = async () => {
      try {
        const data = await getBlogPosts();
        setPosts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Political Analysis & Insights | TN Pulse 2026 Blog</title>
        <meta name="description" content="Deep dives, expert analysis, and community stories about the 2026 Tamil Nadu Legislative Assembly elections." />
        <meta property="og:title" content="Political Analysis & Insights | TN Pulse 2026 Blog" />
        <meta property="og:description" content="Deep dives, expert analysis, and community stories about the 2026 Tamil Nadu Legislative Assembly elections." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest mb-4"
          >
            <BookOpen size={12} className="sm:w-[14px] sm:h-[14px]" />
            Political Insights
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-6xl font-black text-zinc-900 font-display mb-4 sm:mb-6"
          >
            Political <span className="text-indigo-600">Insights</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 max-w-2xl mx-auto text-sm sm:text-lg px-4"
          >
            Deep dives, expert analysis, and community stories about the 2026 Tamil Nadu Legislative Assembly elections.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-3xl sm:rounded-[2.5rem] overflow-hidden border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:shadow-2xl hover:shadow-indigo-200/30 transition-all flex flex-col"
              >
                <Link to={`/blog/${post.slug}`} className="relative aspect-video overflow-hidden">
                  <img
                    src={post.imageUrl || `https://picsum.photos/seed/${post.slug}/800/450`}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                    <span className="bg-white/90 backdrop-blur-md px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </Link>

                <div className="p-6 sm:p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 sm:gap-4 text-[8px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 sm:mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={10} className="sm:w-3 sm:h-3" />
                      {formatDate(post.timestamp)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User size={10} className="sm:w-3 sm:h-3" />
                      {post.author}
                    </div>
                  </div>

                  <Link to={`/blog/${post.slug}`}>
                    <h2 className="text-lg sm:text-xl font-black text-zinc-900 mb-3 sm:mb-4 group-hover:text-indigo-600 transition-colors font-display leading-tight">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-zinc-500 text-xs sm:text-sm line-clamp-3 mb-4 sm:mb-6 flex-1">
                    {post.excerpt}
                  </p>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-indigo-600 font-black text-[10px] sm:text-xs uppercase tracking-widest group/link"
                  >
                    Read Full Story
                    <ArrowRight size={12} className="sm:w-[14px] sm:h-[14px] group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-zinc-200">
            <BookOpen size={48} className="mx-auto text-zinc-300 mb-4" />
            <h3 className="text-xl font-black text-zinc-900 mb-2">No posts yet</h3>
            <p className="text-zinc-500">Check back soon for the latest political analysis.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListPage;
