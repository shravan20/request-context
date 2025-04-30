import { contextManager } from 'request-ctxt';
import prometheus from 'prom-client';

// Example of using context with Prometheus metrics
export const createMetricsMiddleware = () => {
    const httpRequestDuration = new prometheus.Histogram({
        name: 'http_request_duration_seconds',
        help: 'Duration of HTTP requests in seconds',
        labelNames: ['method', 'path', 'status', 'userId']
    });

    return (req, res, next) => {
        const start = Date.now();
        
        // Add response hook to record metrics
        res.on('finish', () => {
            const context = contextManager.getAll();
            const duration = (Date.now() - start) / 1000;
            
            httpRequestDuration.observe(
                {
                    method: context.method,
                    path: context.path,
                    status: res.statusCode,
                    userId: context.userId || 'anonymous'
                },
                duration
            );
        });
        
        next();
    };
};