# Request Context

A robust Node.js framework for request context management. Maintain request-scoped context across your entire application stack - from web handlers to database calls, logging, metrics, and more.

## Core Features

- 🎯 **Request-Scoped Storage** - Isolated context for each request using AsyncLocalStorage
- 🔍 **Automatic Request Tracing** - Built-in request ID generation and propagation
- 🔌 **Framework Agnostic** - First-class support for Express, Fastify, and native HTTP
- 🏃 **High Performance** - Minimal overhead using Node.js built-in features
- 🎨 **Flexible Context** - Store and access any data across your request lifecycle
- 🔒 **Type Safe** - Written in JavaScript with JSDoc comments
- 🧩 **Middleware Ready** - Easy integration with existing middleware chains

## Quick Start

```bash
npm install request-ctxt
```

```javascript
import express from 'express';
import { expressMiddleware, contextManager } from 'request-ctxt';

const app = express();

// Add context middleware
app.use(expressMiddleware({
    getContext: req => ({
        path: req.path,
        userId: req.user?.id
    })
}));

// Access context anywhere in your application
app.get('/users', async (req, res) => {
    const context = contextManager.getAll();
    // Use context in database calls, logging, etc.
});
```

## Core Concepts

### Request Context

Each request gets its own isolated context storage that:
- Is automatically created at the start of a request
- Is accessible anywhere in your application during that request
- Is automatically cleaned up when the request ends
- Maintains isolation between concurrent requests
- Preserves context across async operations

### Request ID

Every request automatically gets a unique ID that:
- Is generated using UUID v4 if not provided
- Can be read from request headers
- Is added to response headers
- Is available in context as 'requestId'
- Enables request tracing across your system

## Framework Integration

### Express
```javascript
import { expressMiddleware } from 'request-ctxt';

app.use(expressMiddleware({
    requestIdHeader: 'x-trace-id',
    getContext: req => ({
        path: req.path,
        userId: req.user?.id,
        // Add any request data you need
    })
}));
```

### Fastify
```javascript
import { fastifyMiddleware } from 'request-ctxt';

fastify.addHook('onRequest', fastifyMiddleware({
    getContext: req => ({
        path: req.url,
        userId: req.user?.id
    })
}));
```

### Native HTTP
```javascript
import { httpMiddleware } from 'request-ctxt';

const middleware = httpMiddleware({
    getContext: req => ({
        path: req.url,
        ip: req.socket.remoteAddress
    })
});
```

## Using Context

Access context anywhere in your application:

```javascript
import { contextManager } from 'request-ctxt';

// Get all context
const context = contextManager.getAll();

// Get specific value
const requestId = contextManager.get('requestId');

// Set context value
contextManager.set('customKey', 'value');
```

## Common Use Cases

### Logging
```javascript
const log = (level, message, extra = {}) => {
    const context = contextManager.getAll();
    logger[level]({
        ...context,
        ...extra,
        message
    });
};
```

### Database Auditing
```javascript
const createUser = async (userData) => {
    const context = contextManager.getAll();
    return db.users.create({
        ...userData,
        audit: {
            requestId: context.requestId,
            createdBy: context.userId
        }
    });
};
```

### Metrics
```javascript
const recordMetric = (name, value, tags = {}) => {
    const context = contextManager.getAll();
    metrics.record(name, value, {
        ...tags,
        userId: context.userId,
        path: context.path
    });
};
```

### Distributed Tracing
```javascript
const startSpan = (name) => {
    const context = contextManager.getAll();
    return tracer.startSpan(name, {
        attributes: {
            requestId: context.requestId,
            userId: context.userId
        }
    });
};
```

## API Reference

### Middleware Options
```typescript
interface MiddlewareOptions {
    // Header for request ID (default: 'x-request-id')
    requestIdHeader?: string;
    
    // Extract context from request
    getContext?: (req: Request) => Record<string, any>;
}
```

### Context Manager
```typescript
interface ContextManager {
    // Get all context
    getAll(): Record<string, any>;
    
    // Get specific value
    get(key: string): any;
    
    // Set value
    set(key: string, value: any): void;
}
```

## Examples

Check out the [examples](./examples) directory for complete working examples:

### Framework Examples
- Express integration
- Fastify integration
- Native HTTP integration

### Use Case Examples
- Logging integration (Console, Pino, Winston)
- Database auditing with Sequelize
- Metrics with Prometheus
- Distributed tracing with OpenTelemetry
- Error handling and monitoring
- Authentication context

Each example demonstrates:
- Middleware setup
- Context usage patterns
- Integration techniques
- Best practices
- Error handling

## Best Practices

1. **Add Middleware Early**
   - Place context middleware before other middleware
   - Ensures context is available throughout request

2. **Choose Context Carefully**
   - Include data needed across the stack
   - Consider performance impact
   - Focus on cross-cutting concerns

3. **Create Helper Functions**
   - Wrap common operations
   - Maintain consistent patterns
   - Reduce boilerplate

4. **Handle Errors**
   - Include context in error reporting
   - Maintain context in error middleware
   - Clean up resources properly

## License

MIT
