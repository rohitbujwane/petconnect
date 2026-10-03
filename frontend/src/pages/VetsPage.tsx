import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Veterinarian } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Stethoscope,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  ShieldCheck,
  Phone,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const VetsPage: React.FC = () => {
  const [vets, setVets] = useState<Veterinarian[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedVet, setSelectedVet] = useState<Veterinarian | null>(null);
  const [petName, setPetName] = useState('Sheru');
  const [petSpecies, setPetSpecies] = useState('Dog');
  const [appointmentDate, setAppointmentDate] = useState('2026-04-10');
  const [appointmentTime, setAppointmentTime] = useState('11:00 AM');
  const [reason, setReason] = useState('Annual core vaccination booster and general physical checkup');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { isAuthenticated, user } = useAuth();

  const fetchVets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cityFilter !== 'All') params.append('city', cityFilter);
      if (search) params.append('search', search);

      const res = await api.get(`/vets?${params.toString()}`);
      if (res.data.success) {
        setVets(res.data.vets);
      }
    } catch (err) {
      console.error('Error fetching veterinarians:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVets();
  }, [cityFilter, search]);

  const handleOpenBooking = (vet: Veterinarian) => {
    setSelectedVet(vet);
    setBookingSuccess(false);
    setBookingModalOpen(true);
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in or use the 1-Click Demo Switcher to book a vet appointment.');
      return;
    }
    if (!selectedVet) return;

    setSubmitting(true);
    try {
      const res = await api.post('/vets/appointments', {
        vetId: selectedVet.id,
        petName,
        petSpecies,
        petAge: '2 years',
        appointmentDate,
        appointmentTime,
        reason,
        userPhone: user?.phone || '+91 98811 44332'
      });

      if (res.data.success) {
        setBookingSuccess(true);
        setTimeout(() => {
          setBookingModalOpen(false);
        }, 1500);
      }
    } catch (err) {
      console.error('Error booking appointment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-700 rounded-3xl p-8 sm:p-10 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-blue-100">
            Medical & Clinical Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight">
            Verified Veterinarians
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Connect with board-certified veterinary surgeons, feline specialists, and general practitioners for wellness visits, orthopedic surgeries, and routine vaccinations.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-xs font-bold">
          <ShieldCheck className="w-5 h-5 text-blue-300" />
          <span>Licensed BVSc & MVSc Doctors</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
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

        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by doctor name, specialization, or clinic..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Vets Grid */}
      <div className="space-y-4">
        <div className="text-xs font-semibold text-slate-500">
          Showing <strong className="text-slate-800">{vets.length}</strong> certified veterinary doctors
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-72 bg-slate-100 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vets.map((vet) => (
              <div
                key={vet.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={vet.avatar}
                      alt={vet.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1.5">
                        <h3 className="text-base font-bold font-display text-slate-900">{vet.name}</h3>
                      </div>
                      <p className="text-xs text-blue-700 font-semibold">{vet.qualification}</p>
                      <p className="text-[11px] text-slate-500">{vet.experienceYears} Years Experience</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-xs font-bold text-slate-900 block">{vet.clinicName}</span>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{vet.address}, {vet.city}</span>
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Specialization & Services:
                    </span>
                    <p className="text-xs font-medium text-slate-700 mb-2">{vet.specialization}</p>
                    <div className="flex flex-wrap gap-1">
                      {vet.services.slice(0, 3).map((s, idx) => (
                        <span key={idx} className="text-[10px] bg-blue-50 text-blue-800 border border-blue-100 px-2 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Consultation</span>
                    <span className="text-base font-black font-display text-slate-900">₹{vet.consultationFee}</span>
                  </div>

                  <button
                    onClick={() => handleOpenBooking(vet)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    Request Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Appointment Booking Modal */}
      {bookingModalOpen && selectedVet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5">
            <div>
              <h3 className="text-lg font-bold font-display text-slate-900">
                Book Visit with {selectedVet.name}
              </h3>
              <p className="text-xs text-slate-500">
                {selectedVet.clinicName} • {selectedVet.city} (Fee: ₹{selectedVet.consultationFee})
              </p>
            </div>

            {bookingSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-bold text-center flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Appointment requested! Check status in your Appointments dashboard.</span>
              </div>
            ) : (
              <form onSubmit={handleBookAppointment} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">Pet Name</label>
                    <input
                      type="text"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">Species</label>
                    <select
                      value={petSpecies}
                      onChange={(e) => setPetSpecies(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                    >
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Bird">Bird</option>
                      <option value="Rabbit">Rabbit</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">Preferred Date</label>
                    <input
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">Time Slot</label>
                    <select
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                    >
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:30 PM">04:30 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Reason for Clinic Consultation</label>
                  <textarea
                    rows={2}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                  >
                    {submitting ? 'Submitting...' : 'Confirm Appointment Request'}
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
