import http from 'http';
import { httpMiddleware, logger } from 'request-ctxt';

// Configure the logger (optional)
logger.configure(console);

// Create middleware instance with configuration
const middleware = httpMiddleware({
    requestIdHeader: 'x-request-id',
    getUserId: req => req.user?.id,
    getExtra: req => ({
        ip: req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
    })
});

// Create server
const server = http.createServer((req, res) => {
    middleware(req, res, () => {
        // Log the request
        logger.info('Handling request', { url: req.url });

        // Simple router
        if (req.url === '/') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Hello from Node.js HTTP!' }));
        } else if (req.url === '/error') {
            logger.error('Something went wrong', { error: 'Test error' });
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Test error' }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not found' }));
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    logger.info(`HTTP server listening on port ${PORT}`);
});