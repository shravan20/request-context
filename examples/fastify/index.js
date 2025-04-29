import Fastify from 'fastify';
import { fastifyMiddleware, logger } from 'request-ctxt';

const fastify = Fastify({
    logger: false // We'll use our context-aware logger instead
});

// Configure the logger (optional)
logger.configure(console);

// Register the middleware
fastify.addHook('onRequest', fastifyMiddleware({
    // Optional configuration
    requestIdHeader: 'x-request-id',
    getUserId: request => request.user?.id,
    getExtra: request => ({
        ip: request.ip,
        userAgent: request.headers['user-agent']
    })
}));

// Example routes
fastify.get('/', async (request, reply) => {
    logger.info('Handling root request');
    return { message: 'Hello from Fastify!' };
});

fastify.get('/error', async (request, reply) => {
    logger.error('Something went wrong', { error: 'Test error' });
    reply.status(500).send({ error: 'Test error' });
});

const start = async () => {
    try {
        const PORT = process.env.PORT || 3000;
        await fastify.listen({ port: PORT });
        logger.info(`Fastify server listening on port ${PORT}`);
    } catch (err) {
        logger.error('Error starting server', { error: err });
        process.exit(1);
    }
};

start();