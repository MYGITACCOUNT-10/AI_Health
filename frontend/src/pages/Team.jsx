import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import NavbarPublic from '../components/NavbarPublic';
import api from '../api/axios';

const professionalImages = [
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1594824416752-d17dc7db4104?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
];

const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10 }
};

const Team = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search')?.toLowerCase() || '';
  const specialty = searchParams.get('specialty')?.toLowerCase() || '';

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/doctors/profile/');
        // The backend returns an array if successful
        const docs = Array.isArray(response.data) ? response.data : response.data.results || [];
        setTeam(docs);
      } catch (err) {
        console.error("Failed to load doctors", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <motion.div 
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-slate-50"
    >
      <NavbarPublic />
      
      <section className="pt-32 pb-20 px-4 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">Meet Our Specialists</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {specialty ? `Showing specialists for ${specialty.charAt(0).toUpperCase() + specialty.slice(1)}` : 'Our platform is backed by world-class medical professionals dedicated to providing exceptional care.'}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => (
              <motion.div 
                key={i} 
                className="h-96 bg-slate-200 rounded-3xl"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              />
            ))}
          </div>
        ) : team.filter(m => {
            const nameMatch = (m.first_name + ' ' + m.last_name + ' ' + m.user_name).toLowerCase().includes(search);
            const specMatch = m.specialization ? m.specialization.toLowerCase().includes(specialty) : true;
            return nameMatch && (specialty ? specMatch : true);
          }).length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No specialists found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.filter(m => {
               const nameMatch = (m.first_name + ' ' + m.last_name + ' ' + m.user_name).toLowerCase().includes(search);
               const specMatch = m.specialization ? m.specialization.toLowerCase().includes(specialty) : true;
               return nameMatch && (specialty ? specMatch : true);
            }).map((member, i) => (
              <motion.div
                key={member.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={professionalImages[i % professionalImages.length]} 
                    alt={`Dr. ${member.user_name}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 gap-4">
                    <button className="bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm text-white transition-colors"><Mail className="h-5 w-5" /></button>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Dr. {member.first_name ? `${member.first_name} ${member.last_name}` : member.user_name}</h3>
                  <p className="text-blue-600 font-medium text-sm mb-3">{member.specialization || "General Specialist"}</p>
                  <div className="w-12 h-1 bg-slate-100 mx-auto rounded-full mb-3" />
                  <p className="text-slate-500 text-sm">{member.qualifications || "MD"}</p>
                  <p className="text-slate-400 text-xs mt-1">{member.experience_years ? `${member.experience_years}+ Years Experience` : "Highly Experienced"}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
      
      <footer className="py-12 bg-slate-900 text-center text-slate-400 text-sm mt-auto">
        <p>&copy; {new Date().getFullYear()} HealthAI. All rights reserved.</p>
      </footer>
    </motion.div>
  );
};

export default Team;
