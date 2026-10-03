import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Pet, AdoptionApplication } from '../types';
import { Heart, CheckCircle2, ShieldCheck, AlertCircle, Clock, User, Home, FileText, ArrowRight } from 'lucide-react';

export const AdoptionApplicationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const petIdParam = searchParams.get('petId');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [availablePets, setAvailablePets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [myApplications, setMyApplications] = useState<AdoptionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    petId: petIdParam || '',
    applicantName: user?.name || '',
    applicantEmail: user?.email || '',
    applicantPhone: user?.phone || '',
    applicantAge: '27',
    address: user?.address || 'Kalyani Nagar',
    city: user?.city || 'Pune',
    occupation: 'Software Professional',
    previousExperience: 'Had family dogs for 8 years, familiar with routine care.',
    currentPets: 'None currently.',
    homeType: 'Apartment',
    familyMembersCount: '2',
    reasonForAdoption: 'To provide a loving permanent home and daily exercise companionship.',
    expectedCareArrangements: 'Work from home partial days, registered with local vet clinic.',
    agreedToTerms: true
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const petRes = await api.get('/pets');
        if (petRes.data.success) {
          setAvailablePets(petRes.data.pets);
          if (petIdParam) {
            const found = petRes.data.pets.find((p: Pet) => p.id === petIdParam);
            if (found) {
              setSelectedPet(found);
              setFormData(prev => ({ ...prev, petId: found.id }));
            }
          }
        }

        if (isAuthenticated) {
          const appRes = await api.get('/adoptions/my');
          if (appRes.data.success) {
            setMyApplications(appRes.data.applications);
          }
        }
      } catch (err) {
        console.error('Error loading adoption data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [petIdParam, isAuthenticated]);

  const handlePetSelect = (id: string) => {
    const pet = availablePets.find(p => p.id === id);
    setSelectedPet(pet || null);
    setFormData(prev => ({ ...prev, petId: id }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please sign in or use the Demo Switcher to submit an adoption application.');
      navigate('/login');
      return;
    }

    if (!formData.petId) {
      setErrorMsg('Please select a pet to adopt.');
      return;
    }

    if (!formData.agreedToTerms) {
      setErrorMsg('You must agree to responsible pet ownership terms.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.post('/adoptions', formData);
      if (res.data.success) {
        setSuccessMsg('Your adoption application has been submitted successfully! The caregiver/shelter will contact you.');
        // Refresh my applications
        const myRes = await api.get('/adoptions/my');
        if (myRes.data.success) {
          setMyApplications(myRes.data.applications);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMsg(res.data.message || 'Failed to submit application.');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Server error submitting application.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">Pending Review</span>;
      case 'Under Review':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">Under Review</span>;
      case 'Interview Required':
        return <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full border border-purple-200">Interview Call Scheduled</span>;
      case 'Approved':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">Approved for Meetup</span>;
      case 'Rejected':
        return <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full border border-rose-200">Application Declined</span>;
      case 'Completed':
        return <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">Adoption Finalized 🎉</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Responsible Adoption Protocol
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900 tracking-tight">
          Adoption Application Form
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Our shelter partners and foster guardians review each application to ensure a safe, lifelong match between animals and human families.
        </p>
      </div>

      {/* Existing Applications Tracker */}
      {myApplications.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-600" />
            <span>My Submitted Adoption Applications ({myApplications.length})</span>
          </h2>

          <div className="space-y-3">
            {myApplications.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={app.petImage || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80'}
                    alt={app.petName}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Application for {app.petName}</h3>
                    <p className="text-xs text-slate-500">
                      Submitted on {new Date(app.createdAt).toLocaleDateString()} • City: {app.city}
                    </p>
                    {app.reviewNotes && (
                      <p className="text-xs text-slate-600 mt-1 italic">
                        <strong>Shelter Note:</strong> "{app.reviewNotes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(app.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success / Error Feedback */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs sm:text-sm font-medium flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs sm:text-sm font-medium flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Application Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-8">
        {/* Step 1: Pet Selection */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-brand-700 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-xs">1</span>
            <span>Target Companion Pet</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Select Pet to Adopt</label>
              <select
                value={formData.petId}
                onChange={(e) => handlePetSelect(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none"
                required
              >
                <option value="">-- Choose a pet from available listings --</option>
                {availablePets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.species} • {p.breed} • {p.city})
                  </option>
                ))}
              </select>
            </div>

            {selectedPet && (
              <div className="p-3 bg-brand-50/50 rounded-xl border border-brand-200 flex items-center space-x-3">
                <img
                  src={selectedPet.images[0]}
                  alt={selectedPet.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">{selectedPet.name}</span>
                  <span className="text-slate-600">{selectedPet.breed} • {selectedPet.location}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Applicant Personal Details */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-2 text-brand-700 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-xs">2</span>
            <span>Applicant Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Full Legal Name</label>
              <input
                type="text"
                value={formData.applicantName}
                onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Email Address</label>
              <input
                type="email"
                value={formData.applicantEmail}
                onChange={(e) => setFormData({ ...formData, applicantEmail: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Contact Phone Number</label>
              <input
                type="tel"
                value={formData.applicantPhone}
                onChange={(e) => setFormData({ ...formData, applicantPhone: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Applicant Age</label>
              <input
                type="number"
                min="18"
                max="90"
                value={formData.applicantAge}
                onChange={(e) => setFormData({ ...formData, applicantAge: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Occupation / Profession</label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">City / Town</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none"
                required
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Residential Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Building name, Flat/House number, Street, Landmark"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Step 3: Household & Lifestyle Experience */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-2 text-brand-700 font-bold text-sm">
            <span className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-xs">3</span>
            <span>Living Space & Pet Experience</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Home Type</label>
              <select
                value={formData.homeType}
                onChange={(e) => setFormData({ ...formData, homeType: e.target.value as any })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none"
              >
                <option value="Apartment">Apartment / Flat</option>
                <option value="Independent House">Independent House</option>
                <option value="Villa">Villa with Garden</option>
                <option value="Farmhouse">Farmhouse</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Number of Family Members in Household</label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.familyMembersCount}
                onChange={(e) => setFormData({ ...formData, familyMembersCount: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Previous Pet Experience</label>
              <textarea
                rows={2}
                value={formData.previousExperience}
                onChange={(e) => setFormData({ ...formData, previousExperience: e.target.value })}
                placeholder="Mention past dogs, cats, or rescue experiences..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Current Pets at Home</label>
              <textarea
                rows={2}
                value={formData.currentPets}
                onChange={(e) => setFormData({ ...formData, currentPets: e.target.value })}
                placeholder="List species, breed, age, and vaccination status of existing pets..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Reason for Adopting</label>
              <textarea
                rows={2}
                value={formData.reasonForAdoption}
                onChange={(e) => setFormData({ ...formData, reasonForAdoption: e.target.value })}
                placeholder="Why do you wish to adopt this specific companion?"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Expected Daily Care & Exercise Arrangements</label>
              <textarea
                rows={2}
                value={formData.expectedCareArrangements}
                onChange={(e) => setFormData({ ...formData, expectedCareArrangements: e.target.value })}
                placeholder="Who will walk, feed, and look after the pet when you travel?"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Step 4: Responsible Ownership Agreement */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span>Pet Connect Ethical Adoption Covenant</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 text-[11px]">
              <li>I commit to providing wholesome nutrition, veterinary immunizations, and a safe indoor shelter.</li>
              <li>I will never abandon, sell, or subject the animal to neglect or cruelty.</li>
              <li>I consent to a friendly telephonic or video home verification visit by the shelter coordinator.</li>
              <li>If unforeseen circumstances occur, I will return the pet to the original NGO rather than deserting it.</li>
            </ul>
          </div>

          <label className="flex items-start space-x-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.agreedToTerms}
              onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
              className="mt-1 rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
              required
            />
            <span className="text-xs font-semibold text-slate-800">
              I certify that all details above are true, and I solemnly agree to the terms of responsible, compassionate pet ownership.
            </span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-brand-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <Heart className="w-4 h-4" />
            <span>{submitting ? 'Submitting Application...' : 'Submit Adoption Application'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
