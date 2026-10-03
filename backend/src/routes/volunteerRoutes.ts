import { Router } from 'express';
import {
  registerVolunteer,
  getAllVolunteers,
  getVolunteerDashboardStats
} from '../controllers/volunteerController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getAllVolunteers);
router.post('/register', authenticate, registerVolunteer);
router.get('/dashboard', authenticate, getVolunteerDashboardStats);

export default router;
