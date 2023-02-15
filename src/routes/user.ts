import { Router } from 'express';
import { register, login } from '../controllers/user';

export const router = Router();

router.post('/register', register);
router.post('/login', login);
