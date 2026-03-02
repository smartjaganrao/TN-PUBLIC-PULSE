import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Vote, 
  MessageSquare, 
  FileText, 
  Trash2, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  ShieldAlert,
  ChevronRight,
  User,
  MapPin,
  Clock,
  LogOut,
  Plus,
  Image as ImageIcon,
  Type,
  X,
  BookOpen
} from 'lucide-react';
import Markdown from 'react-markdown';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getAllVotes, getAllComments, deleteDocument, getForumTopics, getBlogPosts, postBlogPost } from '../services/voteService';
import { parties } from '../data/parties';

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'votes' | 'comments' | 'forum' | 'blog'>('votes');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddBlog, setShowAddBlog] = useState(false);

  // New Blog Post State
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogCategory, setBlogCategory] = useState('');
  const [blogImageUrl, setBlogImageUrl] = useState('');
  const [submittingBlog, setSubmittingBlog] = useState(false);
  const [blogEditorTab, setBlogEditorTab] = useState<'write' | 'preview'>('write');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin2026') { // Simple demo password
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      let result: any[] = [];
      if (activeTab === 'votes') result = await getAllVotes();
      else if (activeTab === 'comments') result = await getAllComments();
      else if (activeTab === 'forum') result = await getForumTopics();
      else if (activeTab === 'blog') result = await getBlogPosts();
      setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, activeTab]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      const collectionName = 
        activeTab === 'votes' ? 'votes' : 
        activeTab === 'comments' ? 'comments' : 
        activeTab === 'forum' ? 'forum_topics' : 'blog_posts';
      await deleteDocument(collectionName, id);
      setData(prev => prev.filter(item => item.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingBlog(true);
    try {
      await postBlogPost({
        title: blogTitle,
        slug: blogSlug.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        content: blogContent,
        excerpt: blogExcerpt,
        author: blogAuthor,
        category: blogCategory,
        imageUrl: blogImageUrl
      });
      setShowAddBlog(false);
      setBlogTitle('');
      setBlogSlug('');
      setBlogContent('');
      setBlogExcerpt('');
      setBlogAuthor('');
      setBlogCategory('');
      setBlogImageUrl('');
      fetchData();
    } catch (e) {
      console.error(e);
      alert('Failed to add blog post');
    } finally {
      setSubmittingBlog(false);
    }
  };

  const filteredData = data.filter(item => {
    const searchStr = searchTerm.toLowerCase();
    if (activeTab === 'votes') {
      return item.nickname?.toLowerCase().includes(searchStr) || 
             item.district?.toLowerCase().includes(searchStr) || 
             item.party?.toLowerCase().includes(searchStr);
    }
    if (activeTab === 'comments') {
      return item.nickname?.toLowerCase().includes(searchStr) || 
             item.content?.toLowerCase().includes(searchStr);
    }
    if (activeTab === 'forum') {
      return item.title?.toLowerCase().includes(searchStr) || 
             item.nickname?.toLowerCase().includes(searchStr);
    }
    if (activeTab === 'blog') {
      return item.title?.toLowerCase().includes(searchStr) || 
             item.author?.toLowerCase().includes(searchStr) || 
             item.category?.toLowerCase().includes(searchStr);
    }
    return true;
  });

  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-10 rounded-[2.5rem] space-y-8"
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto text-emerald-500">
              <ShieldAlert size={32} />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-widest">Admin Access</h1>
            <p className="text-zinc-500 text-sm">Enter the secure password to access the TN Pulse dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Secure Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-emerald-600 text-white py-4 rounded-full font-black uppercase tracking-widest hover:bg-emerald-500 transition-all active:scale-95"
            >
              Unlock Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E4E3E0] font-sans text-[#141414]">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-[#141414]/10 p-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#141414] rounded-lg flex items-center justify-center text-white">
            <LayoutDashboard size={18} />
          </div>
          <span className="font-black uppercase tracking-widest text-xs">TN Pulse Admin</span>
        </div>
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="p-2 text-rose-500"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden bg-white border-b border-[#141414]/10 p-2 sticky top-[65px] z-40 overflow-x-auto flex gap-2 no-scrollbar">
        <button 
          onClick={() => setActiveTab('votes')}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'votes' ? 'bg-[#141414] text-white' : 'bg-zinc-100 text-zinc-500'}`}
        >
          <Vote size={12} />
          Votes
        </button>
        <button 
          onClick={() => setActiveTab('comments')}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'comments' ? 'bg-[#141414] text-white' : 'bg-zinc-100 text-zinc-500'}`}
        >
          <MessageSquare size={12} />
          Comments
        </button>
        <button 
          onClick={() => setActiveTab('forum')}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'forum' ? 'bg-[#141414] text-white' : 'bg-zinc-100 text-zinc-500'}`}
        >
          <FileText size={12} />
          Forum
        </button>
        <button 
          onClick={() => setActiveTab('blog')}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'blog' ? 'bg-[#141414] text-white' : 'bg-zinc-100 text-zinc-500'}`}
        >
          <BookOpen size={12} />
          Blog
        </button>
      </div>

      {/* Sidebar (Desktop Only) */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-[#141414]/10 p-8 hidden lg:flex flex-col gap-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#141414] rounded-lg flex items-center justify-center text-white">
            <LayoutDashboard size={18} />
          </div>
          <span className="font-black uppercase tracking-widest text-sm">TN Pulse Admin</span>
        </div>

        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('votes')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'votes' ? 'bg-[#141414] text-white' : 'hover:bg-zinc-100 text-zinc-500'}`}
          >
            <Vote size={14} />
            Votes
          </button>
          <button 
            onClick={() => setActiveTab('comments')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'comments' ? 'bg-[#141414] text-white' : 'hover:bg-zinc-100 text-zinc-500'}`}
          >
            <MessageSquare size={14} />
            Comments
          </button>
          <button 
            onClick={() => setActiveTab('forum')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'forum' ? 'bg-[#141414] text-white' : 'hover:bg-zinc-100 text-zinc-500'}`}
          >
            <FileText size={14} />
            Forum Topics
          </button>
          <button 
            onClick={() => setActiveTab('blog')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'blog' ? 'bg-[#141414] text-white' : 'hover:bg-zinc-100 text-zinc-500'}`}
          >
            <BookOpen size={14} />
            Blog Posts
          </button>
        </nav>

        <div className="mt-auto">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all w-full"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 sm:p-8 lg:p-12 space-y-8 sm:space-y-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter font-display">
              {activeTab === 'votes' ? 'Voting Records' : activeTab === 'comments' ? 'Community Comments' : activeTab === 'forum' ? 'Forum Management' : 'Blog Management'}
            </h1>
            <p className="text-zinc-500 text-[10px] sm:text-xs font-medium uppercase tracking-widest mt-1 sm:mt-2">
              Viewing {filteredData.length} records from Firestore
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {activeTab === 'blog' && (
              <button 
                onClick={() => setShowAddBlog(true)}
                className="flex items-center gap-2 bg-[#141414] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
              >
                <Plus size={16} />
                New Post
              </button>
            )}
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full bg-white border border-[#141414]/10 rounded-xl pl-12 pr-4 py-2.5 sm:py-3 text-sm outline-none focus:ring-2 focus:ring-[#141414] transition-all md:min-w-[300px]"
              />
            </div>
            <button 
              onClick={fetchData}
              className="p-2.5 sm:p-3 bg-white border border-[#141414]/10 rounded-xl hover:bg-zinc-50 transition-all"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        {/* Data Table */}
        <div className="bg-white border border-[#141414]/10 rounded-[2rem] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-bottom border-[#141414]/10 bg-zinc-50/50">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Record Details</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Metadata</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Timestamp</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredData.map((item) => (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-[#141414]/5 hover:bg-zinc-50/50 transition-all group"
                    >
                      <td className="px-8 py-6">
                        {activeTab === 'votes' ? (
                          <div className="flex items-center gap-4">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-black text-xs"
                              style={{ backgroundColor: parties.find(p => p.id === item.party)?.color || '#141414' }}
                            >
                              {item.party[0]}
                            </div>
                            <div>
                              <p className="font-black text-sm">{item.nickname || 'Anonymous'}</p>
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{item.party}</p>
                            </div>
                          </div>
                        ) : activeTab === 'comments' ? (
                          <div className="space-y-1">
                            <p className="font-black text-sm">{item.nickname}</p>
                            <p className="text-xs text-zinc-500 line-clamp-1">{item.content}</p>
                          </div>
                        ) : activeTab === 'forum' ? (
                          <div className="space-y-1">
                            <p className="font-black text-sm">{item.title}</p>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">By {item.nickname}</p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="font-black text-sm">{item.title}</p>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">By {item.author}</p>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        {activeTab === 'votes' ? (
                          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                            <MapPin size={12} />
                            {item.district}
                          </div>
                        ) : activeTab === 'comments' ? (
                          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                            <User size={12} />
                            {item.partyId || 'No Party'}
                          </div>
                        ) : activeTab === 'forum' ? (
                          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                            <FileText size={12} />
                            {item.category}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                            <BookOpen size={12} />
                            {item.category}
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                          <Clock size={12} />
                          {formatTime(item.timestamp)}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {filteredData.length === 0 && !loading && (
            <div className="p-20 text-center space-y-4">
              <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto text-zinc-300">
                <Search size={32} />
              </div>
              <p className="text-zinc-400 font-black uppercase tracking-widest text-xs">No records found matching your search.</p>
            </div>
          )}
        </div>
      </main>

      {/* Add Blog Modal */}
      <AnimatePresence>
        {showAddBlog && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddBlog(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter font-display">Create New Blog Post</h2>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">Publish political analysis to the public pulse</p>
                </div>
                <button 
                  onClick={() => setShowAddBlog(false)}
                  className="p-3 bg-white border border-zinc-200 rounded-2xl text-zinc-400 hover:text-rose-500 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddBlog} className="p-8 overflow-y-auto space-y-8">
                {/* Metadata Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Post Title</label>
                    <div className="relative">
                      <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                      <input 
                        type="text" 
                        value={blogTitle}
                        onChange={(e) => setBlogTitle(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#141414] transition-all"
                        placeholder="Election Predictions 2026"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">URL Slug (SEO)</label>
                    <input 
                      type="text" 
                      value={blogSlug}
                      onChange={(e) => setBlogSlug(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#141414] transition-all"
                      placeholder="election-predictions-2026"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Image URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                      <input 
                        type="text" 
                        value={blogImageUrl}
                        onChange={(e) => setBlogImageUrl(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#141414] transition-all"
                        placeholder="https://images.unsplash.com/..."
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Author</label>
                    <input 
                      type="text" 
                      value={blogAuthor}
                      onChange={(e) => setBlogAuthor(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#141414] transition-all"
                      placeholder="Admin"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Category</label>
                    <input 
                      type="text" 
                      value={blogCategory}
                      onChange={(e) => setBlogCategory(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#141414] transition-all"
                      placeholder="Analysis"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Excerpt (Brief Summary)</label>
                    <input 
                      type="text"
                      value={blogExcerpt}
                      onChange={(e) => setBlogExcerpt(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#141414] transition-all"
                      placeholder="A short summary of the post..."
                      required
                    />
                  </div>
                </div>

                {/* Content Editor Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Content (Markdown Supported)</label>
                    <div className="flex bg-zinc-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setBlogEditorTab('write')}
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${blogEditorTab === 'write' ? 'bg-white text-[#141414] shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                      >
                        Write
                      </button>
                      <button
                        type="button"
                        onClick={() => setBlogEditorTab('preview')}
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${blogEditorTab === 'preview' ? 'bg-white text-[#141414] shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                      >
                        Preview
                      </button>
                    </div>
                  </div>

                  <div className="min-h-[400px] bg-zinc-50 rounded-[2rem] border border-zinc-200 overflow-hidden flex flex-col">
                    {blogEditorTab === 'write' ? (
                      <div className="flex-1 bg-white quill-editor-container">
                        <ReactQuill 
                          theme="snow"
                          value={blogContent}
                          onChange={setBlogContent}
                          placeholder="Write your analysis here... formatting will be preserved when you paste from other sources."
                          className="h-full"
                          modules={{
                            toolbar: [
                              [{ 'header': [1, 2, 3, false] }],
                              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                              [{'list': 'ordered'}, {'list': 'bullet'}],
                              ['link', 'image'],
                              ['clean']
                            ],
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full flex-1 bg-white px-8 py-6 overflow-y-auto prose prose-zinc prose-sm max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: blogContent || '*No content to preview*' }} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddBlog(false)}
                    className="px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={submittingBlog}
                    className="bg-[#141414] text-white px-12 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 disabled:opacity-50"
                  >
                    {submittingBlog ? 'Publishing...' : 'Publish Post'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPage;
