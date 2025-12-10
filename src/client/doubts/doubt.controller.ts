import type { Request, Response } from 'express';
import { createDoubtService, getAllDoubtsService, getDoubtByIdService, addAnswerService, getDoubtsByIdsService } from './doubt.service.js';
import { asyncHandler } from '../../utils/AsyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export const createDoubtController = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, dateOfBirth, phoneNumber, questionCategory, questionDescription, gender, city, state } = req.body;

  if (!phoneNumber || !questionCategory || !questionDescription) {
    throw new ApiError(400, 'Missing required fields: phoneNumber, questionCategory, questionDescription');
  }

  try {
    const result = await createDoubtService({
      fullName,
      dob : dateOfBirth,
      phoneNumber,
      gender ,
      city,
      state,
      questionCategory,
      questionDescription,
      location : 'Rih',
      ipAddress: req.ip || null,
      deviceInfo: req.get('User-Agent') || null,
      requestTime: req.headers['x-timestamp'] as string,
    });

    const queryIds = [{ queryId: result.id }];
    const data = await getDoubtsByIdsService(queryIds);

    res.status(201).json(new ApiResponse(201, data[0], 'Question submitted successfully'));
  } catch (error) {
    throw new ApiError(500, 'Failed to create doubt');
  }
});

export const getAllDoubtsController = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const { date, status, category } = req.query;

  const filters = {
    date: date as string | undefined,
    status: status as string | undefined,
    category: category as string | undefined,
  };
  console.log('Filters:', date);

  const result = await getAllDoubtsService(page, limit, filters);

  res.status(200).json(new ApiResponse(200, result));
});

export const getDoubtByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, 'ID is required');
  }

  const doubt = await getDoubtByIdService(id);

  if (!doubt) {
    throw new ApiError(404, 'Doubt not found');
  }

  res.status(200).json(new ApiResponse(200, doubt));
});

export const addAnswerController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { answer } = req.body;

  if (!id) {
    throw new ApiError(400, 'ID is required');
  }

  if (!answer) {
    throw new ApiError(400, 'Answer is required');
  }

  try {
    const doubt = await addAnswerService(id, answer);

    res.status(200).json(new ApiResponse(200, doubt, 'Answer added successfully'));
  } catch (error) {
    throw new ApiError(500, 'Failed to add answer');
  }
});

export const getDoubtsByIdsController = asyncHandler(async (req: Request, res: Response) => {
  
  const { userHistory : ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, 'Ids array is required and must be non-empty');
  }

  for (const item of ids) {
    if (!item.queryId || typeof item.queryId !== 'string') {
      throw new ApiError(400, 'Each item must have a valid queryId');
    }
  }


  try {
    const doubts = await getDoubtsByIdsService(ids);

    res.status(200).json(new ApiResponse(200, doubts, 'Doubts details retrieved successfully'));
  } catch (error) {
    throw new ApiError(500, 'Failed to retrieve doubts details');
  }
});