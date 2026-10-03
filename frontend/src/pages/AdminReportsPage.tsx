import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { LostPet, FoundPet } from '../types';
import { Compass, ArrowLeft, Phone, MapPin, CheckCircle } from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const [lostList, setLostList] = useState<LostPet[]>([]);
  const [foundList, setFoundList] = useState<FoundPet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get('/lost-found');
      if (res.data.success) {
        setLostList(res.data.lost || []);
        setFoundList(res.data.found || []);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdateStatus = async (id: string, type: 'Lost' | 'Found', newStatus: string) => {
    try {
      await api.put(`/lost-found/${id}/status`, { type, status: newStatus });
      fetchReports();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

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
          Lost & Found Incident Moderation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor missing pet reports, reunions, and resolved cases across regions.
        </p>
      </div>

      {/* Lost Pets Table */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Missing Pets Dossiers ({lostList.length})</h2>
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Pet</th>
                  <th className="p-4">Last Seen</th>
                  <th className="p-4">Marks & Details</th>
                  <th className="p-4">Guardian Contact</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lostList.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img src={p.images[0]} alt={p.petName} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <span className="font-bold text-slate-900 block">{p.petName}</span>
                          <span className="text-slate-500 text-[11px]">{p.breed}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <div>{p.lastSeenLocation}</div>
                      <div className="text-[11px] text-slate-400">{p.city}</div>
                    </td>
                    <td className="p-4 text-slate-600 max-w-[200px] truncate">
                      {p.identifyingMarks}
                    </td>
                    <td className="p-4 text-slate-600">
                      <div>{p.contactName}</div>
                      <div className="text-[11px] text-brand-600 font-mono">{p.contactPhone}</div>
                    </td>
                    <td className="p-4">
                      <select
                        value={p.status}
                        onChange={(e) => handleUpdateStatus(p.id, 'Lost', e.target.value)}
                        className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none"
                      >
                        <option value="Lost">Lost</option>
                        <option value="Reunited">Reunited</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
