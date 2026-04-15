'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getRecommendations, getMyRegistrations } from '@/lib/api';
import EventCard from '@/components/EventCard';
import { motion } from 'framer-motion';
import { Brain, CalendarCheck, Zap, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [recommendations, setRecommendations] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login'); return; }
    if (!user.quizCompleted) { router.push('/quiz'); return; }

    const fetchDashboardData = async () => {
      try {
        const [recsRes, regRes] = await Promise.all([
          getRecommendations(),
          getMyRegistrations(),
        ]);
        setRecommendations(recsRes.data.recommendations || []);
        setRegistrations(regRes.data.registrations || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  // Helper to render traits
  const renderTrait = (traitName, value) => {
    const colors = {
      high: 'bg-indigo-500 text-white',
      medium: 'bg-indigo-500/20 text-indigo-300',
      low: 'bg-white/5 text-slate-500'
    };
    return (
      <div className="flex flex-col items-center p-3 glass rounded-xl border border-white/5">
        <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">{traitName}</span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${colors[value] || colors.medium}`}>
          {value}
        </span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
        </h1>
        <p className="text-slate-400">Here's your personalized event hub based on your AI profile.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        {/* Sidebar / Profile Block */}
        <div className="lg:col-span-1 space-y-6 w-full">
          <div className="glass p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>AI Profile</h3>
                <Link href="/quiz" className="text-xs text-indigo-400 hover:underline">Retake Quiz</Link>
              </div>
            </div>

            {user?.personalityProfile ? (
              <div className="grid grid-cols-2 gap-3">
                {renderTrait('Social', user.personalityProfile.social)}
                {renderTrait('Creative', user.personalityProfile.creative)}
                {renderTrait('Tech', user.personalityProfile.tech)}
                {renderTrait('Energy', user.personalityProfile.energetic)}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Profile data unavailable.</p>
            )}
          </div>
          
          <div className="glass p-6 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                <CalendarCheck className="w-4 h-4 text-emerald-400" />
                Upcoming (<span className="text-emerald-400">{registrations.filter(r => new Date(r.event.date) >= new Date()).length}</span>)
              </h3>
            </div>
            
            {registrations.length === 0 ? (
              <p className="text-sm text-slate-400">No upcoming events. Time to explore!</p>
            ) : (
              <div className="space-y-4">
                {registrations.slice(0, 3).map((reg) => (
                  <Link key={reg._id} href={`/events/${reg.event._id}`} className="block group">
                    <div className="flex gap-3 items-center p-2 rounded-xl hover:bg-white/5 transition">
                      <img src={reg.event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-200 group-hover:text-indigo-400 truncate">{reg.event.title}</p>
                        <p className="text-xs text-slate-500">{new Date(reg.event.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content / Recommendations */}
        <div className="lg:col-span-2 w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
              <Zap className="w-6 h-6 text-amber-400 fill-amber-400/20" />
              Recommended for You
            </h2>
            <Link href="/events" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {recommendations.map((event, idx) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <EventCard 
                    event={event} 
                    score={event.recommendationScore} 
                    showScore={true} 
                    savedIds={user?.savedEvents?.map(e => e._id || e) || []}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glass rounded-3xl border border-white/5">
              <Zap className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-300 mb-2">No direct matches found</h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">We couldn't find events perfectly matching your profile right now. Try exploring our full catalog.</p>
              <Link href="/events" className="btn-primary">Browse All Events</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
