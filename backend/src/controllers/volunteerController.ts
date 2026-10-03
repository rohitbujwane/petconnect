import { Request, Response } from 'express';
import { db } from '../models/db';
import { Volunteer } from '../models/types';
import { AuthenticatedRequest } from '../middleware/auth';

export const registerVolunteer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      city,
      skills = [],
      availability = 'Weekends',
      animalExperience,
      preferredRescueType
    } = req.body;

    const userId = req.user?.id || `user-vol-${Date.now()}`;

    const existing = await db.volunteers.findOne(v => v.userId === userId || v.email === email);
    if (existing) {
      res.status(400).json({ success: false, message: 'You are already registered as a volunteer!' });
      return;
    }

    const newVol: Volunteer = {
      id: `vol-${Date.now()}`,
      userId,
      name: name || req.user?.name || 'Volunteer',
      email: email || req.user?.email || '',
      phone: phone || req.user?.phone || '',
      city: city || req.user?.city || 'Pune',
      skills: skills.length > 0 ? skills : ['Animal Handling', 'First Aid'],
      availability,
      animalExperience: animalExperience || 'Passionate about animal rescue and community care.',
      preferredRescueType: preferredRescueType || 'All animals',
      hoursContributed: 0,
      activeCasesCount: 0,
      badges: ['New Volunteer', 'Life Saver Candidate'],
      rating: 5.0,
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    await db.volunteers.create(newVol);

    // If user is logged in, update their role to volunteer if adopter
    if (req.user && req.user.role === 'adopter') {
      await db.users.update(req.user.id, { role: 'volunteer' });
    }

    res.status(201).json({
      success: true,
      message: 'Registered as Pet Connect Volunteer! Welcome to the life-saving network.',
      volunteer: newVol
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error registering volunteer.' });
  }
};

export const getAllVolunteers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { city, availability } = req.query;
    let vols = await db.volunteers.find();

    if (city && city !== 'All') {
      vols = vols.filter(v => v.city.toLowerCase() === (city as string).toLowerCase());
    }

    if (availability && availability !== 'All') {
      vols = vols.filter(v => v.availability === availability);
    }

    res.json({ success: true, count: vols.length, volunteers: vols });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching volunteers.' });
  }
};

export const getVolunteerDashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const volunteer = await db.volunteers.findOne(v => v.userId === userId);

    const allRescueCases = await db.rescueCases.find();
    const assignedCases = allRescueCases.filter(c => c.assignedVolunteerId === userId || c.assignedVolunteerId === volunteer?.id);
    const availableCases = allRescueCases.filter(c => c.status === 'Reported');
    const completedRescues = assignedCases.filter(c => c.status === 'Rescued' || c.status === 'Treatment' || c.status === 'Closed');

    res.json({
      success: true,
      volunteerProfile: volunteer || null,
      stats: {
        totalHours: volunteer?.hoursContributed || 35,
        assignedCount: assignedCases.length,
        availableCount: availableCases.length,
        completedCount: completedRescues.length,
        badges: volunteer?.badges || ['Active Volunteer', 'Compassion Star']
      },
      assignedCases,
      availableCases: availableCases.slice(0, 5)
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching volunteer stats.' });
  }
};
