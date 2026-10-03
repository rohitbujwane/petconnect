import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Pet, AdoptionApplication, Appointment, PetCareReminder } from '../types';
import { PetCard } from '../components/pets/PetCard';
import {
  Heart,
  Calendar,
  Clock,
  Bell,
  ShieldCheck,
  User,
  PlusCircle,
  FileText,
  Activity,
  ArrowRight
} from 'lucide-react';

export const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Pet[]>([]);
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reminders, setReminders] = useState<PetCareReminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [favRes, appRes, aptRes, remRes] = await Promise.all([
          api.get('/pets/favorites'),
          api.get('/adoptions/my'),
          api.get('/vets/appointments/my'),
          api.get('/pet-care/reminders')
        ]);

        if (favRes.data.success) setFavorites(favRes.data.favorites);
        if (appRes.data.success) setApplications(appRes.data.applications);
        if (aptRes.data.success) setAppointments(aptRes.data.appointments);
        if (remRes.data.success) setReminders(remRes.data.reminders);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">Pending</span>;
      case 'Under Review':
        return <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">Under Review</span>;
      case 'Interview Required':
        return <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">Interview Scheduled</span>;
      case 'Approved':
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">Approved</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
            alt={user?.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-brand-500/20 shadow-sm"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black font-display text-slate-900">
                Hello, {user?.name}!
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-brand-100 text-brand-800 border border-brand-200">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {user?.email} • {user?.city} • Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2026'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/pets"
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            Browse Pets
          </Link>
          <Link
            to="/profile"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Summary Stat Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs text-center space-y-1">
          <span className="text-2xl font-black font-display text-rose-600">{favorites.length}</span>
          <span className="text-xs font-semibold text-slate-500 block">Favorite Pets</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs text-center space-y-1">
          <span className="text-2xl font-black font-display text-brand-600">{applications.length}</span>
          <span className="text-xs font-semibold text-slate-500 block">Adoption Applications</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs text-center space-y-1">
          <span className="text-2xl font-black font-display text-blue-600">{appointments.length}</span>
          <span className="text-xs font-semibold text-slate-500 block">Vet Appointments</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs text-center space-y-1">
          <span className="text-2xl font-black font-display text-amber-600">{reminders.filter(r => !r.completed).length}</span>
          <span className="text-xs font-semibold text-slate-500 block">Active Reminders</span>
        </div>
      </div>

      {/* Applications Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-600" />
            <span>My Adoption Applications ({applications.length})</span>
          </h2>
          <Link to="/adoption" className="text-xs font-semibold text-brand-600 hover:underline">
            Submit New Application
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-xs text-slate-500">
            You haven't submitted any adoption applications yet. Find your dream companion on our adoption portal!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={app.petImage || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80'}
                    alt={app.petName}
                    className="w-14 h-14 rounded-2xl object-cover"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{app.petName}</h3>
                    <p className="text-[11px] text-slate-500">
                      Submitted: {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                    {app.reviewNotes && (
                      <p className="text-[10px] text-slate-600 italic mt-0.5 truncate max-w-[200px]">
                        "{app.reviewNotes}"
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  {getStatusBadge(app.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Appointments & Reminders Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appointments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Upcoming Vet Appointments ({appointments.length})</span>
            </h2>
            <Link to="/vets" className="text-xs font-semibold text-blue-600 hover:underline">
              Book Vet
            </Link>
          </div>

          {appointments.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              No upcoming veterinary appointments.
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 3).map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{apt.petName} — {apt.reason}</span>
                    <span className="text-slate-500">{apt.vetName} ({apt.clinicName})</span>
                    <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">
                      📅 {apt.appointmentDate} at {apt.appointmentTime}
                    </span>
                  </div>
                  <span className="font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reminders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-600" />
              <span>Care Reminders ({reminders.length})</span>
            </h2>
            <Link to="/pet-care" className="text-xs font-semibold text-amber-600 hover:underline">
              Manage All
            </Link>
          </div>

          {reminders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              No active care reminders scheduled.
            </div>
          ) : (
            <div className="space-y-3">
              {reminders.slice(0, 3).map((rem) => (
                <div
                  key={rem.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{rem.title}</span>
                    <span className="text-slate-500">Pet: {rem.petName} • {rem.type}</span>
                    <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">
                      📅 Due: {rem.dueDate}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${rem.completed ? 'bg-slate-100 text-slate-500' : 'bg-amber-100 text-amber-800'}`}>
                    {rem.completed ? 'Done' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Saved Favorite Pets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span>My Saved Favorite Pets ({favorites.length})</span>
          </h2>
          <Link to="/pets" className="text-xs font-semibold text-brand-600 hover:underline">
            Explore More Pets
          </Link>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-2">
            <p className="text-xs text-slate-500">You haven't added any pets to your favorites yet.</p>
            <Link to="/pets" className="inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">
              Browse Adoption Listings
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                isFavoritedInitially={true}
                onFavoriteToggle={(id, isFav) => {
                  if (!isFav) {
                    setFavorites(prev => prev.filter(p => p.id !== id));
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
