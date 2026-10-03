import React from 'react';
import { Search, RotateCcw, Filter, Check } from 'lucide-react';

interface PetFilterProps {
  filters: {
    species: string;
    city: string;
    gender: string;
    vaccinated?: boolean;
    sterilized?: boolean;
    specialNeeds?: boolean;
    adoptionStatus: string;
    search: string;
    sortBy: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  onReset: () => void;
}

export const PetFilter: React.FC<PetFilterProps> = ({ filters, setFilters, onReset }) => {
  const speciesList = ['All', 'Dog', 'Cat', 'Bird', 'Rabbit', 'Other'];
  const cities = ['All', 'Pune', 'Mumbai', 'Nanded', 'Nagpur', 'Chhatrapati Sambhajinagar'];

  const handleChange = (field: string, value: any) => {
    setFilters((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-5">
      {/* Species Selector Tabs */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 block">
          Species Category
        </label>
        <div className="flex flex-wrap gap-2">
          {speciesList.map((sp) => {
            const isSelected = filters.species === sp;
            return (
              <button
                key={sp}
                onClick={() => handleChange('species', sp)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30 scale-105'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {sp === 'All' ? '🐾 All Pets' : sp === 'Dog' ? '🐶 Dogs' : sp === 'Cat' ? '🐱 Cats' : sp === 'Bird' ? '🦜 Birds' : sp === 'Rabbit' ? '🐰 Rabbits' : '✨ Other'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Input & Dropdowns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Keyword Search */}
        <div className="relative">
          <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Search by Name or Breed</label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              placeholder="e.g. Golden, Indie, Calico..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {/* City Filter */}
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Location / City</label>
          <select
            value={filters.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Locations' : c}
              </option>
            ))}
          </select>
        </div>

        {/* Gender Filter */}
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Gender</label>
          <select
            value={filters.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Sorting */}
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="ageAsc">Youngest First</option>
            <option value="ageDesc">Oldest First</option>
            <option value="name">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Checkbox Toggles & Reset Row */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700">
          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.vaccinated === true}
              onChange={(e) => handleChange('vaccinated', e.target.checked ? true : undefined)}
              className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
            />
            <span>Vaccinated Only</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.sterilized === true}
              onChange={(e) => handleChange('sterilized', e.target.checked ? true : undefined)}
              className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
            />
            <span>Neutered / Spayed</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.specialNeeds === true}
              onChange={(e) => handleChange('specialNeeds', e.target.checked ? true : undefined)}
              className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
            />
            <span>Special Needs Friendly</span>
          </label>
        </div>

        <button
          onClick={onReset}
          className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
};
