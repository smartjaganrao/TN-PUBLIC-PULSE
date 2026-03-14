import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Clock, Share2, Eye, Loader2, BookOpen } from 'lucide-react';
import Markdown from 'react-markdown';
import { getBlogPostBySlug, BlogPost, incrementBlogViews } from '../services/voteService';

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        const data = await getBlogPostBySlug(slug);
        if (data) {
          setPost(data);
          document.title = `${data.title} | TN Pulse 2026 Blog`;
          await incrementBlogViews(data.id);
        } else {
          navigate('/blog');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug, navigate]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-indigo-600 font-black text-xs uppercase tracking-widest mb-8 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl sm:rounded-[3rem] overflow-hidden shadow-2xl shadow-zinc-200/50 border border-zinc-100"
        >
          <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
            <img
              src={post.imageUrl || `https://picsum.photos/seed/${post.slug}/1200/600`}
              alt={post.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 sm:from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8">
              <span className="bg-indigo-600 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest shadow-lg mb-2 sm:mb-4 inline-block">
                {post.category}
              </span>
              <h1 className="text-xl sm:text-5xl font-black text-white font-display leading-tight">
                {post.title}
              </h1>
            </div>
          </div>

          <div className="p-6 sm:p-12">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[8px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-8 sm:mb-12 border-b border-zinc-100 pb-6 sm:pb-8">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Calendar size={12} className="sm:w-3.5 sm:h-3.5 text-indigo-600" />
                {formatDate(post.timestamp)}
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <User size={12} className="sm:w-3.5 sm:h-3.5 text-indigo-600" />
                {post.author}
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Eye size={12} className="sm:w-3.5 sm:h-3.5 text-indigo-600" />
                {post.views} Views
              </div>
              <button
                onClick={handleShare}
                className="ml-auto flex items-center gap-1.5 sm:gap-2 bg-zinc-50 hover:bg-zinc-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-colors text-zinc-600"
              >
                <Share2 size={12} className="sm:w-3.5 sm:h-3.5" />
                Share
              </button>
            </div>

            <div 
              className="prose prose-zinc prose-sm sm:prose-lg max-w-none prose-headings:font-display prose-headings:font-black prose-a:text-indigo-600 prose-img:rounded-2xl sm:prose-img:rounded-3xl prose-blockquote:border-l-indigo-600 prose-blockquote:bg-zinc-50 prose-blockquote:p-4 sm:prose-blockquote:p-6 prose-blockquote:rounded-r-2xl sm:prose-blockquote:rounded-r-3xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-10 sm:mt-16 pt-8 sm:pt-12 border-t border-zinc-100">
              <div className="bg-indigo-50 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="bg-indigo-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-white">
                  <BookOpen size={24} className="sm:w-8 sm:h-8" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-black text-zinc-900 mb-1 sm:mb-2 font-display">Stay Informed</h3>
                  <p className="text-zinc-600 text-xs sm:text-sm">
                    We bring you the most accurate and up-to-date political analysis for Tamil Nadu 2026.
                  </p>
                </div>
                <Link
                  to="/blog"
                  className="w-full sm:w-auto text-center bg-white text-indigo-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 hover:shadow-xl transition-all"
                >
                  More Stories
                </Link>
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default BlogDetailPage;
