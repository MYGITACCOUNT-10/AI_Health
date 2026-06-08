import { motion } from 'framer-motion';
import { Target, Heart, Award, Shield, Users, Lightbulb } from 'lucide-react';
import NavbarPublic from '../components/NavbarPublic';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarPublic />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-100 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-cyan-100 blur-3xl opacity-50" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6"
          >
            Pioneering the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Healthcare</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          >
            We believe that every patient deserves access to intelligent, personalized, and efficient healthcare. By combining top-tier medical expertise with cutting-edge Artificial Intelligence, we are making world-class healthcare accessible to all.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            <Target className="h-12 w-12 text-blue-600 mb-8 relative z-10" />
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Mission</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              To empower patients and doctors with an intelligent platform that simplifies medical record management, streamlines appointments, and leverages AI to surface actionable health insights—improving clinical outcomes worldwide.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            <Lightbulb className="h-12 w-12 text-cyan-600 mb-8 relative z-10" />
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Vision</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              To become the global standard for digital healthcare infrastructure, where proactive AI-driven health monitoring becomes as ubiquitous as standard clinical care, eradicating preventable diseases through early detection.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-4 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Journey</h2>
            <p className="text-lg text-slate-600">How we evolved from a small clinic into a global healthcare AI platform.</p>
          </div>
          
          <div className="space-y-12">
            {[
              { year: '2023', title: 'The Inception', desc: 'HealthAI was founded by a team of visionary doctors and AI engineers.' },
              { year: '2024', title: 'Clinical Validation', desc: 'Partnered with top 10 hospitals to train our AI on diverse medical datasets.' },
              { year: '2025', title: 'Platform Launch', desc: 'Released the HealthAI SaaS platform to the public, onboarding 50,000 patients in the first month.' },
              { year: '2026', title: 'Global Expansion', desc: 'Currently expanding our intelligent diagnostic tools to clinics worldwide.' }
            ].map((milestone, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="flex flex-col items-center">
                  <div className="h-14 w-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg border-4 border-white shadow-sm shrink-0">
                    {milestone.year.slice(2)}
                  </div>
                  {i !== 3 && <div className="h-full w-0.5 bg-slate-200 mt-2 min-h-[40px]" />}
                </div>
                <div className="pt-3">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{milestone.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{milestone.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="py-12 bg-slate-900 text-center text-slate-400 text-sm">
        <p>&copy; 2026 HealthAI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default About;
