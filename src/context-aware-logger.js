import { getAll } from './context-manager';

let baseLogger = console; // fallback if no logger configured

function configureLogger(loggerInstance) {
    baseLogger = loggerInstance;
}

function logWithContext(level, message, extra = {}) {
    const context = getAll();
    if (typeof baseLogger[level] === 'function') {
        baseLogger[level]({ ...context, ...extra }, message);
    } else {
        baseLogger.log({ level, ...context, ...extra }, message);
    }
}

const logger = {
    info: (msg, extra) => logWithContext('info', msg, extra),
    error: (msg, extra) => logWithContext('error', msg, extra),
    warn: (msg, extra) => logWithContext('warn', msg, extra),
    debug: (msg, extra) => logWithContext('debug', msg, extra),
    configure: configureLogger
};

export default logger;
