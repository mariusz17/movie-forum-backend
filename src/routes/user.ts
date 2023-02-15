import { Router } from 'express';
import { register } from '../controllers/user';

export const router = Router();

router.post('/register', register);
