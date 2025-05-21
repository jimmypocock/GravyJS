# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GravyJS is a WYSIWYG editor React component featuring variable templates and snippet management. The editor allows users to create templates with configurable variables (e.g., `[[name]]`), populate them dynamically, and copy the result with formatting preserved. **Note: Currently marked as WIP - Not Yet Working.**

## Development Commands

```bash
# Build package for production
npm run build

# Build with watch mode (development)
npm run build:watch

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Start development environment (builds package + demo)
npm run dev

# Demo-specific commands
npm run demo:install    # Install demo dependencies
npm run demo:link      # Link package to demo
npm run dev:demo       # Start demo server only
```

## Architecture

### Core Technology Stack

- **Framework**: React with forwardRef pattern and imperative ref API
- **Build System**: Rollup with Babel transpilation (ES modules + CommonJS)
- **Testing**: Jest with React Testing Library and jsdom
- **Demo Environment**: Vite-based development setup

### Key Design Principles

1. **Template Preservation**: Original templates never change when variables are populated
2. **Configurable Variable Delimiters**: Default `[[]]` to avoid React JSX conflicts
3. **Modern DOM APIs**: Uses Selection/Range APIs instead of deprecated `document.execCommand`
4. **XSS Protection**: All user input is escaped before HTML insertion
5. **Copy Functionality**: Returns both HTML and plain text for maximum compatibility

### Component Structure

```
src/
├── GravyJS.js         # Main React component (forwardRef)
├── GravyJS.css        # Component styles
├── index.js           # Package entry point
├── index.d.ts         # TypeScript declarations
└── __tests__/         # Jest test files
```

### Variable System Implementation

Variables are stored as HTML spans with data attributes:

```html
<!-- Unpopulated variable -->
<span class="gravy-variable" data-variable="name">[[name]]</span>

<!-- Populated variable -->
<span class="gravy-variable-populated">John Doe</span>
```

Variable detection uses regex pattern matching on both HTML and text content for robustness.

### Exposed API (via ref)

```javascript
// Main methods
editorRef.current.populateVariables()      // Promise<{html, plainText, variables}>
editorRef.current.getContent()             // Returns current HTML
editorRef.current.setContent(html)         // Sets editor content
editorRef.current.getAllVariables()        # Returns array of variable names
```

## Testing Setup

- **Environment**: jsdom with React Testing Library
- **Configuration**: `jest.config.js` with CSS module mocking
- **Mocks**: Selection and Range APIs for contentEditable testing
- **Coverage**: Excludes entry point and setup files

## Development Workflow

### Package Development

1. Make changes to `src/` files
2. Run `npm run build:watch` for live rebuilding
3. Use demo app (`npm run dev:demo`) for testing

### Demo Setup

The demo environment uses npm linking for live development:

```bash
npm link                    # In package root
cd demo && npm link gravyjs  # Link to demo
```

### Common Issues

- **Cursor Management**: Solved using proper Selection API management with TreeWalker
- **React contentEditable Warnings**: Handled with careful event management
- **Variable Conflicts**: Configurable delimiters prevent JSX template literal conflicts

## Build Configuration

### Rollup Output

- **CommonJS**: `dist/index.js` for Node.js compatibility
- **ES Modules**: `dist/index.es.js` for modern bundlers
- **TypeScript**: `dist/index.d.ts` declarations copied from source
- **CSS**: Extracted to `dist/index.css` with postcss processing

### External Dependencies

React and ReactDOM are marked as peer dependencies and external in build.