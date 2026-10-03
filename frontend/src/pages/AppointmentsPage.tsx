import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Appointment, AppointmentStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Stethoscope,
  Phone,
  User,
  PlusCircle,
  AlertCircle
} from 'lucide-react';

export const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  const fetchAppointments = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await api.get('/vets/appointments/my');
      if (res.data.success) {
        setAppointments(res.data.appointments);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [isAuthenticated]);

  const handleUpdateStatus = async (id: string, status: AppointmentStatus) => {
    try {
      const res = await api.put(`/vets/appointments/${id}/status`, { status });
      if (res.data.success) {
        fetchAppointments();
      }
    } catch (err) {
      console.error('Error updating appointment:', err);
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'Requested':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">Awaiting Clinic Confirmation</span>;
      case 'Confirmed':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">Confirmed Slot</span>;
      case 'Completed':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">Visit Completed</span>;
      case 'Cancelled':
        return <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full border border-rose-200">Cancelled</span>;
      default:
        return null;
    }
  };

  const isVetOrAdmin = user?.role === 'vet' || user?.role === 'admin';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Veterinary Clinical Care</span>
          <h1 className="text-3xl font-black font-display text-slate-900 tracking-tight">
            Veterinary Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track clinic consultations, vaccinations, and status confirmation.
          </p>
        </div>

        <Link
          to="/vets"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Find & Book a Vet</span>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-32 bg-slate-100 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No scheduled appointments</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Book routine checkups or vaccinations for your rescued companions with licensed veterinarians.
          </p>
          <Link
            to="/vets"
            className="inline-block px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl"
          >
            Explore Veterinarians
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold font-display text-slate-900">
                    Patient: {apt.petName} ({apt.petSpecies})
                  </h3>
                  {getStatusBadge(apt.status)}
                </div>

                <p className="text-xs text-slate-600 flex items-center gap-1.5 font-semibold">
                  <Stethoscope className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{apt.vetName} • {apt.clinicName}</span>
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> {apt.appointmentDate}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {apt.appointmentTime}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <User className="w-3.5 h-3.5 text-slate-400" /> Guardian: {apt.userName} ({apt.userPhone})
                  </span>
                </div>

                <p className="text-xs text-slate-600 pt-1">
                  <strong>Reason:</strong> {apt.reason}
                </p>

                {apt.notes && (
                  <p className="text-[11px] text-slate-500 italic">
                    <strong>Clinic Notes:</strong> {apt.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {isVetOrAdmin && apt.status === 'Requested' && (
                  <button
                    onClick={() => handleUpdateStatus(apt.id, 'Confirmed')}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    Confirm Slot
                  </button>
                )}

                {isVetOrAdmin && apt.status === 'Confirmed' && (
                  <button
                    onClick={() => handleUpdateStatus(apt.id, 'Completed')}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    Mark Completed
                  </button>
                )}

                {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                  <button
                    onClick={() => handleUpdateStatus(apt.id, 'Cancelled')}
                    className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
