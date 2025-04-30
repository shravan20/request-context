# Contributing to Request Context

First off, thank you for considering contributing to Request Context! This is a community-driven project and we welcome contributions of all kinds: from discussions and documentation to bug fixes and features.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Requirements](#testing-requirements)
- [Documentation Standards](#documentation-standards)
- [Example Guidelines](#example-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/request-context.git
   cd request-context
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Process

1. **Keep it Minimal**: This package focuses solely on request context management. Any additional functionality should be implemented as examples rather than core features.

2. **Core Principles**:
   - Maintain request isolation
   - Ensure proper async context handling
   - Keep the API simple and intuitive
   - Focus on performance and reliability

3. **Feature Requests**:
   - Open an issue to discuss the feature first
   - Explain the use case and benefits
   - Get feedback from maintainers
   - Proceed with implementation after approval

## Pull Request Process

1. **Before Submitting**:
   - Update documentation for any new features
   - Add or update examples if needed
   - Add tests for new functionality
   - Ensure all tests pass
   - Run linting checks

2. **PR Description**:
   - Clearly describe the changes
   - Link to related issues
   - Include before/after examples if applicable
   - List any breaking changes

3. **Review Process**:
   - PRs require at least one maintainer review
   - Address review feedback promptly
   - Keep the PR focused and minimal

## Code Style Guidelines

### General

- Use ES modules (import/export)
- Use const/let appropriately
- Avoid unnecessary dependencies
- Keep functions small and focused
- Use meaningful variable names

### JavaScript Style

```javascript
// Use descriptive variable names
const requestId = generateId();  // Good
const id = generateId();        // Less clear

// Use consistent spacing
function example(param1, param2) {
    // Use 4 spaces for indentation
    const result = doSomething();
    return result;
}

// Use early returns
function validate(data) {
    if (!data) return false;
    if (!data.id) return false;
    return true;
}

// Use modern JS features
const { id, name } = user;  // Object destructuring
const items = [...array];   // Spread operator
```

### Naming Conventions

- Use camelCase for variables and functions
- Use PascalCase for classes
- Use UPPER_SNAKE_CASE for constants
- Use descriptive names that reflect purpose

## Testing Requirements

1. **Unit Tests**:
   - Required for all new features
   - Should cover edge cases
   - Mock external dependencies
   - Keep tests focused and isolated

2. **Test Structure**:
   ```javascript
   describe('Feature', () => {
       it('should handle normal case', () => {
           // Test implementation
       });

       it('should handle edge case', () => {
           // Test implementation
       });

       it('should throw on invalid input', () => {
           // Test implementation
       });
   });
   ```

3. **Coverage Requirements**:
   - Aim for 80%+ coverage
   - Cover all code paths
   - Include error scenarios

## Documentation Standards

### Code Comments

- Use JSDoc for public APIs
- Keep comments focused and necessary
- Explain "why" not "what"

```javascript
/**
 * Creates a new context for the request
 * @param {Object} options - Configuration options
 * @param {string} [options.requestIdHeader='x-request-id'] - Header to use for request ID
 * @returns {Function} Middleware function
 */
function createContext(options) {
    // Implementation
}
```

### README Updates

- Keep examples simple and focused
- Update API documentation
- Include use cases
- Document breaking changes

### Example Guidelines

1. **Structure**:
   - Place in examples directory
   - Include package.json
   - Add README with setup instructions
   - Keep examples minimal

2. **Content**:
   - Show real-world usage
   - Include error handling
   - Add comments explaining key concepts
   - Demonstrate best practices

## Example Guidelines

When adding examples:

1. **Directory Structure**:
   ```
   examples/
   ├── use-case-name/
   │   ├── index.js
   │   ├── package.json
   │   └── README.md
   ```

2. **Example Code**:
   - Keep it simple and focused
   - Include error handling
   - Add helpful comments
   - Show best practices

3. **README**:
   - Explain the use case
   - List requirements
   - Include setup instructions
   - Show expected output

## Questions?

Feel free to open an issue for:
- Feature discussions
- Usage questions
- Bug reports
- Documentation improvements

We appreciate your contributions to making Request Context better!