import { Request, Response } from 'express';
import { db } from '../models/db';
import { PetHealthRecord, PetCareReminder } from '../models/types';
import { AuthenticatedRequest } from '../middleware/auth';
import { PetCareAIService } from '../services/petCareAiService';

export const getHealthRecords = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    let records: PetHealthRecord[] = [];
    if (req.user.role === 'admin' || req.user.role === 'vet') {
      records = await db.healthRecords.find();
    } else {
      records = await db.healthRecords.find(r => r.ownerId === req.user?.id);
    }

    res.json({ success: true, count: records.length, healthRecords: records });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching health records.' });
  }
};

export const createHealthRecord = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const {
      petId,
      petName,
      species,
      breed,
      birthDate,
      gender,
      microchipNumber,
      bloodGroup,
      allergies = [],
      vaccinations = [],
      medicalHistory = [],
      medicines = [],
      nextAppointment
    } = req.body;

    if (!petName || !species) {
      res.status(400).json({ success: false, message: 'Pet name and species are required.' });
      return;
    }

    const newRecord: PetHealthRecord = {
      id: `rec-${Date.now()}`,
      petId,
      petName,
      ownerId: req.user.id,
      ownerName: req.user.name,
      species,
      breed: breed || 'Mixed Breed',
      birthDate: birthDate || '2025-01-01',
      gender: gender || 'Male',
      microchipNumber,
      bloodGroup,
      allergies,
      vaccinations,
      medicalHistory,
      medicines,
      nextAppointment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.healthRecords.create(newRecord);

    res.status(201).json({
      success: true,
      message: 'Pet Health Passport created successfully!',
      healthRecord: newRecord
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error creating health record.' });
  }
};

export const updateHealthRecord = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await db.healthRecords.findById(id);

    if (!existing) {
      res.status(404).json({ success: false, message: 'Health record not found.' });
      return;
    }

    const updated = await db.healthRecords.update(id, {
      ...req.body,
      updatedAt: new Date().toISOString()
    });

    res.json({ success: true, message: 'Health record updated.', healthRecord: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating health record.' });
  }
};

export const getReminders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const reminders = await db.reminders.find(r => r.userId === req.user?.id);
    reminders.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    res.json({ success: true, count: reminders.length, reminders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching reminders.' });
  }
};

export const createReminder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { petName, type, title, dueDate, time = '09:00', frequency = 'Once', notes = '' } = req.body;

    if (!petName || !title || !dueDate) {
      res.status(400).json({ success: false, message: 'Pet name, title, and due date are required.' });
      return;
    }

    const newReminder: PetCareReminder = {
      id: `rem-${Date.now()}`,
      userId: req.user.id,
      petName,
      type: type || 'Other',
      title,
      dueDate,
      time,
      frequency,
      notes,
      completed: false,
      createdAt: new Date().toISOString()
    };

    await db.reminders.create(newReminder);

    res.status(201).json({
      success: true,
      message: 'Care reminder scheduled!',
      reminder: newReminder
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error creating reminder.' });
  }
};

export const toggleReminder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const reminder = await db.reminders.findById(id);

    if (!reminder) {
      res.status(404).json({ success: false, message: 'Reminder not found.' });
      return;
    }

    const updated = await db.reminders.update(id, { completed: !reminder.completed });
    res.json({ success: true, message: 'Reminder updated', reminder: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error toggling reminder.' });
  }
};

export const deleteReminder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await db.reminders.delete(id);
    res.json({ success: true, message: 'Reminder deleted.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting reminder.' });
  }
};

export const askPetCareAI = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ success: false, message: 'Please provide a valid question.' });
      return;
    }

    const response = await PetCareAIService.answerQuestion(message);
    res.json({
      success: true,
      chatMessage: response
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error getting PetCare AI response.' });
  }
};
