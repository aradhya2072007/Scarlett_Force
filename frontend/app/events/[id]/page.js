'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getEvent, rsvpEvent, checkRegistration, toggleSaveEvent } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, DollarSign, Clock, ArrowLeft, Bookmark, BookmarkCheck, CheckCircle2, Ticket } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function EventDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registration, setRegistration] = useState(null);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const { data } = await getEvent(params.id);
        setEvent(data.event);
        
        if (user) {
          setSaved(user.savedEvents?.some(e => e._id === data.event._id || e === data.event._id));
          const regRes = await checkRegistration(params.id);
          if (regRes.data.isRegistered) {
            setRegistration(regRes.data.registration);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error('Event not found');
        router.push('/events');
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [params.id, user, router]);

  const handleRSVP = async () => {
    if (!user) {
      toast.error('Please sign in to RSVP');
      router.push('/login');
      return;
    }
    setRsvpLoading(true);
    try {
      const { data } = await rsvpEvent(event._id);
      setRegistration(data.registration);
      setEvent(prev => ({ ...prev, rsvpCount: prev.rsvpCount + (data.waitlisted ? 0 : 1) }));
      toast.success(data.waitlisted ? 'Added to waitlist!' : 'Registration successful!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to RSVP');
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) { toast.error('Please sign in to save'); return; }
    try {
      const { data } = await toggleSaveEvent(event._id);
      setSaved(data.saved);
      toast.success(data.saved ? 'Event saved!' : 'Event removed from saved');
    } catch (err) {
      toast.error('Failed to update saved status');
    }
  };

  if (loading || !event) return <div className="h-screen flex center text-white">Loading...</div>;

  const dateObj = new Date(event.date);
  const isFull = event.rsvpCount >= event.capacity;
  const isPast = dateObj < new Date();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/events" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </Link>

      {/* Hero Image */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full h-64 md:h-96 rounded-3xl overflow-hidden relative mb-8 border border-white/10"
      >
        <img 
          src={event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`tag tag-${event.category}`}>{event.category}</span>
            {event.price === 0 && <span className="tag tag-sports tracking-widest text-[#4ade80] !border-[#4ade80]/40">FREE</span>}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {event.title}
          </h1>
          <p className="text-slate-300 font-medium">By {event.organizer.name}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-8 rounded-3xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>About this Event</h2>
            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </div>
            
            {event.tags?.length > 0 && (
              <div className="mt-8 pt-8 border-t border-white/5">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map(tag => (
                    <span key={tag} className="tag tag-default bg-white/5">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details Card */}
          <div className="glass p-6 rounded-3xl border border-white/10 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-white font-medium">{dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                <p className="text-slate-400 text-sm mt-0.5">{dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-medium">{event.location.venue || 'TBA'}</p>
                <p className="text-slate-400 text-sm mt-0.5">{event.location.city}{event.location.address ? `, ${event.location.address}` : ''}</p>
                {event.location.isOnline && <span className="inline-block mt-1 bg-cyan-500/20 text-cyan-300 text-xs px-2 py-0.5 rounded font-medium">Virtual Event</span>}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-medium">{event.price === 0 ? 'Free Entry' : `$${event.price}`}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-slate-400">
                <Users className="w-4 h-4" />
                <span className="text-sm">{event.rsvpCount} / {event.capacity} Attendees</span>
              </div>
              {isFull && <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded">FULL</span>}
            </div>
          </div>

          {/* Actions */}
          <div className="glass p-6 rounded-3xl border border-white/10 text-center">
            {isPast ? (
              <div className="text-slate-400 font-medium py-3">This event has already passed.</div>
            ) : registration ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold bg-emerald-500/10 py-3 rounded-xl">
                  <CheckCircle2 className="w-5 h-5" /> 
                  {registration.status === 'waitlisted' ? 'On Waitlist' : 'You are Registered!'}
                </div>
                {registration.ticketCode && (
                  <div className="text-sm text-slate-400 border border-dashed border-white/20 p-3 rounded-xl flex items-center justify-center gap-2">
                    <Ticket className="w-4 h-4" /> Ticket: {registration.ticketCode}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleRSVP}
                disabled={rsvpLoading || (isFull && !user)}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  isFull 
                    ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 cursor-pointer'
                }`}
              >
                {rsvpLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : isFull ? 'Join Waitlist' : 'RSVP Now'}
              </button>
            )}

            <button 
              onClick={handleSave}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              {saved ? <BookmarkCheck className="w-5 h-5 text-indigo-400" /> : <Bookmark className="w-5 h-5" />}
              {saved ? 'Saved to Dashboard' : 'Save for Later'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
