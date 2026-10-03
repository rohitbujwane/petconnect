import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Pet } from '../types';
import { PetCard } from '../components/pets/PetCard';
import { PetFilter } from '../components/pets/PetFilter';
import { AIMatchModal } from '../components/pets/AIMatchModal';
import { Sparkles, Dog, Filter, RotateCcw } from 'lucide-react';

export const PetListingPage: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const initialFilters = {
    species: 'All',
    city: 'All',
    gender: 'All',
    vaccinated: undefined as boolean | undefined,
    sterilized: undefined as boolean | undefined,
    specialNeeds: undefined as boolean | undefined,
    adoptionStatus: 'All',
    search: '',
    sortBy: 'newest'
  };

  const [filters, setFilters] = useState(initialFilters);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.species !== 'All') params.append('species', filters.species);
      if (filters.city !== 'All') params.append('city', filters.city);
      if (filters.gender !== 'All') params.append('gender', filters.gender);
      if (filters.adoptionStatus !== 'All') params.append('adoptionStatus', filters.adoptionStatus);
      if (filters.vaccinated !== undefined) params.append('vaccinated', String(filters.vaccinated));
      if (filters.sterilized !== undefined) params.append('sterilized', String(filters.sterilized));
      if (filters.specialNeeds !== undefined) params.append('specialNeeds', String(filters.specialNeeds));
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);

      const res = await api.get(`/pets?${params.toString()}`);
      if (res.data.success) {
        setPets(res.data.pets);
      }
    } catch (err) {
      console.error('Error fetching pets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [filters]);

  const handleReset = () => {
    setFilters(initialFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-600 via-emerald-600 to-teal-600 rounded-3xl p-8 sm:p-10 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-brand-100">
            Adoption Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight">
            Find Your Companion
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Every rescue animal here has been checked by a certified veterinarian and is waiting to shower your home with unconditional love.
          </p>
        </div>

        <button
          onClick={() => setIsAiModalOpen(true)}
          className="px-6 py-3.5 bg-white hover:bg-slate-50 text-brand-800 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 flex items-center space-x-2 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-brand-600" />
          <span>Launch AI Compatibility Matcher</span>
        </button>
      </div>

      {/* Filter Component */}
      <PetFilter filters={filters} setFilters={setFilters} onReset={handleReset} />

      {/* Listing Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Showing <strong className="text-slate-800">{pets.length}</strong> pets available</span>
          {filters.search && (
            <span>Search keyword: <em className="text-brand-600 font-bold">"{filters.search}"</em></span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 bg-slate-100 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : pets.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
            <Dog className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No pets match your selected filters</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try broadening your search or resetting filters to see all furry companions ready for adoption.
            </p>
            <button
              onClick={handleReset}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </div>

      {/* AI Matcher Modal */}
      <AIMatchModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
    </div>
  );
};
