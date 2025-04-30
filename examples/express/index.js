import express from 'express';
import { expressMiddleware, logger } from 'request-ctxt';

const app = express();

// Configure the logger (optional)
logger.configure(console);

// Add the middleware early in your middleware chain
app.use(expressMiddleware({
    // Optional configuration
    requestIdHeader: 'x-request-id',
    // New getContext function that can return any context fields
    getContext: req => ({
        // These are now optional and configurable
        path: req.path,
        method: req.method,
        userId: req.user?.id,
        ip: req.ip,
        userAgent: req.headers['user-agent']
    })
}));

// Example routes
app.get('/', (req, res) => {
    logger.info('Handling root request');
    res.json({ message: 'Hello from Express!' });
});

app.get('/error', (req, res) => {
    logger.error('Something went wrong', { error: 'Test error' });
    res.status(500).json({ error: 'Test error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Express server listening on port ${PORT}`);
});