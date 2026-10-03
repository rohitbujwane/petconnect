import { Router } from 'express';
import {
  getAdminAnalytics,
  getAllUsers,
  updateUserRole,
  resetDatabase
} from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Restricted to admin
router.get('/analytics', authenticate, authorize('admin'), getAdminAnalytics);
router.get('/users', authenticate, authorize('admin'), getAllUsers);
router.put('/users/:id/role', authenticate, authorize('admin'), updateUserRole);
router.post('/reset-db', authenticate, authorize('admin'), resetDatabase);

export default router;
