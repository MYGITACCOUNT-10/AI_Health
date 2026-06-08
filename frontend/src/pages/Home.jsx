import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Activity, ArrowRight, Calendar, FileText, Pill, 
  BrainCircuit, ShieldCheck, Clock, Users, Shield, 
  Heart, Star, ChevronDown, CheckCircle2, ChevronRight,
  PlayCircle, MapPin, Phone, Search, Stethoscope, Mail, Newspaper, ExternalLink
} from 'lucide-react';
import NavbarPublic from '../components/NavbarPublic';
import api from '../api/axios';

const professionalImages = [
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1594824416752-d17dc7db4104?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300"
];

// Common Framer Motion Variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 15 } }
};

const cardHover = {
  rest: { scale: 1, y: 0, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" },
  hover: { scale: 1.02, y: -8, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }
};

const pageTransition = {
  initial: { opacity: 0, filter: "blur(10px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(10px)" }
};

const AnimatedNumber = ({ value }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const controls = animate(count, value, { duration: 3, ease: "easeOut" });
    return controls.stop;
  }, [count, value]);

  return <motion.span>{rounded}</motion.span>;
};

const Hero = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [specialty, setSpecialty] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (specialty) params.append('specialty', specialty);
    navigate(`/team?${params.toString()}`);
  };

  return (
    <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-white">
      {/* Animated Floating Orbs */}
      <div className="absolute inset-0 -z-10 bg-slate-50 overflow-hidden">
         <motion.div 
            animate={{ x: [0, 50, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className="absolute top-10 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
         />
         <motion.div 
            animate={{ x: [0, -50, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="absolute top-40 right-10 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
         />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          <div className="lg:w-1/2 text-left">
            <motion.div variants={staggerContainer} initial="hidden" animate="show">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold mb-6">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                The Premier Healthcare Marketplace
              </motion.div>
              
              <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
                Find Doctors. <br/>
                Manage Healthcare. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Get AI Insights.</span>
              </motion.h1>
              
              <motion.p variants={fadeUp} className="text-lg text-slate-500 mb-8 max-w-xl leading-relaxed font-medium">
                Book instantly with top specialists, access your digital health vault, and let our Clinical Intelligence Engine analyze your medical reports.
              </motion.p>
              
              <motion.div variants={fadeUp} className="bg-white p-3 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 max-w-xl relative group">
                <div className="absolute inset-0 bg-blue-400 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10"></div>
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-grow flex items-center">
                    <Search className="absolute left-3 h-5 w-5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search doctors, symptoms..." 
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="relative sm:w-48 flex-shrink-0 flex items-center border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-2">
                    <Stethoscope className="absolute left-4 h-5 w-5 text-slate-400" />
                    <select 
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-transparent focus:outline-none focus:border-transparent focus:ring-0 bg-transparent text-slate-700 appearance-none font-medium cursor-pointer"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                    >
                      <option value="">All Specialties</option>
                      <option value="cardiology">Cardiology</option>
                      <option value="neurology">Neurology</option>
                      <option value="pediatrics">Pediatrics</option>
                      <option value="orthopedics">Orthopedics</option>
                      <option value="general">General</option>
                    </select>
                    <ChevronDown className="absolute right-3 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors flex-shrink-0 flex items-center justify-center gap-2 mt-2 sm:mt-0 active:scale-95">
                    Find
                  </button>
                </form>
              </motion.div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white bg-slate-100 h-[500px]"
              style={{ perspective: 1000 }}
            >
              <div className="relative rounded-[2rem] overflow-hidden border border-slate-200/50 shadow-2xl">
                  <motion.img 
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=1200" 
                    alt="AI Healthcare Platform" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
              </div>
              
              <motion.div 
                 initial={{ y: 50, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.8 }}
                 className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-xl border border-white/50 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Verified Professionals</div>
                    <div className="text-sm text-slate-500">Board-certified specialists</div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

const Specialties = () => {
  const navigate = useNavigate();
  const specs = [
    { name: 'Cardiology', icon: Heart, color: 'rose' },
    { name: 'Neurology', icon: BrainCircuit, color: 'purple' },
    { name: 'Pediatrics', icon: Users, color: 'emerald' },
    { name: 'Orthopedics', icon: Activity, color: 'amber' },
    { name: 'General Medicine', icon: Stethoscope, color: 'blue' },
    { name: 'Diagnostics', icon: FileText, color: 'cyan' },
  ];

  return (
    <div className="py-20 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex justify-between items-end mb-10"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Top Specialties</h2>
            <p className="text-slate-500">Find experienced doctors across all specialties.</p>
          </div>
          <Link to="/team" className="hidden sm:flex items-center text-blue-600 font-bold hover:text-blue-700 transition-colors">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </motion.div>
        
        <motion.div 
           variants={staggerContainer}
           initial="hidden"
           whileInView="show"
           viewport={{ once: true, margin: "-50px" }}
           className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {specs.map((s, i) => (
            <motion.button 
              key={i}
              variants={fadeUp}
              whileHover={{ scale: 1.05, y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/team?specialty=${s.name.toLowerCase()}`)}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center group"
            >
              <div className={`h-14 w-14 rounded-full bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <s.icon className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{s.name}</h3>
            </motion.button>
          ))}
        </motion.div>
        
        <Link to="/team" className="sm:hidden mt-6 flex items-center justify-center w-full bg-white border border-slate-200 py-3 rounded-xl text-blue-600 font-bold">
          View All Specialties
        </Link>
      </div>
    </div>
  );
};

const Features = () => {
  const features = [
    { title: "Appointment Scheduling", desc: "Book consultations instantly with our specialist doctors.", icon: Calendar, color: "blue" },
    { title: "Digital Prescriptions", desc: "Manage prescriptions digitally without the fear of losing paper.", icon: Pill, color: "amber" },
    { title: "Medical Reports", desc: "Securely store and track all your medical documents in one vault.", icon: FileText, color: "emerald" },
    { title: "Patient Monitoring", desc: "Track health history with visual health timelines and scores.", icon: Activity, color: "purple" }
  ];

  return (
    <div id="services" className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Comprehensive Healthcare Tools</h2>
          <p className="text-lg text-slate-500">Everything you need to manage your healthcare journey, all in one beautifully designed platform.</p>
        </motion.div>
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((f, i) => (
            <motion.div 
               key={i} 
               variants={fadeUp}
               whileHover={{ y: -5 }}
               className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-lg hover:border-slate-300 transition-all"
            >
              <div className={`h-12 w-12 rounded-xl bg-${f.color}-100 text-${f.color}-600 flex items-center justify-center mb-6`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
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

const ResearchHubPreview = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/ai-engine/news/?category=All').then(res => {
      setArticles(res.data.slice(0, 3));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="flex justify-between items-end mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-3 uppercase tracking-wider">
              <Newspaper className="h-3 w-3" /> Research Hub
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Latest Medical Insights</h2>
            <p className="text-slate-500">AI-summarized clinical research and healthcare news.</p>
          </div>
          <Link to="/blog" className="hidden sm:flex items-center text-blue-600 font-bold hover:text-blue-700 bg-white border border-slate-200 px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95">
            View All Articles <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
              <motion.div 
                 key={i} 
                 className="h-80 bg-slate-200 rounded-3xl"
                 animate={{ opacity: [0.5, 1, 0.5] }}
                 transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              />
            ))}
          </div>
        ) : (
          <motion.div 
             variants={staggerContainer}
             initial="hidden"
             whileInView="show"
             viewport={{ once: true }}
             className="grid md:grid-cols-3 gap-8"
          >
            {articles.map((article, i) => (
              <motion.div key={article.id} variants={fadeUp} whileHover={{ y: -8, scale: 1.02 }} initial="rest">
                <Link to="/blog" className="block bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col h-full h-80 group relative">
                  {/* Mouse Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 transition-colors duration-500 pointer-events-none z-0" />

                  <div className="h-40 overflow-hidden bg-slate-100 relative z-10">
                    {article.thumbnail_url ? (
                      <>
                        <motion.img 
                           src={article.thumbnail_url} 
                           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </>
                    ) : (
                      <FallbackMedicalImage index={i} />
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold text-blue-600 rounded-lg shadow-sm">
                      {article.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow relative z-10">
                    <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{article.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow">
                      {article.short_description ? article.short_description.replace(/<[^>]+>/g, '') : 'Click to read full article and AI analysis.'}
                    </p>
                    <div className="text-xs text-slate-400 font-medium flex items-center justify-between mt-auto group-hover:text-slate-600 transition-colors">
                      <span>{article.source}</span>
                      <span>{new Date(article.published_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

const AIWorkflow = () => (
  <div id="ai-showcase" className="py-24 bg-slate-900 text-white relative overflow-hidden">
    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#3b82f6_1px,_transparent_1px)] [background-size:24px_24px]"></div>
    
    <motion.div 
      animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
      transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl"
    />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2">
          <motion.div 
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-bold mb-6"
          >
            <BrainCircuit className="h-4 w-4" /> AI Healthcare Showcase
          </motion.div>
          <motion.h2 
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
          >
            Clinical intelligence, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">delivered instantly.</span>
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="text-lg text-slate-300 mb-10 leading-relaxed"
          >
            Our proprietary AI pipeline ingests unstructured medical PDFs, extracts vital diagnostic parameters, and generates personalized, clinical-grade summaries before you even step into the doctor's office.
          </motion.p>
          
          <motion.div 
             variants={staggerContainer}
             initial="hidden"
             whileInView="show"
             viewport={{ once: true }}
             className="space-y-6"
          >
            {[
              { title: "Upload Report", desc: "Securely vault your lab results." },
              { title: "AI Analysis", desc: "NLP models parse complex medical jargon." },
              { title: "Executive Summary", desc: "Get an instant, readable health overview." }
            ].map((step, i) => (
              <motion.div key={i} variants={fadeUp} className="flex gap-4 items-center group">
                <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold group-hover:bg-cyan-500/20 transition-colors">
                  {i + 1}
                </div>
                <div>
                  <h4 className="font-bold text-slate-100">{step.title}</h4>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        <div className="lg:w-1/2 w-full">
           <motion.div 
              initial={{ opacity: 0, rotateY: -10, scale: 0.95 }}
              whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 1.2 }}
              className="relative rounded-3xl bg-slate-800 p-8 shadow-2xl border border-slate-700"
              style={{ perspective: 1000 }}
           >
              <div className="relative z-10 space-y-4">
                <motion.div 
                   initial={{ x: 50, opacity: 0 }}
                   whileInView={{ x: 0, opacity: 1 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.5 }}
                   className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-2xl p-5 flex items-center gap-4"
                >
                   <div className="h-12 w-12 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><FileText /></div>
                   <div>
                      <div className="text-slate-200 font-bold">blood_test_results.pdf</div>
                      <div className="text-slate-400 text-sm">Analyzed in 1.2s</div>
                   </div>
                   <CheckCircle2 className="ml-auto text-emerald-400 h-6 w-6" />
                </motion.div>

                <div className="h-8 border-l-2 border-dashed border-slate-700 ml-11"></div>

                <motion.div 
                   initial={{ x: 50, opacity: 0 }}
                   whileInView={{ x: 0, opacity: 1 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.8 }}
                   className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-2xl p-6"
                >
                   <div className="flex items-center gap-2 text-cyan-400 font-bold mb-4">
                      <BrainCircuit className="h-5 w-5" /> Executive Summary
                   </div>
                   <div className="space-y-3">
                      <motion.div className="h-3 bg-slate-800 rounded w-full" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}></motion.div>
                      <motion.div className="h-3 bg-slate-800 rounded w-5/6" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}></motion.div>
                      <motion.div className="h-3 bg-slate-800 rounded w-4/6" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}></motion.div>
                   </div>
                   <div className="mt-6 flex gap-3">
                      <div className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/30">HbA1c: Normal</div>
                      <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">Cholesterol: Elevated</div>
                   </div>
                </motion.div>
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  </div>
);

const TopDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/doctors/profile/').then(res => {
      const docs = Array.isArray(res.data) ? res.data : res.data.results || [];
      setDoctors(docs.slice(0, 4));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Top Specialists</h2>
          <p className="text-lg text-slate-500">Meet a few of our renowned doctors dedicated to your health.</p>
        </motion.div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {[1,2,3,4].map(i => (
               <motion.div 
                 key={i} 
                 className="h-96 bg-slate-100 rounded-3xl"
                 animate={{ opacity: [0.5, 1, 0.5] }}
                 transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
               />
             ))}
          </div>
        ) : doctors.length > 0 ? (
          <motion.div 
             variants={staggerContainer}
             initial="hidden"
             whileInView="show"
             viewport={{ once: true }}
             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {doctors.map((member, i) => (
              <motion.div 
                 key={member.id} 
                 variants={fadeUp}
                 whileHover="hover"
                 initial="rest"
                 className="bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden shadow-sm"
              >
                <div className="h-64 overflow-hidden relative">
                  <motion.img 
                     src={professionalImages[i % professionalImages.length]} 
                     alt={`Dr. ${member.user_name}`} 
                     className="w-full h-full object-cover"
                     whileHover={{ scale: 1.05 }}
                     transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="p-6 text-center bg-white z-10 relative">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Dr. {member.first_name ? `${member.first_name} ${member.last_name}` : member.user_name}</h3>
                  <p className="text-blue-600 font-medium text-sm mb-3">{member.specialization || "General Specialist"}</p>
                  <div className="w-12 h-1 bg-blue-100 mx-auto rounded-full mb-3" />
                  <p className="text-slate-500 text-sm">{member.qualifications || "MD"}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-10 text-slate-500">No specialists found...</div>
        )}
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           className="text-center mt-12"
        >
          <Link to="/team" className="inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 px-8 py-3 text-base font-bold text-slate-700 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm hover:shadow-md active:scale-95">
            View All Doctors
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

const AboutUs = () => (
  <div id="about" className="py-24 bg-blue-600 relative overflow-hidden">
    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-3xl">
        <motion.h2 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-3xl md:text-5xl font-bold text-white mb-6"
        >
           Redefining Healthcare Delivery.
        </motion.h2>
        <motion.p 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.2 }}
           className="text-blue-100 text-lg md:text-xl leading-relaxed mb-12"
        >
          HealthAI was founded on a simple principle: patients and doctors deserve a platform that removes friction. By blending world-class hospital expertise with Silicon Valley-grade AI, we are creating a transparent, highly efficient healthcare marketplace.
        </motion.p>
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.4 }}
           className="flex gap-12"
        >
          <div>
            <div className="text-4xl md:text-5xl font-bold text-white mb-1">
               <AnimatedNumber value={500} />+
            </div>
            <div className="text-blue-200 text-sm md:text-base font-medium">Patients Managed</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-white mb-1">
               <AnimatedNumber value={98} />%
            </div>
            <div className="text-blue-200 text-sm md:text-base font-medium">Satisfaction Rate</div>
          </div>
        </motion.div>
      </div>
    </div>
  </div>
);

const Timeline = () => {
  const steps = [
    { step: "1", title: "Registration & Profile", desc: "Create your patient profile securely. Tell us about your health history.", align: "left" },
    { step: "2", title: "AI Health Analysis", desc: "Upload past medical records. Our AI organizes and highlights key risk factors.", align: "right" },
    { step: "3", title: "Consultation & Treatment", desc: "Book appointments with top specialists and receive a digital care plan.", align: "left" },
    { step: "4", title: "Continuous Monitoring", desc: "Track vital signs over time, get prescription refills, and stay healthy.", align: "right" }
  ];

  return (
    <div className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Your Health Journey</h2>
          <p className="text-lg text-slate-500">Track, manage, and improve your wellbeing with our structured timeline approach.</p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto relative">
          <motion.div 
             initial={{ height: 0 }}
             whileInView={{ height: "100%" }}
             viewport={{ once: true }}
             transition={{ duration: 2, ease: "easeInOut" }}
             className="absolute left-[20px] md:left-1/2 transform md:-translate-x-1/2 w-1 bg-blue-100 rounded-full"
          />
          <div className="space-y-12">
            {steps.map((item, idx) => (
              <motion.div 
                 key={idx} 
                 initial={{ opacity: 0, x: item.align === 'left' ? 50 : -50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true, margin: "-100px" }}
                 transition={{ type: "spring", duration: 1 }}
                 className={`flex flex-col md:flex-row items-start md:items-center justify-between w-full ${item.align === 'left' ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="hidden md:block w-5/12"></div>
                <div className="z-20 relative md:static mb-4 md:mb-0">
                  <motion.div 
                     whileHover={{ scale: 1.2, rotate: 360 }}
                     transition={{ duration: 0.5 }}
                     className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full shadow-lg border-4 border-white text-white font-bold relative left-[0px] md:left-0 cursor-pointer"
                  >
                    {item.step}
                  </motion.div>
                </div>
                <div className={`w-full pl-12 md:pl-0 md:w-5/12 ${item.align === 'left' ? 'md:text-right' : 'md:text-left'}`}>
                  <motion.div 
                     whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                     className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm transition-all"
                  >
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-500">{item.desc}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactUs = () => (
  <div id="contact" className="py-24 bg-slate-50 border-t border-slate-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-16">
        <motion.div 
           initial={{ opacity: 0, x: -30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           className="lg:w-1/3"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Get in Touch</h2>
          <p className="text-slate-500 mb-8">Have questions about our platform? Our support team is available 24/7 to assist you.</p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Phone className="h-5 w-5" /></div>
              <div>
                <div className="font-bold text-slate-900">Phone Support</div>
                <div className="text-slate-500 group-hover:text-blue-600 transition-colors">+1 (800) 123-4567</div>
              </div>
            </div>
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors"><Mail className="h-5 w-5" /></div>
              <div>
                <div className="font-bold text-slate-900">Email Us</div>
                <div className="text-slate-500 group-hover:text-emerald-600 transition-colors">support@healthai.com</div>
              </div>
            </div>
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors"><MapPin className="h-5 w-5" /></div>
              <div>
                <div className="font-bold text-slate-900">Headquarters</div>
                <div className="text-slate-500 group-hover:text-purple-600 transition-colors">San Francisco, CA</div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
           initial={{ opacity: 0, x: 30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           className="lg:w-2/3"
        >
          <form className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
              <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Jane" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
              <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Doe" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="jane@example.com" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
              <textarea rows="4" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="How can we help?"></textarea>
            </div>
            <div className="sm:col-span-2">
              <motion.button 
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 type="button" 
                 className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-600/20"
              >
                Send Message
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  </div>
);

const FAQAccordion = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border border-slate-200 rounded-2xl mb-4 bg-white overflow-hidden transition-all shadow-sm"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-900">{q}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="h-5 w-5 text-slate-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 text-slate-600 border-t border-slate-100 mt-2">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQ = () => (
  <div className="py-24 bg-white">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
        <p className="text-lg text-slate-500">Everything you need to know about HealthAI.</p>
      </motion.div>
      <FAQAccordion q="How does AI analysis work?" a="Our AI securely processes uploaded medical reports (like PDFs) using advanced Natural Language Processing to extract key findings and generate easy-to-understand executive summaries and recommendations." />
      <FAQAccordion q="Is my data secure?" a="Yes. HealthAI uses enterprise-grade encryption for all data at rest and in transit. Only authorized medical personnel and you have access to your medical records." />
      <FAQAccordion q="Can I download prescriptions?" a="Absolutely. Once a doctor issues a digital prescription, it is instantly available in your dashboard to view, download as a PDF, or present directly to a pharmacy." />
      <FAQAccordion q="Can doctors upload reports?" a="Yes. Both patients and their assigned doctors can upload medical reports into the patient's secure vault." />
      <FAQAccordion q="How accurate are AI insights?" a="Our AI is trained on massive clinical datasets. While highly accurate for summarization, AI insights are always marked with a confidence score and are intended to assist—not replace—professional medical judgement." />
    </div>
  </div>
);

const Footer = () => (
  <footer className="bg-slate-900 pt-20 pb-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">HealthAI</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Delivering next-generation, AI-powered healthcare management for clinics and patients globally.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Platform</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><Link to="/register" className="hover:text-white transition-colors">For Patients</Link></li>
            <li><Link to="/register" className="hover:text-white transition-colors">For Doctors</Link></li>
            <li><a href="#ai-showcase" className="hover:text-white transition-colors">AI Engine</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
            <li><Link to="/team" className="hover:text-white transition-colors">Our Specialists</Link></li>
            <li><Link to="/blog" className="hover:text-white transition-colors">Research Hub</Link></li>
            <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Legal</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors">HIPAA Compliance</a></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-slate-800 text-center flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-slate-500 text-sm">© {new Date().getFullYear()} HealthAI Systems. All rights reserved.</p>
        <div className="flex items-center gap-2 text-slate-500 text-sm">
           Crafted with <Heart className="h-4 w-4 text-red-500 mx-1" /> for better healthcare.
        </div>
      </div>
    </div>
  </footer>
);

const Home = () => {
  return (
    <motion.div 
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900"
    >
      <NavbarPublic />
      <main>
        <Hero />
        <Specialties />
        <Features />
        <ResearchHubPreview />
        <AIWorkflow />
        <TopDoctors />
        <AboutUs />
        <Timeline />
        <FAQ />
        <ContactUs />
      </main>
      <Footer />
    </motion.div>
  );
};

export default Home;
