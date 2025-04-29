import { v4 as uuid } from 'uuid';
import contextManager from '../context-manager';

const defaultOptions = {
    requestIdHeader: 'x-request-id',
    getUserId: request => request.user?.id,
    getExtra: () => ({})
};

function fastifyMiddleware(options = {}) {
    const config = { ...defaultOptions, ...options };

    return (request, reply, done) => {
        const requestId = request.headers[config.requestIdHeader] || uuid();
        const userId = config.getUserId(request);
        const extra = config.getExtra(request);

        contextManager.run(() => {
            // Set standard context values
            contextManager.set('requestId', requestId);
            contextManager.set('path', request.url);
            contextManager.set('method', request.method);
            
            if (userId) {
                contextManager.set('userId', userId);
            }

            // Set any extra context from options
            Object.entries(extra).forEach(([key, value]) => {
                contextManager.set(key, value);
            });

            // Add requestId to response headers
            reply.header(config.requestIdHeader, requestId);

            done();
        });
    };
}

export default fastifyMiddleware;
