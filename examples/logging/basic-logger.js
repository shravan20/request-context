import { contextManager } from 'request-ctxt';

// Example of a basic context-aware logger
export const logger = {
    info: (msg, extra = {}) => {
        console.info({ ...contextManager.getAll(), ...extra, message: msg });
    },
    error: (msg, extra = {}) => {
        console.error({ ...contextManager.getAll(), ...extra, message: msg });
    },
    warn: (msg, extra = {}) => {
        console.warn({ ...contextManager.getAll(), ...extra, message: msg });
    },
    debug: (msg, extra = {}) => {
        console.debug({ ...contextManager.getAll(), ...extra, message: msg });
    }
};