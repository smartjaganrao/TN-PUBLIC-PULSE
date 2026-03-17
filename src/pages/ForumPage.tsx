import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Plus, MessageCircle, ThumbsUp, User, Clock, ChevronRight, ArrowLeft, Loader2, Filter, Send, TrendingUp, Award, Zap, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../context/LanguageContext';
import { subscribeToForumTopics, postForumTopic, upvoteForumTopic, ForumTopic } from '../services/voteService';

const ForumPage: React.FC = () => {
  const { t } = useLanguage();
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [nickname, setNickname] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('All');

  const categories = ['General', 'Education', 'Healthcare', 'Infrastructure', 'Agriculture', 'Economy'];

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToForumTopics((data) => {
      setTopics(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !title.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      await postForumTopic(nickname.trim(), title.trim(), content.trim(), category);
      setNickname('');
      setTitle('');
      setContent('');
      setShowCreateModal(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTopicDate = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleUpvote = async (id: string) => {
    try {
      await upvoteForumTopic(id);
      setTopics(prev => prev.map(t => t.id === id ? { ...t, upvotes: t.upvotes + 1 } : t));
    } catch (e) {
      console.error(e);
    }
  };

  const filteredTopics = filter === 'All' ? topics : topics.filter(t => t.category === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-16 relative">
      <Helmet>
        <title>Political Forum | Tamil Pulse 2026 Discussions</title>
        <meta name="description" content="Engage in deep political discussions about Tamil Nadu's future. Start a topic, share your insights, and connect with other voters." />
        <meta property="og:title" content="Political Forum | Tamil Pulse 2026 Discussions" />
        <meta property="og:description" content="Engage in deep political discussions about Tamil Nadu's future. Start a topic, share your insights, and connect with other voters." />
        <meta property="og:url" content={`${window.location.origin}/forum`} />
      </Helmet>
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -z-10 w-64 h-64 bg-[#046A38]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10">
        <div className="space-y-4 md:space-y-6">
          <Link to="/" className="text-zinc-400 hover:text-zinc-800 font-black text-[10px] flex items-center gap-2 transition-all uppercase tracking-[0.2em] hover:-translate-x-1">
            <ArrowLeft size={12} />
            Back to Home
          </Link>
          <h1 className="text-4xl sm:text-7xl font-black text-zinc-900 font-display tracking-tighter leading-none">
            Community <span className="text-[#046A38]">Debate</span>
          </h1>
          <p className="text-zinc-500 max-w-2xl font-medium text-sm sm:text-lg leading-relaxed">
            What matters most to you in Tamil Nadu today? Share your vision, discuss community needs, and vote for the most important issues facing our society.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-zinc-900 text-white px-6 sm:px-10 py-4 sm:py-5 rounded-full font-black text-sm sm:text-lg flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-2xl shadow-zinc-200 active:scale-95 group w-full sm:w-auto"
        >
          <Plus size={20} className="sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-500" />
          Start a Topic
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex items-center gap-2 text-zinc-400 mr-4">
            <Filter size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Category</span>
          </div>
          {['All', ...categories].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 rounded-2xl text-xs font-black transition-all whitespace-nowrap border ${
                filter === cat 
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-xl' 
                  : 'bg-white text-zinc-500 border-zinc-100 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Topics List & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="animate-spin text-[#046A38]" size={56} />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Loading Discussions...</p>
            </div>
          ) : filteredTopics.length > 0 ? (
            <div className="space-y-6">
              {filteredTopics.map((topic, idx) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all group relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                    {/* Upvote Column */}
                    <div className="flex sm:flex-col items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleUpvote(topic.id);
                        }}
                        className="p-3 rounded-2xl bg-zinc-50 text-zinc-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all flex flex-row sm:flex-col items-center gap-2 border border-zinc-100 hover:border-emerald-200 active:scale-90"
                      >
                        <ThumbsUp size={16} />
                        <span className="text-xs font-black">{topic.upvotes}</span>
                      </button>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase tracking-widest rounded-lg border border-emerald-100">
                          {topic.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-[8px] text-zinc-400 uppercase tracking-widest font-black">
                          <Clock size={10} />
                          {formatTopicDate(topic.timestamp)}
                        </div>
                      </div>
                      
                      <Link to={`/forum/${topic.id}`} className="block group/title">
                        <h3 className="text-xl sm:text-2xl font-black text-zinc-900 group-hover/title:text-[#046A38] transition-colors font-display tracking-tight leading-tight">
                          {topic.title}
                        </h3>
                      </Link>
                      
                      <div className="text-zinc-500 line-clamp-2 font-medium text-sm leading-relaxed max-w-2xl prose prose-sm prose-zinc">
                        <ReactMarkdown>{topic.content}</ReactMarkdown>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-black text-[10px] shadow-lg">
                            {topic.nickname[0].toUpperCase()}
                          </div>
                          <span className="text-[10px] font-black text-zinc-900">{topic.nickname}</span>
                        </div>
                        
                        <Link 
                          to={`/forum/${topic.id}`}
                          className="flex items-center gap-2 text-zinc-400 hover:text-[#046A38] font-black text-[10px] uppercase tracking-widest transition-colors"
                        >
                          <MessageCircle size={14} />
                          {topic.replyCount} Replies
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-50 rounded-[4rem] p-20 text-center border-2 border-dashed border-zinc-200">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl text-3xl">
                💡
              </div>
              <h3 className="text-2xl font-black text-zinc-900 mb-2 font-display">No topics yet</h3>
              <p className="text-zinc-500 font-medium max-w-xs mx-auto text-sm">
                Be the first to share your vision for Tamil Nadu 2026!
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Trending Topics */}
          <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] -mr-16 -mt-16" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <TrendingUp size={20} className="text-emerald-400" />
                <h4 className="text-sm font-black uppercase tracking-widest">Trending Now</h4>
              </div>
              <div className="space-y-4">
                {topics.slice(0, 3).map((topic, i) => (
                  <Link key={topic.id} to={`/forum/${topic.id}`} className="block group">
                    <div className="flex items-start gap-3">
                      <span className="text-emerald-400 font-black text-xs mt-1">0{i+1}</span>
                      <div className="space-y-1">
                        <p className="text-xs font-black group-hover:text-emerald-400 transition-colors line-clamp-2 leading-tight">
                          {topic.title}
                        </p>
                        <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">
                          {topic.replyCount} Replies
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Community Stats */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <Award size={20} className="text-amber-500" />
              <h4 className="text-sm font-black uppercase tracking-widest text-zinc-900">Community Stats</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">Total Topics</p>
                <p className="text-2xl font-black text-zinc-900">{topics.length}</p>
              </div>
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">Total Replies</p>
                <p className="text-2xl font-black text-zinc-900">{topics.reduce((acc, t) => acc + t.replyCount, 0)}</p>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100 space-y-4">
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-emerald-600" />
              <h4 className="text-sm font-black uppercase tracking-widest text-emerald-900">Debate Rules</h4>
            </div>
            <ul className="space-y-3">
              {[
                "Be respectful to all members",
                "No hate speech or personal attacks",
                "Keep discussions relevant to TN",
                "Use facts to support your vision"
              ].map((rule, i) => (
                <li key={i} className="flex items-start gap-2 text-[10px] font-bold text-emerald-800/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 flex-shrink-0" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-zinc-900/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-3xl bg-white rounded-[2rem] sm:rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] overflow-hidden"
            >
              <div className="p-6 sm:p-16 space-y-8 sm:space-y-12">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 font-display tracking-tight">Start a <span className="text-[#046A38]">Discussion</span></h2>
                    <p className="text-zinc-500 text-sm font-medium">Share your vision for the 2026 Tamil Nadu elections.</p>
                  </div>
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 sm:p-4 hover:bg-zinc-100 rounded-2xl sm:rounded-3xl transition-all active:scale-90"
                  >
                    <Plus size={24} className="sm:w-8 sm:h-8 rotate-45 text-zinc-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-2">Your Nickname</label>
                      <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-xl sm:rounded-[2rem] px-6 py-4 sm:px-8 sm:py-5 outline-none focus:ring-4 focus:ring-[#046A38]/10 focus:bg-white transition-all font-bold text-zinc-700"
                        placeholder="e.g. CitizenX"
                        required
                      />
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-2">Select Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-xl sm:rounded-[2rem] px-6 py-4 sm:px-8 sm:py-5 outline-none focus:ring-4 focus:ring-[#046A38]/10 focus:bg-white transition-all font-bold text-zinc-700 appearance-none"
                      >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-2">Topic Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-xl sm:rounded-[2rem] px-6 py-4 sm:px-8 sm:py-5 outline-none focus:ring-4 focus:ring-[#046A38]/10 focus:bg-white transition-all font-bold text-zinc-700"
                      placeholder="What is the main issue or vision?"
                      required
                    />
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-2">Detailed Description</label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={4}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl sm:rounded-[2.5rem] px-6 py-4 sm:px-8 sm:py-6 outline-none focus:ring-4 focus:ring-[#046A38]/10 focus:bg-white transition-all font-medium text-zinc-600 resize-none leading-relaxed"
                      placeholder="Explain your vision or the issue in detail. Why is this important for 2026?"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-zinc-900 text-white py-4 sm:py-6 rounded-full font-black text-lg sm:text-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:bg-zinc-800 transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    {submitting ? <Loader2 className="animate-spin" /> : <>Publish Topic <Send size={18} /></>}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ForumPage;
