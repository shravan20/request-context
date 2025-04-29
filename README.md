# Request Context

Minimal Node.js library for managing per-request context and enhancing your logger automatically.

## Features

- Scoped context per request using AsyncLocalStorage
- Pluggable logger (Pino, Winston, Console, etc.)
- Auto-injects traceId, userId, path into logs
- Framework agnostic - supports Express, Fastify, and native HTTP
- Clean, small, production-ready

## Installation

```bash
npm install request-context
```

## Usage

### Express

```javascript
import express from 'express';
import { expressMiddleware, logger } from 'request-context';

const app = express();

// Add the middleware early in your middleware chain
app.use(expressMiddleware({
    // Optional configuration
    requestIdHeader: 'x-request-id',
    getUserId: req => req.user?.id,
    getExtra: req => ({
        // Add any extra context you want
        ip: req.ip
    })
}));

// Now all your logs will automatically include request context
app.get('/', (req, res) => {
    logger.info('Hello world!');  // Will include requestId, path, userId, etc.
    res.send('Hello!');
});
```

### Fastify

```javascript
import fastify from 'fastify';
import { fastifyMiddleware, logger } from 'request-context';

const app = fastify();

// Register the middleware
app.addHook('onRequest', fastifyMiddleware({
    // Optional configuration
    requestIdHeader: 'x-request-id',
    getUserId: request => request.user?.id,
    getExtra: request => ({
        // Add any extra context you want
        ip: request.ip
    })
}));

// Now all your logs will automatically include request context
app.get('/', (request, reply) => {
    logger.info('Hello world!');  // Will include requestId, path, userId, etc.
    reply.send('Hello!');
});
```

### Native HTTP Server

```javascript
import http from 'http';
import { httpMiddleware, logger } from 'request-context';

const middleware = httpMiddleware({
    // Optional configuration
    requestIdHeader: 'x-request-id',
    getUserId: req => req.user?.id,
    getExtra: req => ({
        // Add any extra context you want
        ip: req.socket.remoteAddress
    })
});

const server = http.createServer((req, res) => {
    middleware(req, res, () => {
        logger.info('Hello world!');  // Will include requestId, path, userId, etc.
        res.end('Hello!');
    });
});

server.listen(3000);
```

## Configuration Options

All middleware functions accept these options:

- `requestIdHeader` (string): Header to use for request ID. Defaults to 'x-request-id'
- `getUserId` (function): Function to extract user ID from request. Defaults to req.user?.id
- `getExtra` (function): Function to extract additional context from request. Defaults to empty object

## Logger Configuration

```javascript
import pino from 'pino';
import { logger } from 'request-context';

// Configure with your preferred logger
logger.configure(pino());

// Now all logs will be handled by pino
logger.info('Hello world!');
```

## Context Values

The following context values are automatically added to every request:

- `requestId`: Unique ID for each request (from header or generated)
- `path`: Request path
- `method`: HTTP method
- `userId`: User ID (if available)
- Any additional values from getExtra()

## Examples

Check out the [examples](./examples) directory for complete working examples using:
- Express
- Fastify
- Native HTTP Server

Each example demonstrates:
- Middleware setup
- Logger configuration
- Request handling
- Error handling
- Context propagation

## Publishing

A publish script is included to help with releasing new versions. The script handles:

- npm login
- version bumping
- publishing to npm
- git tagging
- pushing changes

To use it:

```bash
# Make the script executable (one-time setup)
chmod +x publish.sh

# Publish a new version
./publish.sh <version_type>

# where version_type is one of:
# - major (for breaking changes)
# - minor (for new features)
# - patch (for bug fixes)
```

The script will:
1. Validate your working directory is clean
2. Log you into npm if needed
3. Run tests if they exist
4. Bump the version
5. Publish to npm
6. Push changes and tags to git

## License

MIT
