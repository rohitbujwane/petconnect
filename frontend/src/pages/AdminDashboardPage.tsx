import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  Users,
  Heart,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Building2,
  Stethoscope,
  TrendingUp,
  FileText,
  Compass,
  ArrowRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/analytics');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleResetDb = async () => {
    if (!window.confirm('Are you sure you want to reset all data back to the clean initial demo state?')) return;
    setResetting(true);
    try {
      const res = await api.post('/admin/reset-db');
      if (res.data.success) {
        setResetSuccess(true);
        fetchAnalytics();
        setTimeout(() => setResetSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error resetting database:', err);
    } finally {
      setResetting(false);
    }
  };

  const COLORS = ['#16a34a', '#0d9488', '#f59e0b', '#ec4899', '#6366f1'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Platform Administration
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900 tracking-tight mt-1">
            Admin Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            System metrics, user roles, rescue analytics, and welfare moderation tools.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleResetDb}
            disabled={resetting}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5"
            title="Reset to fresh demo sample data"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span>Reset Demo DB</span>
          </button>
        </div>
      </div>

      {resetSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold">
          Database cleanly restored to factory demo state!
        </div>
      )}

      {/* Admin Sub-navigation Links */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Link
          to="/admin/users"
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/30 text-center font-bold text-xs text-slate-800 transition-all flex flex-col items-center space-y-1.5"
        >
          <Users className="w-5 h-5 text-purple-600" />
          <span>Manage Users</span>
        </Link>
        <Link
          to="/admin/pets"
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-brand-400 hover:bg-brand-50/30 text-center font-bold text-xs text-slate-800 transition-all flex flex-col items-center space-y-1.5"
        >
          <Heart className="w-5 h-5 text-brand-600" />
          <span>Manage Pets</span>
        </Link>
        <Link
          to="/admin/adoptions"
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 text-center font-bold text-xs text-slate-800 transition-all flex flex-col items-center space-y-1.5"
        >
          <FileText className="w-5 h-5 text-emerald-600" />
          <span>Adoptions Review</span>
        </Link>
        <Link
          to="/admin/rescue"
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-red-400 hover:bg-red-50/30 text-center font-bold text-xs text-slate-800 transition-all flex flex-col items-center space-y-1.5"
        >
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span>Rescue Dispatch</span>
        </Link>
        <Link
          to="/admin/reports"
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 text-center font-bold text-xs text-slate-800 transition-all flex flex-col items-center space-y-1.5 col-span-2 sm:col-span-1"
        >
          <Compass className="w-5 h-5 text-amber-600" />
          <span>Lost & Found Radar</span>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 bg-slate-100 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <>
          {/* Top Key Performance Indicators (KPIs) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Total Users</span>
              <div className="text-3xl font-black font-display text-slate-900">{data?.summary.totalUsers}</div>
              <span className="text-[11px] text-emerald-600 font-semibold block">Across 6 user roles</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Total Pets Listed</span>
              <div className="text-3xl font-black font-display text-brand-600">{data?.summary.totalPets}</div>
              <span className="text-[11px] text-slate-500 font-semibold block">{data?.summary.availablePets} Available for adoption</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Rescue Success Rate</span>
              <div className="text-3xl font-black font-display text-emerald-600">{data?.summary.rescueSuccessRate}%</div>
              <span className="text-[11px] text-slate-500 font-semibold block">{data?.summary.rescuedCount} animals saved</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Partner NGOs</span>
              <div className="text-3xl font-black font-display text-purple-600">{data?.summary.totalNGOs}</div>
              <span className="text-[11px] text-slate-500 font-semibold block">{data?.summary.totalVolunteers} Active Volunteers</span>
            </div>
          </div>

          {/* Recharts Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Monthly Trend Area Chart (8 cols) */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-bold font-display text-slate-900">
                  Monthly Adoption & Rescue Trajectory
                </h3>
                <p className="text-xs text-slate-500">6-month growth in adoptions, emergencies handled, and user registrations</p>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.charts.monthlyTrends || []}>
                    <defs>
                      <linearGradient id="colorAdoptions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorRescues" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e11d48" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Area type="monotone" dataKey="adoptions" stroke="#16a34a" fillOpacity={1} fill="url(#colorAdoptions)" name="Adoptions" />
                    <Area type="monotone" dataKey="rescues" stroke="#e11d48" fillOpacity={1} fill="url(#colorRescues)" name="Emergency Rescues" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Species Distribution Pie Chart (4 cols) */}
            <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-bold font-display text-slate-900">
                  Species Breakdown
                </h3>
                <p className="text-xs text-slate-500">Inventory by animal category</p>
              </div>

              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.charts.speciesDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {(data?.charts.speciesDistribution || []).map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-semibold text-slate-600">
                {(data?.charts.speciesDistribution || []).map((s: any, idx: number) => (
                  <span key={idx} className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                    <span>{s.name} ({s.value})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
