import type { Request, Response } from 'express';
import {
  createDonationUsageService,
  getAllDonationUsagesService,
  getDonationUsageByIdService,
  updateDonationUsageService,
  deleteDonationUsageService,
} from './donationUsage.service.js';
import { asyncHandler } from '../../utils/AsyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export const createDonationUsageController = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, titleHindi, descriptionHindi, images } = req.body;

  if (!title || !description || !titleHindi || !descriptionHindi || !images) {
    throw new ApiError(400, 'All fields are required');
  }

  const donationUsage = await createDonationUsageService({
    title,
    description,
    titleHindi,
    descriptionHindi,
    images,
  });

  res.status(201).json(new ApiResponse(201, donationUsage, 'Donation usage created successfully'));
});

export const getAllDonationUsagesController = asyncHandler(async (req: Request, res: Response) => {
  const donationUsages = await getAllDonationUsagesService();

  res.status(200).json(new ApiResponse(200, donationUsages, 'Donation usages retrieved successfully'));
});

export const getDonationUsageByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, 'ID is required');
  }

  const donationUsage = await getDonationUsageByIdService(id);

  if (!donationUsage) {
    throw new ApiError(404, 'Donation usage not found');
  }

  res.status(200).json(new ApiResponse(200, donationUsage, 'Donation usage retrieved successfully'));
});

export const updateDonationUsageController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, 'ID is required');
  }

  const { title, description, titleHindi, descriptionHindi, images } = req.body;

  const updatedDonationUsage = await updateDonationUsageService(id, {
    title,
    description,
    titleHindi,
    descriptionHindi,
    images,
  });

  res.status(200).json(new ApiResponse(200, updatedDonationUsage, 'Donation usage updated successfully'));
});

export const deleteDonationUsageController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, 'ID is required');
  }

  await deleteDonationUsageService(id);

  res.status(200).json(new ApiResponse(200, null, 'Donation usage deleted successfully'));
});