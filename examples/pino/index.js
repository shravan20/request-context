import express from 'express';
import pino from 'pino';
import { expressMiddleware, logger } from 'request-ctxt';

const app = express();

// Configure Pino logger
const pinoLogger = pino({
    level: 'debug',
    timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
    formatters: {
        level: (label) => ({ level: label })
    }
});

// Configure our context-aware logger with Pino
logger.configure(pinoLogger);

// Add the middleware
app.use(expressMiddleware({
    requestIdHeader: 'x-request-id',
    getUserId: req => req.user?.id,
    getExtra: req => ({
        ip: req.ip,
        userAgent: req.headers['user-agent']
    })
}));

// Example routes
app.get('/', (req, res) => {
    logger.info('Handling root request');
    logger.debug('Debug information', { someKey: 'someValue' });
    res.json({ message: 'Hello from Express with Pino!' });
});

app.get('/error', (req, res) => {
    logger.error('Something went wrong', { 
        error: new Error('Test error'),
        additionalInfo: 'Some context'
    });
    res.status(500).json({ error: 'Test error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Express server with Pino listening on port ${PORT}`);
});