import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { deleteOldLogs } from '../utils/logReader.js';
import { consoleLogger } from '../utils/logger.js';

const pipelineAsync = promisify(pipeline);

async function compressFile(sourceFile: string, destinationFile: string): Promise<void> {
    const gzip = zlib.createGzip();
    const source = fs.createReadStream(sourceFile);
    const destination = fs.createWriteStream(destinationFile);
    
    await pipelineAsync(source, gzip, destination);
}

/**
 * Rotate a log file:
 * 1. Compress current log file
 * 2. Rename with date
 * 3. Create new empty log file
 * @param logType 'api' or 'error'
 */
async function rotateLogFile(logType: 'api' | 'error'): Promise<void> {
    const logsDir = path.join(process.cwd(), 'logs');
    const currentLogFile = path.join(logsDir, `${logType}.log`);
    
    // Check if log file exists and has content
    if (!fs.existsSync(currentLogFile)) {
        consoleLogger.info(`No ${logType}.log file to rotate`);
        return;
    }

    const stats = fs.statSync(currentLogFile);
    if (stats.size === 0) {
        consoleLogger.info(`${logType}.log is empty, skipping rotation`);
        return;
    }

    // Get yesterday's date for the archived file name
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    const archivedLogFile = path.join(logsDir, `${logType}-${dateStr}.log`);
    const compressedLogFile = path.join(logsDir, `${logType}-${dateStr}.log.gz`);

    try {
        // Step 1: Rename current log file to include date
        fs.renameSync(currentLogFile, archivedLogFile);
        consoleLogger.info(`Renamed ${logType}.log to ${logType}-${dateStr}.log`);

        // Step 2: Compress the archived log file
        await compressFile(archivedLogFile, compressedLogFile);
        consoleLogger.info(`Compressed ${logType}-${dateStr}.log to ${logType}-${dateStr}.log.gz`);

        // Step 3: Delete the uncompressed archived file
        fs.unlinkSync(archivedLogFile);
        consoleLogger.info(`Deleted uncompressed ${logType}-${dateStr}.log`);

        // Step 4: Create new empty log file
        fs.writeFileSync(currentLogFile, '');
        consoleLogger.info(`Created new ${logType}.log file`);

        // Step 5: Delete old logs (older than 15 days)
        deleteOldLogs(logType);
        consoleLogger.info(`Deleted old ${logType} logs (older than 15 days)`);

    } catch (error) {
        consoleLogger.error({ error, logType }, `Error rotating ${logType} log file`);
        // If rotation fails, try to restore the original file
        if (fs.existsSync(archivedLogFile) && !fs.existsSync(currentLogFile)) {
            fs.renameSync(archivedLogFile, currentLogFile);
        }
    }
}

export function startLogRotationWorker(): void {

    const cronExpression = '30 18 * * *';

    cron.schedule(cronExpression, async () => {
        console.log('Starting log rotation at 12:00 AM IST');
        
        try {
            await rotateLogFile('api');
            
            await rotateLogFile('error');
            
            consoleLogger.info('Log rotation completed successfully');
        } catch (error) {
            consoleLogger.error({ error }, 'Error during log rotation');
        }
    }, {
        timezone: 'UTC'
    });

    console.log('Log rotation worker started (runs daily at 12:00 AM IST)');
}

export async function manualLogRotation(): Promise<void> {
    consoleLogger.info('Manual log rotation triggered');
    await rotateLogFile('api');
    await rotateLogFile('error');
    consoleLogger.info('Manual log rotation completed');
}
