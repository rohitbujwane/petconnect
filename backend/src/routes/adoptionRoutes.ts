import { Router } from 'express';
import {
  submitApplication,
  getMyApplications,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus
} from '../controllers/adoptionController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, submitApplication);
router.get('/my', authenticate, getMyApplications);
router.get('/', authenticate, getAllApplications);
router.get('/:id', authenticate, getApplicationById);
router.put('/:id/status', authenticate, updateApplicationStatus);

export default router;
