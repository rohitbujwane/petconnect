import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Pet } from '../types';
import { Heart, ArrowLeft, PlusCircle, Trash2, Edit, CheckCircle, MapPin } from 'lucide-react';

export const AdminPetsPage: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New Pet Form State
  const [newPet, setNewPet] = useState({
    name: '',
    species: 'Dog',
    breed: 'Indie',
    age: 1,
    ageUnit: 'years' as 'years' | 'months',
    gender: 'Male' as 'Male' | 'Female',
    size: 'Medium' as 'Small' | 'Medium' | 'Large',
    city: 'Pune',
    location: 'Kalyani Nagar, Pune',
    description: 'Energetic and friendly rescue.',
    medicalInfo: 'Vaccinated and neutered.',
    vaccinated: true,
    sterilized: true,
    specialNeeds: false,
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    activityLevel: 'Moderate' as 'Low' | 'Moderate' | 'High'
  });

  const fetchPets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/pets');
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
  }, []);

  const handleStatusChange = async (id: string, newStatus: any) => {
    try {
      const res = await api.put(`/pets/${id}`, { adoptionStatus: newStatus });
      if (res.data.success) {
        setPets(prev => prev.map(p => (p.id === id ? { ...p, adoptionStatus: newStatus } : p)));
      }
    } catch (err) {
      console.error('Error changing pet status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this pet listing?')) return;
    try {
      const res = await api.delete(`/pets/${id}`);
      if (res.data.success) {
        setPets(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('Error deleting pet:', err);
    }
  };

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/pets', {
        ...newPet,
        images: [newPet.imageUrl],
        personality: ['Playful', 'Gentle', 'Loyal']
      });
      if (res.data.success) {
        setAddModalOpen(false);
        fetchPets();
      }
    } catch (err) {
      console.error('Error adding pet:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          to="/admin"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Center</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display text-slate-900 tracking-tight">
            Pet Listings Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage available companions, update adoption statuses, and publish new shelter listings.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Pet</span>
        </button>
      </div>

      {/* Pets Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Pet</th>
                <th className="p-4">Breed & Location</th>
                <th className="p-4">Caregiver</th>
                <th className="p-4">Adoption Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pets.map((pet) => (
                <tr key={pet.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={pet.images[0]}
                        alt={pet.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{pet.name}</span>
                        <span className="text-slate-500 text-[11px]">{pet.species} • {pet.age} {pet.ageUnit}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">
                    <div>{pet.breed}</div>
                    <div className="text-[11px] text-slate-400">{pet.location}</div>
                  </td>
                  <td className="p-4 text-slate-600">
                    <span className="font-semibold">{pet.fosterOrOwnerName}</span>
                    <span className="text-[10px] text-slate-400 block">{pet.fosterOrOwnerType}</span>
                  </td>
                  <td className="p-4">
                    <select
                      value={pet.adoptionStatus}
                      onChange={(e) => handleStatusChange(pet.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                        pet.adoptionStatus === 'Available'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : pet.adoptionStatus === 'Pending'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-purple-50 text-purple-800 border-purple-200'
                      }`}
                    >
                      <option value="Available">Available</option>
                      <option value="Pending">Pending</option>
                      <option value="Adopted">Adopted</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(pet.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Pet Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 max-h-[85vh] overflow-y-auto">
            <h3 className="text-xl font-bold font-display text-slate-900">List New Pet for Adoption</h3>
            <form onSubmit={handleAddPet} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Pet Name</label>
                  <input
                    type="text"
                    value={newPet.name}
                    onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Species</label>
                  <select
                    value={newPet.species}
                    onChange={(e) => setNewPet({ ...newPet, species: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Breed</label>
                  <input
                    type="text"
                    value={newPet.breed}
                    onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">City</label>
                  <select
                    value={newPet.city}
                    onChange={(e) => setNewPet({ ...newPet, city: e.target.value, location: `${e.target.value}, Maharashtra` })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="Pune">Pune</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Nanded">Nanded</option>
                    <option value="Nagpur">Nagpur</option>
                    <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Photo URL</label>
                <input
                  type="url"
                  value={newPet.imageUrl}
                  onChange={(e) => setNewPet({ ...newPet, imageUrl: e.target.value })}
                  required
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Description</label>
                <textarea
                  rows={2}
                  value={newPet.description}
                  onChange={(e) => setNewPet({ ...newPet, description: e.target.value })}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs"
                >
                  Publish Pet Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
