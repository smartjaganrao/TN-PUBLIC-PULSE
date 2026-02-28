import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, User, Clock, Loader2, Heart } from 'lucide-react';
import { subscribeToComments, postComment, Comment } from '../services/voteService';
import { parties } from '../data/parties';

const CommentSection: React.FC = () => {
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

  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-500 p-2 rounded-lg text-white shadow-lg shadow-indigo-200 animate-pulse">
          <MessageSquare size={24} />
        </div>
        <h2 className="text-3xl font-black text-zinc-900 font-display flex items-center gap-3">
          Community Pulse
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Comment Form */}
        <div className="lg:col-span-1">
          <div className="glass p-8 rounded-[2.5rem] sticky top-8">
            <h3 className="text-xl font-black mb-6 font-display">Join the Conversation</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 font-display">
                  Your Nickname
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="e.g. Tamilan"
                    className="w-full bg-white border border-zinc-200 rounded-2xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 font-display">
                  Supporting Party (Optional)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {parties.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPartyId(selectedPartyId === p.id ? '' : p.id)}
                      className={`relative aspect-square rounded-xl border-2 transition-all overflow-hidden p-1 ${
                        selectedPartyId === p.id ? 'border-indigo-500 scale-110 shadow-lg' : 'border-transparent bg-zinc-50 opacity-60 hover:opacity-100'
                      }`}
                      title={p.name}
                    >
                      <img src={p.image} alt={p.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      {selectedPartyId === p.id && (
                        <div className="absolute inset-0 bg-indigo-500/10 flex items-center justify-center">
                          <Heart size={16} className="text-indigo-500 fill-indigo-500" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 font-display">
                  Your Thoughts
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's your prediction for 2026?"
                  rows={4}
                  className="w-full bg-white border border-zinc-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting || !nickname.trim() || !content.trim()}
                className="w-full bg-indigo-600 text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-200"
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                Post Comment
              </button>
            </form>
          </div>
        </div>

        {/* Comments List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-indigo-500" size={32} />
            </div>
          ) : comments.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black relative">
                        {comment.nickname[0].toUpperCase()}
                        {comment.partyId && (
                          <div 
                            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white overflow-hidden bg-white shadow-sm"
                            title={`Supports ${parties.find(p => p.id === comment.partyId)?.name}`}
                          >
                            <img 
                              src={parties.find(p => p.id === comment.partyId)?.image} 
                              alt="party" 
                              className="w-full h-full object-contain p-0.5"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-zinc-900">{comment.nickname}</h4>
                          {comment.partyId && (
                            <span 
                              className="text-[8px] font-black px-1.5 py-0.5 rounded-full text-white uppercase tracking-tighter"
                              style={{ backgroundColor: parties.find(p => p.id === comment.partyId)?.color }}
                            >
                              {parties.find(p => p.id === comment.partyId)?.name}
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
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="bg-zinc-50 rounded-[3rem] p-20 text-center border-2 border-dashed border-zinc-200">
              <div className="text-4xl mb-4">💬</div>
              <p className="text-zinc-400 font-medium">No comments yet. Be the first to speak!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
