# Roadmap for Framework-Agnostic Request Context Implementation

## Core Implementation Steps

1. Create base middleware factory with common options:

```js
function createMiddleware(options = {}) {
  return {
    requestIdHeader: options.requestIdHeader || 'x-request-id',
    getUserId: options.getUserId || (req => req.user?.id),
    getExtra: options.getExtra || (() => ({}))
  }
}
```

2. Express Middleware Implementation:

```js
function expressMiddleware(options) {
  const config = createMiddleware(options);
  return (req, res, next) => {
    const requestId = req.headers[config.requestIdHeader] || uuid();
    contextManager.run(() => {
      contextManager.set('requestId', requestId);
      contextManager.set('path', req.path);
      // ... set other context
      next();
    });
  }
}
```

3. Fastify Middleware Implementation:

```js
function fastifyMiddleware(options) {
  const config = createMiddleware(options);
  return (request, reply, done) => {
    const requestId = request.headers[config.requestIdHeader] || uuid();
    contextManager.run(() => {
      contextManager.set('requestId', requestId);
      contextManager.set('path', request.url);
      // ... set other context
      done();
    });
  }
}
```

4. Native HTTP Middleware Implementation:

```js
function httpMiddleware(options) {
  const config = createMiddleware(options);
  return (req, res, next) => {
    const requestId = req.headers[config.requestIdHeader] || uuid();
    contextManager.run(() => {
      contextManager.set('requestId', requestId);
      contextManager.set('path', req.url);
      // ... set other context
      next();
    });
  }
}
```

## Implementation Order

1. Create middleware directory structure
2. Implement common middleware factory
3. Implement Express middleware
4. Implement Fastify middleware  
5. Implement HTTP middleware
6. Update exports
7. Add tests
8. Update documentation

## Key Considerations

- Keep consistent interface across all frameworks
- Allow customization through options
- Handle errors appropriately
- Clean up context after request completion
- Generate request IDs if not provided
- Extract common request data (path, method, etc)
