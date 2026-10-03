import { Request, Response } from 'express';
import { db } from '../models/db';

export const globalSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, category = 'all' } = req.query;

    if (!q || typeof q !== 'string' || q.trim() === '') {
      res.json({
        success: true,
        query: '',
        results: {
          pets: [],
          vets: [],
          ngos: [],
          rescues: [],
          lostFound: []
        },
        totalCount: 0
      });
      return;
    }

    const query = q.toLowerCase().trim();

    // 1. Pets
    let pets = await db.pets.find(p =>
      p.name.toLowerCase().includes(query) ||
      p.breed.toLowerCase().includes(query) ||
      p.species.toLowerCase().includes(query) ||
      p.city.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.personality.some(t => t.toLowerCase().includes(query))
    );

    // 2. Vets
    let vets = await db.vets.find(v =>
      v.name.toLowerCase().includes(query) ||
      v.clinicName.toLowerCase().includes(query) ||
      v.specialization.toLowerCase().includes(query) ||
      v.city.toLowerCase().includes(query) ||
      v.services.some(s => s.toLowerCase().includes(query))
    );

    // 3. NGOs
    let ngos = await db.ngos.find(n =>
      n.organizationName.toLowerCase().includes(query) ||
      n.city.toLowerCase().includes(query) ||
      n.description.toLowerCase().includes(query)
    );

    // 4. Rescues
    let rescues = await db.rescueCases.find(r =>
      r.animalType.toLowerCase().includes(query) ||
      r.condition.toLowerCase().includes(query) ||
      r.location.toLowerCase().includes(query) ||
      r.city.toLowerCase().includes(query) ||
      r.emergencyLevel.toLowerCase().includes(query)
    );

    // 5. Lost & Found
    const lost = await db.lostPets.find(l =>
      l.petName.toLowerCase().includes(query) ||
      l.breed.toLowerCase().includes(query) ||
      l.species.toLowerCase().includes(query) ||
      l.city.toLowerCase().includes(query)
    );
    const found = await db.foundPets.find(f =>
      f.approximateBreed.toLowerCase().includes(query) ||
      f.species.toLowerCase().includes(query) ||
      f.city.toLowerCase().includes(query)
    );

    const lostFound = [...lost, ...found];

    const totalCount = pets.length + vets.length + ngos.length + rescues.length + lostFound.length;

    res.json({
      success: true,
      query,
      results: {
        pets: category === 'all' || category === 'pets' ? pets : [],
        vets: category === 'all' || category === 'vets' ? vets : [],
        ngos: category === 'all' || category === 'ngos' ? ngos : [],
        rescues: category === 'all' || category === 'rescues' ? rescues : [],
        lostFound: category === 'all' || category === 'lostFound' ? lostFound : []
      },
      totalCount
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error executing search.' });
  }
};
