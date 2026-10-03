import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Pet } from '../types';
import { useAuth } from '../context/AuthContext';
import { PetCard } from '../components/pets/PetCard';
import {
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Phone,
  Share2,
  Calendar,
  Activity,
  CheckCircle,
  AlertCircle,
  Building2,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';

export const PetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [relatedPets, setRelatedPets] = useState<Pet[]>([]);
  const [activeImage, setActiveImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [favorited, setFavorited] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPet = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/pets/${id}`);
        if (res.data.success) {
          setPet(res.data.pet);
          setActiveImage(res.data.pet.images[0] || '');
          setRelatedPets(res.data.relatedPets || []);
        }
      } catch (err) {
        console.error('Error fetching pet details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
    window.scrollTo(0, 0);
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated || !pet) {
      alert('Please log in or use the 1-Click Demo Switcher to save favorites.');
      return;
    }
    try {
      const res = await api.post('/pets/favorite', { petId: pet.id });
      if (res.data.success) {
        setFavorited(res.data.favorited);
      }
    } catch (err) {
      console.error('Error updating favorite:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold text-slate-500">Loading pet profile...</p>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Pet profile not found</h2>
        <Link to="/pets" className="inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">
          Back to all pets
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <div>
        <Link
          to="/pets"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Pet Listings</span>
        </Link>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Gallery & Photos */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
            <img
              src={activeImage}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className={`text-xs font-bold px-3 py-1 rounded-full text-white backdrop-blur-md ${
                pet.adoptionStatus === 'Available' ? 'bg-emerald-500/90' : 'bg-amber-500/90'
              }`}>
                {pet.adoptionStatus}
              </span>
            </div>
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-slate-900 shadow-sm transition-all"
                title="Share Pet Profile"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleFavoriteToggle}
                className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center shadow-sm transition-all ${
                  favorited ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-700 hover:text-rose-500'
                }`}
                title="Save Favorite"
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          {pet.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {pet.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImage === img ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${pet.name} thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {copied && (
            <div className="p-2.5 text-xs text-center text-emerald-800 bg-emerald-50 rounded-xl border border-emerald-200">
              Link copied to clipboard! Share it with friends and family.
            </div>
          )}
        </div>

        {/* Right: Detailed Pet Info & Adoption CTAs */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900">
                {pet.name}
              </h1>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                {pet.species} • {pet.gender}
              </span>
            </div>

            <p className="text-base font-semibold text-slate-700 mb-2">{pet.breed}</p>

            <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-4">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{pet.location} ({pet.city})</span>
            </p>

            {/* Quick Fact Grid */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Age</span>
                <span className="text-sm font-bold text-slate-800">{pet.age} {pet.ageUnit}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Size</span>
                <span className="text-sm font-bold text-slate-800">{pet.size}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Activity</span>
                <span className="text-sm font-bold text-slate-800">{pet.activityLevel} Energy</span>
              </div>
            </div>
          </div>

          {/* Personality Traits */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Personality & Temperament
            </h3>
            <div className="flex flex-wrap gap-2">
              {pet.personality.map((trait, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Medical Info & Social Suitability */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Health & Household Compatibility
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <div className={`p-3 rounded-xl border flex items-center space-x-2 ${pet.vaccinated ? 'bg-teal-50 border-teal-200 text-teal-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                <ShieldCheck className="w-4 h-4" />
                <span>{pet.vaccinated ? 'Vaccinated' : 'Vaccination in progress'}</span>
              </div>

              <div className={`p-3 rounded-xl border flex items-center space-x-2 ${pet.sterilized ? 'bg-indigo-50 border-indigo-200 text-indigo-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                <CheckCircle className="w-4 h-4" />
                <span>{pet.sterilized ? 'Neutered / Spayed' : 'Sterilization required'}</span>
              </div>

              <div className={`p-3 rounded-xl border flex items-center space-x-2 ${pet.goodWithKids ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                <CheckCircle className="w-4 h-4" />
                <span>{pet.goodWithKids ? 'Great with Children' : 'Better in adult home'}</span>
              </div>

              <div className={`p-3 rounded-xl border flex items-center space-x-2 ${pet.goodWithPets ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                <CheckCircle className="w-4 h-4" />
                <span>{pet.goodWithPets ? 'Good with other pets' : 'Prefers solo pet'}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <strong className="text-slate-900 block">Veterinary Medical Notes:</strong>
              <p>{pet.medicalInfo}</p>
              {pet.specialNeeds && (
                <div className="pt-2 text-amber-800">
                  <strong>Special Care Requirement:</strong> {pet.specialNeedsDetails || pet.careRequirements}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              About {pet.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {pet.description}
            </p>
          </div>

          {/* Shelter / Caregiver Contact */}
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">Caregiver / Shelter</span>
                <span className="text-xs font-bold text-slate-900">{pet.fosterOrOwnerName}</span>
              </div>
            </div>
            <a
              href={`tel:${pet.fosterOrOwnerPhone}`}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact</span>
            </a>
          </div>

          {/* Primary Apply Action Button */}
          <div className="pt-2 space-y-3">
            <Link
              to={`/adoption?petId=${pet.id}`}
              className="w-full block py-4 bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 text-white text-center rounded-2xl font-bold text-sm sm:text-base shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.01]"
            >
              Apply to Adopt {pet.name}
            </Link>

            <p className="text-[11px] text-center text-slate-400">
              100% Free Adoption. Applications are reviewed within 48 hours by {pet.fosterOrOwnerName}.
            </p>
          </div>
        </div>
      </div>

      {/* Related Pets Section */}
      {relatedPets.length > 0 && (
        <div className="pt-12 border-t border-slate-200 space-y-6">
          <div>
            <h3 className="text-2xl font-bold font-display text-slate-900">
              Other Companions You Might Love
            </h3>
            <p className="text-xs text-slate-500">More furry friends from {pet.city}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPets.map((p) => (
              <PetCard key={p.id} pet={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
