import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Users, Mail, Shuffle, Activity, Lock, Unlock } from 'lucide-react';
import AdminLoginModal from './AdminLoginModal';

interface LayoutProps {
  children: React.ReactNode;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, isAdmin, setIsAdmin }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const toggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={() => setIsAdmin(true)}
      />

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex-shrink-0 flex flex-col shadow-2xl relative z-20">
        <div className="p-6 border-b border-slate-700 flex items-center space-x-3">
          <Activity className="text-blue-400 w-8 h-8" />
          <h1 className="text-xl font-bold tracking-wider">SkateApp</h1>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          <NavLink
            to="/"
            className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 group ${isActive ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-white/5 hover:text-white hover:pl-4'}`}
          >
            <Calendar className="w-5 h-5" />
            <span>Dashboard</span>
          </NavLink>



          {/* Admin Only Links */}
          {isAdmin && (
            <>
              <NavLink
                to="/roster"
                className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 group ${isActive ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-white/5 hover:text-white hover:pl-4'}`}
              >
                <Users className="w-5 h-5" />
                <span>Roster</span>
              </NavLink>
              <NavLink
                to="/invites"
                className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 group ${isActive ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-white/5 hover:text-white hover:pl-4'}`}
              >
                <Mail className="w-5 h-5" />
                <span>Invites</span>
              </NavLink>

              <NavLink
                to="/teams"
                className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 group ${isActive ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-white/5 hover:text-white hover:pl-4'}`}
              >
                <Shuffle className="w-5 h-5" />
                <span>Team Balancer</span>
              </NavLink>
            </>
          )}
        </nav>

        <div className="p-6">
          <button
            onClick={toggleAdmin}
            className={`w-full flex items-center justify-center space-x-2 p-3 rounded-xl transition-all duration-300 mb-4 border border-transparent ${isAdmin ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white hover:shadow-lg'}`}
          >
            {isAdmin ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span className="text-sm font-medium">{isAdmin ? 'Logout' : 'Admin Access'}</span>
          </button>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 text-xs text-slate-400 border border-slate-700/50">
            <p className="font-semibold text-white mb-1">Weekly Status</p>
            <p>Mode: <span className={isAdmin ? "text-red-400 font-bold" : "text-green-400"}>{isAdmin ? 'Admin' : 'View Only'}</span></p>
            <p>Next Game: Friday, 8PM</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;