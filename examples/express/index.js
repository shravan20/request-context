import express from 'express';
import { expressMiddleware, logger } from 'request-ctxt';

const app = express();

// Configure the logger (optional)
logger.configure(console);

// Add the middleware early in your middleware chain
app.use(expressMiddleware({
    // Optional configuration
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