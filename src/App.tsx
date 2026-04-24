/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ExternalLink, 
  Layers, 
  Users, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Github, 
  MessageSquare, 
  X, 
  Send,
  Loader2,
  Menu,
  ChevronRight,
  LayoutGrid
} from 'lucide-react';
import { ECOSYSTEM_PROJECTS, CATEGORIES, Project } from './constants';
import { GoogleGenAI } from "@google/genai";

// AI Assistant Component
function AIGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: "Welcome to the Base Nexus. I'm your AI guide to the Base ecosystem. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }), []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: "You are an expert on the Base network (Coinbase's Layer 2). You help users understand the ecosystem, identify top projects like Aerodrome and Warpcast, and explain how to bridge or build on Base. Be concise, professional, and helpful. Use a technical but approachable tone."
        }
      });

      const aiText = response.text || "I'm sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: 'ai', content: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "I'm having trouble connecting to my brain right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 sm:w-96 glass-panel rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[500px]"
          >
            <div className="p-4 bg-base-blue/10 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-base-blue animate-pulse" />
                <span className="font-mono text-sm font-bold tracking-tight uppercase">Base Nexus Guide</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
                    m.role === 'user' 
                      ? 'bg-base-blue text-white' 
                      : 'bg-white/5 border border-white/10 text-gray-200'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                    <Loader2 size={16} className="animate-spin text-base-blue" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-black/40">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Nexus anything..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-base-blue transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-base-blue hover:text-white transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-base-blue shadow-lg blue-glow flex items-center justify-center text-white hover:scale-105 transition-transform active:scale-95"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredProjects = useMemo(() => {
    return ECOSYSTEM_PROJECTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col data-grid overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 glass-panel border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-base-blue rounded-lg flex items-center justify-center">
              <Layers size={18} className="text-white" />
            </div>
            <span className="font-mono text-xl font-black tracking-tighter uppercase italic">Base Nexus</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-gray-400">
            <a href="#" className="hover:text-base-blue transition-colors">Ecosystem</a>
            <a href="#" className="hover:text-base-blue transition-colors">Developers</a>
            <a href="#" className="hover:text-base-blue transition-colors">Statistics</a>
            <a href="#" className="hover:text-base-blue transition-colors">Docs</a>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://github.com/base-org" className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">
              <Github size={20} />
            </a>
            <button className="md:hidden p-2 text-gray-400">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-3 rounded-2xl glass-panel text-base-blue font-mono text-xs uppercase tracking-[0.2em] inline-block"
          >
            Build your dreams on Base
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic mb-6 leading-none"
          >
            The Ecosystem <br />
            <span className="text-base-blue">Nexus</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl text-gray-400 text-lg md:text-xl mb-12 font-mono"
          >
            Discover, build, and explore the most vibrant L2 network on Ethereum. 
            Curated by the community, powered by Base.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search projects, protocols..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-base-blue focus:ring-1 focus:ring-base-blue transition-all"
              />
            </div>
          </motion.div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full max-w-5xl h-96 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-base-blue rounded-full blur-[120px]" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-[100px] animate-pulse" />
        </div>
      </header>

      {/* Stats Section */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">Global TVL</span>
            <span className="text-2xl font-black font-mono tracking-tight">$4.2B+</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">Total Projects</span>
            <span className="text-2xl font-black font-mono tracking-tight">1,200+</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">Daily Txns</span>
            <span className="text-2xl font-black font-mono tracking-tight">2.5M</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">Active Users</span>
            <span className="text-2xl font-black font-mono tracking-tight">450K</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-16 w-full">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl border font-mono text-[10px] uppercase tracking-widest transition-all ${
                selectedCategory === cat 
                  ? 'bg-base-blue border-base-blue text-white' 
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative"
              >
                <div className="h-full glass-panel p-6 rounded-2xl hover:border-base-blue/50 transition-colors flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden border border-white/10 group-hover:border-base-blue transition-colors">
                      <img 
                        src={project.icon} 
                        alt={project.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <a 
                      href={project.url} 
                      target="_blank" 
                      className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-base-blue hover:bg-base-blue/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold font-mono tracking-tight group-hover:text-base-blue transition-colors flex items-center gap-2">
                      {project.name}
                      {project.stats && (
                        <span className="text-[10px] bg-base-blue/10 text-base-blue px-2 py-0.5 rounded-full border border-base-blue/20">
                          {project.stats.value}
                        </span>
                      )}
                    </h3>
                    <p className="font-mono text-xs text-base-blue/60 uppercase tracking-widest mb-3 mt-1">
                      {project.category}
                    </p>
                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-600 uppercase tracking-tighter">Verified Protocol</span>
                    <button className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1 group/btn">
                      Explore <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProjects.length === 0 && (
          <div className="py-32 text-center">
            <LayoutGrid size={48} className="mx-auto text-white/5 mb-4" />
            <p className="text-gray-500 font-mono italic">No projects found matching your criteria</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 bg-black/50 py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-base-blue rounded-lg flex items-center justify-center">
                <Layers size={18} className="text-white" />
              </div>
              <span className="font-mono text-xl font-black tracking-tighter uppercase italic">Base Nexus</span>
            </div>
            <p className="text-gray-500 max-w-sm mb-6 leading-relaxed">
              An community-driven registry for the Base network. Empowering builders and users to navigate the L2 revolution.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Globe size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><MessageSquare size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><ShieldCheck size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-white mb-6">Ecosystem</h4>
            <ul className="space-y-4 text-xs font-mono text-gray-500">
              <li><a href="#" className="hover:text-base-blue transition-colors">DEFI HUB</a></li>
              <li><a href="#" className="hover:text-base-blue transition-colors">NFT GALLERY</a></li>
              <li><a href="#" className="hover:text-base-blue transition-colors">SOCIAL PROTOCOLS</a></li>
              <li><a href="#" className="hover:text-base-blue transition-colors">BRIDGES</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-white mb-6">Resources</h4>
            <ul className="space-y-4 text-xs font-mono text-gray-500">
              <li><a href="https://docs.base.org" className="hover:text-base-blue transition-colors">DOCUMENTATION</a></li>
              <li><a href="https://faucet.base.org" className="hover:text-base-blue transition-colors">FAUCET</a></li>
              <li><a href="#" className="hover:text-base-blue transition-colors">DEVELOPER PORTAL</a></li>
              <li><a href="#" className="hover:text-base-blue transition-colors">BRAND ASSETS</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-[10px] font-mono text-gray-600 uppercase tracking-[0.2em]">
          <span>© 2024 BASE NEXUS PROJECT</span>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* AI Assistant */}
      <AIGuide />
    </div>
  );
}
