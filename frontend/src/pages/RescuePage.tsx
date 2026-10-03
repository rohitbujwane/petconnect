import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { RescueCase, RescueStatus, EmergencyLevel } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  AlertTriangle,
  ShieldAlert,
  Clock,
  MapPin,
  Phone,
  UserCheck,
  CheckCircle,
  Activity,
  PlusCircle,
  MessageSquare
} from 'lucide-react';

export const RescuePage: React.FC = () => {
  const [rescueCases, setRescueCases] = useState<RescueCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [selectedCase, setSelectedCase] = useState<RescueCase | null>(null);

  // Status Update Modal State
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<RescueStatus>('Reported');
  const [noteText, setNoteText] = useState('');
  const [volunteerName, setVolunteerName] = useState('');
  const [updating, setUpdating] = useState(false);

  const { user, isAuthenticated } = useAuth();

  const fetchRescues = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (levelFilter !== 'All') params.append('emergencyLevel', levelFilter);

      const res = await api.get(`/rescue?${params.toString()}`);
      if (res.data.success) {
        setRescueCases(res.data.cases);
      }
    } catch (err) {
      console.error('Error fetching rescue cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRescues();
  }, [statusFilter, levelFilter]);

  const handleOpenUpdate = (caseItem: RescueCase) => {
    setSelectedCase(caseItem);
    setTargetStatus(caseItem.status);
    setVolunteerName(caseItem.assignedVolunteerName || user?.name || '');
    setNoteText('');
    setUpdateModalOpen(true);
  };

  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;

    setUpdating(true);
    try {
      // If assigning volunteer
      if (targetStatus === 'Assigned' && volunteerName) {
        await api.post(`/rescue/${selectedCase.id}/assign`, {
          volunteerName,
          volunteerId: user?.id
        });
      }

      const res = await api.put(`/rescue/${selectedCase.id}/status`, {
        status: targetStatus,
        noteText
      });

      if (res.data.success) {
        setUpdateModalOpen(false);
        fetchRescues();
      }
    } catch (err) {
      console.error('Error updating rescue case:', err);
    } finally {
      setUpdating(false);
    }
  };

  const getEmergencyBadge = (level: EmergencyLevel) => {
    switch (level) {
      case 'Critical':
        return <span className="bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">CRITICAL</span>;
      case 'High':
        return <span className="bg-rose-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase">HIGH</span>;
      case 'Medium':
        return <span className="bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase">MEDIUM</span>;
      case 'Low':
        return <span className="bg-blue-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase">LOW</span>;
      default:
        return null;
    }
  };

  const statuses: RescueStatus[] = [
    'Reported',
    'Assigned',
    'Rescue in Progress',
    'Rescued',
    'Treatment',
    'Rehabilitating',
    'Closed'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-3xl p-8 sm:p-10 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-red-100">
            Emergency Response Network
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight">
            Animal Rescue Operations
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
            Coordinating rapid volunteer dispatch, ambulance transit, emergency veterinary triage, and post-trauma shelter care across Maharashtra.
          </p>
        </div>

        <Link
          to="/rescue/report"
          className="px-6 py-3.5 bg-white hover:bg-slate-50 text-red-700 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all hover:scale-105 flex items-center space-x-2 shrink-0"
        >
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span>Report Animal Emergency</span>
        </Link>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Severity Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Severity:</span>
          {['All', 'Critical', 'High', 'Medium', 'Low'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                levelFilter === lvl
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            {statuses.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Rescue Cases List */}
      <div className="space-y-4">
        <div className="text-xs font-semibold text-slate-500">
          Showing <strong className="text-slate-800">{rescueCases.length}</strong> active rescue missions
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-44 bg-slate-100 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {rescueCases.map((caseItem) => (
              <div
                key={caseItem.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Image & Main Info */}
                <div className="flex items-start sm:items-center space-x-4">
                  <img
                    src={caseItem.images[0]}
                    alt={caseItem.animalType}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {getEmergencyBadge(caseItem.emergencyLevel)}
                      <h3 className="text-lg font-bold font-display text-slate-900">
                        {caseItem.animalType} ({caseItem.condition})
                      </h3>
                      <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                        {caseItem.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{caseItem.location}, {caseItem.city}</span>
                    </p>

                    <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                      {caseItem.description}
                    </p>

                    <div className="flex items-center space-x-4 text-[11px] text-slate-400 pt-1">
                      <span>Reported by: <strong className="text-slate-700">{caseItem.reporterName}</strong></span>
                      {caseItem.assignedVolunteerName && (
                        <span>Assigned to: <strong className="text-emerald-700">{caseItem.assignedVolunteerName}</strong></span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Timeline & Action Button */}
                <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col items-end justify-between gap-3 shrink-0">
                  <div className="text-right text-xs">
                    <span className="text-[10px] text-slate-400 block">Logged Time</span>
                    <span className="font-semibold text-slate-700">
                      {new Date(caseItem.createdAt).toLocaleDateString()} {new Date(caseItem.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <a
                      href={`tel:${caseItem.reporterPhone}`}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Reporter</span>
                    </a>

                    <button
                      onClick={() => handleOpenUpdate(caseItem)}
                      className="px-4 py-2 bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                    >
                      Update Case Status
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Case Update Modal */}
      {updateModalOpen && selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-5 max-h-[85vh] overflow-y-auto">
            <div>
              <h3 className="text-lg font-bold font-display text-slate-900">
                Update Mission Status: {selectedCase.animalType}
              </h3>
              <p className="text-xs text-slate-500">
                Log triage notes and change state along the emergency workflow.
              </p>
            </div>

            <form onSubmit={handleSaveUpdate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Progress Status</label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as RescueStatus)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Assign Rescuer / Volunteer Name</label>
                <input
                  type="text"
                  value={volunteerName}
                  onChange={(e) => setVolunteerName(e.target.value)}
                  placeholder="e.g. Aarav Deshmukh (Volunteer)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Field Notes / Medical Update</label>
                <textarea
                  rows={3}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="e.g. Bandage applied, animal admitted to shelter ICU..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                />
              </div>

              {/* Existing Notes Log */}
              {selectedCase.notes.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                  <span className="font-bold text-slate-700 block">Incident Log Timeline:</span>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {selectedCase.notes.map((n) => (
                      <div key={n.id} className="text-[11px] text-slate-600 border-l-2 border-brand-500 pl-2">
                        <span className="font-semibold text-slate-800">{n.author}:</span> {n.text}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUpdateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs"
                >
                  {updating ? 'Saving...' : 'Confirm Status Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
