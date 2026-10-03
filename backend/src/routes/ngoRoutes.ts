import { Router } from 'express';
import {
  getAllNGOs,
  getNGOById,
  getNGODashboardStats,
  createNGOEvent,
  createNGOAnnouncement
} from '../controllers/ngoController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getAllNGOs);
router.get('/dashboard', authenticate, getNGODashboardStats);
router.get('/:id', getNGOById);
router.post('/events', authenticate, createNGOEvent);
router.post('/announcements', authenticate, createNGOAnnouncement);

export default router;
