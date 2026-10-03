import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Volunteer } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Award,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle,
  PlusCircle,
  Phone,
  Mail,
  Heart
} from 'lucide-react';

export const VolunteersPage: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');

  // Registration Modal State
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [skillsInput, setSkillsInput] = useState('Animal First Aid, Foster Care, Transport');
  const [availabilityInput, setAvailabilityInput] = useState<'Weekdays' | 'Weekends' | 'Full-time' | 'Emergency On-call'>('Weekends');
  const [experienceInput, setExperienceInput] = useState('Experienced with dog and cat rescue handling.');
  const [preferredTypeInput, setPreferredTypeInput] = useState('Street dog rescues and puppy fosters');
  const [submitting, setSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  const { user, isAuthenticated } = useAuth();

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cityFilter !== 'All') params.append('city', cityFilter);
      if (availabilityFilter !== 'All') params.append('availability', availabilityFilter);

      const res = await api.get(`/volunteers?${params.toString()}`);
      if (res.data.success) {
        setVolunteers(res.data.volunteers);
      }
    } catch (err) {
      console.error('Error fetching volunteers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, [cityFilter, availabilityFilter]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const skillsArray = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
      const res = await api.post('/volunteers/register', {
        name: user?.name || 'Volunteer',
        email: user?.email || '',
        phone: user?.phone || '',
        city: user?.city || 'Pune',
        skills: skillsArray,
        availability: availabilityInput,
        animalExperience: experienceInput,
        preferredRescueType: preferredTypeInput
      });

      if (res.data.success) {
        setRegSuccess(true);
        setTimeout(() => {
          setRegisterModalOpen(false);
          fetchVolunteers();
        }, 1500);
      }
    } catch (err) {
      console.error('Error registering volunteer:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-brand-700 rounded-3xl p-8 sm:p-10 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-teal-100">
            Community Frontline
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight">
            Volunteer Lifesaver Network
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
            Our volunteers respond to accident emergencies, foster recovering animals, conduct weekend adoption drives, and assist in animal birth control programs.
          </p>
        </div>

        <button
          onClick={() => setRegisterModalOpen(true)}
          className="px-6 py-3.5 bg-white hover:bg-slate-50 text-teal-800 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 flex items-center space-x-2 shrink-0"
        >
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>Register as a Volunteer</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">City:</span>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
          >
            <option value="All">All Maharashtra</option>
            <option value="Pune">Pune</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Nanded">Nanded</option>
            <option value="Nagpur">Nagpur</option>
            <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Availability:</span>
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
          >
            <option value="All">All Availabilities</option>
            <option value="Emergency On-call">Emergency On-call</option>
            <option value="Weekends">Weekends</option>
            <option value="Weekdays">Weekdays</option>
            <option value="Full-time">Full-time</option>
          </select>
        </div>
      </div>

      {/* Volunteer Cards Grid */}
      <div className="space-y-4">
        <div className="text-xs font-semibold text-slate-500">
          Showing <strong className="text-slate-800">{volunteers.length}</strong> registered lifesavers
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-slate-100 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {volunteers.map((vol) => (
              <div
                key={vol.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold font-display text-slate-900">{vol.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{vol.city} • <strong className="text-emerald-700">{vol.availability}</strong></span>
                      </p>
                    </div>
                    <span className="px-2.5 py-1 text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded-full flex items-center gap-1">
                      ⭐ {vol.rating}
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {vol.badges.map((b, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-md flex items-center gap-1"
                      >
                        <Award className="w-3 h-3 text-purple-600" /> {b}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {vol.animalExperience}
                  </p>

                  {/* Skills Pills */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Verified Skills:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {vol.skills.map((s, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Metrics */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {vol.hoursContributed} hrs logged
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    {vol.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Volunteer Registration Modal */}
      {registerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5">
            <h3 className="text-xl font-bold font-display text-slate-900">
              Join the Pet Connect Volunteer Force
            </h3>
            <p className="text-xs text-slate-500">
              Contribute your weekends or emergency availability to make a direct impact on stray animal welfare.
            </p>

            {regSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-bold text-center">
                Registered successfully! Welcome to the volunteer network.
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Rescue Skills (comma separated)</label>
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder="First Aid, Dog Walking, Foster Care, Transport"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Availability Schedule</label>
                  <select
                    value={availabilityInput}
                    onChange={(e) => setAvailabilityInput(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="Weekends">Weekends Only</option>
                    <option value="Emergency On-call">Emergency On-call (24/7)</option>
                    <option value="Weekdays">Weekdays</option>
                    <option value="Full-time">Full-time Volunteer</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Animal Handling Experience</label>
                  <textarea
                    rows={2}
                    value={experienceInput}
                    onChange={(e) => setExperienceInput(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Preferred Welfare Area</label>
                  <input
                    type="text"
                    value={preferredTypeInput}
                    onChange={(e) => setPreferredTypeInput(e.target.value)}
                    placeholder="e.g. Stray feeding, Dog rescues, Kitten fosters"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRegisterModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs"
                  >
                    {submitting ? 'Registering...' : 'Complete Volunteer Registration'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
