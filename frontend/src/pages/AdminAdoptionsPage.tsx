import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { AdoptionApplication, ApplicationStatus } from '../types';
import { FileText, ArrowLeft, CheckCircle2, Clock, Eye, AlertCircle } from 'lucide-react';

export const AdminAdoptionsPage: React.FC = () => {
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<AdoptionApplication | null>(null);
  const [statusVal, setStatusVal] = useState<ApplicationStatus>('Pending');
  const [reviewNote, setReviewNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/adoptions');
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.error('Error fetching adoption applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleOpenReview = (app: AdoptionApplication) => {
    setSelectedApp(app);
    setStatusVal(app.status);
    setReviewNote(app.reviewNotes || '');
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setUpdating(true);
    try {
      const res = await api.put(`/adoptions/${selectedApp.id}/status`, {
        status: statusVal,
        reviewNotes: reviewNote
      });

      if (res.data.success) {
        setSelectedApp(null);
        fetchApplications();
      }
    } catch (err) {
      console.error('Error updating application status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const statuses: ApplicationStatus[] = [
    'Pending',
    'Under Review',
    'Interview Required',
    'Approved',
    'Rejected',
    'Completed'
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
          Adoption Applications Oversight
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review applicant suitability, schedule interviews, and finalize legal adoptions.
        </p>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Pet Target</th>
                <th className="p-4">Applicant</th>
                <th className="p-4">Home & Experience</th>
                <th className="p-4">Current Status</th>
                <th className="p-4 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={app.petImage || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80'}
                        alt={app.petName}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <span className="font-bold text-slate-900">{app.petName}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">
                    <div className="font-bold text-slate-900">{app.applicantName} ({app.applicantAge} yrs)</div>
                    <div className="text-[11px] text-slate-400">{app.applicantPhone} • {app.city}</div>
                  </td>
                  <td className="p-4 text-slate-600">
                    <div>{app.homeType} ({app.familyMembersCount} family members)</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[200px]">{app.previousExperience}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOpenReview(app)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Review & Decide
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Status Dialog Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 max-h-[85vh] overflow-y-auto">
            <div>
              <h3 className="text-xl font-bold font-display text-slate-900">
                Review Application for {selectedApp.petName}
              </h3>
              <p className="text-xs text-slate-500">Applicant: {selectedApp.applicantName} ({selectedApp.applicantPhone})</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2 text-slate-700">
              <p><strong>Occupation:</strong> {selectedApp.occupation}</p>
              <p><strong>Address:</strong> {selectedApp.address}, {selectedApp.city}</p>
              <p><strong>Home Type:</strong> {selectedApp.homeType} ({selectedApp.familyMembersCount} members)</p>
              <p><strong>Reason for Adoption:</strong> {selectedApp.reasonForAdoption}</p>
              <p><strong>Care Arrangements:</strong> {selectedApp.expectedCareArrangements}</p>
              <p><strong>Prior Experience:</strong> {selectedApp.previousExperience}</p>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Decision Status</label>
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value as ApplicationStatus)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Counselor / Shelter Notes</label>
                <textarea
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="e.g. Telephonic interview round cleared. Home verification visit scheduled..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
                >
                  {updating ? 'Saving...' : 'Update Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
