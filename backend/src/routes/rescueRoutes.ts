import { Router } from 'express';
import {
  reportRescue,
  getAllRescueCases,
  getRescueById,
  updateRescueStatus,
  assignVolunteer,
  addRescueNote
} from '../controllers/rescueController';
import { optionalAuth, authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getAllRescueCases);
router.post('/', optionalAuth, reportRescue);
router.get('/:id', getRescueById);
router.put('/:id/status', authenticate, updateRescueStatus);
router.post('/:id/assign', authenticate, assignVolunteer);
router.post('/:id/notes', authenticate, addRescueNote);

export default router;
