import express from 'express';
import doubtRouter from './client/doubts/doubt.route.js';
import adminUserRouter from './client/adminUser/adminUser.route.js';
import analyticsRouter from './client/analytics/analytics.route.js';
import jaapRouter from './client/jaap/jaap.route.js';
import aboutRouter from './client/about/about.route.js';
import categoriesRouter from './client/categories/categories.route.js';
import 'dotenv/config';
import { ApiError } from './utils/ApiError.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors({
  origin: isProduction ? process.env.FRONTEND_URL!  : 'http://localhost:8010',
  credentials: isProduction
}));

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

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors
        });
    }
    // For other errors
    console.error(err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        errors: []
    });
});

export { app };
