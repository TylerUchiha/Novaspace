import React from 'react';
import { UserProfile } from '../types';
import { UserAvatar } from './UserAvatar';
import { User, Building2, LogOut, Sparkles, ArrowRight, Wallet } from 'lucide-react';
import { motion } from 'motion/react';

interface WelcomePageProps {
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenWorkspaces: () => void;
  onLogout: () => void;
  onOpenBalance: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  userProfile,
  onOpenProfile,
  onOpenWorkspaces,
  onLogout,
  onOpenBalance,
}) => {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between font-['Inter'] p-6 md:p-12 relative overflow-hidden">
      {/* Background soft glow accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/30 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between z-10 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-200">
            <Building2 size={24} />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">NovaSpace</span>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm group cursor-pointer"
        >
          <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
          <span className="font-black text-xs uppercase tracking-widest">Sign Out</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center z-10 my-8">
        {/* User Greeting Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6 mb-12"
        >
          <div className="relative inline-block">
            <UserAvatar pfp={userProfile.pfp} name={userProfile.name} profession={userProfile.profession} size="2xl" className="mx-auto shadow-xl ring-8 ring-white" />
          </div>

          <div>
            <span className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100/60 inline-block mb-3">
              Member Portal
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
              Welcome, <span className="text-blue-600">{userProfile.name}</span>!
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-md mx-auto mt-3">
              Where would you like to go today? Select an option below to get started.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button onClick={onOpenBalance} className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200/80 shadow-sm text-xs font-bold text-slate-700 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer">
              <Wallet size={14} className="text-emerald-500" />
              <span>Balance: <strong className="text-slate-900 font-black">{(userProfile.credits || 0).toLocaleString()} EGP</strong></span>
            </button>
            {userProfile.profession && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200/80 shadow-sm text-xs font-bold text-slate-500">
                <span>{userProfile.profession}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          {/* Card 1: My Profile */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={onOpenProfile}
            className="group bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200/80 shadow-xl hover:shadow-2xl hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-125 transition-transform" />
            
            <div className="relative z-10 mb-8">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all">
                <User size={32} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">My Profile</h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                View & update your personal information, saved payment methods, and account security.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-3 font-black text-xs text-blue-600 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
              <span>View Profile</span>
              <ArrowRight size={16} />
            </div>
          </motion.div>

          {/* Card 2: Workspaces */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={onOpenWorkspaces}
            className="group bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200/80 shadow-xl hover:shadow-2xl hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-125 transition-transform" />

            <div className="relative z-10 mb-8">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Building2 size={32} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Workspaces</h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                Explore all co-working spaces, browse locations, and reserve your desk or meeting room.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-3 font-black text-xs text-emerald-600 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
              <span>Explore Workspaces</span>
              <ArrowRight size={16} />
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center z-10 mt-8 pt-6 border-t border-slate-200/60">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
          © 2025 NOVASPACE WORLDWIDE ECOSYSTEM
        </p>
      </footer>
    </div>
  );
};

export default WelcomePage;
