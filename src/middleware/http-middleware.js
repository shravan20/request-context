import { v4 as uuid } from 'uuid';
import contextManager from '../context-manager';
import { parse } from 'url';

const defaultOptions = {
    requestIdHeader: 'x-request-id',
    getUserId: () => undefined,
    getExtra: () => ({})
};

function httpMiddleware(options = {}) {
    const config = { ...defaultOptions, ...options };

    return (req, res, next) => {
        const requestId = req.headers[config.requestIdHeader] || uuid();
        const userId = config.getUserId(req);
        const extra = config.getExtra(req);
        const parsedUrl = parse(req.url);

        contextManager.run(() => {
            // Set standard context values
            contextManager.set('requestId', requestId);
            contextManager.set('path', parsedUrl.pathname);
            contextManager.set('method', req.method);
            
            if (userId) {
                contextManager.set('userId', userId);
            }

            // Set any extra context from options
            Object.entries(extra).forEach(([key, value]) => {
                contextManager.set(key, value);
            });

            // Add requestId to response headers
            res.setHeader(config.requestIdHeader, requestId);

            next();
        });
    };
}

export default httpMiddleware;