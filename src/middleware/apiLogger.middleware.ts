import type { Request, Response, NextFunction } from 'express';
import { apiLogger, consoleLogger } from '../utils/logger.js';

/**
 * Middleware to log all API requests
 * Logs: method, URL, status code, response time, IP, user agent
 */
export const apiLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    // Capture original end function
    const originalEnd = res.end;

    // Override end function to log when request completes
    res.end = function(chunk?: any, encoding?: any, callback?: any): Response {
        const responseTime = Date.now() - startTime;
        
        // Prepare log data
        const logData = {
            method: req.method,
            url: req.path,
            path: req.path,
            fullUrl: req.originalUrl || req.url,
            statusCode: res.statusCode,
            responseTime: `${responseTime}ms`,
            ip: req.ip || req.socket.remoteAddress,
            userAgent: req.get('user-agent'),
            query: req.query && Object.keys(req.query).length > 0 ? req.query : undefined,
            body: req.method !== 'GET' && req.body && Object.keys(req.body).length > 0 
                ? sanitizeBody(req.body) 
                : undefined,
        };

        // Log to file
        apiLogger.info(logData);
        
        // Log to console in development
        if (process.env.NODE_ENV !== 'production') {
            consoleLogger.info(logData, 'API Request');
        }

        // Call original end function
        return originalEnd.call(this, chunk, encoding, callback);
    };

    next();
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
