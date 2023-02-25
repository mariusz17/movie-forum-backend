import { Router } from 'express';
import {
  register,
  login,
  profile,
  logout,
  logoutAll,
  refresh,
} from '../controllers/user';
import { protect } from '../middleware/auth';

export const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.post('/logout-all', protect, logoutAll);
router.get('/refresh', refresh);
router.get('/profile', protect, profile);
