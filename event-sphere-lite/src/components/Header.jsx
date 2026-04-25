import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, User, Search, MessageCircle, Home, Bookmark, Compass } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useSavedEvents } from '../context/SavedEventsContext';

function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { conversations } = useUser();
  const { savedEventIds } = useSavedEvents();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60 h-16 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-full gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0">
            <div className="bg-emerald-500 p-2 rounded-xl text-white">
              <Sparkles size={20} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 hidden sm:block">
              EventSphere Lite
            </h1>
          </Link>

          {/* Primary Navigation Links */}
          <nav className="flex items-center gap-2">
            <Link
              to="/"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all flex-shrink-0 text-base ${
                location.pathname === '/'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Home size={18} />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link
              to="/explore"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all flex-shrink-0 text-base ${
                location.pathname === '/explore'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <Compass size={18} />
              <span className="hidden sm:inline">Explore Events</span>
              <span className="sm:hidden">Explore</span>
            </Link>
          </nav>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search events..." 
                className="w-full pl-11 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-full text-sm transition-all outline-none"
              />
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center gap-3">
            <Link 
              to="/saved" 
              className={`p-2 rounded-xl transition-all relative ${location.pathname === '/saved' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:bg-slate-100'}`}
              title="Saved Events"
            >
              <Bookmark size={22} fill={location.pathname === '/saved' ? 'currentColor' : 'none'} />
              {savedEventIds.length > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-emerald-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {savedEventIds.length}
                </span>
              )}
            </Link>
            
            <Link 
              to="/messages" 
              className={`p-2 rounded-xl transition-all relative ${location.pathname === '/messages' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:bg-slate-100'}`}
              title="Messages"
            >
              <MessageCircle size={22} />
              {conversations.length > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
              )}
            </Link>
            
            <Link 
              to="/profile" 
              className={`p-2 rounded-xl transition-all flex items-center gap-2 ${location.pathname === '/profile' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:bg-slate-100'}`}
              title="Profile"
            >
              <div className={`p-1.5 rounded-lg ${location.pathname === '/profile' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                <User size={18} />
              </div>
              <span className="text-sm font-semibold hidden sm:inline">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
