import { Router } from 'express';
import {
  getHealthRecords,
  createHealthRecord,
  updateHealthRecord,
  getReminders,
  createReminder,
  toggleReminder,
  deleteReminder,
  askPetCareAI
} from '../controllers/petCareController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/health-records', authenticate, getHealthRecords);
router.post('/health-records', authenticate, createHealthRecord);
router.put('/health-records/:id', authenticate, updateHealthRecord);

router.get('/reminders', authenticate, getReminders);
router.post('/reminders', authenticate, createReminder);
router.put('/reminders/:id/toggle', authenticate, toggleReminder);
router.delete('/reminders/:id', authenticate, deleteReminder);

router.post('/ai-assistant', askPetCareAI);

export default router;
