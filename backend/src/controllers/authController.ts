import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../models/db';
import { generateToken } from '../utils/jwt';
import { User, UserRole } from '../models/types';
import { AuthenticatedRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role = 'adopter', phone, address, city = 'Pune', avatar, bio } = req.body;

    if (!name || !email || !password || !phone) {
      res.status(400).json({ success: false, message: 'Please provide name, email, password, and phone number.' });
      return;
    }

    const existingUser = await db.users.findOne(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role as UserRole,
      phone,
      address,
      city,
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      bio: bio || '',
      createdAt: new Date().toISOString()
    };

    await db.users.create(newUser);

    // If registered as volunteer, create volunteer record
    if (role === 'volunteer') {
      await db.volunteers.create({
        id: `vol-${Date.now()}`,
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        city: newUser.city,
        skills: ['Animal Care', 'Rescue Transport'],
        availability: 'Weekends',
        animalExperience: 'New registered volunteer passionate about animal rescue.',
        preferredRescueType: 'Street Animals',
        hoursContributed: 0,
        activeCasesCount: 0,
        badges: ['New Volunteer'],
        rating: 5.0,
        status: 'Active',
        createdAt: new Date().toISOString()
      });
    }

    // If registered as NGO, create initial NGO profile
    if (role === 'ngo') {
      await db.ngos.create({
        id: `ngo-${Date.now()}`,
        userId: newUser.id,
        organizationName: name,
        registrationNumber: `REG-${Date.now().toString().slice(-6)}`,
        contactPerson: name,
        email: newUser.email,
        phone: newUser.phone,
        address: address || 'Main City Office',
        city: newUser.city,
        description: bio || 'Animal welfare organization committed to saving lives.',
        logo: newUser.avatar || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=300&q=80',
        totalRescues: 0,
        totalAdoptions: 0,
        activeVolunteers: 1,
        verified: false,
        events: [],
        announcements: [],
        createdAt: new Date().toISOString()
      });
    }

    // If registered as Vet, create initial Vet profile
    if (role === 'vet') {
      await db.vets.create({
        id: `vet-${Date.now()}`,
        userId: newUser.id,
        name,
        qualification: 'BVSc & AH',
        specialization: 'General Veterinary Medicine',
        experienceYears: 1,
        clinicName: `${name} Pet Clinic`,
        address: address || 'Main Road',
        city: newUser.city,
        phone: newUser.phone,
        email: newUser.email,
        availabilityDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        consultationFee: 500,
        services: ['General Checkup', 'Vaccination', 'Deworming'],
        rating: 5.0,
        reviewsCount: 1,
        avatar: newUser.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
        verified: false,
        createdAt: new Date().toISOString()
      });
    }

    const token = generateToken(newUser);

    const { password: _, ...userSafe } = newUser;
    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: userSafe
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error during registration.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide both email and password.' });
      return;
    }

    const user = await db.users.findOne(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
      return;
    }

    const token = generateToken(user);
    const { password: _, ...userSafe } = user;

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: userSafe
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error during login.' });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated.' });
    return;
  }
  const { password: _, ...userSafe } = req.user;
  res.json({ success: true, user: userSafe });
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { name, phone, address, city, avatar, bio } = req.body;
    const updated = await db.users.update(req.user.id, {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(address && { address }),
      ...(city && { city }),
      ...(avatar && { avatar }),
      ...(bio !== undefined && { bio })
    });

    if (!updated) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const { password: _, ...userSafe } = updated;
    res.json({ success: true, message: 'Profile updated successfully!', user: userSafe });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error updating profile.' });
  }
};

export const demoLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role = 'admin' } = req.body;
    let targetEmail = 'admin@petconnect.demo';

    if (role === 'ngo') targetEmail = 'ngo@petconnect.demo';
    else if (role === 'vet') targetEmail = 'vet@petconnect.demo';
    else if (role === 'volunteer') targetEmail = 'volunteer@petconnect.demo';
    else if (role === 'owner') targetEmail = 'owner@petconnect.demo';
    else if (role === 'adopter' || role === 'user') targetEmail = 'user@petconnect.demo';

    const user = await db.users.findOne(u => u.email.toLowerCase() === targetEmail.toLowerCase());
    if (!user) {
      res.status(404).json({ success: false, message: `Demo user for role ${role} not found.` });
      return;
    }

    const token = generateToken(user);
    const { password: _, ...userSafe } = user;

    res.json({
      success: true,
      message: `Logged in as demo ${role.toUpperCase()} successfully!`,
      token,
      user: userSafe
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error during demo login.' });
  }
};
