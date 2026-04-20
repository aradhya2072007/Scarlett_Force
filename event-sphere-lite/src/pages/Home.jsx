import React, { useState, useMemo, useEffect } from 'react';
import { mockEvents, filterCategories } from '../data/events';
import EventCard from '../components/EventCard';
import FilterSidebar from '../components/FilterSidebar';
import { Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Home() {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('eventSphereFilters');
    if (saved) {
      try {
        setSelectedFilters(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse filters', e);
      }
    }
  }, []);

  // Save to local storage when filters change
  useEffect(() => {
    localStorage.setItem('eventSphereFilters', JSON.stringify(selectedFilters));
  }, [selectedFilters]);

  const toggleFilter = (filter) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  const filteredEvents = useMemo(() => {
    return mockEvents.filter(event => {
      // Search text match
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            event.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      // If no filters selected, show all
      if (selectedFilters.length === 0) return true;

      const eventTags = [...event.tags, event.price, event.eventType, event.category];
      
      // Group active filters by category
      const activeGroups = {};
      
      selectedFilters.forEach(filter => {
        // Find which category this filter belongs to
        for (const [categoryKey, options] of Object.entries(filterCategories)) {
          if (options.includes(filter)) {
            if (!activeGroups[categoryKey]) activeGroups[categoryKey] = [];
            activeGroups[categoryKey].push(filter);
            break;
          }
        }
      });

      // For the event to pass, it must satisfy ALL active filter groups.
      for (const [categoryKey, selectedOptions] of Object.entries(activeGroups)) {
        const matchesCategory = selectedOptions.some(option => eventTags.includes(option));
        if (!matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [selectedFilters, searchQuery]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-24 h-[calc(100vh-8rem)]">
          <FilterSidebar 
            selectedFilters={selectedFilters} 
            toggleFilter={toggleFilter} 
            clearFilters={clearFilters} 
          />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-50 lg:hidden pb-10"
            >
              <div className="p-4 flex justify-between items-center border-b lg:hidden">
                <h2 className="font-bold text-lg">Filters</h2>
                <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <FilterSidebar 
                selectedFilters={selectedFilters} 
                toggleFilter={toggleFilter} 
                clearFilters={clearFilters}
                closeMobileSidebar={() => setIsMobileSidebarOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Search Bar - Mobile/Tablet only since desktop header search might be inaccessible or we just keep it here for simplicity in this component */}
        <div className="mb-6 md:hidden">
          <input 
            type="text" 
            placeholder="Search events..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm transition-all outline-none"
          />
        </div>

        {/* Active Filters Display */}
        {selectedFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm font-medium text-slate-500 mr-2">Active Filters:</span>
            <AnimatePresence>
              {selectedFilters.map(filter => (
                <motion.span 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  key={filter} 
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full cursor-pointer hover:bg-red-100 hover:text-red-800 transition-colors group"
                  onClick={() => toggleFilter(filter)}
                >
                  {filter}
                  <X size={14} className="text-emerald-600 group-hover:text-red-600" />
                </motion.span>
              ))}
            </AnimatePresence>
            <button 
              onClick={clearFilters}
              className="text-sm text-slate-500 hover:text-emerald-600 underline ml-2 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'} Found
          </h2>
          <button 
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            <Menu size={18} />
            Filters
          </button>
        </div>

        {/* Grid */}
        {filteredEvents.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredEvents.map(event => (
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-dashed border-slate-300 text-center"
          >
            <div className="bg-slate-50 p-4 rounded-full mb-4">
              <Sparkles size={32} className="text-emerald-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No events found</h3>
            <p className="text-slate-500 max-w-sm mb-6 leading-relaxed">
              We couldn't find any events matching your selected personality or interest filters. Try adjusting them!
            </p>
            <button 
              onClick={clearFilters}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </div>
    </main>
  );
}

export default Home;
