import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MessageSquare, 
  Phone, 
  Video, 
  Info, 
  Image as ImageIcon, 
  Heart, 
  Camera, 
  Mic, 
  ChevronLeft,
  PenSquare
} from 'lucide-react';
import { useUser } from '../context/UserContext';

function Messages() {
  const location = useLocation();
  const navigate = useNavigate();
  const { conversations, sendMessage } = useUser();
  const [selectedConv, setSelectedConv] = useState(null);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConv?.messages]);

  useEffect(() => {
    if (location.state?.host) {
      const host = location.state.host;
      const existing = conversations.find(c => c.hostId === host.id);
      if (existing) {
        setSelectedConv(existing);
      } else {
        setSelectedConv({ 
          hostId: host.id, 
          hostName: host.name, 
          hostAvatar: host.avatar, 
          messages: [] 
        });
      }
    } else if (conversations.length > 0 && !selectedConv) {
      setSelectedConv(conversations[0]);
    }
  }, [location.state, conversations]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || !selectedConv) return;
    
    sendMessage(selectedConv.hostId, selectedConv.hostName, selectedConv.hostAvatar, inputText);
    setInputText('');
    
    // Auto-reply simulation
    setTimeout(() => {
      sendMessage(selectedConv.hostId, selectedConv.hostName, selectedConv.hostAvatar, "Hey! Thanks for reaching out. See you at the event!", false);
    }, 2000);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="flex h-[calc(100vh-65px)] bg-white overflow-hidden">
      {/* Sidebar */}
      <div className={`w-full md:w-[350px] flex flex-col border-r border-slate-200 transition-all ${selectedConv ? 'hidden md:flex' : 'flex'}`}>
        <div className="h-[60px] px-5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <button onClick={handleBack} className="p-1 -ml-1 hover:bg-slate-100 rounded-full transition-colors">
              <ChevronLeft size={24} className="text-slate-800" />
            </button>
            <span className="text-xl font-bold tracking-tight">Direct</span>
          </div>
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <PenSquare size={22} className="text-slate-800" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {conversations.length > 0 ? (
            conversations.map((conv) => (
              <button
                key={conv.hostId}
                onClick={() => setSelectedConv(conv)}
                className={`w-full flex items-center gap-3 px-5 py-3 transition-colors ${selectedConv?.hostId === conv.hostId ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                    <img src={conv.hostAvatar} className="w-full h-full rounded-full border-2 border-white object-cover" alt="" />
                  </div>
                  <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <p className="font-semibold text-[15px] text-slate-900 truncate">{conv.hostName}</p>
                  <p className="text-xs text-slate-500 truncate font-normal">Active {Math.floor(Math.random() * 60)}m ago</p>
                </div>
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400">
              <div className="p-4 rounded-full bg-slate-50 mb-4 text-slate-300">
                <MessageSquare size={40} />
              </div>
              <p className="text-sm font-medium text-slate-600">No messages yet</p>
              <p className="text-xs text-slate-400 mt-1 text-center leading-relaxed">Join an event to start communicating with hosts!</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col bg-white ${!selectedConv ? 'hidden md:flex' : 'flex'}`}>
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="h-[60px] px-5 border-b border-slate-200 flex items-center justify-between bg-white/80 backdrop-blur-sm z-10">
              <div className="flex items-center gap-3">
                <button className="md:hidden p-1 -ml-2 hover:bg-slate-100 rounded-full" onClick={() => setSelectedConv(null)}>
                  <ChevronLeft size={24} className="text-slate-800" />
                </button>
                <img src={selectedConv.hostAvatar} className="w-8 h-8 rounded-full border border-slate-200" alt="" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-tight flex items-center gap-1.5 cursor-pointer">
                    {selectedConv.hostName}
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">Active today</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-700">
                  <Phone size={22} strokeWidth={1.8} />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-700">
                  <Video size={22} strokeWidth={1.8} />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-700">
                  <Info size={22} strokeWidth={1.8} />
                </button>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-3 bg-[#fafafa]">
              <div className="flex flex-col items-center py-10">
                <img src={selectedConv.hostAvatar} className="w-24 h-24 rounded-full border-2 border-white shadow-sm mb-3" alt="" />
                <h4 className="text-xl font-bold text-slate-900">{selectedConv.hostName}</h4>
                <p className="text-sm text-slate-500 mb-6">Host • EventSphere Pro</p>
                <button className="px-5 py-1.5 bg-white border border-slate-300 text-slate-900 font-semibold text-xs rounded-md shadow-sm hover:bg-slate-50 transition-all">View Profile</button>
              </div>

              {selectedConv.messages?.map((msg, i) => {
                const isFirst = i === 0 || selectedConv.messages[i-1].isFromUser !== msg.isFromUser;
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    key={msg.id} 
                    className={`flex ${msg.isFromUser ? 'justify-end' : 'justify-start'} ${isFirst ? 'mt-6' : 'mt-0.5'}`}
                  >
                    {!msg.isFromUser && (
                      <div className="w-8 mr-2 flex-shrink-0 self-end">
                        {isFirst && <img src={selectedConv.hostAvatar} className="w-7 h-7 rounded-full" alt="" />}
                      </div>
                    )}
                    <div className={`max-w-[70%] px-4 py-2.5 text-[15px] leading-relaxed break-words
                      ${msg.isFromUser 
                        ? 'bg-gradient-to-tr from-[#3797f0] to-[#c058f4] text-white rounded-[18px] rounded-br-[4px]' 
                        : 'bg-[#efefef] text-slate-900 rounded-[18px] rounded-bl-[4px] ml-0'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="max-w-4xl mx-auto border border-slate-200 rounded-full flex items-center px-4 py-2.5 bg-white shadow-sm focus-within:shadow-md transition-shadow">
                <button className="p-1 px-2 text-blue-500 hover:opacity-75 transition-opacity">
                  <ImageIcon size={22} strokeWidth={1.8} />
                </button>
                <input 
                  type="text" 
                  placeholder="Message..." 
                  value={inputText} 
                  onChange={(e) => setInputText(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                  className="flex-1 bg-transparent border-none outline-none text-[15px] px-3 text-slate-900 placeholder:text-slate-400" 
                />
                <div className="flex items-center gap-3 mr-1">
                  {inputText.trim() ? (
                    <button onClick={handleSend} className="text-[#0095f6] font-bold text-[14px] hover:text-blue-700 transition-colors px-2">Send</button>
                  ) : (
                    <div className="flex items-center gap-4 text-slate-700 pr-2">
                      <button className="hover:opacity-60 transition-opacity"><Mic size={22} strokeWidth={1.8} /></button>
                      <button className="hover:opacity-60 transition-opacity"><Heart size={22} strokeWidth={1.8} /></button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 bg-[#fafafa]">
             <div className="p-6 rounded-full border-2 border-slate-900/10 text-slate-900 mb-6">
                <MessageSquare size={54} strokeWidth={1} />
             </div>
             <h3 className="text-2xl font-semibold text-slate-900">Your Messages</h3>
             <p className="text-slate-500 mt-2 mb-8">Send private photos and messages to a friend or group.</p>
             <button className="bg-[#0095f6] hover:bg-[#1877f2] text-white px-5 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
                Send Message
             </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
