import { contextManager } from 'request-ctxt';
import { trace } from '@opentelemetry/api';
import { NodeTracerProvider } from '@opentelemetry/node';

// Example of integrating with OpenTelemetry for distributed tracing
export const setupTracing = () => {
    const provider = new NodeTracerProvider();
    const tracer = provider.getTracer('request-context-example');

    return (req, res, next) => {
        const context = contextManager.getAll();
        
        // Create a span for each request
        const span = tracer.startSpan('http_request', {
            attributes: {
                requestId: context.requestId,
                userId: context.userId,
                path: context.path,
                method: context.method
            }
        });

        // End span when request completes
        res.on('finish', () => {
            span.setStatus({ code: res.statusCode < 400 ? 0 : 1 });
            span.end();
        });

        next();
    };
};