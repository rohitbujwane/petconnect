import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, CheckCircle2, MapPin, Camera, Phone, User, Calendar } from 'lucide-react';

export const LostFoundReportPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialType = (searchParams.get('type') as 'Lost' | 'Found') || 'Lost';
  const [reportType, setReportType] = useState<'Lost' | 'Found'>(initialType);

  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    petName: '',
    species: 'Dog',
    breed: '',
    gender: 'Male',
    age: '2 years',
    location: '',
    city: 'Pune',
    dateTime: new Date().toISOString().slice(0, 16),
    description: '',
    identifyingMarks: '',
    contactName: user?.name || '',
    contactPhone: user?.phone || '',
    contactEmail: user?.email || '',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80'
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

      if (reportType === 'Lost') {
        await api.post('/lost-found/lost', {
          petName: formData.petName,
          species: formData.species,
          breed: formData.breed || 'Indie / Mix',
          gender: formData.gender,
          age: formData.age,
          lastSeenLocation: formData.location,
          city: formData.city,
          coordinates: coords,
          dateTime: formData.dateTime,
          description: formData.description,
          identifyingMarks: formData.identifyingMarks,
          contactName: formData.contactName,
          contactPhone: formData.contactPhone,
          contactEmail: formData.contactEmail,
          images: [formData.imageUrl]
        });
      } else {
        await api.post('/lost-found/found', {
          species: formData.species,
          approximateBreed: formData.breed || 'Unknown / Mixed',
          locationFound: formData.location,
          city: formData.city,
          coordinates: coords,
          dateTime: formData.dateTime,
          description: formData.description,
          contactName: formData.contactName,
          contactPhone: formData.contactPhone,
          contactEmail: formData.contactEmail,
          images: [formData.imageUrl]
        });
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/lost-found');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error publishing incident report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-black font-display text-slate-900 tracking-tight">
          Publish Incident Report
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Alert volunteers, pet parents, and animal welfare organizations across Maharashtra.
        </p>
      </div>

      {/* Type Selector Tabs */}
      <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setReportType('Lost')}
          className={`py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
            reportType === 'Lost'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>I Lost My Pet</span>
        </button>

        <button
          type="button"
          onClick={() => setReportType('Found')}
          className={`py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
            reportType === 'Found'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>I Found a Stray / Pet</span>
        </button>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold text-center">
          Incident report pinned to community radar! Redirecting to map...
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold text-center">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reportType === 'Lost' && (
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Pet Name</label>
              <input
                type="text"
                value={formData.petName}
                onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                placeholder="e.g. Max, Bella"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
                required={reportType === 'Lost'}
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Species</label>
            <select
              value={formData.species}
              onChange={(e) => setFormData({ ...formData, species: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
            >
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Rabbit">Rabbit</option>
              <option value="Other">Other Animal</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">
              {reportType === 'Lost' ? 'Breed' : 'Approximate Breed'}
            </label>
            <input
              type="text"
              value={formData.breed}
              onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
              placeholder="e.g. Indie, Labrador, Persian"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
            />
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
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">
              {reportType === 'Lost' ? 'Last Seen Exact Location / Landmark' : 'Found Location Landmark'}
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Near Jogger’s Park, Kalyani Nagar Bridge"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Date & Approximate Time</label>
            <input
              type="datetime-local"
              value={formData.dateTime}
              onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Photo URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Description of Circumstances</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe color, size, collar, emotional behavior..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
              required
            />
          </div>

          {reportType === 'Lost' && (
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Identifying Marks / Collar Details</label>
              <input
                type="text"
                value={formData.identifyingMarks}
                onChange={(e) => setFormData({ ...formData, identifyingMarks: e.target.value })}
                placeholder="e.g. White patch over right eye, red nylon collar with bell"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Your Name</label>
            <input
              type="text"
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Contact Phone (Public)</label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
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
            className={`px-8 py-3.5 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all ${
              reportType === 'Lost' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {loading ? 'Publishing...' : reportType === 'Lost' ? 'Publish Lost Pet Alert' : 'Publish Found Pet Report'}
          </button>
        </div>
      </form>
    </div>
  );
};
