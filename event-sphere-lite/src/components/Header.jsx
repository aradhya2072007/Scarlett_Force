import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, User, Search, MessageCircle, Home } from 'lucide-react';
import { useUser } from '../context/UserContext';

function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { conversations } = useUser();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60 h-16 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo - Restored */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-emerald-500 p-2 rounded-xl text-white">
              <Sparkles size={20} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
              EventSphere Lite
            </h1>
          </Link>
          
          {/* Search Bar - Restored logic with cleaner look */}
          <div className="flex-1 max-w-md mx-8 hidden md:block">
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
          <div className="flex items-center gap-5">
            <Link to="/" className={`p-2 rounded-xl transition-all ${location.pathname === '/' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:bg-slate-100'}`}>
              <Home size={22} />
            </Link>
            
            <Link 
              to="/messages" 
              className={`p-2 rounded-xl transition-all relative ${location.pathname === '/messages' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <MessageCircle size={22} />
              {conversations.length > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
              )}
            </Link>
            
            <Link 
              to="/profile" 
              className={`p-2 rounded-xl transition-all flex items-center gap-2 ${location.pathname === '/profile' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:bg-slate-100'}`}
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
