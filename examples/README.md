# Request Context Examples

This directory contains example implementations using different Node.js frameworks and logging libraries:

## Setup

Each example is a standalone application that uses the latest version of the request-ctxt package. To run an example:

1. Install dependencies:
```bash
cd examples/<example-name>
npm install
```

2. Run the example:
```bash
npm start
```

Note: These examples always use the latest version of request-ctxt from npm. In a production environment, you should pin to a specific version.

## Framework Examples

### Express Example
Basic Express.js implementation with console logging.

### Fastify Example
Basic Fastify implementation with console logging.

### Native HTTP Example
Basic Node.js HTTP server implementation with console logging.

## Logger Examples

### Pino Logger Example
Express.js implementation with Pino logger, demonstrating:
- Structured JSON logging
- Custom timestamp formatting
- Multiple log levels
- Error serialization

### Winston Logger Example
Express.js implementation with Winston logger, demonstrating:
- Structured JSON logging
- Colorized console output
- Custom formatting
- Multiple transports

## Testing the Examples

Each example starts a server on port 3000 (or PORT environment variable) with two endpoints:

1. GET `/` - Returns a success message and logs various levels
2. GET `/error` - Simulates an error condition with error logging

### Example Requests

```bash
# Test the success endpoint
curl http://localhost:3000/

# Test the error endpoint
curl http://localhost:3000/error

# Test with a custom request ID
curl -H "x-request-id: test-123" http://localhost:3000/
```

Each request will generate logs with context information including:
- Request ID (auto-generated or from header)
- Path
- HTTP Method
- IP Address
- User Agent
- Timestamp
- Log Level
- Any errors that occur

## Example Output

### Pino Logger
```json
{
  "level": "info",
  "time": "2023-10-20T12:34:56.789Z",
  "requestId": "test-123",
  "path": "/",
  "method": "GET",
  "ip": "::1",
  "userAgent": "curl/7.64.1",
  "msg": "Handling root request"
}
```

### Winston Logger
```json
{
  "level": "info",
  "message": "Handling root request",
  "timestamp": "2023-10-20T12:34:56.789Z",
  "requestId": "test-123",
  "path": "/",
  "method": "GET",
  "ip": "::1",
  "userAgent": "curl/7.64.1"
}
```