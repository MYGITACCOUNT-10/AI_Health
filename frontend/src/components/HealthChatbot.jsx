import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, BrainCircuit, Loader2 } from 'lucide-react';
import api from '../api/axios';

const HealthChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm HealthAI. I've reviewed your medical vault. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    // Fetch initial chat history
    api.get('/ai-engine/chat/')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const formattedMessages = res.data.map(msg => ({ role: msg.role, text: msg.text }));
          setMessages(formattedMessages);
        }
      })
      .catch(err => console.error("Error fetching chat history:", err));
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/ai-engine/chat/', { question: userMessage.text });
      setMessages(prev => [...prev, { role: 'assistant', text: response.data.answer }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', text: "I'm sorry, I'm having trouble connecting to my knowledge base right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 h-16 w-16 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-blue-700 transition-colors z-50 group"
          >
            <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
            <MessageSquare className="h-7 w-7 group-hover:scale-110 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden h-[500px]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 flex justify-between items-center text-white shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/30">
                  <BrainCircuit className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold leading-tight">HealthAI</h3>
                  <div className="flex items-center gap-1.5 text-xs text-blue-100">
                    <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    Online
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-slate-50 p-4 overflow-y-auto scrollbar-thin flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-3 shadow-sm">
                    <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2 items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your health..."
                className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl px-4 py-2 text-sm outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="h-10 w-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-sm shadow-blue-500/20"
              >
                <Send className="h-4 w-4 ml-1" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HealthChatbot;
