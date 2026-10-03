import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config';

// Import Routes
import authRoutes from './routes/authRoutes';
import petRoutes from './routes/petRoutes';
import adoptionRoutes from './routes/adoptionRoutes';
import lostFoundRoutes from './routes/lostFoundRoutes';
import rescueRoutes from './routes/rescueRoutes';
import volunteerRoutes from './routes/volunteerRoutes';
import ngoRoutes from './routes/ngoRoutes';
import vetRoutes from './routes/vetRoutes';
import petCareRoutes from './routes/petCareRoutes';
import messageRoutes from './routes/messageRoutes';
import notificationRoutes from './routes/notificationRoutes';
import searchRoutes from './routes/searchRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Pet Connect — AI-Powered Pet Adoption & Welfare Platform API',
    version: '1.0.0'
  });
});

// Root API Directory
app.get('/api', (_req: Request, res: Response) => {
  res.json({
    name: 'Pet Connect API',
    tagline: 'Connecting Hearts. Saving Lives.',
    version: '1.0.0',
    documentation: '/docs/API_DOCUMENTATION.md',
    endpoints: {
      auth: '/api/auth (register, login, me, profile, demo-login)',
      pets: '/api/pets (browse, filter, match, favorites)',
      adoptions: '/api/adoptions (apply, track, review status)',
      lostFound: '/api/lost-found (report lost, report found, match claim)',
      rescue: '/api/rescue (emergency report, live cases, volunteer assignment)',
      volunteers: '/api/volunteers (network, registration, dashboard stats)',
      ngos: '/api/ngos (directory, shelter stats, adoption events)',
      vets: '/api/vets (directory, appointment booking)',
      petCare: '/api/pet-care (health records, care reminders, PetCare AI chatbot)',
      messages: '/api/messages (conversations, direct chats)',
      notifications: '/api/notifications (alerts, status updates)',
      search: '/api/search (global multi-entity keyword search)',
      admin: '/api/admin (analytics, user moderation, stats)'
    }
  });
});

// Mount Routes
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

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error occurred.',
    error: config.nodeEnv === 'development' ? err.stack : undefined
  });
});

// 404 Route Handler
app.use('*', (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found. Refer to GET /api for the full catalog.'
  });
});

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🐾 PET CONNECT API SERVER RUNNING ON PORT ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`✨ Environment: ${config.nodeEnv}`);
  console.log(`🔑 Demo Accounts:`);
  console.log(`   • Admin:       admin@petconnect.demo   (pwd: Demo@123)`);
  console.log(`   • NGO:         ngo@petconnect.demo     (pwd: Demo@123)`);
  console.log(`   • Vet:         vet@petconnect.demo     (pwd: Demo@123)`);
  console.log(`   • Adopter:     user@petconnect.demo    (pwd: Demo@123)`);
  console.log(`   • Volunteer:   volunteer@petconnect.demo (pwd: Demo@123)`);
  console.log(`====================================================`);
});

export default app;
