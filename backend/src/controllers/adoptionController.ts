import { Response } from 'express';
import { db } from '../models/db';
import { AdoptionApplication, ApplicationStatus } from '../models/types';
import { AuthenticatedRequest } from '../middleware/auth';

export const submitApplication = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const {
      petId,
      applicantName,
      applicantEmail,
      applicantPhone,
      applicantAge,
      address,
      city,
      occupation,
      previousExperience,
      currentPets,
      homeType,
      familyMembersCount,
      reasonForAdoption,
      expectedCareArrangements,
      agreedToTerms
    } = req.body;

    const pet = await db.pets.findById(petId);
    if (!pet) {
      res.status(404).json({ success: false, message: 'Pet not found.' });
      return;
    }

    if (!agreedToTerms) {
      res.status(400).json({ success: false, message: 'You must agree to the terms of responsible pet ownership.' });
      return;
    }

    const newApplication: AdoptionApplication = {
      id: `app-${Date.now()}`,
      petId: pet.id,
      petName: pet.name,
      petImage: pet.images[0] || '',
      applicantId: req.user.id,
      applicantName: applicantName || req.user.name,
      applicantEmail: applicantEmail || req.user.email,
      applicantPhone: applicantPhone || req.user.phone,
      applicantAge: Number(applicantAge) || 25,
      address: address || '',
      city: city || req.user.city,
      occupation: occupation || 'Professional',
      previousExperience: previousExperience || 'None',
      currentPets: currentPets || 'None',
      homeType: homeType || 'Apartment',
      familyMembersCount: Number(familyMembersCount) || 2,
      reasonForAdoption: reasonForAdoption || 'Want to give a forever home.',
      expectedCareArrangements: expectedCareArrangements || 'Daily walks and quality food.',
      agreedToTerms: true,
      status: 'Pending',
      reviewNotes: 'Application submitted and queued for review.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.adoptions.create(newApplication);

    // Create notification for applicant
    await db.notifications.create({
      id: `notif-${Date.now()}`,
      userId: req.user.id,
      title: 'Adoption Application Received',
      message: `Your application to adopt ${pet.name} has been received and is queued for verification.`,
      type: 'adoption',
      link: '/dashboard',
      read: false,
      createdAt: new Date().toISOString()
    });

    // Notify shelter/foster owner if user is known
    if (pet.fosterOrOwnerId) {
      await db.notifications.create({
        id: `notif-ngo-${Date.now()}`,
        userId: pet.fosterOrOwnerId,
        title: 'New Adoption Application',
        message: `${newApplication.applicantName} submitted an application for ${pet.name}.`,
        type: 'adoption',
        link: '/admin/adoptions',
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    res.status(201).json({
      success: true,
      message: 'Adoption application submitted successfully!',
      application: newApplication
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error submitting application.' });
  }
};

export const getMyApplications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const apps = await db.adoptions.find(a => a.applicantId === req.user!.id);
    res.json({ success: true, count: apps.length, applications: apps });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching applications.' });
  }
};

export const getAllApplications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status, petId } = req.query;
    let apps = await db.adoptions.find();

    if (status && status !== 'All') {
      apps = apps.filter(a => a.status === status);
    }

    if (petId) {
      apps = apps.filter(a => a.petId === petId);
    }

    // Sort newest first
    apps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({ success: true, count: apps.length, applications: apps });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching all applications.' });
  }
};

export const getApplicationById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const app = await db.adoptions.findById(id);

    if (!app) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    res.json({ success: true, application: app });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching application.' });
  }
};

export const updateApplicationStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;

    const validStatuses: ApplicationStatus[] = ['Pending', 'Under Review', 'Interview Required', 'Approved', 'Rejected', 'Completed'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: `Invalid status: ${status}` });
      return;
    }

    const app = await db.adoptions.findById(id);
    if (!app) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    const updated = await db.adoptions.update(id, {
      status,
      reviewNotes: reviewNotes || app.reviewNotes,
      reviewerId: req.user?.id,
      updatedAt: new Date().toISOString()
    });

    // If completed/approved, mark pet as pending or adopted
    if (status === 'Approved' || status === 'Completed') {
      await db.pets.update(app.petId, {
        adoptionStatus: status === 'Completed' ? 'Adopted' : 'Pending'
      });
    }

    // Send notification to applicant
    await db.notifications.create({
      id: `notif-${Date.now()}`,
      userId: app.applicantId,
      title: `Adoption Status: ${status}`,
      message: `Your adoption application for ${app.petName} has been updated to "${status}". Notes: ${reviewNotes || 'Updated by shelter counselor.'}`,
      type: 'adoption',
      link: '/dashboard',
      read: false,
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, message: `Application status updated to ${status}.`, application: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating status.' });
  }
};
