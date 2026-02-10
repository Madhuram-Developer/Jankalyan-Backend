import fs from 'fs';
import path from 'path';
import readline from 'readline';

export interface LogEntry {
    time: string;
    level: string;
    msg?: string;
    req?: any;
    res?: any;
    err?: any;
    responseTime?: number;
    [key: string]: any;
}

export interface PaginatedLogs {
    logs: LogEntry[];
    page: number;
    pageSize: number;
    totalLogs: number;
    totalPages: number;
}

/**
 * Read logs from a file with pagination
 * @param logFilePath Path to the log file
 * @param page Page number (1-indexed)
 * @param pageSize Number of logs per page
 * @returns Paginated log entries
 */
export async function readLogsWithPagination(
    logFilePath: string,
    page: number = 1,
    pageSize: number = 100
): Promise<PaginatedLogs> {
    if (!fs.existsSync(logFilePath)) {
        return {
            logs: [],
            page,
            pageSize,
            totalLogs: 0,
            totalPages: 0
        };
    }

    const logs: LogEntry[] = [];
    const fileStream = fs.createReadStream(logFilePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        if (line.trim()) {
            try {
                const logEntry = JSON.parse(line);
                logs.push(logEntry);
            } catch (error) {
                // Skip invalid JSON lines
                console.error('Invalid JSON in log file:', line);
            }
        }
    }

    // Reverse to show most recent logs first
    logs.reverse();

    const totalLogs = logs.length;
    const totalPages = Math.ceil(totalLogs / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedLogs = logs.slice(startIndex, endIndex);

    return {
        logs: paginatedLogs,
        page,
        pageSize,
        totalLogs,
        totalPages
    };
}

/**
 * Get all archived log files (compressed logs)
 * @param logType 'api' or 'error'
 * @returns List of archived log files with dates
 */
export function getArchivedLogs(logType: 'api' | 'error'): string[] {
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
        return [];
    }

    const files = fs.readdirSync(logsDir);
    const pattern = new RegExp(`^${logType}-\\d{4}-\\d{2}-\\d{2}\\.log\\.gz$`);
    
    return files
        .filter(file => pattern.test(file))
        .sort()
        .reverse(); // Most recent first
}

/**
 * Delete old log files (older than 15 days)
 * @param logType 'api' or 'error'
 */
export function deleteOldLogs(logType: 'api' | 'error'): void {
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
        return;
    }

    const now = new Date();
    const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
    const files = fs.readdirSync(logsDir);
    const pattern = new RegExp(`^${logType}-(\\d{4})-(\\d{2})-(\\d{2})\\.log\\.gz$`);

    files.forEach(file => {
        const match = file.match(pattern);
        if (match) {
            const [, year, month, day] = match;
            if (!year || !month || !day) return;
            const fileDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            
            if (fileDate < fifteenDaysAgo) {
                const filePath = path.join(logsDir, file);
                fs.unlinkSync(filePath);
                console.log(`Deleted old log file: ${file}`);
            }
        }
    });
}
