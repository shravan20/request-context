import express from 'express';
import winston from 'winston';
import { expressMiddleware, contextManager } from 'request-ctxt';

const app = express();

// Setup your Winston logger as you normally would
const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// Create a context-aware log method
const log = {
    info: (msg, extra = {}) => logger.info(msg, { ...contextManager.getAll(), ...extra }),
    error: (msg, extra = {}) => logger.error(msg, { ...contextManager.getAll(), ...extra }),
    warn: (msg, extra = {}) => logger.warn(msg, { ...contextManager.getAll(), ...extra }),
    debug: (msg, extra = {}) => logger.debug(msg, { ...contextManager.getAll(), ...extra })
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
    res.json({ message: 'Hello from Express with Winston!' });
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