import express from 'express';
import { getAppSettingsController, updateAppSettingsController } from './about.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/settings', getAppSettingsController);
router.post('/settings', authenticateToken, updateAppSettingsController);

export default router;
