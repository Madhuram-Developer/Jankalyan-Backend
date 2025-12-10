import type { Request, Response } from 'express';
import { getCategoriesService } from './categories.service.js';
import { asyncHandler } from '../../utils/AsyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export const getCategoriesController = asyncHandler(async (req: Request, res: Response) => {
    console.log("In categories controller");
  const categories = getCategoriesService();

  res.status(200).json(new ApiResponse(200, categories, 'Categories retrieved successfully'));
});