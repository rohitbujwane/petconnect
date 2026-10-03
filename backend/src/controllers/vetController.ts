import { Request, Response } from 'express';
import { db } from '../models/db';
import { Appointment, AppointmentStatus } from '../models/types';
import { AuthenticatedRequest } from '../middleware/auth';

export const getAllVets = async (req: Request, res: Response): Promise<void> => {
  try {
    const { city, specialization, search } = req.query;
    let vets = await db.vets.find();

    if (city && city !== 'All') {
      vets = vets.filter(v => v.city.toLowerCase() === (city as string).toLowerCase());
    }

    if (specialization && specialization !== 'All') {
      vets = vets.filter(v => v.specialization.toLowerCase().includes((specialization as string).toLowerCase()));
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      vets = vets.filter(v =>
        v.name.toLowerCase().includes(q) ||
        v.clinicName.toLowerCase().includes(q) ||
        v.specialization.toLowerCase().includes(q) ||
        v.services.some(s => s.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: vets.length, vets });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching veterinarians.' });
  }
};

export const getVetById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const vet = await db.vets.findById(id);

    if (!vet) {
      res.status(404).json({ success: false, message: 'Veterinarian not found.' });
      return;
    }

    res.json({ success: true, vet });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching vet profile.' });
  }
};

export const bookAppointment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const {
      vetId,
      petName,
      petSpecies,
      petAge = '1 year',
      appointmentDate,
      appointmentTime,
      reason,
      userPhone
    } = req.body;

    const vet = await db.vets.findById(vetId);
    if (!vet) {
      res.status(404).json({ success: false, message: 'Veterinarian not found.' });
      return;
    }

    if (!appointmentDate || !appointmentTime || !petName || !reason) {
      res.status(400).json({ success: false, message: 'Please provide pet name, reason, appointment date and time slot.' });
      return;
    }

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      vetId: vet.id,
      vetName: vet.name,
      clinicName: vet.clinicName,
      userId: req.user.id,
      userName: req.user.name,
      userPhone: userPhone || req.user.phone,
      petName,
      petSpecies: petSpecies || 'Dog',
      petAge,
      appointmentDate,
      appointmentTime,
      reason,
      status: 'Requested',
      notes: 'Pending clinic review',
      createdAt: new Date().toISOString()
    };

    await db.appointments.create(newApt);

    // Notify vet
    if (vet.userId) {
      await db.notifications.create({
        id: `notif-${Date.now()}`,
        userId: vet.userId,
        title: 'New Appointment Request',
        message: `${req.user.name} requested an appointment for ${petName} on ${appointmentDate} at ${appointmentTime}.`,
        type: 'appointment',
        link: '/appointments',
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    res.status(201).json({
      success: true,
      message: 'Appointment requested! Clinic will confirm your slot shortly.',
      appointment: newApt
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error booking appointment.' });
  }
};

export const getMyAppointments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const isVet = req.user.role === 'vet';
    let appointments: Appointment[] = [];

    if (isVet) {
      const vetRecord = await db.vets.findOne(v => v.userId === req.user?.id);
      appointments = await db.appointments.find(a => a.vetId === vetRecord?.id || a.vetName.includes(req.user!.name));
    } else {
      appointments = await db.appointments.find(a => a.userId === req.user?.id);
    }

    appointments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({ success: true, count: appointments.length, appointments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching appointments.' });
  }
};

export const updateAppointmentStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses: AppointmentStatus[] = ['Requested', 'Confirmed', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: `Invalid status: ${status}` });
      return;
    }

    const apt = await db.appointments.findById(id);
    if (!apt) {
      res.status(404).json({ success: false, message: 'Appointment not found.' });
      return;
    }

    const updated = await db.appointments.update(id, {
      status,
      notes: notes || apt.notes
    });

    // Notify user
    await db.notifications.create({
      id: `notif-${Date.now()}`,
      userId: apt.userId,
      title: `Appointment ${status}`,
      message: `Your appointment with ${apt.vetName} for ${apt.petName} on ${apt.appointmentDate} is ${status}.`,
      type: 'appointment',
      link: '/appointments',
      read: false,
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Appointment marked as ${status}.`,
      appointment: updated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating appointment.' });
  }
};
