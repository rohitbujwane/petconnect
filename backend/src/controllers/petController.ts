import { Request, Response } from 'express';
import { db } from '../models/db';
import { Pet } from '../models/types';
import { AuthenticatedRequest } from '../middleware/auth';
import { AIMatchingService } from '../services/aiMatchingService';

export const getAllPets = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      species,
      breed,
      gender,
      city,
      vaccinated,
      sterilized,
      specialNeeds,
      adoptionStatus,
      search,
      sortBy = 'newest'
    } = req.query;

    let pets = await db.pets.find();

    // Filtering
    if (species && species !== 'All') {
      pets = pets.filter(p => p.species.toLowerCase() === (species as string).toLowerCase());
    }

    if (breed && breed !== 'All') {
      pets = pets.filter(p => p.breed.toLowerCase().includes((breed as string).toLowerCase()));
    }

    if (gender && gender !== 'All') {
      pets = pets.filter(p => p.gender.toLowerCase() === (gender as string).toLowerCase());
    }

    if (city && city !== 'All') {
      pets = pets.filter(p => p.city.toLowerCase() === (city as string).toLowerCase());
    }

    if (vaccinated !== undefined) {
      const isVaccinated = vaccinated === 'true';
      pets = pets.filter(p => p.vaccinated === isVaccinated);
    }

    if (sterilized !== undefined) {
      const isSterilized = sterilized === 'true';
      pets = pets.filter(p => p.sterilized === isSterilized);
    }

    if (specialNeeds !== undefined) {
      const hasSpecialNeeds = specialNeeds === 'true';
      pets = pets.filter(p => p.specialNeeds === hasSpecialNeeds);
    }

    if (adoptionStatus && adoptionStatus !== 'All') {
      pets = pets.filter(p => p.adoptionStatus.toLowerCase() === (adoptionStatus as string).toLowerCase());
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      pets = pets.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.breed.toLowerCase().includes(q) ||
        p.species.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.personality.some(trait => trait.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'newest') {
      pets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'ageAsc') {
      pets.sort((a, b) => (a.ageUnit === 'years' ? a.age * 12 : a.age) - (b.ageUnit === 'years' ? b.age * 12 : b.age));
    } else if (sortBy === 'ageDesc') {
      pets.sort((a, b) => (b.ageUnit === 'years' ? b.age * 12 : b.age) - (a.ageUnit === 'years' ? a.age * 12 : a.age));
    } else if (sortBy === 'name') {
      pets.sort((a, b) => a.name.localeCompare(b.name));
    }

    res.json({
      success: true,
      count: pets.length,
      pets
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching pets.' });
  }
};

export const getPetById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const pet = await db.pets.findById(id);

    if (!pet) {
      res.status(404).json({ success: false, message: 'Pet not found.' });
      return;
    }

    // Related pets (same species or same city)
    const related = (await db.pets.find(p => p.id !== pet.id && (p.species === pet.species || p.city === pet.city))).slice(0, 3);

    res.json({
      success: true,
      pet,
      relatedPets: related
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching pet profile.' });
  }
};

export const createPet = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const {
      name,
      species,
      breed,
      age,
      ageUnit = 'years',
      gender,
      size = 'Medium',
      location,
      city,
      description,
      medicalInfo = 'Vaccinated and checked by veterinarian.',
      vaccinated = true,
      sterilized = false,
      specialNeeds = false,
      specialNeedsDetails = '',
      images = [],
      personality = [],
      activityLevel = 'Moderate',
      goodWithKids = true,
      goodWithPets = true,
      careRequirements = 'Regular balanced meals and exercise.'
    } = req.body;

    if (!name || !species || !breed || age === undefined || !gender || !city) {
      res.status(400).json({ success: false, message: 'Please provide all mandatory pet details.' });
      return;
    }

    const defaultImages = [
      species === 'Cat'
        ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80'
    ];

    const newPet: Pet = {
      id: `pet-${Date.now()}`,
      name,
      species,
      breed,
      age: Number(age),
      ageUnit,
      gender,
      size,
      location: location || `${city}, Maharashtra`,
      city,
      description,
      medicalInfo,
      vaccinated: Boolean(vaccinated),
      sterilized: Boolean(sterilized),
      specialNeeds: Boolean(specialNeeds),
      specialNeedsDetails,
      adoptionStatus: 'Available',
      images: images.length > 0 ? images : defaultImages,
      personality: personality.length > 0 ? personality : ['Friendly', 'Playful', 'Loving'],
      activityLevel,
      goodWithKids: Boolean(goodWithKids),
      goodWithPets: Boolean(goodWithPets),
      careRequirements,
      fosterOrOwnerId: req.user.id,
      fosterOrOwnerType: req.user.role === 'ngo' ? 'NGO' : 'User',
      fosterOrOwnerName: req.user.name,
      fosterOrOwnerPhone: req.user.phone,
      createdAt: new Date().toISOString()
    };

    await db.pets.create(newPet);

    res.status(201).json({
      success: true,
      message: 'Pet listed for adoption successfully!',
      pet: newPet
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error creating pet listing.' });
  }
};

export const updatePet = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const pet = await db.pets.findById(id);

    if (!pet) {
      res.status(404).json({ success: false, message: 'Pet not found.' });
      return;
    }

    // Verify ownership or admin privileges
    if (req.user?.role !== 'admin' && req.user?.id !== pet.fosterOrOwnerId) {
      res.status(403).json({ success: false, message: 'You are not authorized to update this pet.' });
      return;
    }

    const updated = await db.pets.update(id, req.body);
    res.json({ success: true, message: 'Pet profile updated successfully!', pet: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating pet.' });
  }
};

export const deletePet = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const pet = await db.pets.findById(id);

    if (!pet) {
      res.status(404).json({ success: false, message: 'Pet not found.' });
      return;
    }

    if (req.user?.role !== 'admin' && req.user?.id !== pet.fosterOrOwnerId) {
      res.status(403).json({ success: false, message: 'You are not authorized to delete this pet.' });
      return;
    }

    await db.pets.delete(id);
    res.json({ success: true, message: 'Pet listing removed successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting pet.' });
  }
};

export const getMatchingRecommendations = async (req: Request, res: Response): Promise<void> => {
  try {
    const criteria = req.body;
    const pets = await db.pets.find();

    const ranked = AIMatchingService.rankPetsForAdopter(pets, criteria);

    res.json({
      success: true,
      count: ranked.length,
      recommendations: ranked
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error calculating AI recommendations.' });
  }
};

export const toggleFavorite = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { petId } = req.body;
    const pet = await db.pets.findById(petId);
    if (!pet) {
      res.status(404).json({ success: false, message: 'Pet not found.' });
      return;
    }

    const existing = await db.favorites.findOne(f => f.userId === req.user!.id && f.petId === petId);

    if (existing) {
      await db.favorites.delete(existing.id);
      res.json({ success: true, favorited: false, message: 'Removed from favorites.' });
    } else {
      await db.favorites.create({
        id: `fav-${Date.now()}`,
        userId: req.user.id,
        petId,
        createdAt: new Date().toISOString()
      });
      res.json({ success: true, favorited: true, message: 'Saved to favorites!' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating favorite.' });
  }
};

export const getMyFavorites = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const favs = await db.favorites.find(f => f.userId === req.user!.id);
    const petIds = favs.map(f => f.petId);
    const pets = await db.pets.find(p => petIds.includes(p.id));

    res.json({
      success: true,
      favorites: pets
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching favorites.' });
  }
};
