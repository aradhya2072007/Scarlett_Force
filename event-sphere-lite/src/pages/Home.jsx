import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Compass, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-2xl"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-500 p-5 rounded-3xl text-white shadow-2xl shadow-emerald-400/40">
            <Sparkles size={40} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 mb-4 leading-tight">
          Welcome to{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-400">
            EventSphere
          </span>
        </h1>

        {/* Subheading placeholder */}
        <p className="text-lg text-slate-500 mb-10 leading-relaxed">
          Your landing page content will go here. Explore amazing events in the meantime!
        </p>

        {/* CTA */}
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-base font-semibold rounded-2xl shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
        >
          <Compass size={20} />
          Explore Events
          <ArrowRight size={18} />
        </Link>
      </motion.div>
    </main>
  );
}

export default Home;
