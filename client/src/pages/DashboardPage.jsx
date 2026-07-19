import { useState, useEffect } from 'react';
import { Flame, TrendingDown, ArrowUpRight, CheckCircle, Leaf, Share2, Target, Plus, X, Download, Copy, Save } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for the chart
const mockData24h = Array.from({ length: 24 }).map((_, i) => ({
  time: `${i}:00`,
  kwh: Number((Math.random() * 2 + 0.5).toFixed(2))
}));

export default function DashboardPage({ user }) {
  const [usageData, setUsageData] = useState(mockData24h);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'report', 'goal', 'log', 'share'
  const [modalInput, setModalInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, role: 'ai', text: "Hi there! I'm your AI Energy Assistant. Ask me how to save power or type 'tips' to get your daily recommendations!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { id: Date.now(), role: 'user', text: userMsg }]);
    setIsChatting(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/recommendations/chat', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      
      setChatMessages(prev => [...prev, { 
        id: Date.now(), 
        role: 'ai', 
        text: data.success ? data.response : "Sorry, I couldn't process that right now." 
      }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { 
        id: Date.now(), 
        role: 'ai', 
        text: "Error connecting to AI brain. Please try again later." 
      }]);
    }
    setIsChatting(false);
  };

  const handleShareProgress = async () => {
    const text = `I've saved 45 lbs of CO2 and maintained a ${user?.current_streak || 3}-day streak on PowerSaver AI! 🌍⚡`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My PowerSaver Progress', text: text });
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      setModalInput(text);
      setActiveModal('share');
    }
  };

  const handleSetGoal = () => {
    setModalInput('');
    setActiveModal('goal');
  };

  const submitGoal = () => {
    if (modalInput && !isNaN(modalInput)) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setActiveModal(null);
      }, 800);
    }
  };

  const handleLogReading = () => {
    setModalInput('');
    setActiveModal('log');
  };

  const submitLogReading = async () => {
    if (modalInput && !isNaN(modalInput)) {
      setIsSubmitting(true);
      try {
        const token = localStorage.getItem('token');
        await fetch('http://localhost:5000/api/usage/ingest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ kwh: parseFloat(modalInput) })
        });
        setActiveModal(null);
      } catch (err) {
        alert('Failed to log reading.');
      }
      setIsSubmitting(false);
    }
  };

  const handleViewReport = () => setActiveModal('report');
  const handleDownloadPDF = () => window.print();



  const copyToClipboard = () => {
    navigator.clipboard.writeText(modalInput);
    setActiveModal(null);
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Dynamic Modals */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 ${activeModal === 'report' ? 'print:bg-white print:fixed print:inset-0 print:z-[9999]' : ''}`}
            onClick={() => setActiveModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className={`bg-white rounded-2xl shadow-2xl w-full overflow-hidden flex flex-col ${activeModal === 'report' ? 'max-w-lg print:shadow-none print:w-full print:max-w-none' : 'max-w-md'}`}
              onClick={e => e.stopPropagation()}
            >
              <div className={`${activeModal === 'report' ? 'bg-primary text-white print:bg-white print:text-black print:border-b' : 'bg-gray-50 border-b border-gray-200 text-gray-900'} p-6 flex justify-between items-center`}>
                <div className="flex items-center">
                  {activeModal === 'report' && <Leaf className="h-6 w-6 mr-2" />}
                  {activeModal === 'log' && <Plus className="h-6 w-6 text-primary mr-2" />}
                  {activeModal === 'goal' && <Target className="h-6 w-6 text-accent mr-2" />}
                  {activeModal === 'share' && <Share2 className="h-6 w-6 text-blue-500 mr-2" />}
                  <h2 className="text-xl font-bold">
                    {activeModal === 'report' && 'Environmental Impact Report'}
                    {activeModal === 'log' && 'Log Energy Reading'}
                    {activeModal === 'goal' && 'Set New Energy Goal'}
                    {activeModal === 'share' && 'Share Your Progress'}
                  </h2>
                </div>
                <button onClick={() => setActiveModal(null)} className={`${activeModal === 'report' ? 'text-white/80 hover:text-white print:hidden' : 'text-gray-400 hover:text-gray-600'}`}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6">
                
                {/* Report Content */}
                {activeModal === 'report' && (
                  <div className="space-y-6">
                    <div className="text-center pb-6 border-b border-gray-100">
                      <p className="text-gray-500 mb-1">Prepared for</p>
                      <p className="text-2xl font-bold text-gray-900">{user?.name || 'Student'}</p>
                      <p className="text-sm text-gray-400">{user?.dorm || 'Campus'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-xl text-center print:border">
                        <p className="text-4xl font-black text-primary mb-1">45<span className="text-lg">lbs</span></p>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">CO2 Saved</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl text-center print:border">
                        <p className="text-4xl font-black text-green-500 mb-1">2</p>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Trees Planted</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl text-center col-span-2 print:border">
                        <p className="text-4xl font-black text-accent mb-1">12%</p>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Energy Reduction vs Campus Avg</p>
                      </div>
                    </div>
                    <div className="pt-4 flex justify-end space-x-3 print:hidden">
                      <button onClick={() => setActiveModal(null)} className="btn-secondary">Close</button>
                      <button onClick={handleDownloadPDF} className="btn-primary flex items-center">
                        <Download className="h-4 w-4 mr-2" /> Download PDF
                      </button>
                    </div>
                  </div>
                )}

                {/* Log & Goal Content */}
                {(activeModal === 'log' || activeModal === 'goal') && (
                  <div className="space-y-4">
                    <p className="text-gray-600 text-sm">
                      {activeModal === 'log' ? 'Enter your current meter reading below to track your usage.' : 'Set a new target to challenge yourself and earn more coins!'}
                    </p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {activeModal === 'log' ? 'Meter Reading (kWh)' : 'Target Usage (kWh)'}
                      </label>
                      <input 
                        type="number" 
                        className="input-field w-full text-lg" 
                        placeholder="e.g. 150"
                        value={modalInput}
                        onChange={(e) => setModalInput(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="pt-4 flex justify-end space-x-3">
                      <button onClick={() => setActiveModal(null)} className="btn-secondary">Cancel</button>
                      <button 
                        onClick={activeModal === 'log' ? submitLogReading : submitGoal} 
                        disabled={isSubmitting || !modalInput}
                        className={`${activeModal === 'goal' ? 'bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors' : 'btn-primary'} flex items-center disabled:opacity-50`}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isSubmitting ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Share Content */}
                {activeModal === 'share' && (
                  <div className="space-y-4">
                    <p className="text-gray-600 text-sm">Copy this message and share it with your friends!</p>
                    <textarea 
                      className="input-field w-full resize-none h-32 text-gray-700" 
                      value={modalInput}
                      readOnly
                    />
                    <div className="pt-4 flex justify-end space-x-3">
                      <button onClick={() => setActiveModal(null)} className="btn-secondary">Close</button>
                      <button onClick={copyToClipboard} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy to Clipboard
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card bg-gradient-to-br from-white to-orange-50 border-orange-100 flex items-center p-6">
          <div className="h-16 w-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center shadow-inner">
            <Flame className="h-8 w-8 animate-pulse" />
          </div>
          <div className="ml-6">
            <p className="text-sm font-medium text-gray-500">Current Streak</p>
            <div className="flex items-baseline">
              <span className="text-4xl font-black text-gray-900">{user?.current_streak || 3}</span>
              <span className="ml-2 text-lg font-medium text-gray-500">days</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="card flex flex-col justify-center">
          <p className="text-sm font-medium text-gray-500">This Week's Savings</p>
          <div className="mt-2 flex items-baseline">
            <span className="text-4xl font-black text-primary">-12%</span>
          </div>
          <div className="mt-1 flex items-center text-sm text-primary font-medium">
            <TrendingDown className="h-4 w-4 mr-1" />
            vs last week
          </div>
        </motion.div>

        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="card flex flex-col justify-center">
          <p className="text-sm font-medium text-gray-500">Leaderboard Rank</p>
          <div className="mt-2 flex items-baseline">
            <span className="text-4xl font-black text-gray-900">#42</span>
            <span className="ml-2 text-sm font-medium text-gray-500">/ 350</span>
          </div>
          <div className="mt-1 flex items-center text-sm text-green-500 font-medium">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            Up 5 spots
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart Area */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Live Power Usage</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm font-medium bg-primary text-white rounded-md">24h</button>
              <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors">7d</button>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorKwh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22A06B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22A06B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                />
                <Area type="monotone" dataKey="kwh" stroke="#22A06B" strokeWidth={3} fillOpacity={1} fill="url(#colorKwh)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Chatbot Panel */}
        <div className="card p-0 flex flex-col bg-gradient-to-b from-white to-primary-light/10 border-primary/20 h-[22rem] overflow-hidden">
          <div className="p-4 border-b border-primary/10 flex items-center justify-between bg-white/50">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                <Flame className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">AI Assistant</h2>
            </div>
            <div className="bg-primary-light text-primary text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">Smart</div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isChatting && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex space-x-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-white border-t border-gray-100">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask me anything..." 
                className="flex-1 input-field py-2 text-sm"
              />
              <button 
                type="submit" 
                disabled={!chatInput.trim() || isChatting} 
                className="bg-primary hover:bg-primary-dark text-white px-4 rounded-lg flex items-center justify-center disabled:opacity-50 transition-colors"
              >
                <ArrowUpRight className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Action & Impact Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={handleLogReading} className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary-light/20 transition-all text-gray-700 hover:text-primary group">
              <div className="h-10 w-10 bg-gray-50 group-hover:bg-primary-light rounded-full flex items-center justify-center mb-2">
                <Plus className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">Log Reading</span>
            </button>
            <button onClick={handleSetGoal} className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-accent hover:bg-accent-light/20 transition-all text-gray-700 hover:text-accent group">
              <div className="h-10 w-10 bg-gray-50 group-hover:bg-accent-light rounded-full flex items-center justify-center mb-2">
                <Target className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">Set Goal</span>
            </button>
            <button onClick={handleShareProgress} className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-gray-700 hover:text-blue-500 group sm:col-span-2">
              <div className="flex items-center space-x-2">
                <Share2 className="h-5 w-5" />
                <span className="text-sm font-medium">Share Progress</span>
              </div>
            </button>
          </div>
        </div>

        <div className="card p-6 bg-primary text-white overflow-hidden relative border-none">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Leaf className="h-48 w-48 -mr-10 -mt-10" />
          </div>
          <h2 className="text-xl font-bold mb-2 relative z-10">Your Impact</h2>
          <p className="text-primary-light mb-8 relative z-10 text-sm">This semester's energy savings translated to real-world impact.</p>
          
          <div className="grid grid-cols-2 gap-6 relative z-10 mb-6">
            <div>
              <p className="text-4xl font-black mb-1">45</p>
              <p className="text-xs font-bold text-primary-light uppercase tracking-wider">lbs CO2 Saved</p>
            </div>
            <div>
              <p className="text-4xl font-black mb-1">2</p>
              <p className="text-xs font-bold text-primary-light uppercase tracking-wider">Trees Planted</p>
            </div>
          </div>
          
          <button onClick={handleViewReport} className="w-full bg-white text-primary font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors shadow-sm relative z-10">
            View Full Report
          </button>
        </div>
      </div>
    </div>
  );
}
