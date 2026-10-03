import { Request, Response } from 'express';
import { db } from '../models/db';
import { NGO, NGOEvent, NGOAnnouncement } from '../models/types';
import { AuthenticatedRequest } from '../middleware/auth';

export const getAllNGOs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { city } = req.query;
    let ngos = await db.ngos.find();

    if (city && city !== 'All') {
      ngos = ngos.filter(n => n.city.toLowerCase() === (city as string).toLowerCase());
    }

    res.json({ success: true, count: ngos.length, ngos });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching NGOs.' });
  }
};

export const getNGOById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const ngo = await db.ngos.findById(id);

    if (!ngo) {
      res.status(404).json({ success: false, message: 'NGO not found.' });
      return;
    }

    const shelterPets = await db.pets.find(p => p.fosterOrOwnerId === ngo.userId || p.fosterOrOwnerId === ngo.id);

    res.json({
      success: true,
      ngo,
      pets: shelterPets
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching NGO.' });
  }
};

export const getNGODashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const allPets = await db.pets.find();
    const allAdoptions = await db.adoptions.find();
    const allRescues = await db.rescueCases.find();
    const allVolunteers = await db.volunteers.find();

    const availablePets = allPets.filter(p => p.adoptionStatus === 'Available').length;
    const adoptedPets = allPets.filter(p => p.adoptionStatus === 'Adopted').length;
    const activeRescues = allRescues.filter(r => r.status !== 'Closed' && r.status !== 'Rescued').length;
    const successfulRescues = allRescues.filter(r => r.status === 'Rescued' || r.status === 'Closed' || r.status === 'Rehabilitating').length;

    res.json({
      success: true,
      stats: {
        totalPets: allPets.length,
        availablePets,
        adoptedPets,
        activeRescues,
        successfulRescues,
        volunteersCount: allVolunteers.length,
        pendingAdoptionRequests: allAdoptions.filter(a => a.status === 'Pending' || a.status === 'Under Review').length
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching NGO stats.' });
  }
};

export const createNGOEvent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, date, location, description, ngoId } = req.body;

    const ngo = await db.ngos.findOne(n => n.id === ngoId || n.userId === req.user?.id);
    if (!ngo) {
      res.status(404).json({ success: false, message: 'NGO organization record not found.' });
      return;
    }

    const newEvent: NGOEvent = {
      id: `ev-${Date.now()}`,
      title,
      date,
      location,
      description
    };

    const updatedEvents = [...ngo.events, newEvent];
    await db.ngos.update(ngo.id, { events: updatedEvents });

    res.status(201).json({
      success: true,
      message: 'Adoption drive / welfare event published!',
      event: newEvent
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error publishing event.' });
  }
};

export const createNGOAnnouncement = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, content, ngoId } = req.body;

    const ngo = await db.ngos.findOne(n => n.id === ngoId || n.userId === req.user?.id);
    if (!ngo) {
      res.status(404).json({ success: false, message: 'NGO organization record not found.' });
      return;
    }

    const newAnnouncement: NGOAnnouncement = {
      id: `an-${Date.now()}`,
      title,
      date: new Date().toISOString().split('T')[0],
      content
    };

    const updated = [...ngo.announcements, newAnnouncement];
    await db.ngos.update(ngo.id, { announcements: updated });

    res.status(201).json({
      success: true,
      message: 'Announcement published to community board!',
      announcement: newAnnouncement
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error creating announcement.' });
  }
};
