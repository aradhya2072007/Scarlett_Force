import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockEvents } from '../data/events';
import EventCard from '../components/EventCard';
import { useSavedEvents } from '../context/SavedEventsContext';

function SavedEvents() {
  const { savedEventIds } = useSavedEvents();
  
  const savedEvents = mockEvents.filter(event => savedEventIds.includes(event.id));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <Link 
            to="/profile" 
            className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors mb-4 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Profile</span>
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
            <Bookmark size={32} className="text-emerald-500" fill="currentColor" />
            Saved for Later
          </h1>
          <p className="text-slate-500 mt-2">
            You have {savedEvents.length} {savedEvents.length === 1 ? 'event' : 'events'} saved in your list.
          </p>
        </div>
        
        {savedEvents.length > 0 && (
          <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 flex items-center gap-3 text-emerald-700 font-medium">
            <Sparkles size={20} />
            Premium Event Access
          </div>
        )}
      </div>

      {/* Content Area */}
      {savedEvents.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {savedEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onClick={(e) => console.log('View Event:', e)} 
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 px-6 bg-white rounded-[3rem] border border-dashed border-slate-300 text-center"
        >
          <div className="bg-slate-50 p-6 rounded-full mb-6">
            <Bookmark size={48} className="text-slate-300" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Your list is empty</h3>
          <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
            You haven't saved any events yet. Start exploring and bookmark the ones that catch your eye!
          </p>
          <Link 
            to="/"
            className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95"
          >
            Explore Events
          </Link>
        </motion.div>
      )}
    </main>
  );
}

export default SavedEvents;
