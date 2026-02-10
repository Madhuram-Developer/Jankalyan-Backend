import type { Request, Response, NextFunction } from 'express';
import { errorLogger, consoleLogger } from '../utils/logger.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Middleware to log all errors
 * Logs: error message, stack trace, request details, user info
 */
export const errorLoggerMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Prepare error log data
    const errorData = {
        message: err.message || 'Unknown error',
        statusCode: err.statusCode || 500,
        stack: err.stack,
        method: req.method,
        url: req.path,
        path: req.path,
        fullUrl: req.originalUrl || req.url,
        ip: req.ip || req.socket.remoteAddress,
        userAgent: req.get('user-agent'),
        query: req.query && Object.keys(req.query).length > 0 ? req.query : undefined,
        body: req.method !== 'GET' && req.body && Object.keys(req.body).length > 0 
            ? sanitizeBody(req.body) 
            : undefined,
        timestamp: new Date().toISOString(),
        // Include custom error fields if ApiError
        ...(err instanceof ApiError && {
            success: err.success,
            errors: err.errors
        })
    };

    // Log to error log file
    errorLogger.error(errorData);
    
    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
        consoleLogger.error(errorData, 'Error caught');
    }

    // Pass to next error handler
    next(err);
};

/**
 * Sanitize request body to remove sensitive data
 */
function sanitizeBody(body: any): any {
    const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'authorization'];
    const sanitized = { ...body };
    
    for (const field of sensitiveFields) {
        if (sanitized[field]) {
            sanitized[field] = '[REDACTED]';
        }
    }
    
    return sanitized;
}
