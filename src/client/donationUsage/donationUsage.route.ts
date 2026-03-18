import express from 'express';
import {
  createDonationUsageController,
  getAllDonationUsagesController,
  getDonationUsageByIdController,
  updateDonationUsageController,
  deleteDonationUsageController,
} from './donationUsage.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllDonationUsagesController);
router.get('/:id', getDonationUsageByIdController);
router.post('/', authenticateToken, createDonationUsageController);
router.post('/:id', authenticateToken, updateDonationUsageController);
router.post('/:id/delete', authenticateToken, deleteDonationUsageController);

export default router;