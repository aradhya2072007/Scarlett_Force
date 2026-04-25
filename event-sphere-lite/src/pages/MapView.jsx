import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { mockEvents } from '../data/events';
import { Calendar, MapPin, Tag, DollarSign, Navigation, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Fix default Leaflet marker icon broken in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Color-coded icon by category
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
    html: `<div style="
      width:34px;height:34px;
      background:${color};
      border:3px solid white;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 2px 10px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -38],
  });
}

// Pulsing blue dot for current location
const locationIcon = L.divIcon({
  className: '',
  html: `
    <div style="position:relative;width:22px;height:22px;">
      <div style="
        position:absolute;inset:0;
        background:#3b82f6;
        border:3px solid white;
        border-radius:50%;
        box-shadow:0 0 0 4px rgba(59,130,246,0.3);
        animation:pulse-ring 2s infinite;
      "></div>
    </div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -14],
});

// Inner component — reads the map instance via useMap hook
function LocateButton({ userPos, setUserPos, locating, setLocating, locateError, setLocateError }) {
  const map = useMap();

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      setLocateError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setLocateError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setUserPos({ lat: latitude, lng: longitude, accuracy });
        map.flyTo([latitude, longitude], 14, { duration: 1.5 });
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        setLocateError('Location access denied. Please allow location in your browser.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [map, setUserPos, setLocating, setLocateError]);

  return (
    <div className="leaflet-top leaflet-right" style={{ marginTop: '80px' }}>
      <div className="leaflet-control leaflet-bar" style={{ border: 'none', boxShadow: 'none' }}>
        <button
          onClick={handleLocate}
          disabled={locating}
          title="Show my location"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '40px', height: '40px',
            background: userPos ? '#3b82f6' : 'white',
            border: '2px solid rgba(0,0,0,0.2)',
            borderRadius: '6px',
            cursor: locating ? 'wait' : 'pointer',
            color: userPos ? 'white' : '#1e293b',
            transition: 'all 0.2s',
          }}
        >
          {locating
            ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            : <Navigation size={18} />
          }
        </button>
      </div>
    </div>
  );
}

function MapView() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userPos, setUserPos] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState(null);

  return (
    <div className="relative flex h-[calc(100vh-4rem)] overflow-hidden isolate">

      {/* ===== MAP ===== */}
      <div className="flex-1 relative">
        {/* Error toast */}
        <AnimatePresence>
          {locateError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-[1100] bg-red-600 text-white text-sm px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3"
            >
              <span>{locateError}</span>
              <button onClick={() => setLocateError(null)} className="opacity-70 hover:opacity-100">
                <X size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current location badge */}
        {userPos && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-4 z-[1000] bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5"
          >
            <Navigation size={12} />
            Showing your location
          </motion.div>
        )}

        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ width: '100%', height: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Event markers */}
          {mockEvents.map(event => (
            <Marker
              key={event.id}
              position={[event.lat, event.lng]}
              icon={createCategoryIcon(event.category)}
              eventHandlers={{ click: () => setSelectedEvent(event) }}
            >
              <Popup>
                <div className="min-w-[190px]">
                  <p className="font-bold text-slate-800 text-sm leading-tight mb-1">{event.title}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">📍 {event.location}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    📅 {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold ${event.price === 'Free' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {event.price}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Current Location marker + accuracy circle */}
          {userPos && (
            <>
              <Marker position={[userPos.lat, userPos.lng]} icon={locationIcon}>
                <Popup>
                  <div className="text-sm font-semibold text-blue-600 flex items-center gap-1">
                    <Navigation size={14} /> You are here
                  </div>
                  {userPos.accuracy && (
                    <p className="text-xs text-slate-500 mt-1">Accuracy: ~{Math.round(userPos.accuracy)}m</p>
                  )}
                </Popup>
              </Marker>
              <Circle
                center={[userPos.lat, userPos.lng]}
                radius={userPos.accuracy || 100}
                pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.08, weight: 1.5 }}
              />
            </>
          )}

          {/* Locate Me button (inside map, reads map instance) */}
          <LocateButton
            userPos={userPos}
            setUserPos={setUserPos}
            locating={locating}
            setLocating={setLocating}
            locateError={locateError}
            setLocateError={setLocateError}
          />
        </MapContainer>

        {/* Category legend */}
        <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-slate-100">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Category</p>
          <div className="flex flex-col gap-2">
            {Object.entries(categoryColors).map(([cat, color]) => (
              <div key={cat} className="flex items-center gap-2 text-sm">
                <span style={{ background: color }} className="w-3 h-3 rounded-full inline-block flex-shrink-0" />
                <span className="text-slate-700 font-medium">{cat}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 text-sm mt-1 border-t border-slate-100 pt-2">
              <span className="w-3 h-3 rounded-full inline-block flex-shrink-0 bg-blue-500 ring-2 ring-blue-300" />
              <span className="text-slate-700 font-medium">You</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== SIDEBAR ===== */}
      <div className="w-80 xl:w-96 bg-white border-l border-slate-200 overflow-y-auto flex flex-col">
        <div className="p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-slate-800">Events on Map</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {mockEvents.length} events worldwide — click a pin or row for details
          </p>
        </div>

        <div className="flex-1 divide-y divide-slate-100">
          {mockEvents.map(event => (
            <button
              key={event.id}
              onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
              className={`w-full text-left px-5 py-4 transition-all hover:bg-slate-50 ${selectedEvent?.id === event.id ? 'bg-emerald-50 border-l-4 border-emerald-500' : ''}`}
            >
              <div className="flex items-start gap-3">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm leading-tight">{event.title}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin size={11} /> {event.location}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <Calendar size={11} /> {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    <span
                      style={{ background: (categoryColors[event.category] || '#64748b') + '20', color: categoryColors[event.category] || '#64748b' }}
                      className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    >
                      {event.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${event.price === 'Free' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {event.price}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Expanded event detail */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              key={selectedEvent.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 220 }}
              className="border-t border-slate-200 bg-white p-5"
            >
              <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-36 object-cover rounded-2xl mb-4" />
              <p className="font-bold text-slate-800 text-base leading-snug mb-1">{selectedEvent.title}</p>
              <p className="text-sm text-slate-500 mb-3 leading-relaxed line-clamp-3">{selectedEvent.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                <span className="flex items-center gap-1.5"><MapPin size={12} className="text-emerald-500" />{selectedEvent.location}</span>
                <span className="flex items-center gap-1.5"><Calendar size={12} className="text-emerald-500" />{new Date(selectedEvent.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className="flex items-center gap-1.5"><Tag size={12} className="text-emerald-500" />{selectedEvent.eventType}</span>
                <span className="flex items-center gap-1.5"><DollarSign size={12} className="text-emerald-500" />{selectedEvent.price}</span>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                <img src={selectedEvent.host.avatar} alt={selectedEvent.host.name} className="w-8 h-8 rounded-full" />
                <span className="text-xs text-slate-600">Hosted by <span className="font-semibold text-slate-800">{selectedEvent.host.name}</span></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default MapView;
