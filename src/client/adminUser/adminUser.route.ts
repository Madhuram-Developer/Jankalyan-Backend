import express from 'express';
import { getAllAdminUsersController, getAdminUserByIdController, addAdminUserController, registerAdminController, loginAdminController, logoutAdminController } from './adminUser.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.post('/add', addAdminUserController);
router.post('/register', registerAdminController);
router.post('/login', loginAdminController);
router.post('/logout', logoutAdminController);
router.get('/users', authenticateToken, getAllAdminUsersController);
router.get('/users/:id', authenticateToken, getAdminUserByIdController);

export default router;