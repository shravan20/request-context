import { getAll } from './context-manager.js';

let baseLogger = console; // fallback if no logger configured
let loggerType = 'console';

function detectLoggerType(logger) {
    if (logger.constructor.name === 'Pino') return 'pino';
    if (logger.constructor.name === 'Winston' || logger.constructor.name === 'Logger') return 'winston';
    return 'console';
}

function configureLogger(loggerInstance) {
    baseLogger = loggerInstance;
    loggerType = detectLoggerType(loggerInstance);
}

function formatForPino(level, message, context) {
    // Pino expects the message as first argument and context as second
    return [message, context];
}

function formatForWinston(level, message, context) {
    // Winston expects a single object with a message property
    return [{ message, level, ...context }];
}

function formatForConsole(level, message, context) {
    // Console logger expects context object and message
    return [context, message];
}

function logWithContext(level, message, extra = {}) {
    const context = { ...getAll(), ...extra };

    let args;
    switch (loggerType) {
        case 'pino':
            args = formatForPino(level, message, context);
            if (typeof baseLogger[level] === 'function') {
                baseLogger[level](...args);
            } else {
                baseLogger.info(...args);
            }
            break;

        case 'winston':
            args = formatForWinston(level, message, context);
            if (typeof baseLogger[level] === 'function') {
                baseLogger[level](...args);
            } else {
                baseLogger.log(...args);
            }
            break;

        default: // console or unknown logger
            args = formatForConsole(level, message, context);
            if (typeof baseLogger[level] === 'function') {
                baseLogger[level](...args);
            } else {
                baseLogger.log(level, ...args);
            }
    }
}

const logger = {
    info: (msg, extra) => logWithContext('info', msg, extra),
    error: (msg, extra) => logWithContext('error', msg, extra),
    warn: (msg, extra) => logWithContext('warn', msg, extra),
    debug: (msg, extra) => logWithContext('debug', msg, extra),
    trace: (msg, extra) => logWithContext('trace', msg, extra),
    fatal: (msg, extra) => logWithContext('fatal', msg, extra),
    configure: configureLogger
};

export default logger;
