import express from 'express';
import winston from 'winston';
import { expressMiddleware, logger } from 'request-ctxt';

const app = express();

// Configure Winston logger
const winstonLogger = winston.createLogger({
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

// Configure our context-aware logger with Winston
logger.configure(winstonLogger);

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
    res.json({ message: 'Hello from Express with Winston!' });
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
    logger.info(`Express server with Winston listening on port ${PORT}`);
});