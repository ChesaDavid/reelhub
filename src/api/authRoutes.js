import express from 'express';
import { registerUser } from '../lib/auth/register.js';
import { loginUser } from '../lib/auth/login.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
