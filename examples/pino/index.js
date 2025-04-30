import express from 'express';
import pino from 'pino';
import { expressMiddleware, contextManager } from 'request-ctxt';

const app = express();

// Setup your logger as you normally would
const logger = pino({
    level: 'debug',
    timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
});

// Create a context-aware log method
const log = {
    info: (msg, extra = {}) => logger.info({ ...contextManager.getAll(), ...extra }, msg),
    error: (msg, extra = {}) => logger.error({ ...contextManager.getAll(), ...extra }, msg),
    debug: (msg, extra = {}) => logger.debug({ ...contextManager.getAll(), ...extra }, msg),
    warn: (msg, extra = {}) => logger.warn({ ...contextManager.getAll(), ...extra }, msg)
};

// Add the middleware for context management
app.use(expressMiddleware({
    requestIdHeader: 'x-request-id',
    getContext: req => ({
        path: req.path,
        method: req.method,
        userId: req.user?.id,
        ip: req.ip,
        userAgent: req.headers['user-agent']
    })
}));

// Example routes
app.get('/', (req, res) => {
    log.info('Handling root request');
    log.debug('Debug information', { someKey: 'someValue' });
    res.json({ message: 'Hello from Express with Pino!' });
});

app.get('/error', (req, res) => {
    log.error('Something went wrong', { 
        error: new Error('Test error'),
        additionalInfo: 'Some context'
    });
    res.status(500).json({ error: 'Test error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    log.info('Express server started', { port: PORT });
});