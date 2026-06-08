import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ExternalLink, ArrowRight, BrainCircuit, Activity, X, Newspaper, ChevronRight, Search, Sparkles, Filter, ShieldCheck, FileText, ChevronDown } from 'lucide-react';
import NavbarPublic from '../components/NavbarPublic';
import api from '../api/axios';

const categories = ['All', 'Technology', 'Cardiology', 'Neurology', 'Oncology', 'Public Health', 'Medical Research'];

const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10 }
};

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800", // Medical research
  "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800", // Lab
  "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=800", // Virus/bacteria
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800", // Medical equipment
  "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800", // Medical tech
  "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800", // Stethoscope
  "https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?auto=format&fit=crop&q=80&w=800", // Medicine/pills
  "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=800"  // Healthcare
];

const FallbackMedicalImage = ({ index }) => {
  const imageUrl = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  
  return (
    <div className="w-full h-full relative overflow-hidden bg-blue-50/50">
      <motion.img 
        src={imageUrl} 
        alt="Healthcare"
        className="w-full h-full object-cover"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 20 + (index % 5), repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 to-transparent pointer-events-none" />
    </div>
  );
};

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [insight, setInsight] = useState(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/ai-engine/news/?category=${activeCategory}`);
        setPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [activeCategory]);

  const handleArticleClick = async (article) => {
    setSelectedArticle(article);
    setInsight(null);
    setLoadingInsight(true);
    try {
      const response = await api.post(`/ai-engine/news/${article.id}/analyze/`);
      setInsight(response.data);
    } catch (error) {
      console.error("Failed to analyze news:", error);
    } finally {
      setLoadingInsight(false);
    }
  };

  const closeModal = () => {
    setSelectedArticle(null);
    setInsight(null);
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (post.short_description && post.short_description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <motion.div 
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900"
    >
      <NavbarPublic />
      
      <section className="pt-32 pb-12 px-4 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold mb-6">
              <BrainCircuit className="h-4 w-4" />
              AI-Powered Research Hub
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Medical Research & Insights</h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium mb-8">
              Explore real-time medical news from trusted sources, enhanced with Gemini AI to generate rapid executive summaries and clinical takeaways.
            </p>
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search research topics..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-6 px-4 bg-white border-b border-slate-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 md:justify-center min-w-max pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto flex-grow w-full">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <motion.div 
                 key={i} 
                 className="h-96 bg-slate-200 rounded-3xl"
                 animate={{ opacity: [0.5, 1, 0.5] }}
                 transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              />
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, i) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => handleArticleClick(post)}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col h-full cursor-pointer group relative"
              >
                {/* Mouse Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 transition-colors duration-500 pointer-events-none z-0" />

                {post.thumbnail_url ? (
                  <div className="h-48 overflow-hidden bg-slate-100 relative z-10">
                    <img src={post.thumbnail_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                ) : (
                  <div className="h-48 bg-slate-100 relative z-10 overflow-hidden">
                    <FallbackMedicalImage index={i} />
                  </div>
                )}
                
                <div className="p-6 flex flex-col flex-grow relative z-10">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-4">
                    <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{post.category || 'Research'}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors line-clamp-3">
                    {post.title}
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                    {post.short_description ? post.short_description.replace(/<[^>]+>/g, '') : 'Click to view full AI analysis and read the complete article from the source.'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-4 mt-auto group-hover:border-blue-100 transition-colors">
                    <div className="flex items-center gap-1.5 font-medium">
                      <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      {post.source}
                    </div>
                    {post.published_date && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        {new Date(post.published_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Activity className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Articles Found</h3>
            <p className="text-slate-500">We couldn't find any recent research in this category.</p>
          </div>
        )}
      </section>

      <footer className="py-12 bg-slate-900 text-center text-slate-400 text-sm mt-20">
        <p>&copy; {new Date().getFullYear()} HealthAI Research Hub. All rights reserved.</p>
      </footer>

      {/* AI Analysis Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={closeModal}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <BrainCircuit className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Gemini AI Analysis</h3>
                    <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Clinical Intelligence Engine</p>
                  </div>
                </div>
                <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="overflow-y-auto p-6 md:p-10">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
                  {selectedArticle.title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-100">
                  <span className="font-semibold text-blue-600">{selectedArticle.source}</span>
                  <span>•</span>
                  <span>{selectedArticle.published_date ? new Date(selectedArticle.published_date).toLocaleDateString() : 'Recent'}</span>
                </div>

                {loadingInsight ? (
                  <div className="space-y-8 animate-pulse">
                    <div>
                      <div className="h-6 w-48 bg-slate-200 rounded mb-4"></div>
                      <div className="h-4 w-full bg-slate-100 rounded mb-2"></div>
                      <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
                    </div>
                    <div>
                      <div className="h-6 w-40 bg-slate-200 rounded mb-4"></div>
                      <div className="h-4 w-full bg-slate-100 rounded mb-2"></div>
                      <div className="h-4 w-3/4 bg-slate-100 rounded"></div>
                    </div>
                    <div className="flex items-center justify-center py-10">
                      <div className="flex flex-col items-center gap-4 text-blue-600">
                        <BrainCircuit className="h-10 w-10 animate-bounce" />
                        <span className="font-semibold">Gemini is analyzing this research...</span>
                      </div>
                    </div>
                  </div>
                ) : insight ? (
                  <div className="space-y-10">
                    <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                      <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                        Executive Summary
                      </h4>
                      <p className="text-slate-700 leading-relaxed text-lg">
                        {insight.executive_summary}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-4">Key Findings</h4>
                      <ul className="space-y-3">
                        {insight.key_findings.map((finding, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-slate-700">
                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-bold mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <h4 className="text-md font-bold text-slate-900 mb-3">Why This Matters</h4>
                        <p className="text-slate-600 leading-relaxed text-sm">
                          {insight.why_this_matters}
                        </p>
                      </div>
                      <div className="bg-cyan-50/30 p-6 rounded-2xl border border-cyan-100">
                        <h4 className="text-md font-bold text-slate-900 mb-3">Doctor Perspective</h4>
                        <p className="text-slate-600 leading-relaxed text-sm">
                          {insight.doctor_perspective}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 text-red-500">Failed to load analysis.</div>
                )}
              </div>
              
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center mt-auto">
                 <p className="text-xs text-slate-400 font-medium">Disclaimer: AI generated summaries do not constitute medical advice.</p>
                 <a href={selectedArticle.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors">
                   Read Full Article <ExternalLink className="h-4 w-4" />
                 </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Blog;
