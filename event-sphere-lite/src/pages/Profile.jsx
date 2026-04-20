import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, MapPin, Shield, Bell, Bookmark, Settings, LogOut, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSavedEvents } from '../context/SavedEventsContext';

function Profile() {
  const { count } = useSavedEvents();

  const user = {
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    joined: 'March 2024',
    location: 'San Francisco, CA',
    interests: ['Tech', 'Music', 'Design'],
    stats: [
      { label: 'Attended', value: 12, icon: Calendar, link: '#' },
      { label: 'Saved', value: count, icon: Bookmark, link: '/saved' },
      { label: 'Reviews', value: 8, icon: Sparkles, link: '#' }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Return Button */}
      <div className="mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium text-sm hover:bg-slate-50 hover:border-emerald-200 hover:text-emerald-600 transition-all active:scale-95 shadow-sm group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Events
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
      >
        {/* Cover Section */}
        <div className="h-48 bg-gradient-to-r from-emerald-500 to-teal-400 relative">
          <div className="absolute -bottom-16 left-10 p-1.5 bg-white rounded-3xl shadow-lg">
            <div className="w-32 h-32 bg-slate-100 rounded-[1.25rem] flex items-center justify-center text-emerald-500">
              <User size={64} strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Profile Info Header */}
        <div className="pt-20 pb-10 px-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
              <div className="flex items-center gap-4 mt-2 text-slate-500">
                <span className="flex items-center gap-1.5 text-sm">
                  <Mail size={16} />
                  {user.email}
                </span>
                <span className="flex items-center gap-1.5 text-sm">
                  <MapPin size={16} />
                  {user.location}
                </span>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95">
              <Settings size={18} />
              Edit Profile
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            {user.stats.map((stat, i) => (
              <Link 
                key={i} 
                to={stat.link}
                className="bg-slate-50 p-6 rounded-3xl border border-slate-100/50 flex items-center gap-4 hover:bg-white hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group"
              >
                <div className="p-3 bg-white rounded-2xl shadow-sm text-emerald-500 group-hover:bg-emerald-50 transition-colors">
                  <stat.icon size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Detailed Info Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Shield size={20} className="text-emerald-500" />
                Account Security
              </h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-emerald-200 transition-all group">
                  <span className="text-slate-600 font-medium">Change Password</span>
                  <Settings size={18} className="text-slate-300 group-hover:text-emerald-500" />
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-emerald-200 transition-all group">
                  <span className="text-slate-600 font-medium">Two-Factor Auth</span>
                  <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-wider">Enabled</div>
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Bell size={20} className="text-emerald-500" />
                Preferences
              </h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-emerald-200 transition-all group">
                  <span className="text-slate-600 font-medium">Notification Settings</span>
                  <Bell size={18} className="text-slate-300 group-hover:text-emerald-500" />
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-white border border-rose-50 rounded-2xl hover:bg-rose-50 transition-all group">
                  <span className="text-rose-600 font-medium">Log Out</span>
                  <LogOut size={18} className="text-rose-300 group-hover:text-rose-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Profile;
