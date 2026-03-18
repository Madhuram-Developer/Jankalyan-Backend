import type { Request, Response } from 'express';
import { getAppSettingsService, updateAppSettingsService } from './about.service.js';
import { asyncHandler } from '../../utils/AsyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export const getAppSettingsController = asyncHandler(async (req: Request, res: Response) => {
  const settings = await getAppSettingsService();

  res.status(200).json(new ApiResponse(200, settings, 'App settings retrieved successfully'));
});

export const updateAppSettingsController = asyncHandler(async (req: Request, res: Response) => {
  const { description, paymentQR, bankName, ifscCode, accountNumber, videoUrl, title, upiId, TransactionNote, titleHindi, descriptionHindi, targetAmount, collectedAmount, totalAmount, accountName } = req.body;

  const updatedSettings = await updateAppSettingsService({
    description,
    paymentQR,
    bankName,
    ifscCode,
    accountNumber,
    videoUrl,
    title,
    upiId,
    TransactionNote,
    titleHindi,
    descriptionHindi,
    accountName,
    targetAmount: targetAmount !== undefined ? parseFloat(targetAmount) : null,
    collectedAmount: collectedAmount !== undefined ? parseFloat(collectedAmount) : null,
    totalAmount: totalAmount !== undefined ? parseFloat(totalAmount) : null,
  });

  res.status(200).json(new ApiResponse(200, updatedSettings, 'App settings updated successfully'));
});
