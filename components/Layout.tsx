import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, MessageCircle, User, Menu, Bell } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from "react-router-dom";



export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, login } = useStore();
  const location = useLocation();
  const navigate = useNavigate();


  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 md:pb-0">
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-brand-900 leading-none">VIN GRAND PARK</span>
              <span className="text-xs text-brand-600 font-medium tracking-wider">HOMES</span>
            </div>
          </Link>

          <nav className="flex items-center gap-8">
            <Link to="/" className="font-medium text-slate-600 hover:text-brand-600 transition">Trang chủ</Link>
            {/* <Link to="/search" className="font-medium text-slate-600 hover:text-brand-600 transition"></Link> */}
            <Link to="/search" className="font-medium text-slate-600 hover:text-brand-600 transition">Căn Hộ Cho Thuê</Link>
            {/* <Link to="/projects" className="font-medium text-slate-600 hover:text-brand-600 transition">Dự án</Link>
            <Link to="/explore" className="font-medium text-slate-600 hover:text-brand-600 transition">Khám phá</Link> */}
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/new-post" className="bg-accent-500 hover:bg-accent-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-accent-500/20 transition flex items-center gap-2">
              <PlusCircle size={18} />
              Đăng tin
            </Link>
            {user ? (
              <div className="flex items-center gap-3">
                <button className="p-2 text-slate-400 hover:text-brand-600 transition relative">
                  <Bell size={24} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <Link to="/profile">
                   <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-brand-100" />
                </Link>
              </div>
            ) : (
              <button  onClick={() => navigate("/login")} className="text-brand-700 font-semibold px-4 py-2 hover:bg-brand-50 rounded-xl transition">
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 bg-white shadow-sm px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="font-bold text-brand-900">VIN HOMES</span>
          </Link>
          <div className="flex items-center gap-3">
             <button className="p-2 text-slate-600">
               <Bell size={24} />
             </button>
             <button className="p-2 text-slate-600">
               <Menu size={24} />
             </button>
          </div>
      </header>

      <main>
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-16 pb-safe z-50 flex items-center justify-around">
        <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-brand-600' : 'text-slate-400'}`}>
          <Home size={24} strokeWidth={isActive('/') ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Trang chủ</span>
        </Link>
        <Link to="/search" className={`flex flex-col items-center gap-1 ${isActive('/search') ? 'text-brand-600' : 'text-slate-400'}`}>
          <Search size={24} strokeWidth={isActive('/search') ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Tìm kiếm</span>
        </Link>
        <Link to="/post" className="flex flex-col items-center -mt-6">
          <div className="w-14 h-14 bg-brand-600 rounded-full shadow-lg shadow-brand-600/30 flex items-center justify-center text-white">
            <PlusCircle size={28} />
          </div>
          <span className="text-[10px] font-medium text-brand-700 mt-1">Đăng tin</span>
        </Link>
        <Link to="/chat" className={`flex flex-col items-center gap-1 ${isActive('/chat') ? 'text-brand-600' : 'text-slate-400'}`}>
          <MessageCircle size={24} strokeWidth={isActive('/chat') ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Chat</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-brand-600' : 'text-slate-400'}`}>
          <User size={24} strokeWidth={isActive('/profile') ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Cá nhân</span>
        </Link>
      </nav>
    </div>
  );
};