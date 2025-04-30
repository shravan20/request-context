import { v4 as uuid } from 'uuid';
import contextManager from '../context-manager.js';

const defaultOptions = {
    requestIdHeader: 'x-request-id',
    getContext: () => ({})
};

function httpMiddleware(options = {}) {
    const config = { ...defaultOptions, ...options };

    return (req, res, next) => {
        const requestId = req.headers[config.requestIdHeader] || uuid();

        contextManager.run(() => {
            // Always set requestId as it's required for tracing
            contextManager.set('requestId', requestId);

            // Get additional context from options
            const extraContext = config.getContext(req);
            Object.entries(extraContext).forEach(([key, value]) => {
                contextManager.set(key, value);
            });

            // Add requestId to response headers
            res.setHeader(config.requestIdHeader, requestId);

            next();
        });
    };
}

export default httpMiddleware;