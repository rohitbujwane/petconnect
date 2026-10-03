import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Heart, Lock, Mail, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('user@petconnect.demo');
  const [password, setPassword] = useState('Demo@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  const handleQuickDemo = async (role: UserRole) => {
    setLoading(true);
    setError('');
    const res = await demoLogin(role);
    setLoading(false);
    if (res.success) {
      if (role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2 mb-1">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <span className="text-2xl font-black font-display text-slate-900 tracking-tight">
              Pet<span className="text-brand-600">Connect</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold font-display text-slate-900">Welcome Back</h1>
          <p className="text-xs text-slate-500">Sign in to your account or pick a 1-click test role below.</p>
        </div>

        {/* 1-Click Fast Demo Role Selectors */}
        <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200/80 space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-900">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>1-Click Fast Demo Login (Instant Evaluation)</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-1.5 px-2 bg-white hover:bg-purple-100 text-purple-800 rounded-lg border border-purple-200 transition-colors"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('ngo')}
              className="py-1.5 px-2 bg-white hover:bg-emerald-100 text-emerald-800 rounded-lg border border-purple-200 transition-colors"
            >
              NGO Shelter
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('vet')}
              className="py-1.5 px-2 bg-white hover:bg-blue-100 text-blue-800 rounded-lg border border-purple-200 transition-colors"
            >
              Veterinarian
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('volunteer')}
              className="py-1.5 px-2 bg-white hover:bg-amber-100 text-amber-800 rounded-lg border border-purple-200 transition-colors"
            >
              Volunteer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('adopter')}
              className="py-1.5 px-2 bg-white hover:bg-rose-100 text-rose-800 rounded-lg border border-purple-200 transition-colors col-span-2"
            >
              Pet Adopter (User)
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium rounded-xl">
            {error}
          </div>
        )}

        {/* Regular Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
          >
            <span>{loading ? 'Signing In...' : 'Sign In to Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-xs text-center text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-600 font-bold hover:underline">
            Register as Adopter, Shelter, or Vet
          </Link>
        </p>
      </div>
    </div>
  );
};
