import React from 'react';
import { Calendar, MapPin, Tag, Bookmark, CheckCircle2, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSavedEvents } from '../context/SavedEventsContext';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event, onClick }) => {
  const { toggleSave, isSaved } = useSavedEvents();
  const { isJoined, joinEvent } = useUser();
  const navigate = useNavigate();
  
  const saved = isSaved(event.id);
  const joined = isJoined(event.id);

  const handleSave = (e) => {
    e.stopPropagation();
    toggleSave(event.id);
  };

  const handleJoin = (e) => {
    e.stopPropagation();
    joinEvent(event.id);
  };

  const handleChat = (e) => {
    e.stopPropagation();
    navigate('/messages', { state: { host: event.host } });
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case 'Workshop': return 'bg-purple-500/80';
      case 'Meetup': return 'bg-blue-500/80';
      case 'Party': return 'bg-pink-500/80';
      case 'Conference': return 'bg-amber-500/80';
      default: return 'bg-emerald-500/80';
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer relative flex flex-col h-full"
      onClick={() => onClick(event)}
    >
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-emerald-700 shadow-sm">
          {event.price}
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          <div className={`${getBadgeColor(event.eventType)} backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm ring-1 ring-white/20 min-w-[70px] h-6 flex items-center justify-center text-center uppercase tracking-wider`}>
            {event.eventType}
          </div>
          <button 
            onClick={handleSave}
            className={`w-6 h-6 flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 shadow-lg active:scale-90 ${
              saved 
              ? 'bg-emerald-600 text-white' 
              : 'bg-white/80 text-emerald-600 hover:bg-emerald-500 hover:text-white'
            }`}
          >
            <Bookmark size={12} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-medium">
          <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><MapPin size={14} /> {event.location}</span>
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1">{event.title}</h3>
        <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {event.description}
        </p>
        
        <div className="flex flex-wrap gap-1.5 mb-6">
          {event.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="inline-flex items-center gap-1 text-[10px] font-medium bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md">
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={event.host.avatar} className="w-6 h-6 rounded-full border border-emerald-100" alt={event.host.name} />
            <span className="text-[10px] text-slate-400 font-medium">Hosted by <span className="text-slate-600 font-semibold">{event.host.name}</span></span>
          </div>
          
          {joined ? (
            <button 
              onClick={handleChat}
              className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5 active:scale-95 ring-1 ring-emerald-200"
            >
              <MessageSquare size={14} />
              Ask Host
            </button>
          ) : (
            <button 
              onClick={handleJoin}
              className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5 active:scale-95"
            >
              Join
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
