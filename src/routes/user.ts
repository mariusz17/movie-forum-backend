import { Router } from 'express';
import { register, login, me } from '../controllers/user';
import { logout } from '../controllers/user/logout';
import { protect } from '../middleware/auth';

export const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/profile', protect, me);
