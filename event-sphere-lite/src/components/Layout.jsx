import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 relative selection:bg-emerald-200 selection:text-emerald-900">
      <Header />
      <div className="pt-0"> {/* Padding for sticky header if needed, but header is relative/sticky */}
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
