'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Tag, Star, Bookmark, BookmarkCheck } from 'lucide-react';
import { useState } from 'react';
import { toggleSaveEvent } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORY_COLORS = {
  tech: '#6366f1', music: '#ec4899', sports: '#22c55e', art: '#f59e0b',
  networking: '#06b6d4', food: '#f97316', adventure: '#10b981',
  wellness: '#a78bfa', gaming: '#ef4444', science: '#3b82f6',
  film: '#a855f7', education: '#fbbf24', default: '#64748b',
};

export default function EventCard({ event, score, showScore = false, savedIds = [] }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(savedIds.includes(event._id));
  const [saving, setSaving] = useState(false);

  const color = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.default;
  const dateObj = new Date(event.date);
  const day = dateObj.toLocaleDateString('en-US', { day: 'numeric' });
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
  const time = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in to save events'); return; }
    setSaving(true);
    try {
      const { data } = await toggleSaveEvent(event._id);
      setSaved(data.saved);
      toast.success(data.saved ? 'Event saved!' : 'Event removed from saved');
    } catch {
      toast.error('Could not save event');
    } finally {
      setSaving(false);
    }
  };

  const imageUrl = event.image || `https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600`;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative rounded-2xl overflow-hidden glass border border-white/8 cursor-pointer"
      style={{ '--card-color': color }}
    >
      <Link href={`/events/${event._id}`} className="block">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600'; }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Date badge */}
          <div className="absolute top-3 left-3 flex flex-col items-center bg-black/60 backdrop-blur-md rounded-xl px-3 py-1.5 border border-white/10">
            <span className="text-xs font-bold text-white/60 uppercase tracking-wider">{month}</span>
            <span className="text-xl font-black text-white leading-none">{day}</span>
          </div>

          {/* Featured badge */}
          {event.isFeatured && (
            <div className="absolute top-3 right-10 flex items-center gap-1 bg-amber-500/20 backdrop-blur-md border border-amber-500/40 rounded-full px-2.5 py-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-amber-300">Featured</span>
            </div>
          )}

          {/* Category tag */}
          <div className="absolute bottom-3 left-3">
            <span className={`tag tag-${event.category} tag-default`}>{event.category}</span>
          </div>

          {/* Recommendation score */}
          {showScore && score > 0 && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-indigo-500/20 backdrop-blur-md border border-indigo-500/40 rounded-full px-2.5 py-1">
              <Zap className="w-3 h-3 text-indigo-400" />
              <span className="text-xs font-bold text-indigo-300">{score}% match</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-white text-base leading-snug mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {event.title}
          </h3>

          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              <span className="truncate">{event.location?.venue || event.location?.city}</span>
              {event.location?.isOnline && <span className="text-cyan-400 font-medium">• Online</span>}
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Calendar className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
              <span>{time} · {dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Users className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
              <span>{event.rsvpCount} / {event.capacity} registered</span>
            </div>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {event.tags.slice(0, 3).map((tag) => (
                <span key={tag} className={`tag tag-${tag} tag-default`}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Footer */}
      <div className="px-4 pb-4 flex items-center justify-between">
        <div>
          {event.price === 0 ? (
            <span className="text-green-400 font-bold text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>Free</span>
          ) : (
            <span className="text-white font-bold text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>
              <span className="text-slate-500 text-xs">from </span>${event.price}
            </span>
          )}
        </div>
        <button
          id={`save-btn-${event._id}`}
          onClick={handleSave}
          disabled={saving}
          className="p-2 rounded-lg hover:bg-indigo-500/10 text-slate-500 hover:text-indigo-400 transition-all disabled:opacity-50"
          title={saved ? 'Unsave' : 'Save event'}
        >
          {saved ? <BookmarkCheck className="w-4 h-4 text-indigo-400" /> : <Bookmark className="w-4 h-4" />}
        </button>
      </div>

      {/* Hover glow border */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1px ${color}40` }}
      />
    </motion.div>
  );
}

// Need to import Zap separately
function Zap({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
