'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getEvents, getRecommendations } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import EventCard from '@/components/EventCard';
import { Search, SlidersHorizontal, Loader2, Sparkles, FilterX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['all', 'tech', 'music', 'sports', 'art', 'networking', 'food', 'wellness', 'gaming'];

export default function Events() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiMode, setAiMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      if (aiMode && user?.quizCompleted) {
        const { data } = await getRecommendations();
        setEvents(data.recommendations || []);
      } else {
        const params = {};
        if (category !== 'all') params.category = category;
        if (search) params.search = search;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        
        const { data } = await getEvents(params);
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [aiMode, user, category, search, minPrice, maxPrice]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchEvents();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [fetchEvents]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Explore <span className="gradient-text">Events</span>
          </h1>
          <p className="text-slate-400 text-sm">Discover the best experiences around the globe.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* AI Toggle */}
          {user?.quizCompleted && (
            <button
              onClick={() => setAiMode(!aiMode)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                aiMode 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20 ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900' 
                  : 'glass text-slate-300 hover:text-white border-white/10'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${aiMode ? 'animate-pulse' : ''}`} />
              For You (AI)
            </button>
          )}

          <button
            onClick={() => { setShowFilters(!showFilters); if(aiMode) setAiMode(false); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              showFilters && !aiMode ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'glass text-slate-300 border-white/10 hover:bg-white/5'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && !aiMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="glass p-6 rounded-2xl border border-white/10 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search titles, tags..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field pl-9 bg-slate-900/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field bg-slate-900/50 appearance-none"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Price Range ($)</label>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="input-field bg-slate-900/50 px-2" />
                  <span className="text-slate-500">-</span>
                  <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="input-field bg-slate-900/50 px-2" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event, idx) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(idx * 0.05, 0.5) }}
            >
              <EventCard 
                event={event} 
                score={event.recommendationScore}
                showScore={aiMode}
                savedIds={user?.savedEvents?.map(e => e._id || e) || []}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center glass rounded-3xl border border-white/5">
          <FilterX className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-300 mb-2">No events found</h3>
          <p className="text-slate-500">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
}
