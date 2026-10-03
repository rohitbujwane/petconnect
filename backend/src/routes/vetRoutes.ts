import { Router } from 'express';
import {
  getAllVets,
  getVetById,
  bookAppointment,
  getMyAppointments,
  updateAppointmentStatus
} from '../controllers/vetController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getAllVets);
router.get('/appointments/my', authenticate, getMyAppointments);
router.post('/appointments', authenticate, bookAppointment);
router.put('/appointments/:id/status', authenticate, updateAppointmentStatus);
router.get('/:id', getVetById);

export default router;
