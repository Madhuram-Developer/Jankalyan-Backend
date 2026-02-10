import { Router } from 'express';
import * as logsController from './logs.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';

const router = Router();

// All log endpoints require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/v1/logs/api
 * @desc    Get API logs with pagination
 * @query   page, pageSize
 * @access  Private (requires authentication)
 */
router.get('/', logsController.getApiLogs);

/**
 * @route   GET /api/v1/logs/error
 * @desc    Get error logs with pagination
 * @query   page, pageSize
 * @access  Private (requires authentication)
 */
router.get('/error', logsController.getErrorLogs);

/**
 * @route   GET /api/v1/logs/archives
 * @desc    Get list of archived log files
 * @query   type (api or error)
 * @access  Private (requires authentication)
 */
router.get('/archives', logsController.getArchivedLogs);

/**
 * @route   GET /api/v1/logs/stats
 * @desc    Get log statistics
 * @access  Private (requires authentication)
 */
router.get('/stats', logsController.getLogStats);

export default router;
