import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { mockEvents, filterCategories } from '../data/events';
import EventCard from '../components/EventCard';
import FilterSidebar from '../components/FilterSidebar';
import EventDetailModal from '../components/EventDetailModal';
import { Menu, X, Sparkles, LayoutGrid, MapPin as MapPinIcon, Navigation, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet marker icons for Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const categoryColors = {
  Tech: '#10b981',
  Music: '#8b5cf6',
  Art: '#f59e0b',
  Sports: '#3b82f6',
  Networking: '#ec4899',
};

function createCategoryIcon(category) {
  const color = categoryColors[category] || '#64748b';
  return L.divIcon({
    className: '',
    html: `<div style="width:30px;height:30px;background:${color};border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -32],
  });
}

const locationIcon = L.divIcon({
  className: '',
  html: `<div style="position:relative;width:20px;height:20px;"><div style="position:absolute;inset:0;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(59,130,246,0.3);animation:pulse-ring 2s infinite;"></div></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -12],
});

// LocateMe control — must live INSIDE MapContainer to use useMap()
function LocateMeControl({ userPos, setUserPos, locating, setLocating, setLocateError }) {
  const map = useMap();
  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      setLocateError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserPos({ lat: coords.latitude, lng: coords.longitude, accuracy: coords.accuracy });
        map.flyTo([coords.latitude, coords.longitude], 13, { duration: 1.4 });
        setLocating(false);
      },
      () => {
        setLocating(false);
        setLocateError('Location access denied. Please allow location in your browser.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [map, setUserPos, setLocating, setLocateError]);

  return (
    <div className="leaflet-top leaflet-right" style={{ marginTop: '60px' }}>
      <div className="leaflet-control leaflet-bar" style={{ border: 'none', boxShadow: 'none' }}>
        <button
          onClick={handleLocate}
          disabled={locating}
          title="Show my location"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '36px', height: '36px',
            background: userPos ? '#3b82f6' : 'white',
            border: '2px solid rgba(0,0,0,0.2)',
            borderRadius: '6px',
            cursor: locating ? 'wait' : 'pointer',
            color: userPos ? 'white' : '#1e293b',
          }}
        >
          {locating
            ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            : <Navigation size={16} />}
        </button>
      </div>
    </div>
  );
}

// Inline map panel that shows filtered events
function ExploreMapPanel({ filteredEvents, onEventClick }) {
  const [userPos, setUserPos] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState(null);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
      {/* Error toast */}
      <AnimatePresence>
        {locateError && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="absolute top-3 left-1/2 -translate-x-1/2 z-[1200] bg-red-600 text-white text-xs px-4 py-2 rounded-xl shadow-lg flex items-center gap-2"
          >
            {locateError}
            <button onClick={() => setLocateError(null)}><X size={13} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location badge */}
      {userPos && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-3 left-3 z-[1100] bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow flex items-center gap-1.5"
        >
          <Navigation size={11} /> Showing your location
        </motion.div>
      )}

      <MapContainer
        center={[30, 0]}
        zoom={2}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredEvents.map(event => (
          <Marker
            key={event.id}
            position={[event.lat, event.lng]}
            icon={createCategoryIcon(event.category)}
            eventHandlers={{ click: () => onEventClick(event) }}
          >
            <Popup>
              <div className="min-w-[170px]">
                <p className="font-bold text-sm text-slate-800 leading-tight mb-1">{event.title}</p>
                <p className="text-xs text-slate-500">📍 {event.location}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  📅 {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold ${event.price === 'Free' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {event.price}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}

        {userPos && (
          <>
            <Marker position={[userPos.lat, userPos.lng]} icon={locationIcon}>
              <Popup><span className="font-semibold text-blue-600 text-sm flex items-center gap-1"><Navigation size={13} /> You are here</span></Popup>
            </Marker>
            <Circle
              center={[userPos.lat, userPos.lng]}
              radius={userPos.accuracy || 100}
              pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.08, weight: 1.5 }}
            />
          </>
        )}

        <LocateMeControl
          userPos={userPos}
          setUserPos={setUserPos}
          locating={locating}
          setLocating={setLocating}
          setLocateError={setLocateError}
        />
      </MapContainer>

      {/* Category legend */}
      <div className="absolute bottom-4 left-4 z-[1100] bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-slate-100">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Category</p>
        <div className="flex flex-col gap-1.5">
          {Object.entries(categoryColors).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-1.5 text-xs">
              <span style={{ background: color }} className="w-2.5 h-2.5 rounded-full flex-shrink-0" />
              <span className="text-slate-700 font-medium">{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Events count badge */}
      <div className="absolute top-3 right-12 z-[1100] bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow border border-slate-100">
        {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} shown
      </div>
    </div>
  );
}

// ─── Main Explore component ──────────────────────────────────────────────────
function Explore() {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'

  useEffect(() => {
    const saved = localStorage.getItem('eventSphereFilters');
    if (saved) {
      try { setSelectedFilters(JSON.parse(saved)); } catch (e) { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('eventSphereFilters', JSON.stringify(selectedFilters));
  }, [selectedFilters]);

  const toggleFilter = (filter) => {
    setSelectedFilters(prev => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]);
  };
  const clearFilters = () => setSelectedFilters([]);

  const filteredEvents = useMemo(() => {
    return mockEvents.filter(event => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (selectedFilters.length === 0) return true;
      const eventTags = [...event.tags, event.price, event.eventType, event.category];
      const activeGroups = {};
      selectedFilters.forEach(filter => {
        for (const [key, options] of Object.entries(filterCategories)) {
          if (options.includes(filter)) {
            if (!activeGroups[key]) activeGroups[key] = [];
            activeGroups[key].push(filter);
            break;
          }
        }
      });
      for (const [, selectedOptions] of Object.entries(activeGroups)) {
        if (!selectedOptions.some(opt => eventTags.includes(opt))) return false;
      }
      return true;
    });
  }, [selectedFilters, searchQuery]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-24 h-[calc(100vh-8rem)]">
          <FilterSidebar selectedFilters={selectedFilters} toggleFilter={toggleFilter} clearFilters={clearFilters} />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-50 lg:hidden pb-10"
            >
              <div className="p-4 flex justify-between items-center border-b">
                <h2 className="font-bold text-lg">Filters</h2>
                <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <FilterSidebar selectedFilters={selectedFilters} toggleFilter={toggleFilter} clearFilters={clearFilters} closeMobileSidebar={() => setIsMobileSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1">

        {/* Mobile search */}
        <div className="mb-6 md:hidden">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm transition-all outline-none"
          />
        </div>

        {/* Active Filters */}
        {selectedFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm font-medium text-slate-500 mr-2">Active Filters:</span>
            <AnimatePresence>
              {selectedFilters.map(filter => (
                <motion.span
                  key={filter}
                  initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full cursor-pointer hover:bg-red-100 hover:text-red-800 transition-colors group"
                  onClick={() => toggleFilter(filter)}
                >
                  {filter}
                  <X size={14} className="text-emerald-600 group-hover:text-red-600" />
                </motion.span>
              ))}
            </AnimatePresence>
            <button onClick={clearFilters} className="text-sm text-slate-500 hover:text-emerald-600 underline ml-2 transition-colors">
              Clear all
            </button>
          </div>
        )}

        {/* Results Header + View Toggle + Mobile Filter */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-slate-800">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'} Found
          </h2>

          <div className="flex items-center gap-2">
            {/* Grid / Map toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${viewMode === 'grid' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <LayoutGrid size={15} /> Grid
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${viewMode === 'map' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <MapPinIcon size={15} /> Map
              </button>
            </div>

            {/* Mobile filter button */}
            <button
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Menu size={18} /> Filters
            </button>
          </div>
        </div>

        {/* ─── GRID VIEW ─── */}
        {viewMode === 'grid' && (
          filteredEvents.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} onClick={(e) => setSelectedEvent(e)} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-dashed border-slate-300 text-center"
            >
              <div className="bg-slate-50 p-4 rounded-full mb-4">
                <Sparkles size={32} className="text-emerald-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No events found</h3>
              <p className="text-slate-500 max-w-sm mb-6 leading-relaxed">
                We couldn't find any events matching your filters. Try adjusting them!
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-all shadow-md shadow-emerald-500/20 active:scale-95"
              >
                Reset Filters
              </button>
            </motion.div>
          )
        )}

        {/* ─── MAP VIEW ─── */}
        {viewMode === 'map' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <ExploreMapPanel filteredEvents={filteredEvents} onEventClick={setSelectedEvent} />
          </motion.div>
        )}
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal event={selectedEvent} isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} />
    </main>
  );
}

export default Explore;
