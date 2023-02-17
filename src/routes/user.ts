import { Router } from 'express';
import { register, login, me } from '../controllers/user';
import { protect } from '../middleware/auth';

export const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, me);
