import express from 'express'
import {registerUser, login, refreshToken, logout} from '../controllers/user.controller.js'
import {authenticateToken} from '../middlewares/auth.middleware.js'

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', authenticateToken, logout);

export default router;