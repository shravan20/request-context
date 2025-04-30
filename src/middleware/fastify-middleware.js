import { v4 as uuid } from 'uuid';
import contextManager from '../context-manager.js';

const defaultOptions = {
    requestIdHeader: 'x-request-id',
    getContext: () => ({})
};

function fastifyMiddleware(options = {}) {
    const config = { ...defaultOptions, ...options };

    return (request, reply, done) => {
        const requestId = request.headers[config.requestIdHeader] || uuid();

        contextManager.run(() => {
            // Always set requestId as it's required for tracing
            contextManager.set('requestId', requestId);

            // Get additional context from options
            const extraContext = config.getContext(request);
            Object.entries(extraContext).forEach(([key, value]) => {
                contextManager.set(key, value);
            });

            // Add requestId to response headers
            reply.header(config.requestIdHeader, requestId);

            done();
        });
    };
}

export default fastifyMiddleware;
