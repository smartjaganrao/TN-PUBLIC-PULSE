import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Clock, ThumbsUp, Send, Loader2, MessageCircle, Share2, Flag, MoreHorizontal, Image as ImageIcon, Link as LinkIcon, Type } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getForumTopic, postForumReply, upvoteForumTopic, ForumTopic } from '../services/voteService';

const TopicDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTopic = async () => {
    if (!id) return;
    try {
      const data = await getForumTopic(id);
      setTopic(data);
    } catch (e) {
      console.error(e);
      navigate('/forum');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopic();
  }, [id]);

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !nickname.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      await postForumReply(id, nickname.trim(), content.trim());
      setNickname('');
      setContent('');
      fetchTopic();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTopicDate = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatReplyTime = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatReplyDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  const handleUpvote = async () => {
    if (!topic) return;
    try {
      await upvoteForumTopic(topic.id);
      setTopic(prev => prev ? { ...prev, upvotes: prev.upvotes + 1 } : null);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-[#046A38]" size={48} />
      </div>
    );
  }

  if (!topic) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-16 relative">
      <Helmet>
        <title>{topic.title} | Tamil Pulse Forum</title>
        <meta name="description" content={topic.content.substring(0, 160)} />
        <meta property="og:title" content={`${topic.title} | Tamil Pulse Forum`} />
        <meta property="og:description" content={topic.content.substring(0, 160)} />
        <meta property="og:url" content={`${window.location.origin}/forum/topic/${topic.id}`} />
      </Helmet>
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 -z-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <Link to="/forum" className="text-zinc-400 hover:text-zinc-800 font-black text-[10px] flex items-center gap-2 transition-all uppercase tracking-[0.2em] hover:-translate-x-1 w-fit">
        <ArrowLeft size={12} />
        Back to Forum
      </Link>

      {/* Main Topic Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 sm:p-16 rounded-[2rem] sm:rounded-[4rem] border border-zinc-100 shadow-2xl space-y-6 sm:space-y-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
          <MessageCircle size={200} />
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 relative z-10">
          <span className="px-3 py-1.5 sm:px-5 sm:py-2 bg-emerald-50 text-emerald-700 text-[8px] sm:text-[10px] font-black uppercase tracking-widest rounded-lg sm:rounded-xl border border-emerald-100">
            {topic.category}
          </span>
          <div className="flex items-center gap-2 text-[8px] sm:text-[10px] text-zinc-400 uppercase tracking-widest font-black">
            <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
            {formatTopicDate(topic.timestamp)}
          </div>
        </div>

        <h1 className="text-2xl sm:text-7xl font-black text-zinc-900 font-display tracking-tighter leading-[1.1] sm:leading-[0.9] relative z-10">
          {topic.title}
        </h1>

        <div className="flex items-center gap-4 sm:gap-6 py-4 sm:py-8 border-y border-zinc-50 relative z-10">
          <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-3xl bg-zinc-900 flex items-center justify-center text-white font-black text-sm sm:text-2xl shadow-xl">
            {topic.nickname[0].toUpperCase()}
          </div>
          <div>
            <p className="font-black text-sm sm:text-xl text-zinc-900 leading-none mb-1">{topic.nickname}</p>
            <p className="text-[8px] sm:text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">Verified Contributor</p>
          </div>
        </div>

        <div className="text-base sm:text-2xl text-zinc-700 leading-relaxed font-medium relative z-10 max-w-4xl prose prose-zinc prose-lg">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-4">{children}</p>,
              h1: ({ children }) => <h1 className="text-3xl font-black mb-4 mt-8">{children}</h1>,
              h2: ({ children }) => <h2 className="text-2xl font-black mb-3 mt-6">{children}</h2>,
              ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
              li: ({ children }) => <li className="text-zinc-600">{children}</li>,
              blockquote: ({ children }) => <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-zinc-500 my-6">{children}</blockquote>,
              img: ({ src, alt }) => <img src={src} alt={alt} className="rounded-3xl shadow-xl my-8 w-full object-cover max-h-[500px]" referrerPolicy="no-referrer" />,
              a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-bold underline hover:text-emerald-700">{children}</a>,
            }}
          >
            {topic.content}
          </ReactMarkdown>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-4 sm:pt-6 relative z-10">
          <button
            onClick={handleUpvote}
            className="flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-8 sm:py-4 bg-emerald-50 text-emerald-600 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-sm hover:bg-emerald-100 transition-all active:scale-95 border border-emerald-100"
          >
            <ThumbsUp size={14} className="sm:w-5 sm:h-5" />
            {topic.upvotes} Upvotes
          </button>
          <div className="flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-8 sm:py-4 bg-zinc-50 text-zinc-500 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-sm border border-zinc-100">
            <MessageCircle size={14} className="sm:w-5 sm:h-5" />
            {topic.replies?.length || 0} Replies
          </div>
        </div>
      </motion.div>

      {/* Replies Section */}
      <div className="space-y-12">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-black text-zinc-900 font-display tracking-tight flex items-center gap-4">
            Community Discussion
            <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
          </h2>
        </div>

        {/* Reply Form */}
        <div className="bg-zinc-50 p-6 sm:p-12 rounded-[2rem] sm:rounded-[3.5rem] border border-zinc-100 shadow-inner relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-focus-within:opacity-[0.06] transition-opacity">
            <Send size={80} />
          </div>
          
          <form onSubmit={handleSubmitReply} className="space-y-6 sm:space-y-8 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-2 sm:space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-2">Your Nickname</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full bg-white border border-zinc-100 rounded-xl sm:rounded-[2rem] px-6 py-4 sm:px-8 sm:py-5 outline-none focus:ring-4 focus:ring-[#046A38]/10 transition-all font-bold text-zinc-700 shadow-sm"
                  placeholder="e.g. CitizenX"
                  required
                />
              </div>
            </div>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <button type="button" className="p-2 hover:bg-white rounded-lg text-zinc-400 hover:text-emerald-600 transition-all" title="Add Image">
                  <ImageIcon size={18} />
                </button>
                <button type="button" className="p-2 hover:bg-white rounded-lg text-zinc-400 hover:text-emerald-600 transition-all" title="Add Link">
                  <LinkIcon size={18} />
                </button>
                <button type="button" className="p-2 hover:bg-white rounded-lg text-zinc-400 hover:text-emerald-600 transition-all" title="Text Formatting">
                  <Type size={18} />
                </button>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full bg-white border border-zinc-100 rounded-xl sm:rounded-[2.5rem] px-6 py-4 sm:px-8 sm:py-6 outline-none focus:ring-4 focus:ring-[#046A38]/10 transition-all resize-none font-medium text-zinc-600 leading-relaxed shadow-sm"
                placeholder="Add your thoughts to the discussion... (Supports Markdown)"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto bg-zinc-900 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full font-black text-sm sm:text-lg flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all disabled:opacity-50 shadow-xl active:scale-95"
            >
              {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              Post Contribution
            </button>
          </form>
        </div>

        {/* Replies List */}
        <div className="space-y-6">
          {topic.replies && topic.replies.length > 0 ? (
            topic.replies.map((reply, idx) => (
              <motion.div
                key={reply.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 sm:gap-6"
              >
                <div className="flex flex-row sm:flex-col items-center gap-3 sm:gap-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 font-black text-base sm:text-lg border border-zinc-100">
                    {reply.nickname[0].toUpperCase()}
                  </div>
                  <div className="hidden sm:block w-px h-full bg-zinc-50" />
                </div>
                
                  <div className="flex-1 space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-black text-zinc-900 text-base sm:text-lg leading-none mb-1">{reply.nickname}</p>
                        <div className="flex items-center gap-2 text-[8px] sm:text-[10px] text-zinc-400 uppercase tracking-widest font-black">
                          <Clock size={10} className="sm:w-3 sm:h-3" />
                          {formatReplyTime(reply.timestamp)}
                          <span className="mx-1">•</span>
                          {formatReplyDate(reply.timestamp)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-zinc-300 hover:text-zinc-600 transition-colors">
                          <ThumbsUp size={14} />
                        </button>
                        <button className="p-2 text-zinc-300 hover:text-rose-500 transition-colors">
                          <Flag size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="text-zinc-600 font-medium text-sm sm:text-lg leading-relaxed prose prose-sm prose-zinc">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2">{children}</p>,
                          a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-bold underline">{children}</a>,
                          img: ({ src, alt }) => <img src={src} alt={alt} className="rounded-xl shadow-md my-4 max-h-64 object-cover" referrerPolicy="no-referrer" />,
                        }}
                      >
                        {reply.content}
                      </ReactMarkdown>
                    </div>
                  </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-24 bg-zinc-50 rounded-[3rem] border-2 border-dashed border-zinc-100">
              <div className="text-4xl mb-4 opacity-20">💬</div>
              <p className="text-zinc-400 font-black uppercase tracking-widest text-xs">
                No contributions yet. Start the conversation!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicDetailPage;
