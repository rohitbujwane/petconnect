import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { LostPet, FoundPet } from '../types';
import { LostFoundMap } from '../components/map/LostFoundMap';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  MapPin,
  Phone,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Search,
  PlusCircle,
  HelpCircle,
  Eye,
  Map,
  Grid
} from 'lucide-react';

export const LostFoundPage: React.FC = () => {
  const [lostPets, setLostPets] = useState<LostPet[]>([]);
  const [foundPets, setFoundPets] = useState<FoundPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'both' | 'map' | 'grid'>('both');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Lost' | 'Found'>('All');
  const [cityFilter, setCityFilter] = useState('All');
  const [speciesFilter, setSpeciesFilter] = useState('All');

  // Claim Match Modal State
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [activeClaimTarget, setActiveClaimTarget] = useState<{ report: any; type: 'Lost' | 'Found' } | null>(null);
  const [claimMessage, setClaimMessage] = useState('');
  const [claimContact, setClaimContact] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);

  const { user } = useAuth();

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cityFilter !== 'All') params.append('city', cityFilter);
      if (speciesFilter !== 'All') params.append('species', speciesFilter);

      const res = await api.get(`/lost-found?${params.toString()}`);
      if (res.data.success) {
        setLostPets(res.data.lost || []);
        setFoundPets(res.data.found || []);
      }
    } catch (err) {
      console.error('Error fetching lost and found reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [cityFilter, speciesFilter]);

  const handleOpenClaimModal = (report: LostPet | FoundPet, type: 'Lost' | 'Found') => {
    setActiveClaimTarget({ report, type });
    setClaimMessage(
      type === 'Lost'
        ? `Hello! I spotted a pet matching ${report.species} near this area. Let's verify.`
        : `Hello! This pet strongly resembles my missing pet. I would like to verify details.`
    );
    setClaimContact(user?.phone || user?.email || '');
    setClaimSuccess(false);
    setClaimModalOpen(true);
  };

  const handleSendClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClaimTarget) return;

    try {
      const res = await api.post('/lost-found/claim', {
        reportId: activeClaimTarget.report.id,
        reportType: activeClaimTarget.type,
        claimantMessage: claimMessage,
        contactInfo: claimContact
      });
      if (res.data.success) {
        setClaimSuccess(true);
        setTimeout(() => {
          setClaimModalOpen(false);
        }, 1500);
      }
    } catch (err) {
      console.error('Error submitting match claim:', err);
    }
  };

  const filteredLost = typeFilter === 'Found' ? [] : lostPets;
  const filteredFound = typeFilter === 'Lost' ? [] : foundPets;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 rounded-3xl p-8 sm:p-10 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-amber-100">
            Real-Time Community Radar
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight">
            Lost & Found Pet Network
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
            Every minute counts when a companion is missing. Pinpoint sightings on the interactive map, contact finders, and reunite families.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/lost-found/report?type=Lost"
            className="px-5 py-3 bg-red-700 hover:bg-red-800 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Report Lost Pet</span>
          </Link>

          <Link
            to="/lost-found/report?type=Found"
            className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Report Found Pet</span>
          </Link>
        </div>
      </div>

      {/* Filter and View Toggles Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Type Filter Buttons */}
        <div className="flex items-center space-x-2">
          {(['All', 'Lost', 'Found'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                typeFilter === t
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t === 'All' ? 'All Reports' : t === 'Lost' ? '🔴 Lost Pets' : '🟢 Found Pets'}
            </button>
          ))}
        </div>

        {/* City and Species Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
          >
            <option value="All">All Maharashtra Cities</option>
            <option value="Pune">Pune</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Nanded">Nanded</option>
            <option value="Nagpur">Nagpur</option>
            <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
          </select>

          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
          >
            <option value="All">All Species</option>
            <option value="Dog">Dogs</option>
            <option value="Cat">Cats</option>
            <option value="Bird">Birds</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('both')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${viewMode === 'both' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
            >
              Both
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${viewMode === 'map' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
            >
              Map
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${viewMode === 'grid' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* Map Section */}
      {(viewMode === 'both' || viewMode === 'map') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Map className="w-5 h-5 text-amber-600" />
              <span>Interactive Incident Radar</span>
            </h2>
            <div className="flex items-center space-x-4 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500"></span> Lost Pet Marker</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Found Pet Marker</span>
            </div>
          </div>
          <LostFoundMap
            lostPets={filteredLost}
            foundPets={filteredFound}
            onClaimClick={handleOpenClaimModal}
          />
        </div>
      )}

      {/* Cards Grid Section */}
      {(viewMode === 'both' || viewMode === 'grid') && (
        <div className="space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Grid className="w-5 h-5 text-slate-700" />
            <span>Active Incident Dossiers ({filteredLost.length + filteredFound.length})</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Lost Pet Cards */}
            {filteredLost.map((lost) => (
              <div
                key={lost.id}
                className="bg-white rounded-3xl border border-red-200/90 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={lost.images[0]}
                      alt={lost.petName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-xs">
                      LOST PET
                    </div>
                    <div className="absolute bottom-3 left-3 bg-slate-900/80 text-white text-[11px] px-2.5 py-0.5 rounded-lg backdrop-blur-sm">
                      {lost.city}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold font-display text-slate-900">{lost.petName}</h3>
                      <span className="text-xs text-slate-500">{lost.species} • {lost.breed}</span>
                    </div>

                    <p className="text-xs text-slate-600 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span><strong>Last Seen:</strong> {lost.lastSeenLocation}</span>
                    </p>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {lost.description}
                    </p>

                    <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 text-[11px] text-slate-700">
                      <strong>Distinct Marks:</strong> {lost.identifyingMarks}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-2">
                  <a
                    href={`tel:${lost.contactPhone}`}
                    className="w-full flex items-center justify-center space-x-1.5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Guardian ({lost.contactPhone})</span>
                  </a>

                  <button
                    onClick={() => handleOpenClaimModal(lost, 'Lost')}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
                  >
                    "I Found This Pet" (Notify Guardian)
                  </button>
                </div>
              </div>
            ))}

            {/* Found Pet Cards */}
            {filteredFound.map((found) => (
              <div
                key={found.id}
                className="bg-white rounded-3xl border border-emerald-200/90 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={found.images[0]}
                      alt="Found Pet"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-xs">
                      FOUND PET
                    </div>
                    <div className="absolute bottom-3 left-3 bg-slate-900/80 text-white text-[11px] px-2.5 py-0.5 rounded-lg backdrop-blur-sm">
                      {found.city}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold font-display text-slate-900">{found.species}</h3>
                      <span className="text-xs text-slate-500">Approx. {found.approximateBreed}</span>
                    </div>

                    <p className="text-xs text-slate-600 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>Found Location:</strong> {found.locationFound}</span>
                    </p>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {found.description}
                    </p>

                    <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-[11px] text-slate-700">
                      <strong>Finder:</strong> {found.contactName}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-2">
                  <a
                    href={`tel:${found.contactPhone}`}
                    className="w-full flex items-center justify-center space-x-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Finder ({found.contactPhone})</span>
                  </a>

                  <button
                    onClick={() => handleOpenClaimModal(found, 'Found')}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
                  >
                    "This May Be My Pet" (Notify Finder)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Claim Match Dialog Modal */}
      {claimModalOpen && activeClaimTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-lg font-bold font-display text-slate-900">
              {activeClaimTarget.type === 'Lost' ? 'Report a Sighting / Found Pet' : 'Claim This Found Pet'}
            </h3>
            <p className="text-xs text-slate-500">
              Send a direct alert to the reporter to compare photos and verify ownership.
            </p>

            {claimSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-bold text-center">
                Match notification dispatched to reporter!
              </div>
            ) : (
              <form onSubmit={handleSendClaim} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Your Message</label>
                  <textarea
                    rows={3}
                    value={claimMessage}
                    onChange={(e) => setClaimMessage(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Your Phone or Email</label>
                  <input
                    type="text"
                    value={claimContact}
                    onChange={(e) => setClaimContact(e.target.value)}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setClaimModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs"
                  >
                    Send Match Notification
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
