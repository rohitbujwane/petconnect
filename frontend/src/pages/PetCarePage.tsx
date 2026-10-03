import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { PetHealthRecord, PetCareReminder, ReminderType } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Bell,
  Clock,
  Calendar,
  PlusCircle,
  CheckCircle2,
  Trash2,
  Activity,
  Bot,
  Pill,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const PetCarePage: React.FC = () => {
  const [healthRecords, setHealthRecords] = useState<PetHealthRecord[]>([]);
  const [reminders, setReminders] = useState<PetCareReminder[]>([]);
  const [loading, setLoading] = useState(true);

  // New Reminder Modal
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [remPetName, setRemPetName] = useState('Sheru');
  const [remType, setRemType] = useState<ReminderType>('Vaccination');
  const [remTitle, setRemTitle] = useState('Nobivac Anti-Rabies Booster');
  const [remDate, setRemDate] = useState('2026-05-15');
  const [remNotes, setRemNotes] = useState('Carry clinic health passport booklet.');
  const [submittingRem, setSubmittingRem] = useState(false);

  const { isAuthenticated, user } = useAuth();

  const fetchData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [recRes, remRes] = await Promise.all([
        api.get('/pet-care/health-records'),
        api.get('/pet-care/reminders')
      ]);

      if (recRes.data.success) setHealthRecords(recRes.data.healthRecords);
      if (remRes.data.success) setReminders(remRes.data.reminders);
    } catch (err) {
      console.error('Error fetching pet care data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  const handleToggleReminder = async (id: string) => {
    try {
      const res = await api.put(`/pet-care/reminders/${id}/toggle`);
      if (res.data.success) {
        setReminders(prev =>
          prev.map(r => (r.id === id ? { ...r, completed: !r.completed } : r))
        );
      }
    } catch (err) {
      console.error('Error toggling reminder:', err);
    }
  };

  const handleDeleteReminder = async (id: string) => {
    try {
      await api.delete(`/pet-care/reminders/${id}`);
      setReminders(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Error deleting reminder:', err);
    }
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingRem(true);
    try {
      const res = await api.post('/pet-care/reminders', {
        petName: remPetName,
        type: remType,
        title: remTitle,
        dueDate: remDate,
        time: '10:00 AM',
        frequency: 'Once',
        notes: remNotes
      });

      if (res.data.success) {
        setReminders(prev => [...prev, res.data.reminder]);
        setReminderModalOpen(false);
      }
    } catch (err) {
      console.error('Error creating reminder:', err);
    } finally {
      setSubmittingRem(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-brand-800 rounded-3xl p-8 sm:p-10 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-emerald-100">
            Digital Health & Wellness Passports
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight">
            Pet Care & Digital Health Records
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Maintain your companion's lifelong vaccination cards, treatment timelines, allergy records, and proactive care reminders in one secure digital vault.
          </p>
        </div>

        <Link
          to="/pet-care/assistant"
          className="px-6 py-3.5 bg-white hover:bg-slate-50 text-emerald-900 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 flex items-center space-x-2 shrink-0"
        >
          <Bot className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>Consult PetCare AI</span>
        </Link>
      </div>

      {/* Grid: Health Records on Left (7 cols), Reminders on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Health Records Dossier */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Digital Health Passports</span>
            </h2>
          </div>

          {loading ? (
            <div className="h-64 bg-slate-100 rounded-3xl animate-pulse"></div>
          ) : healthRecords.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              No digital health passports linked to your account yet. Records are generated when you adopt or verify at a clinic.
            </div>
          ) : (
            <div className="space-y-6">
              {healthRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-5"
                >
                  {/* Passport Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xl font-bold font-display text-slate-900">{rec.petName}</h3>
                        <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          Verified Passport
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {rec.species} • {rec.breed} • Guardian: {rec.ownerName}
                      </p>
                    </div>

                    <div className="text-right text-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Microchip</span>
                      <span className="font-mono text-slate-700 font-semibold">{rec.microchipNumber || 'Not chipped'}</span>
                    </div>
                  </div>

                  {/* Vaccinations Schedule Timeline */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Immunization Schedule</span>
                    </h4>
                    <div className="space-y-2">
                      {rec.vaccinations.map((vac) => (
                        <div
                          key={vac.id}
                          className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-800 block">{vac.vaccineName}</span>
                            <span className="text-slate-500 text-[11px]">Given: {vac.dateGiven} • By: {vac.administeredBy}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Next Due</span>
                            <span className="font-bold text-slate-900">{vac.nextDueDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Medical Diagnosis & Treatments */}
                  {rec.medicalHistory.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-blue-600" />
                        <span>Clinical Diagnosis & Treatments</span>
                      </h4>
                      <div className="space-y-2">
                        {rec.medicalHistory.map((med) => (
                          <div key={med.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
                            <div className="flex items-center justify-between font-bold text-slate-800">
                              <span>{med.diagnosis}</span>
                              <span className="text-slate-400 text-[11px]">{med.date}</span>
                            </div>
                            <p className="text-slate-600 text-[11px] leading-relaxed">{med.treatment}</p>
                            <span className="text-[10px] text-blue-600 font-semibold block">Attending Vet: {med.vetName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Allergies / Notes */}
                  {rec.allergies.length > 0 && (
                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-xs text-amber-900 flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Allergies / Drug Sensitivities:</strong>
                        <p className="text-[11px] mt-0.5">{rec.allergies.join(', ')}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Care Reminders & Calendar (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-600" />
              <span>Care Reminders ({reminders.filter(r => !r.completed).length} pending)</span>
            </h2>

            <button
              onClick={() => setReminderModalOpen(true)}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-3">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className={`p-4 rounded-3xl border transition-all flex items-start justify-between gap-3 ${
                  rem.completed
                    ? 'bg-slate-50 border-slate-200/60 opacity-60'
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => handleToggleReminder(rem.id)}
                    className={`w-5 h-5 rounded-md mt-0.5 border flex items-center justify-center transition-colors ${
                      rem.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 hover:border-emerald-500'
                    }`}
                  >
                    {rem.completed && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div className="space-y-0.5">
                    <span className={`text-xs font-bold block ${rem.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {rem.title}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Pet: <strong>{rem.petName}</strong> • {rem.type}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block mt-1">
                      📅 Due: {rem.dueDate} ({rem.time})
                    </span>
                    {rem.notes && (
                      <p className="text-[11px] text-slate-500 pt-1 italic">{rem.notes}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteReminder(rem.id)}
                  className="text-slate-400 hover:text-rose-500 p-1 rounded-lg"
                  title="Delete reminder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Quick PetCare AI Callout Card */}
          <div className="p-6 bg-gradient-to-tr from-emerald-50 to-teal-50 rounded-3xl border border-emerald-200 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Have a health or diet question?</h3>
                <p className="text-xs text-slate-500">Ask PetCare AI instant questions anytime</p>
              </div>
            </div>
            <Link
              to="/pet-care/assistant"
              className="w-full block py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-center rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              Open PetCare AI Chatbot
            </Link>
          </div>
        </div>
      </div>

      {/* Add Reminder Modal */}
      {reminderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-lg font-bold font-display text-slate-900">Schedule Care Reminder</h3>
            <form onSubmit={handleCreateReminder} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Pet Name</label>
                <input
                  type="text"
                  value={remPetName}
                  onChange={(e) => setRemPetName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Care Category</label>
                <select
                  value={remType}
                  onChange={(e) => setRemType(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="Vaccination">Vaccination Booster</option>
                  <option value="Medication">Medication / Spot-on</option>
                  <option value="Deworming">Deworming Dose</option>
                  <option value="Grooming">Bath & Grooming</option>
                  <option value="Vet Appointment">Vet Visit</option>
                  <option value="Feeding">Special Diet</option>
                  <option value="Other">Other Care</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Reminder Title</label>
                <input
                  type="text"
                  value={remTitle}
                  onChange={(e) => setRemTitle(e.target.value)}
                  placeholder="e.g. Give tick chewable tablet"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Due Date</label>
                <input
                  type="date"
                  value={remDate}
                  onChange={(e) => setRemDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Notes (Optional)</label>
                <input
                  type="text"
                  value={remNotes}
                  onChange={(e) => setRemNotes(e.target.value)}
                  placeholder="e.g. Give with food after breakfast"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReminderModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRem}
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs"
                >
                  {submittingRem ? 'Saving...' : 'Add Reminder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
