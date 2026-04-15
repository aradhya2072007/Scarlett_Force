'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Calendar, MapPin, Users, Activity } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="relative isolate overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col justify-center">
      {/* Background decoration */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden sm:mb-8 sm:flex sm:justify-center"
          >
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-slate-300 ring-1 ring-white/10 hover:ring-white/20 glass">
              Announcing AI-powered personality event matching.{' '}
              <Link href="/register" className="font-semibold text-indigo-400"><span className="absolute inset-0" aria-hidden="true"></span>Read more <span aria-hidden="true">&rarr;</span></Link>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Discover Events <br className="hidden sm:block" />
            <span className="gradient-text glow-primary">Matched to Your Vibe</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-slate-300"
          >
            Take our personality quiz and let our recommendation engine find the perfect tech conferences, music festivals, art shows, and networking events for you.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            {user ? (
              <Link href="/dashboard" className="btn-primary py-3 px-8 text-lg">
                <span>Go to Dashboard</span> <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            ) : (
              <>
                <Link href="/register" className="btn-primary py-3 px-8 text-lg">
                  <span>Get Started</span> <Sparkles className="w-5 h-5 ml-2" />
                </Link>
                <Link href="/events" className="text-sm font-semibold leading-6 text-white hover:text-indigo-300 transition-colors">
                  Browse Events <span aria-hidden="true">→</span>
                </Link>
              </>
            )}
          </motion.div>
        </div>

        {/* Feature grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mx-auto mt-20 max-w-2xl sm:mt-24 lg:mt-32 lg:max-w-none"
        >
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {[
              {
                name: 'AI Personality Matching',
                description: 'Our intelligent engine analyzes your quiz results to recommend events that perfectly align with your social, creative, and energetic traits.',
                icon: Activity,
                color: 'text-indigo-400',
                bg: 'bg-indigo-500/10'
              },
              {
                name: 'Curated Experiences',
                description: 'From underground music gigs to massive tech summits, discover hand-picked events spanning a diverse set of categories.',
                icon: Calendar,
                color: 'text-pink-400',
                bg: 'bg-pink-500/10'
              },
              {
                name: 'Seamless RSVP',
                description: 'Book your spot instantly, manage your calendar, and save events for later all from your customized dashboard.',
                icon: Users,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10'
              },
            ].map((feature, idx) => (
              <div key={feature.name} className="flex flex-col glass p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
                <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg}`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-6 flex flex-auto flex-col text-base leading-7 text-slate-300">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </div>
  );
}
