import { Router } from 'express';
import {
  reportLostPet,
  reportFoundPet,
  getAllLostFound,
  claimPotentialMatch,
  updateLostFoundStatus
} from '../controllers/lostFoundController';
import { optionalAuth, authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getAllLostFound);
router.post('/lost', optionalAuth, reportLostPet);
router.post('/found', optionalAuth, reportFoundPet);
router.post('/claim', optionalAuth, claimPotentialMatch);
router.put('/:id/status', authenticate, updateLostFoundStatus);

export default router;
