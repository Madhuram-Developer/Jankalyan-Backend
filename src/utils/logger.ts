import pino from 'pino';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const isProduction = process.env.NODE_ENV === 'production';

// API Logger - logs all HTTP requests
export const apiLogger = pino({
    level: 'info',
    formatters: {
        level: (label) => {
            return { level: label };
        },
    },
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
}, pino.destination({
    dest: path.join(logsDir, 'api.log'),
    sync: false,
    mkdir: true
}));

// Error Logger - logs all errors
export const errorLogger = pino({
    level: 'error',
    formatters: {
        level: (label) => {
            return { level: label };
        },
    },
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
}, pino.destination({
    dest: path.join(logsDir, 'error.log'),
    sync: false,
    mkdir: true
}));

export const consoleLogger = isProduction 
    ? pino({ level: 'debug' })
    : pino({
        level: 'debug',
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
            },
        },
    });

export default {
    apiLogger,
    errorLogger,
    consoleLogger
};
