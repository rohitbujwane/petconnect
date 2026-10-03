import { Request, Response } from 'express';
import { db } from '../models/db';
import { RescueCase, RescueStatus, EmergencyLevel } from '../models/types';
import { AuthenticatedRequest } from '../middleware/auth';

export const reportRescue = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      animalType,
      condition,
      emergencyLevel = 'Medium',
      location,
      city = 'Pune',
      coordinates,
      description,
      images = [],
      reporterName,
      reporterPhone
    } = req.body;

    if (!animalType || !condition || !location || !reporterPhone) {
      res.status(400).json({ success: false, message: 'Please provide animal type, emergency condition, location, and reporter contact.' });
      return;
    }

    const defaultCoords = coordinates || { lat: 18.5204, lng: 73.8567 };

    const newCase: RescueCase = {
      id: `rescue-${Date.now()}`,
      animalType,
      condition,
      emergencyLevel: emergencyLevel as EmergencyLevel,
      location,
      city,
      coordinates: defaultCoords,
      description: description || 'Emergency distress report submitted.',
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80'],
      reporterName: reporterName || req.user?.name || 'Kind Citizen',
      reporterPhone: reporterPhone || req.user?.phone || '',
      reporterId: req.user?.id,
      status: 'Reported',
      notes: [
        {
          id: `rn-${Date.now()}`,
          text: `Emergency rescue case registered at severity [${emergencyLevel}]. Local rescue squad notified.`,
          date: new Date().toISOString(),
          author: 'PetConnect Emergency Dispatch'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.rescueCases.create(newCase);

    // Notify all active volunteers in the same city
    const cityVolunteers = await db.volunteers.find(v => v.city.toLowerCase() === city.toLowerCase());
    for (const vol of cityVolunteers.slice(0, 5)) {
      await db.notifications.create({
        id: `notif-${Date.now()}-${Math.random().toString().slice(2, 6)}`,
        userId: vol.userId,
        title: `🚨 ${emergencyLevel.toUpperCase()} Emergency: ${animalType}`,
        message: `${condition} in ${location}, ${city}. Action requested!`,
        type: 'rescue',
        link: '/rescue',
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    res.status(201).json({
      success: true,
      message: 'Emergency rescue case reported! First responders and local shelters alerted.',
      rescueCase: newCase
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error reporting rescue case.' });
  }
};

export const getAllRescueCases = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, emergencyLevel, city } = req.query;

    let cases = await db.rescueCases.find();

    if (status && status !== 'All') {
      cases = cases.filter(c => c.status === status);
    }

    if (emergencyLevel && emergencyLevel !== 'All') {
      cases = cases.filter(c => c.emergencyLevel === emergencyLevel);
    }

    if (city && city !== 'All') {
      cases = cases.filter(c => c.city.toLowerCase() === (city as string).toLowerCase());
    }

    // Sort newest first
    cases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      success: true,
      count: cases.length,
      cases
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching rescue cases.' });
  }
};

export const getRescueById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const rescueCase = await db.rescueCases.findById(id);

    if (!rescueCase) {
      res.status(404).json({ success: false, message: 'Rescue case not found.' });
      return;
    }

    res.json({ success: true, rescueCase });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching rescue case.' });
  }
};

export const updateRescueStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, noteText } = req.body;

    const validStatuses: RescueStatus[] = ['Reported', 'Assigned', 'Rescue in Progress', 'Rescued', 'Treatment', 'Rehabilitating', 'Closed'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: `Invalid rescue status: ${status}` });
      return;
    }

    const currentCase = await db.rescueCases.findById(id);
    if (!currentCase) {
      res.status(404).json({ success: false, message: 'Rescue case not found.' });
      return;
    }

    const updatedNotes = [...currentCase.notes];
    if (noteText) {
      updatedNotes.push({
        id: `rn-${Date.now()}`,
        text: noteText,
        date: new Date().toISOString(),
        author: req.user?.name || 'Rescuer'
      });
    }

    const updated = await db.rescueCases.update(id, {
      status,
      notes: updatedNotes,
      updatedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Rescue status updated to ${status}.`,
      rescueCase: updated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating rescue status.' });
  }
};

export const assignVolunteer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { volunteerId, volunteerName } = req.body;

    const currentCase = await db.rescueCases.findById(id);
    if (!currentCase) {
      res.status(404).json({ success: false, message: 'Rescue case not found.' });
      return;
    }

    const assignedName = volunteerName || req.user?.name || 'Assigned Volunteer';
    const assignedId = volunteerId || req.user?.id || 'vol-assigned';

    const updatedNotes = [
      ...currentCase.notes,
      {
        id: `rn-${Date.now()}`,
        text: `Assigned to responder ${assignedName}. Case marked as 'Assigned'.`,
        date: new Date().toISOString(),
        author: req.user?.name || 'Coordinator'
      }
    ];

    const updated = await db.rescueCases.update(id, {
      assignedVolunteerId: assignedId,
      assignedVolunteerName: assignedName,
      status: 'Assigned',
      notes: updatedNotes,
      updatedAt: new Date().toISOString()
    });

    // Notify assigned volunteer
    await db.notifications.create({
      id: `notif-${Date.now()}`,
      userId: assignedId,
      title: 'Rescue Case Assigned to You',
      message: `You have been assigned to rescue a ${currentCase.animalType} at ${currentCase.location}.`,
      type: 'rescue',
      link: `/rescue`,
      read: false,
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Assigned to ${assignedName} successfully!`,
      rescueCase: updated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error assigning volunteer.' });
  }
};

export const addRescueNote = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text) {
      res.status(400).json({ success: false, message: 'Note text cannot be empty.' });
      return;
    }

    const currentCase = await db.rescueCases.findById(id);
    if (!currentCase) {
      res.status(404).json({ success: false, message: 'Rescue case not found.' });
      return;
    }

    const newNote = {
      id: `rn-${Date.now()}`,
      text,
      date: new Date().toISOString(),
      author: req.user?.name || 'Field Rescuer'
    };

    const updatedNotes = [...currentCase.notes, newNote];

    const updated = await db.rescueCases.update(id, {
      notes: updatedNotes,
      updatedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Note added to rescue log.',
      rescueCase: updated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error adding note.' });
  }
};
