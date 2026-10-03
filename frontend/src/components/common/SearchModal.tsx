import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Search, X, Dog, Stethoscope, HeartHandshake, AlertCircle, MapPin, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    pets: any[];
    vets: any[];
    ngos: any[];
    rescues: any[];
    lostFound: any[];
  }>({ pets: [], vets: [], ngos: [], rescues: [], lostFound: [] });

  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults({ pets: [], vets: [], ngos: [], rescues: [], lostFound: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        if (res.data.success) {
          setResults(res.data.results);
        }
      } catch (err) {
        console.error('Error during global search:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const totalResults =
    results.pets.length +
    results.vets.length +
    results.ngos.length +
    results.rescues.length +
    results.lostFound.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pets, veterinarians, NGOs, rescue cases, lost animals, cities..."
            className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 text-base"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 mr-2 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold text-slate-500 bg-slate-200 hover:bg-slate-300 rounded-md"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="py-8 text-center text-sm text-slate-500">
              <span className="inline-block animate-spin mr-2">🐾</span> Searching across Pet Connect...
            </div>
          )}

          {!loading && query && totalResults === 0 && (
            <div className="py-10 text-center">
              <Dog className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">No results found for "{query}"</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for "Pune", "Indie", "Surgery", or "Vaccine"</p>
            </div>
          )}

          {!loading && !query && (
            <div className="py-8 text-center text-xs text-slate-400">
              Type keywords above to search pets, clinics, rescue missions, and shelters.
            </div>
          )}

          {/* Pets Result */}
          {results.pets.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center">
                <Dog className="w-3.5 h-3.5 mr-1 text-brand-600" /> Pets for Adoption ({results.pets.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {results.pets.map((pet) => (
                  <div
                    key={pet.id}
                    onClick={() => handleNavigate(`/pets/${pet.id}`)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/30 cursor-pointer flex items-center space-x-3 transition-colors"
                  >
                    <img
                      src={pet.images[0]}
                      alt={pet.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">{pet.name}</h4>
                      <p className="text-xs text-slate-500 truncate">{pet.breed} • {pet.city}</p>
                      <span className="inline-block mt-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                        {pet.adoptionStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vets Result */}
          {results.vets.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center">
                <Stethoscope className="w-3.5 h-3.5 mr-1 text-blue-600" /> Veterinarians ({results.vets.length})
              </h3>
              <div className="space-y-1.5">
                {results.vets.map((vet) => (
                  <div
                    key={vet.id}
                    onClick={() => handleNavigate(`/vets`)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={vet.avatar}
                        alt={vet.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{vet.name}</h4>
                        <p className="text-xs text-slate-500">{vet.specialization} • {vet.clinicName}, {vet.city}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NGOs Result */}
          {results.ngos.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center">
                <HeartHandshake className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Animal Welfare NGOs ({results.ngos.length})
              </h3>
              <div className="space-y-1.5">
                {results.ngos.map((ngo) => (
                  <div
                    key={ngo.id}
                    onClick={() => handleNavigate(`/ngos`)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{ngo.organizationName}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {ngo.city} • Rescues: {ngo.totalRescues}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rescue Cases */}
          {results.rescues.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1 text-rose-600" /> Emergency Rescue Cases ({results.rescues.length})
              </h3>
              <div className="space-y-1.5">
                {results.rescues.map((rescue) => (
                  <div
                    key={rescue.id}
                    onClick={() => handleNavigate(`/rescue`)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-rose-400 hover:bg-rose-50/30 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-800">{rescue.animalType} ({rescue.condition})</span>
                        <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                          {rescue.emergencyLevel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{rescue.location}, {rescue.city} • Status: {rescue.status}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
