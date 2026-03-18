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
router.put('/:id', authenticateToken, updateDonationUsageController);
router.delete('/:id', authenticateToken, deleteDonationUsageController);

export default router;