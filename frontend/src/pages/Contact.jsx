import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import NavbarPublic from '../components/NavbarPublic';

const Contact = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <NavbarPublic />
      
      <section className="pt-32 pb-16 px-4 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Get in Touch</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our support team is available 24/7 to assist you with any questions about the HealthAI platform, your appointments, or our enterprise solutions.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 max-w-7xl mx-auto flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-6">
              <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 shrink-0">
                <MapPin className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Our Headquarters</h3>
                <p className="text-slate-600 leading-relaxed">
                  HealthAI Global Center<br />
                  120 Medical Innovation Way<br />
                  Silicon Valley, CA 94025
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-6">
              <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 shrink-0">
                <Phone className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Phone Support</h3>
                <p className="text-slate-600 leading-relaxed">
                  Emergency: +1 (800) 123-EMER<br />
                  Support: +1 (800) 987-HELP<br />
                  Mon-Fri, 8:00 AM - 8:00 PM EST
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-6">
              <div className="bg-purple-50 p-4 rounded-2xl text-purple-600 shrink-0">
                <Mail className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Email Us</h3>
                <p className="text-slate-600 leading-relaxed">
                  support@healthai.com<br />
                  enterprise@healthai.com<br />
                  careers@healthai.com
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">First Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Last Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Message</label>
                <textarea rows="4" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <Send className="h-5 w-5" />
                Send Message
              </button>
            </form>
          </motion.div>

        </div>
        
        {/* Map Placeholder */}
        <div className="mt-16 bg-slate-100 w-full h-96 rounded-3xl border border-slate-200 overflow-hidden relative flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] opacity-20" />
          <div className="text-center relative z-10">
            <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-slate-600">Google Maps Integration Placeholder</p>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-slate-900 text-center text-slate-400 text-sm mt-auto">
        <p>&copy; 2026 HealthAI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Contact;
