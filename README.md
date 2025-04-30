# Request Context

A lightweight, flexible Node.js library for managing per-request context and automatic logger enhancement. Perfect for tracing requests and maintaining contextual information across your application.

## Features

- 🔍 **Automatic Request Tracing** - Every request gets a unique trace ID
- 🎯 **Per-Request Context** - Isolated context for each request using AsyncLocalStorage
- 🔌 **Framework Agnostic** - Supports Express, Fastify, and native HTTP
- 📝 **Logger Integration** - Works with popular loggers (Pino, Winston, Console)
- 🎨 **Flexible Context** - Customize what context you want to capture
- 🏃 **High Performance** - Minimal overhead using Node.js built-in features
- 🔒 **Type Safe** - Written in JavaScript with JSDoc comments

## Installation

```bash
npm install request-ctxt
# or
yarn add request-ctxt
# or
pnpm add request-ctxt
```

## Quick Start

```javascript
import express from 'express';
import { expressMiddleware, logger } from 'request-ctxt';

const app = express();

// Add the middleware early in your chain
app.use(expressMiddleware({
    getContext: req => ({
        path: req.path,
        userId: req.user?.id,
        ip: req.ip
    })
}));

// Your logs will automatically include request context
app.get('/', (req, res) => {
    logger.info('Processing request');  // includes requestId, path, userId, etc.
    res.send('Hello!');
});
```

## Core Concepts

### Request ID (Trace ID)

Every request automatically gets a unique ID for tracing. The ID is:
- Generated using UUID v4 if not provided
- Read from request headers if present
- Added to response headers
- Automatically included in all logs

### Context Management

The library maintains an isolated context per request using AsyncLocalStorage. This means:
- Context is automatically cleaned up after each request
- No memory leaks
- No cross-request contamination
- Async operations maintain their original context

## Framework Integration

### Express

```javascript
import { expressMiddleware } from 'request-ctxt';

app.use(expressMiddleware({
    // Optional: customize the request ID header (default: x-request-id)
    requestIdHeader: 'x-trace-id',
    
    // Optional: define what context to capture
    getContext: req => ({
        path: req.path,
        method: req.method,
        userId: req.user?.id,
        ip: req.ip,
        userAgent: req.headers['user-agent']
    })
}));
```

### Fastify

```javascript
import { fastifyMiddleware } from 'request-ctxt';

fastify.addHook('onRequest', fastifyMiddleware({
    requestIdHeader: 'x-trace-id',
    getContext: request => ({
        path: request.url,
        method: request.method,
        userId: request.user?.id,
        ip: request.ip
    })
}));
```

### Native HTTP

```javascript
import { httpMiddleware } from 'request-ctxt';

const middleware = httpMiddleware({
    requestIdHeader: 'x-trace-id',
    getContext: req => ({
        path: req.url,
        method: req.method,
        ip: req.socket.remoteAddress
    })
});

http.createServer((req, res) => {
    middleware(req, res, () => {
        // Your request handler
    });
});
```

## Logger Integration

The library supports any logger but provides optimized formatting for popular logging libraries.

### Console Logger (Default)

```javascript
import { logger } from 'request-ctxt';

// Uses console by default
logger.info('Hello world');  // includes all context
```

### Pino Integration

```javascript
import pino from 'pino';
import { logger } from 'request-ctxt';

const pinoLogger = pino({
    level: 'debug',
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
    formatters: {
        level: (label) => ({ level: label })
    }
});

logger.configure(pinoLogger);

// Now logs will be handled by Pino with context
logger.info('Hello world', { extra: 'data' });
```

Example output:
```json
{
  "level": "info",
  "time": "2023-10-20T12:34:56.789Z",
  "requestId": "c2d8e86b-8b4b-4323-8d17-89a9c403cee9",
  "path": "/api/users",
  "method": "GET",
  "userId": "123",
  "msg": "Hello world",
  "extra": "data"
}
```

### Winston Integration

```javascript
import winston from 'winston';
import { logger } from 'request-ctxt';

const winstonLogger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

logger.configure(winstonLogger);

// Now logs will be handled by Winston with context
logger.info('Hello world', { extra: 'data' });
```

Example output:
```json
{
  "level": "info",
  "message": "Hello world",
  "timestamp": "2023-10-20T12:34:56.789Z",
  "requestId": "c2d8e86b-8b4b-4323-8d17-89a9c403cee9",
  "path": "/api/users",
  "method": "GET",
  "userId": "123",
  "extra": "data"
}
```

## API Reference

### Middleware Options

All middleware functions (express, fastify, http) accept these options:

```typescript
interface MiddlewareOptions {
    // Header to use for request ID (default: 'x-request-id')
    requestIdHeader?: string;
    
    // Function to extract context from request
    getContext?: (req: Request) => Record<string, any>;
}
```

### Logger Methods

```typescript
interface Logger {
    // Log methods
    info(message: string, extra?: Record<string, any>): void;
    error(message: string, extra?: Record<string, any>): void;
    warn(message: string, extra?: Record<string, any>): void;
    debug(message: string, extra?: Record<string, any>): void;
    trace(message: string, extra?: Record<string, any>): void;
    fatal(message: string, extra?: Record<string, any>): void;
    
    // Configure logger instance
    configure(logger: any): void;
}
```

### Context Manager

Direct access to the context manager if needed:

```javascript
import { contextManager } from 'request-ctxt';

// Get all context
const context = contextManager.getAll();

// Get specific context value
const requestId = contextManager.get('requestId');

// Set context value
contextManager.set('customKey', 'value');
```

## Best Practices

1. **Add Middleware Early**: Place the middleware as early as possible in your middleware chain to ensure all subsequent operations have access to the request context.

2. **Use Meaningful Context**: While you can add any context, focus on information that's useful for debugging and tracing:
   - Request path and method
   - User ID or session ID
   - IP address
   - Important headers
   - Business-specific identifiers

3. **Error Handling**: Include error details in your logs:
```javascript
try {
    // Your code
} catch (error) {
    logger.error('Operation failed', {
        error: error.message,
        stack: error.stack
    });
}
```

## Examples

Check out the [examples](./examples) directory for complete working examples using:
- Express
- Fastify
- Native HTTP
- Pino Logger
- Winston Logger

Each example demonstrates:
- Middleware setup
- Logger configuration
- Request handling
- Error handling
- Context propagation

## License

MIT
