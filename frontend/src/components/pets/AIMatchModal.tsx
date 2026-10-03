import React, { useState } from 'react';
import { api } from '../../services/api';
import { MatchResult } from '../../types';
import { Sparkles, X, CheckCircle2, ChevronRight, Activity, Home, Award, HeartHandshake, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AIMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIMatchModal: React.FC<AIMatchModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'results'>('form');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchResult[]>([]);

  // Matching criteria state
  const [formData, setFormData] = useState({
    preferredSpecies: 'Dog',
    location: 'Pune',
    livingEnvironment: 'Apartment',
    activityLevel: 'Moderate',
    experience: 'Intermediate',
    hasKids: true,
    hasOtherPets: true,
    workSchedule: 'Work from home'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/pets/match', formData);
      if (res.data.success) {
        setResults(res.data.recommendations);
        setStep('results');
      }
    } catch (err) {
      console.error('Error running AI pet matching:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-brand-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display">AI Pet Compatibility Matcher</h2>
              <p className="text-xs text-emerald-100">
                Multi-factor explainable recommendation engine tailored to your lifestyle & home
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                <strong>How it works:</strong> Our intelligent algorithm analyzes your living environment, activity habits, experience level, and family members against each animal's temperament profile to calculate an explainable compatibility percentage score.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Preferred Species */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Preferred Species</label>
                  <select
                    value={formData.preferredSpecies}
                    onChange={(e) => setFormData({ ...formData, preferredSpecies: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none"
                  >
                    <option value="Dog">🐶 Dog / Puppy</option>
                    <option value="Cat">🐱 Cat / Kitten</option>
                    <option value="Rabbit">🐰 Rabbit</option>
                    <option value="Bird">🦜 Bird</option>
                    <option value="Any">🐾 Open to Any Companion</option>
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Your Location / City</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none"
                  >
                    <option value="Pune">Pune</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Nanded">Nanded</option>
                    <option value="Nagpur">Nagpur</option>
                    <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
                  </select>
                </div>

                {/* Living Environment */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Living Environment</label>
                  <select
                    value={formData.livingEnvironment}
                    onChange={(e) => setFormData({ ...formData, livingEnvironment: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none"
                  >
                    <option value="Apartment">Apartment / Flat</option>
                    <option value="Independent House">Independent House with Yard</option>
                    <option value="Villa">Gated Villa</option>
                    <option value="Farmhouse">Farmhouse / Rural Open Space</option>
                  </select>
                </div>

                {/* Activity Level */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Your Lifestyle & Activity Level</label>
                  <select
                    value={formData.activityLevel}
                    onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none"
                  >
                    <option value="Low">Low (Calm, indoor relaxation, short walks)</option>
                    <option value="Moderate">Moderate (Daily brisk walks, weekend outdoor play)</option>
                    <option value="High">High (Jogging partner, hiking, intensive agility)</option>
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Pet Parenting Experience</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none"
                  >
                    <option value="First-time">First-time Pet Guardian</option>
                    <option value="Intermediate">Intermediate (Cared for pets before)</option>
                    <option value="Experienced">Experienced (Trained in handling & medication)</option>
                  </select>
                </div>

                {/* Work Schedule */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Daily Schedule</label>
                  <select
                    value={formData.workSchedule}
                    onChange={(e) => setFormData({ ...formData, workSchedule: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none"
                  >
                    <option value="Work from home">Work from Home (24/7 presence)</option>
                    <option value="Hybrid">Hybrid (Away 2-3 days a week)</option>
                    <option value="Office full-time">Office Full-Time (Away 8 hours)</option>
                  </select>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-100">
                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.hasKids}
                    onChange={(e) => setFormData({ ...formData, hasKids: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                  />
                  <span>Have children at home</span>
                </label>

                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.hasOtherPets}
                    onChange={(e) => setFormData({ ...formData, hasOtherPets: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                  />
                  <span>Have other existing pets (dogs/cats)</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{loading ? 'Analyzing Matches...' : 'Find My Perfect Companions'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Results View */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Your AI Ranked Compatibility Matches</h3>
                  <p className="text-xs text-slate-500">Ranked by overall lifestyle, space, and energy fit</p>
                </div>
                <button
                  onClick={() => setStep('form')}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-800 underline"
                >
                  Adjust Preferences
                </button>
              </div>

              <div className="space-y-4">
                {results.slice(0, 5).map((match, index) => {
                  const pet = match.pet;
                  const isTop = index === 0;

                  return (
                    <div
                      key={pet.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isTop
                          ? 'border-brand-500 bg-brand-50/40 shadow-sm ring-1 ring-brand-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={pet.images[0]}
                            alt={pet.name}
                            className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-base font-bold text-slate-900">{pet.name}</h4>
                              {isTop && (
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                                  ⭐ Best Overall Match
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500">{pet.breed} • {pet.age} {pet.ageUnit} • {pet.city}</p>
                          </div>
                        </div>

                        {/* Score Gauge */}
                        <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block text-right">Compatibility</span>
                            <span className="text-xl font-black font-display text-brand-600">{match.compatibilityScore}%</span>
                          </div>
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-brand-100 text-brand-700 font-bold text-sm">
                            {match.compatibilityScore >= 80 ? 'A+' : match.compatibilityScore >= 65 ? 'B' : 'C'}
                          </div>
                        </div>
                      </div>

                      {/* Summary explanation */}
                      <p className="text-xs text-slate-700 bg-white/80 p-3 rounded-xl border border-slate-200/80 mb-3 leading-relaxed">
                        💡 <strong>Why this match:</strong> {match.summary}
                      </p>

                      {/* Explainable factor breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
                        {match.factors.map((f, i) => (
                          <div key={i} className="p-2 bg-slate-50 rounded-lg text-[11px] border border-slate-100">
                            <div className="flex items-center justify-between font-bold text-slate-800 mb-0.5">
                              <span>{f.name}</span>
                              <span className={f.score >= 80 ? 'text-emerald-600' : 'text-amber-600'}>
                                {f.score}%
                              </span>
                            </div>
                            <p className="text-slate-500 text-[10px] leading-tight truncate" title={f.description}>
                              {f.description}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* View Link */}
                      <div className="flex justify-end">
                        <Link
                          to={`/pets/${pet.id}`}
                          onClick={onClose}
                          className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-700 hover:text-brand-900 bg-brand-100/70 hover:bg-brand-100 px-3.5 py-1.5 rounded-lg transition-colors"
                        >
                          <span>Meet {pet.name} & View Full Profile</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
