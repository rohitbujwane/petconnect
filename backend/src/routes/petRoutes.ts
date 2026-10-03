import { Router } from 'express';
import {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  getMatchingRecommendations,
  toggleFavorite,
  getMyFavorites
} from '../controllers/petController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getAllPets);
router.post('/match', getMatchingRecommendations);
router.get('/favorites', authenticate, getMyFavorites);
router.post('/favorite', authenticate, toggleFavorite);
router.get('/:id', getPetById);
router.post('/', authenticate, createPet);
router.put('/:id', authenticate, updatePet);
router.delete('/:id', authenticate, deletePet);

export default router;
