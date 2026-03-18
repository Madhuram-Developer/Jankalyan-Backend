import express from 'express';
import doubtRouter from './client/doubts/doubt.route.js';
import adminUserRouter from './client/adminUser/adminUser.route.js';
import analyticsRouter from './client/analytics/analytics.route.js';
import jaapRouter from './client/jaap/jaap.route.js';
import aboutRouter from './client/about/about.route.js';
import categoriesRouter from './client/categories/categories.route.js';
import logsRouter from './client/logs/logs.route.js';
import donationUsageRouter from './client/donationUsage/donationUsage.route.js';
import 'dotenv/config';
import { ApiError } from './utils/ApiError.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { apiLoggerMiddleware } from './middleware/apiLogger.middleware.js';
import { errorLoggerMiddleware } from './middleware/errorLogger.middleware.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

const originRegex = new RegExp(process.env.CORS_ORIGIN!);
app.use(cors({
    origin: originRegex,
    credentials : true
}))

app.use(apiLoggerMiddleware);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Jankalyan Backend!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use('/api/v1', doubtRouter);
app.use('/api/v1/admin', adminUserRouter);
app.use('/api/v1/analytics', analyticsRouter);
app.use('/api/v1/jaap', jaapRouter);
app.use('/api/v1/about', aboutRouter);
app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/logs', logsRouter);
app.use('/api/v1/donations', donationUsageRouter);

app.use(errorLoggerMiddleware);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors
        });
    }
    console.error(err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        errors: []
    });
});

export { app };
