/**
 * PetConnect — Netlify Serverless Function
 * ──────────────────────────────────────────
 * Wraps the entire Express backend as a single Netlify Function
 * using the `serverless-http` adapter.
 *
 * All incoming requests to /.netlify/functions/api/* are forwarded
 * to the Express app, which handles routing internally.
 */

import serverless from 'serverless-http';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

// Import Routes
import authRoutes from '../../backend/dist/routes/authRoutes';
import petRoutes from '../../backend/dist/routes/petRoutes';
import adoptionRoutes from '../../backend/dist/routes/adoptionRoutes';
import lostFoundRoutes from '../../backend/dist/routes/lostFoundRoutes';
import rescueRoutes from '../../backend/dist/routes/rescueRoutes';
import volunteerRoutes from '../../backend/dist/routes/volunteerRoutes';
import ngoRoutes from '../../backend/dist/routes/ngoRoutes';
import vetRoutes from '../../backend/dist/routes/vetRoutes';
import petCareRoutes from '../../backend/dist/routes/petCareRoutes';
import messageRoutes from '../../backend/dist/routes/messageRoutes';
import notificationRoutes from '../../backend/dist/routes/notificationRoutes';
import searchRoutes from '../../backend/dist/routes/searchRoutes';
import adminRoutes from '../../backend/dist/routes/adminRoutes';

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Health Check ─────────────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Pet Connect — AI-Powered Pet Adoption & Welfare Platform API',
    version: '1.0.0',
    runtime: 'Netlify Serverless Function'
  });
});

// ── Root API Directory ───────────────────────────────────────
app.get('/api', (_req: Request, res: Response) => {
  res.json({
    name: 'Pet Connect API',
    tagline: 'Connecting Hearts. Saving Lives.',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      pets: '/api/pets',
      adoptions: '/api/adoptions',
      lostFound: '/api/lost-found',
      rescue: '/api/rescue',
      volunteers: '/api/volunteers',
      ngos: '/api/ngos',
      vets: '/api/vets',
      petCare: '/api/pet-care',
      messages: '/api/messages',
      notifications: '/api/notifications',
      search: '/api/search',
      admin: '/api/admin'
    }
  });
});

// ── Mount Routes ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/lost-found', lostFoundRoutes);
app.use('/api/rescue', rescueRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/ngos', ngoRoutes);
app.use('/api/vets', vetRoutes);
app.use('/api/pet-care', petCareRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);

// ── Global Error Handler ─────────────────────────────────────
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error occurred.',
  });
});

// ── 404 Route Handler ────────────────────────────────────────
app.use('*', (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found. Refer to GET /api for the full catalog.'
  });
});

// ── Export as Netlify Function handler ────────────────────────
export const handler = serverless(app);
