import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { DemoSwitcherModal } from './DemoSwitcherModal';
import { SearchModal } from './SearchModal';
import {
  Heart,
  Search,
  Bell,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Bot,
  Sparkles,
  MessageSquare,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserDropdownOpen(false);
  };

  const navLinks = [
    { name: 'Adopt Pets', path: '/pets' },
    { name: 'Lost & Found', path: '/lost-found' },
    { name: 'Rescue', path: '/rescue' },
    { name: 'Volunteers', path: '/volunteers' },
    { name: 'NGOs', path: '/ngos' },
    { name: 'Veterinarians', path: '/vets' },
    { name: 'Pet Care', path: '/pet-care' },
    { name: 'PetCare AI', path: '/pet-care/assistant', highlight: true },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Heart className="w-6 h-6 fill-white" />
              </div>
              <div>
                <span className="text-2xl font-black font-display tracking-tight text-slate-900 flex items-center gap-1">
                  Pet<span className="text-brand-600">Connect</span>
                </span>
                <span className="hidden sm:block text-[11px] font-semibold text-slate-500 tracking-wide">
                  Connecting Hearts. Saving Lives.
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      link.highlight
                        ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200 flex items-center gap-1.5'
                        : isActive
                        ? 'text-brand-700 bg-brand-50 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {link.highlight && <Bot className="w-4 h-4 text-emerald-600 animate-pulse" />}
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons & Auth */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Global Search Trigger */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                title="Search Pet Connect"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* 1-Click Demo Accounts Switcher Pill */}
              <button
                onClick={() => setDemoModalOpen(true)}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded-full text-xs font-semibold shadow-xs transition-colors"
                title="Switch test user accounts"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Demo Switcher</span>
              </button>

              {/* Notification Center */}
              {isAuthenticated && (
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(!notifDropdownOpen);
                      setUserDropdownOpen(false);
                    }}
                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl relative transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-scale-up">
                      <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Notifications ({unreadCount} new)</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs font-semibold text-brand-600 hover:text-brand-800"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-slate-400">
                            No notifications yet.
                          </div>
                        ) : (
                          notifications.slice(0, 6).map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => {
                                markAsRead(notif.id);
                                if (notif.link) {
                                  navigate(notif.link);
                                  setNotifDropdownOpen(false);
                                }
                              }}
                              className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${
                                !notif.read ? 'bg-emerald-50/50' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                                <span>{notif.title}</span>
                                {!notif.read && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                              </div>
                              <p className="text-slate-600 leading-snug">{notif.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                      <Link
                        to="/notifications"
                        onClick={() => setNotifDropdownOpen(false)}
                        className="block py-2 text-center text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 border-t border-slate-100"
                      >
                        View all notifications
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* User Dropdown / Login Button */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(!userDropdownOpen);
                      setNotifDropdownOpen(false);
                    }}
                    className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <span className="hidden md:block text-xs font-bold text-slate-800 max-w-[120px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-scale-up">
                      <div className="p-4 bg-slate-50 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-brand-100 text-brand-800 border border-brand-200">
                          {user.role}
                        </span>
                      </div>
                      <div className="p-1 space-y-0.5 text-xs text-slate-700 font-medium">
                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-500" />
                          <span>My Dashboard</span>
                        </Link>

                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-purple-50 text-purple-700 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-purple-600" />
                            <span>Admin Center</span>
                          </Link>
                        )}

                        <Link
                          to="/messages"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4 text-slate-500" />
                          <span>Messages</span>
                        </Link>

                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-500" />
                          <span>Profile Settings</span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm shadow-brand-500/30 transition-all hover:scale-[1.02]"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile menu hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-fade-in">
            <button
              onClick={() => {
                setDemoModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 py-2 mb-2 bg-purple-50 text-purple-700 rounded-xl text-xs font-bold border border-purple-200"
            >
              <Sparkles className="w-4 h-4" />
              <span>1-Click Demo Account Switcher</span>
            </button>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                  location.pathname === link.path
                    ? 'bg-brand-50 text-brand-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Demo Switcher & Search Modals */}
      <DemoSwitcherModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
};
