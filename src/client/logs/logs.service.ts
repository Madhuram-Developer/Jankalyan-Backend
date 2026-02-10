import path from 'path';
import fs from 'fs';
import { readLogsWithPagination, getArchivedLogs } from '../../utils/logReader.js';
import type { PaginatedLogs } from '../../utils/logReader.js';

/**
 * Get API logs with pagination
 */
export async function getApiLogs(page: number, pageSize: number): Promise<PaginatedLogs> {
    const apiLogPath = path.join(process.cwd(), 'logs', 'api.log');
    return await readLogsWithPagination(apiLogPath, page, pageSize);
}

/**
 * Get error logs with pagination
 */
export async function getErrorLogs(page: number, pageSize: number): Promise<PaginatedLogs> {
    const errorLogPath = path.join(process.cwd(), 'logs', 'error.log');
    return await readLogsWithPagination(errorLogPath, page, pageSize);
}

/**
 * Get list of archived log files
 */
export function getArchivedLogsList(type: 'api' | 'error'): string[] {
    return getArchivedLogs(type);
}

/**
 * Get log file statistics
 */
export async function getLogStatistics() {
    const logsDir = path.join(process.cwd(), 'logs');
    const apiLogPath = path.join(logsDir, 'api.log');
    const errorLogPath = path.join(logsDir, 'error.log');

    const getFileSize = (filePath: string): number => {
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            return stats.size;
        }
        return 0;
    };

    const getLineCount = (filePath: string): number => {
        if (!fs.existsSync(filePath)) return 0;
        const content = fs.readFileSync(filePath, 'utf-8');
        return content.split('\n').filter(line => line.trim()).length;
    };

    const apiArchivedLogs = getArchivedLogs('api');
    const errorArchivedLogs = getArchivedLogs('error');

    return {
        api: {
            currentLogSize: getFileSize(apiLogPath),
            currentLogLines: getLineCount(apiLogPath),
            archivedLogsCount: apiArchivedLogs.length
        },
        error: {
            currentLogSize: getFileSize(errorLogPath),
            currentLogLines: getLineCount(errorLogPath),
            archivedLogsCount: errorArchivedLogs.length
        },
        totalArchivedLogs: apiArchivedLogs.length + errorArchivedLogs.length
    };
}
