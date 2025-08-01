import express from 'express';
import * as authController from '../controllers/authController.js';
import { isLoggedOut } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', isLoggedOut, authController.signup);
router.post('/login', isLoggedOut, authController.login);
router.get('/logout', authController.logout);

export default router;
