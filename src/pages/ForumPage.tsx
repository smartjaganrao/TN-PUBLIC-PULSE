import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Plus, MessageCircle, ThumbsUp, User, Clock, ChevronRight, ArrowLeft, Loader2, Filter, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
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
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -z-10 w-64 h-64 bg-[#046A38]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-6">
          <Link to="/" className="text-zinc-400 hover:text-zinc-800 font-black text-[10px] flex items-center gap-2 transition-all uppercase tracking-[0.2em] hover:-translate-x-1">
            <ArrowLeft size={12} />
            Back to Home
          </Link>
          <h1 className="text-4xl sm:text-7xl font-black text-zinc-900 font-display tracking-tighter leading-none">
            Community <span className="text-[#046A38]">Debate</span>
          </h1>
          <p className="text-zinc-500 max-w-2xl font-medium text-base sm:text-lg leading-relaxed">
            What matters most to you in Tamil Nadu today? Share your vision, discuss community needs, and vote for the most important issues facing our society.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-zinc-900 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-black text-base sm:text-lg flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-2xl shadow-zinc-200 active:scale-95 group w-full sm:w-auto"
        >
          <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
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

      {/* Topics List */}
      <div className="space-y-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-[#046A38]" size={56} />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Loading Discussions...</p>
          </div>
        ) : filteredTopics.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredTopics.map((topic, idx) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-8 sm:p-10 rounded-[3rem] border border-zinc-100 shadow-sm hover:shadow-2xl hover:border-emerald-100 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                  <MessageSquare size={120} />
                </div>

                <div className="flex flex-col sm:flex-row gap-10 relative z-10">
                  {/* Upvote Column */}
                  <div className="flex sm:flex-col items-center gap-4">
                    <button
                      onClick={() => handleUpvote(topic.id)}
                      className="p-3 sm:p-5 rounded-2xl sm:rounded-[2rem] bg-zinc-50 text-zinc-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all flex flex-row sm:flex-col items-center gap-2 border border-zinc-100 hover:border-emerald-200 active:scale-90"
                    >
                      <ThumbsUp size={20} className="sm:w-6 sm:h-6" />
                      <span className="text-xs sm:text-sm font-black">{topic.upvotes}</span>
                    </button>
                  </div>
                  {/* Content Column */}
                  <div className="flex-1 space-y-4 sm:space-y-6">
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 sm:px-4 sm:py-1.5 bg-emerald-50 text-emerald-700 text-[8px] sm:text-[10px] font-black uppercase tracking-widest rounded-lg sm:rounded-xl border border-emerald-100">
                        {topic.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-[8px] sm:text-[10px] text-zinc-400 uppercase tracking-widest font-black">
                        <Clock size={10} className="sm:w-3 sm:h-3" />
                        {formatTopicDate(topic.timestamp)}
                      </div>
                    </div>
                    
                    <Link to={`/forum/${topic.id}`} className="block group/title">
                      <h3 className="text-2xl sm:text-4xl font-black text-zinc-900 group-hover/title:text-[#046A38] transition-colors font-display tracking-tight leading-tight">
                        {topic.title}
                      </h3>
                    </Link>
                    
                    <p className="text-zinc-500 line-clamp-2 font-medium text-sm sm:text-lg leading-relaxed max-w-3xl">
                      {topic.content}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 sm:pt-8 border-t border-zinc-50 gap-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-zinc-900 flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-lg">
                          {topic.nickname[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] sm:text-xs font-black text-zinc-900">{topic.nickname}</span>
                          <span className="text-[8px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Community Member</span>
                        </div>
                      </div>
                      
                      <Link 
                        to={`/forum/${topic.id}`}
                        className="flex items-center justify-center gap-3 bg-zinc-50 hover:bg-zinc-900 hover:text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl text-zinc-500 font-black text-[8px] sm:text-[10px] uppercase tracking-widest transition-all group/btn"
                      >
                        <MessageCircle size={14} className="sm:w-[18px] sm:h-[18px] group-hover/btn:scale-110 transition-transform" />
                        {topic.replyCount} Replies
                        <ChevronRight size={14} className="sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-50 rounded-[4rem] p-32 text-center border-2 border-dashed border-zinc-200">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl text-4xl">
              💡
            </div>
            <h3 className="text-3xl font-black text-zinc-900 mb-4 font-display">No topics yet</h3>
            <p className="text-zinc-500 font-medium max-w-md mx-auto text-lg">
              Be the first to share your vision for Tamil Nadu 2026! Your voice matters in shaping the future.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-10 bg-[#046A38] text-white px-10 py-5 rounded-full font-black text-lg hover:bg-[#03552d] transition-all shadow-2xl shadow-emerald-100"
            >
              Create First Topic
            </button>
          </div>
        )}
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
              className="relative w-full max-w-3xl bg-white rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] overflow-hidden"
            >
              <div className="p-10 sm:p-16 space-y-12">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black text-zinc-900 font-display tracking-tight">Start a <span className="text-[#046A38]">Discussion</span></h2>
                    <p className="text-zinc-500 font-medium">Share your vision for the 2026 Tamil Nadu elections.</p>
                  </div>
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    className="p-4 hover:bg-zinc-100 rounded-3xl transition-all active:scale-90"
                  >
                    <Plus size={32} className="rotate-45 text-zinc-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-2">Your Nickname</label>
                      <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-[2rem] px-8 py-5 outline-none focus:ring-4 focus:ring-[#046A38]/10 focus:bg-white transition-all font-bold text-zinc-700"
                        placeholder="e.g. CitizenX"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-2">Select Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-[2rem] px-8 py-5 outline-none focus:ring-4 focus:ring-[#046A38]/10 focus:bg-white transition-all font-bold text-zinc-700 appearance-none"
                      >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-2">Topic Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-[2rem] px-8 py-5 outline-none focus:ring-4 focus:ring-[#046A38]/10 focus:bg-white transition-all font-bold text-zinc-700"
                      placeholder="What is the main issue or vision?"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-2">Detailed Description</label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={6}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-[2.5rem] px-8 py-6 outline-none focus:ring-4 focus:ring-[#046A38]/10 focus:bg-white transition-all font-medium text-zinc-600 resize-none leading-relaxed"
                      placeholder="Explain your vision or the issue in detail. Why is this important for 2026?"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-zinc-900 text-white py-6 rounded-full font-black text-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:bg-zinc-800 transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    {submitting ? <Loader2 className="animate-spin" /> : <>Publish Topic <Send size={20} /></>}
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
