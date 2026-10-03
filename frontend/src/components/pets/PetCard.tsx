import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pet } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Heart, MapPin, ShieldCheck, Sparkles, Activity } from 'lucide-react';

interface PetCardProps {
  pet: Pet;
  isFavoritedInitially?: boolean;
  onFavoriteToggle?: (petId: string, isFav: boolean) => void;
}

export const PetCard: React.FC<PetCardProps> = ({ pet, isFavoritedInitially = false, onFavoriteToggle }) => {
  const { isAuthenticated } = useAuth();
  const [favorited, setFavorited] = useState(isFavoritedInitially);
  const [loadingFav, setLoadingFav] = useState(false);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please log in or use the 1-Click Demo Switcher to save favorite pets.');
      return;
    }

    setLoadingFav(true);
    try {
      const res = await api.post('/pets/favorite', { petId: pet.id });
      if (res.data.success) {
        setFavorited(res.data.favorited);
        if (onFavoriteToggle) {
          onFavoriteToggle(pet.id, res.data.favorited);
        }
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setLoadingFav(false);
    }
  };

  const getStatusBadge = () => {
    switch (pet.adoptionStatus) {
      case 'Available':
        return <span className="bg-emerald-500/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-xs">Available for Adoption</span>;
      case 'Pending':
        return <span className="bg-amber-500/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-xs">Adoption Pending</span>;
      case 'Adopted':
        return <span className="bg-purple-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-xs">Happy Forever Home</span>;
      default:
        return null;
    }
  };

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={pet.images[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80'}
          alt={pet.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          {getStatusBadge()}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={handleToggleFavorite}
          disabled={loadingFav}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
            favorited
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
              : 'bg-white/80 text-slate-600 hover:bg-white hover:text-rose-500'
          }`}
          title={favorited ? 'Remove from saved favorites' : 'Save to favorites'}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
        </button>

        {/* Species Pill */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="bg-slate-900/75 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-lg backdrop-blur-sm">
            {pet.species} • {pet.gender}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xl font-bold font-display text-slate-900 group-hover:text-brand-600 transition-colors">
              {pet.name}
            </h3>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {pet.age} {pet.ageUnit}
            </span>
          </div>

          <p className="text-xs font-medium text-slate-600 mb-2 truncate">
            {pet.breed}
          </p>

          <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{pet.location}</span>
          </p>

          {/* Personality Badges */}
          <div className="flex flex-wrap gap-1 mb-3">
            {pet.personality.slice(0, 3).map((trait, idx) => (
              <span
                key={idx}
                className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100"
              >
                {trait}
              </span>
            ))}
          </div>

          {/* Medical & Special Tags */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            {pet.vaccinated && (
              <span className="flex items-center gap-1 text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md font-medium">
                <ShieldCheck className="w-3 h-3" /> Vaccinated
              </span>
            )}
            {pet.specialNeeds && (
              <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-medium">
                <Sparkles className="w-3 h-3" /> Special Needs
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/pets/${pet.id}`}
          className="w-full text-center py-2.5 px-4 bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs hover:shadow-md"
        >
          View Profile & Meet
        </Link>
      </div>
    </div>
  );
};
