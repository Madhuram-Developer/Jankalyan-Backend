import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/AsyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import * as logsService from './logs.service.js';

export const getApiLogs = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 100;

    if (page < 1) {
        throw new ApiError(400, 'Page must be greater than 0');
    }

    if (pageSize < 1 || pageSize > 1000) {
        throw new ApiError(400, 'Page size must be between 1 and 1000');
    }

    const result = await logsService.getApiLogs(page, pageSize);
    
    res.status(200).json(
        new ApiResponse(200, result, 'API logs retrieved successfully')
    );
});

export const getErrorLogs = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 100;

    if (page < 1) {
        throw new ApiError(400, 'Page must be greater than 0');
    }

    if (pageSize < 1 || pageSize > 1000) {
        throw new ApiError(400, 'Page size must be between 1 and 1000');
    }

    const result = await logsService.getErrorLogs(page, pageSize);
    
    res.status(200).json(
        new ApiResponse(200, result, 'Error logs retrieved successfully')
    );
});

export const getArchivedLogs = asyncHandler(async (req: Request, res: Response) => {
    const type = req.query.type as 'api' | 'error';

    if (!type || (type !== 'api' && type !== 'error')) {
        throw new ApiError(400, 'Type must be either "api" or "error"');
    }

    const archives = logsService.getArchivedLogsList(type);
    
    res.status(200).json(
        new ApiResponse(200, { archives }, 'Archived logs list retrieved successfully')
    );
});

/**
 * Get log statistics
 */
export const getLogStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await logsService.getLogStatistics();
    
    res.status(200).json(
        new ApiResponse(200, stats, 'Log statistics retrieved successfully')
    );
});
