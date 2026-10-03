import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { RescueCase, RescueStatus } from '../types';
import { AlertTriangle, ArrowLeft, Phone, MapPin, CheckCircle, ShieldAlert } from 'lucide-react';

export const AdminRescuePage: React.FC = () => {
  const [rescueCases, setRescueCases] = useState<RescueCase[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRescues = async () => {
    setLoading(true);
    try {
      const res = await api.get('/rescue');
      if (res.data.success) {
        setRescueCases(res.data.cases);
      }
    } catch (err) {
      console.error('Error fetching rescues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRescues();
  }, []);

  const handleStatusChange = async (id: string, status: RescueStatus) => {
    try {
      const res = await api.put(`/rescue/${id}/status`, { status, noteText: `Status updated by Admin to ${status}` });
      if (res.data.success) {
        setRescueCases(prev => prev.map(c => (c.id === id ? { ...c, status } : c)));
      }
    } catch (err) {
      console.error('Error updating status:', err);
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
      <div>
        <Link
          to="/admin"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Center</span>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-black font-display text-slate-900 tracking-tight">
          Rescue Missions Command
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor emergency animal dispatch cases, responder assignments, and medical rehabilitation.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Animal & Condition</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Location</th>
                <th className="p-4">Reporter Contact</th>
                <th className="p-4">Assigned Responder</th>
                <th className="p-4">Workflow Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rescueCases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={c.images[0]}
                        alt={c.animalType}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{c.animalType}</span>
                        <span className="text-slate-500 text-[11px]">{c.condition}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                      c.emergencyLevel === 'Critical' ? 'bg-red-100 text-red-800' :
                      c.emergencyLevel === 'High' ? 'bg-rose-100 text-rose-800' :
                      c.emergencyLevel === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {c.emergencyLevel}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">
                    <div>{c.location}</div>
                    <div className="text-[11px] text-slate-400">{c.city}</div>
                  </td>
                  <td className="p-4 text-slate-600">
                    <span className="font-bold text-slate-800 block">{c.reporterName}</span>
                    <a href={`tel:${c.reporterPhone}`} className="text-brand-600 hover:underline text-[11px]">
                      {c.reporterPhone}
                    </a>
                  </td>
                  <td className="p-4 text-slate-600">
                    <span className="font-semibold text-emerald-700">{c.assignedVolunteerName || 'Unassigned'}</span>
                  </td>
                  <td className="p-4">
                    <select
                      value={c.status}
                      onChange={(e) => handleStatusChange(c.id, e.target.value as RescueStatus)}
                      className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
