import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, User, Clock, Loader2, Heart, Reply, ChevronDown, ChevronUp, Share2 } from 'lucide-react';
import { subscribeToComments, postComment, Comment, postCommentReply, subscribeToCommentReplies, CommentReply, likeComment, likeCommentReply } from '../services/voteService';
import { parties } from '../data/parties';
import PartyImage from './PartyImage';

const CommentItem = React.forwardRef<HTMLDivElement, { comment: Comment }>(({ comment }, ref) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<CommentReply[]>([]);
  const [replyNickname, setReplyNickname] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (showReplies) {
      const unsubscribe = subscribeToCommentReplies(comment.id, (data) => {
        setReplies(data);
      });
      return () => unsubscribe();
    }
  }, [showReplies, comment.id]);

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    try {
      await likeComment(comment.id);
    } catch (e) {
      console.error(e);
      setLiked(false);
    }
  };

  const handleReplyLike = async (replyId: string) => {
    try {
      await likeCommentReply(comment.id, replyId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleShareComment = () => {
    const text = `"${comment.content}" - ${comment.nickname} on TN Pulse 2026`;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: 'TN Pulse Comment', text, url });
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      alert('Comment link copied to clipboard!');
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyNickname.trim() || !replyContent.trim()) return;

    setSubmittingReply(true);
    try {
      await postCommentReply(comment.id, replyNickname.trim(), replyContent.trim());
      setReplyContent('');
      setIsReplying(false);
      setShowReplies(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingReply(false);
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow space-y-4"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black relative">
            {comment.nickname[0].toUpperCase()}
            {comment.partyId && (
              <div 
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white overflow-hidden bg-white shadow-sm"
                title={comment.partyId ? `Supports ${parties.find(p => p.id === comment.partyId)?.name || 'a party'}` : ''}
              >
                <PartyImage 
                  src={parties.find(p => p.id === comment.partyId)?.image || ''} 
                  alt="party" 
                  className="w-full h-full p-0.5"
                  fallbackText={parties.find(p => p.id === comment.partyId)?.name[0] || '?'}
                />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-zinc-900">{comment.nickname}</h4>
              {comment.partyId && (
                <span 
                  className="text-[8px] font-black px-2 py-0.5 rounded-full text-white uppercase tracking-widest shadow-sm"
                  style={{ backgroundColor: parties.find(p => p.id === comment.partyId)?.color || '#141414' }}
                >
                  {parties.find(p => p.id === comment.partyId)?.name || 'Party'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
              <Clock size={10} />
              {formatTime(comment.timestamp)}
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-zinc-600 leading-relaxed">
        {comment.content}
      </p>

      <div className="flex items-center gap-4 pt-2">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-colors ${liked ? 'text-rose-500' : 'text-zinc-400 hover:text-rose-500'}`}
        >
          <Heart size={12} className={liked ? 'fill-rose-500' : ''} />
          {comment.likes || 0} Likes
        </button>

        <button 
          onClick={() => setIsReplying(!isReplying)}
          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-600 transition-colors"
        >
          <Reply size={12} />
          {isReplying ? 'Cancel' : 'Reply'}
        </button>

        <button 
          onClick={handleShareComment}
          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          <Share2 size={12} />
          Share
        </button>
        
        {comment.replyCount && comment.replyCount > 0 ? (
          <button 
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            {showReplies ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {comment.replyCount} {comment.replyCount === 1 ? 'Reply' : 'Replies'}
          </button>
        ) : null}
      </div>

      {/* Reply Form */}
      <AnimatePresence>
        {isReplying && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleReplySubmit} className="mt-4 space-y-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                <input
                  type="text"
                  value={replyNickname}
                  onChange={(e) => setReplyNickname(e.target.value)}
                  placeholder="Your nickname"
                  className="w-full bg-white border border-zinc-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  required
                />
              </div>
              <div className="flex gap-2">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Your reply..."
                  rows={2}
                  className="flex-1 bg-white border border-zinc-200 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                  required
                />
                <button
                  type="submit"
                  disabled={submittingReply || !replyNickname.trim() || !replyContent.trim()}
                  className="bg-indigo-600 text-white px-4 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  {submittingReply ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Replies List */}
      <AnimatePresence>
        {showReplies && replies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden space-y-3 pt-2"
          >
            {replies.map((reply) => (
              <div key={reply.id} className="flex gap-3 pl-6 border-l-2 border-zinc-100">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 font-black text-xs shrink-0">
                  {reply.nickname[0].toUpperCase()}
                </div>
                <div className="flex-1 bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-[10px] font-black text-zinc-900">{reply.nickname}</h5>
                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">
                      {formatTime(reply.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {reply.content}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <button 
                      onClick={() => handleReplyLike(reply.id)}
                      className="flex items-center gap-1 text-[9px] font-bold text-zinc-400 hover:text-rose-500 transition-colors"
                    >
                      <Heart size={10} />
                      {reply.likes || 0}
                    </button>
                    <button 
                      onClick={() => {
                        setIsReplying(true);
                        setReplyContent(`@${reply.nickname} `);
                      }}
                      className="flex items-center gap-1 text-[9px] font-bold text-zinc-400 hover:text-indigo-500 transition-colors"
                    >
                      <Reply size={10} />
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

const CommentSection = React.forwardRef<HTMLDivElement>((_, ref) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [selectedPartyId, setSelectedPartyId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToComments((data) => {
      setComments(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      await postComment(nickname.trim(), content.trim(), selectedPartyId || undefined);
      setContent('');
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div ref={ref} className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-500 p-2 rounded-lg text-white shadow-lg shadow-indigo-200 animate-pulse">
          <MessageSquare size={24} />
        </div>
        <h2 className="text-3xl font-black text-zinc-900 font-display flex items-center gap-3">
          Community Pulse
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Comment Form */}
        <div className="w-full">
          <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-zinc-100 shadow-xl mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] -mr-16 -mt-16" />
            
            <h3 className="text-xl font-black mb-6 font-display flex items-center gap-2">
              Join the Conversation
              <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full uppercase tracking-widest">Live</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nickname Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Nickname</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="e.g. Tamilan"
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-200 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Party Support Selection */}
                <div className="space-y-2 overflow-hidden">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Support (Optional)</label>
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                    {parties.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPartyId(selectedPartyId === p.id ? '' : p.id)}
                        className={`relative w-12 h-12 rounded-2xl border transition-all shrink-0 overflow-hidden p-1 flex items-center justify-center ${
                          selectedPartyId === p.id 
                            ? 'border-indigo-500 bg-indigo-50 scale-105 shadow-lg ring-2 ring-indigo-500/20' 
                            : 'border-zinc-100 bg-zinc-50 opacity-60 hover:opacity-100 hover:border-zinc-200'
                        }`}
                        title={p.name}
                      >
                        <PartyImage src={p.image} alt={p.name} className="w-full h-full rounded-lg" />
                        {selectedPartyId === p.id && (
                          <div className="absolute inset-0 bg-indigo-500/10 pointer-events-none" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Your Thoughts</label>
                <div className="relative">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's your prediction for 2026? Share your voice..."
                    rows={3}
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-[2rem] px-6 py-5 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-200 outline-none transition-all resize-none leading-relaxed"
                    required
                  />
                  <div className="absolute bottom-4 right-4">
                    <button
                      type="submit"
                      disabled={submitting || !nickname.trim() || !content.trim()}
                      className="bg-indigo-600 text-white p-4 rounded-2xl font-black hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-xl shadow-indigo-200 active:scale-95 flex items-center justify-center"
                    >
                      {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Comments List - Scrollable */}
        <div className="w-full space-y-4 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-indigo-500" size={32} />
            </div>
          ) : comments.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </AnimatePresence>
          ) : (
            <div className="bg-zinc-50 rounded-[2rem] p-12 text-center border-2 border-dashed border-zinc-200">
              <div className="text-2xl mb-2">💬</div>
              <p className="text-zinc-400 text-sm font-medium">No comments yet. Be the first to speak!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default CommentSection;
