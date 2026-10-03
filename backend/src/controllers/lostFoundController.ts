import { Request, Response } from 'express';
import { db } from '../models/db';
import { LostPet, FoundPet } from '../models/types';
import { AuthenticatedRequest } from '../middleware/auth';

export const reportLostPet = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      petName,
      species,
      breed,
      gender = 'Unknown',
      age = 'Unknown',
      lastSeenLocation,
      city = 'Pune',
      coordinates,
      dateTime,
      description,
      identifyingMarks,
      contactName,
      contactPhone,
      contactEmail,
      images = []
    } = req.body;

    if (!petName || !species || !lastSeenLocation || !contactPhone) {
      res.status(400).json({ success: false, message: 'Please provide pet name, species, last seen location, and contact phone.' });
      return;
    }

    const defaultCoords = coordinates || { lat: 18.5204, lng: 73.8567 };

    const newLostPet: LostPet = {
      id: `lost-${Date.now()}`,
      type: 'Lost',
      petName,
      species,
      breed: breed || 'Mixed Breed',
      gender,
      age,
      lastSeenLocation,
      city,
      coordinates: defaultCoords,
      dateTime: dateTime || new Date().toISOString(),
      description,
      identifyingMarks: identifyingMarks || 'None noted',
      contactName: contactName || req.user?.name || 'Pet Parent',
      contactPhone: contactPhone || req.user?.phone || '',
      contactEmail: contactEmail || req.user?.email || '',
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80'],
      status: 'Lost',
      reportedBy: req.user?.id || 'anonymous',
      createdAt: new Date().toISOString()
    };

    await db.lostPets.create(newLostPet);

    res.status(201).json({
      success: true,
      message: 'Lost pet report published. Local volunteers and shelters alerted!',
      report: newLostPet
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error reporting lost pet.' });
  }
};

export const reportFoundPet = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      species,
      approximateBreed,
      locationFound,
      city = 'Pune',
      coordinates,
      dateTime,
      description,
      contactName,
      contactPhone,
      contactEmail,
      images = []
    } = req.body;

    if (!species || !locationFound || !contactPhone) {
      res.status(400).json({ success: false, message: 'Please provide species, found location, and contact phone.' });
      return;
    }

    const defaultCoords = coordinates || { lat: 18.5204, lng: 73.8567 };

    const newFoundPet: FoundPet = {
      id: `found-${Date.now()}`,
      type: 'Found',
      species,
      approximateBreed: approximateBreed || 'Mixed / Unknown',
      locationFound,
      city,
      coordinates: defaultCoords,
      dateTime: dateTime || new Date().toISOString(),
      description,
      contactName: contactName || req.user?.name || 'Kind Citizen',
      contactPhone: contactPhone || req.user?.phone || '',
      contactEmail: contactEmail || req.user?.email || '',
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80'],
      status: 'Found',
      reportedBy: req.user?.id || 'anonymous',
      createdAt: new Date().toISOString()
    };

    await db.foundPets.create(newFoundPet);

    res.status(201).json({
      success: true,
      message: 'Found pet reported successfully! Case pinned to community radar.',
      report: newFoundPet
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error reporting found pet.' });
  }
};

export const getAllLostFound = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, city, species, status } = req.query;

    let lost = await db.lostPets.find();
    let found = await db.foundPets.find();

    if (city && city !== 'All') {
      lost = lost.filter(l => l.city.toLowerCase() === (city as string).toLowerCase());
      found = found.filter(f => f.city.toLowerCase() === (city as string).toLowerCase());
    }

    if (species && species !== 'All') {
      lost = lost.filter(l => l.species.toLowerCase() === (species as string).toLowerCase());
      found = found.filter(f => f.species.toLowerCase() === (species as string).toLowerCase());
    }

    if (status && status !== 'All') {
      lost = lost.filter(l => l.status.toLowerCase() === (status as string).toLowerCase());
      found = found.filter(f => f.status.toLowerCase() === (status as string).toLowerCase());
    }

    if (type === 'Lost') {
      res.json({ success: true, count: lost.length, items: lost, lost, found: [] });
      return;
    }

    if (type === 'Found') {
      res.json({ success: true, count: found.length, items: found, lost: [], found });
      return;
    }

    const combined = [...lost, ...found].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      success: true,
      count: combined.length,
      items: combined,
      lost,
      found
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching lost/found reports.' });
  }
};

export const claimPotentialMatch = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { reportId, reportType, claimantMessage, contactInfo } = req.body;

    // Send notification to reporter
    let recipientId = '';
    let petNameOrBreed = '';

    if (reportType === 'Lost') {
      const report = await db.lostPets.findById(reportId);
      if (report) {
        recipientId = report.reportedBy;
        petNameOrBreed = report.petName;
      }
    } else {
      const report = await db.foundPets.findById(reportId);
      if (report) {
        recipientId = report.reportedBy;
        petNameOrBreed = `${report.species} (${report.approximateBreed})`;
      }
    }

    if (recipientId && recipientId !== 'anonymous') {
      await db.notifications.create({
        id: `notif-${Date.now()}`,
        userId: recipientId,
        title: 'Potential Match Alert!',
        message: `Someone responded: "${claimantMessage || 'I believe this pet matches mine!'}". Contact: ${contactInfo || req.user?.phone || req.user?.email}`,
        type: 'lost_found',
        link: '/lost-found',
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      message: 'Match notification sent to pet reporter! They have been alerted.'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error processing match claim.' });
  }
};

export const updateLostFoundStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, type } = req.body;

    if (type === 'Lost') {
      const updated = await db.lostPets.update(id, { status });
      res.json({ success: true, message: 'Status updated', report: updated });
    } else {
      const updated = await db.foundPets.update(id, { status });
      res.json({ success: true, message: 'Status updated', report: updated });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating status.' });
  }
};
