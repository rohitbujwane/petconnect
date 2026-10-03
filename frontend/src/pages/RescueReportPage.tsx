import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { EmergencyLevel } from '../types';
import { AlertTriangle, MapPin, Phone, User, ShieldAlert, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const RescueReportPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    animalType: 'Indie Dog',
    condition: 'Injured',
    emergencyLevel: 'High' as EmergencyLevel,
    location: '',
    city: 'Pune',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    reporterName: user?.name || '',
    reporterPhone: user?.phone || ''
  });

  const cityCoordinates: Record<string, { lat: number; lng: number }> = {
    Pune: { lat: 18.5204, lng: 73.8567 },
    Mumbai: { lat: 19.0760, lng: 72.8777 },
    Nanded: { lat: 19.1383, lng: 77.3210 },
    Nagpur: { lat: 21.1458, lng: 79.0882 },
    'Chhatrapati Sambhajinagar': { lat: 19.8762, lng: 75.3433 }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const coords = cityCoordinates[formData.city] || { lat: 18.5204, lng: 73.8567 };

      const res = await api.post('/rescue', {
        ...formData,
        coordinates: coords,
        images: [formData.imageUrl]
      });

      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/rescue');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error reporting emergency.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          to="/rescue"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Rescue Operations Feed</span>
        </Link>
      </div>

      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
          Immediate Emergency Dispatch
        </span>
        <h1 className="text-3xl font-black font-display text-slate-900 tracking-tight">
          Report Animal in Need
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Your emergency report dispatches real-time alerts to nearby animal ambulances, verified volunteers, and veterinary shelters.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold text-center flex items-center justify-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Emergency logged! Rescuers and ambulances alerted. Redirecting...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Animal Type</label>
            <input
              type="text"
              value={formData.animalType}
              onChange={(e) => setFormData({ ...formData, animalType: e.target.value })}
              placeholder="e.g. Street Dog, Kitten, Injured Bird, Cow"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Emergency Condition</label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
            >
              <option value="Injured">Injured (Wounds / Bleeding)</option>
              <option value="Accident">Accident (Hit by vehicle / Fractures)</option>
              <option value="Animal Trapped">Animal Trapped (Drain / Trench / Height)</option>
              <option value="Abandoned">Abandoned (Orphaned neonate litter)</option>
              <option value="Abuse">Abuse / Cruelty Neglect</option>
              <option value="Stray Requiring Care">Stray Requiring Medical Attention</option>
              <option value="Other">Other Emergency</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Emergency Severity Level</label>
            <select
              value={formData.emergencyLevel}
              onChange={(e) => setFormData({ ...formData, emergencyLevel: e.target.value as EmergencyLevel })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none"
            >
              <option value="Critical">🔴 Critical (Life-threatening / Heavy bleeding)</option>
              <option value="High">🟠 High (Unable to stand / Deep fractures)</option>
              <option value="Medium">🟡 Medium (Maggot wounds / Abandoned puppy)</option>
              <option value="Low">🔵 Low (Minor limp / Entangled wire)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">City</label>
            <select
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
            >
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Nanded">Nanded</option>
              <option value="Nagpur">Nagpur</option>
              <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Exact Location / Landmark</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Under Pune Station Flyover, Somwar Peth"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Photo / Video Evidence URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Describe Animal Condition & Safety</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Please describe visible injuries, whether the animal is conscious, aggressive, or hiding..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Your Name (Reporter)</label>
            <input
              type="text"
              value={formData.reporterName}
              onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
              placeholder="Your full name"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Your Phone (For Ambulance Dispatch)</label>
            <input
              type="tel"
              value={formData.reporterPhone}
              onChange={(e) => setFormData({ ...formData, reporterPhone: e.target.value })}
              placeholder="+91 98XXX XXXXX"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{loading ? 'Alerting Rescuers...' : 'Dispatch Emergency Rescue Case'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
