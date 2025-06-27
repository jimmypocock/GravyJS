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
- **Styling**: CSS modules with postcss processing
- **Testing**: Jest with React Testing Library and jsdom
- **Demo Environment**: Vite-based development setup

### Core Features

1. **Rich Text Editing**: Bold, italic, underline, lists, links with keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U)
2. **Variable System**: Configurable delimiters (default `[[]]` to avoid React JSX conflicts)
3. **Variable Population**: Prompts user for values, generates new content without modifying template
4. **Snippet System**: Predefined text snippets with search functionality
5. **Copy with Formatting**: Preserves rich text when copying to clipboard

### Key Design Principles

1. **Template Preservation**: Original templates never change when variables are populated
2. **Configurable Variable Delimiters**: Default `[[]]` to avoid React JSX conflicts
3. **Modern DOM APIs**: Uses Selection/Range APIs with TreeWalker instead of deprecated `document.execCommand`
4. **XSS Protection**: All user input is escaped before HTML insertion
5. **Copy Functionality**: Returns both HTML and plain text for maximum compatibility
6. **Cursor Management**: Proper cursor position management with debounced input handling

### Component Structure

```
src/
├── GravyJS.js                    # Main orchestrator component (forwardRef)
├── GravyJS.css                   # Component styles
├── components/
│   ├── Toolbar.jsx               # Formatting buttons and toolbar logic
│   ├── Editor.jsx                # ContentEditable wrapper with input handling
│   └── SnippetDropdown.jsx       # Snippet search and insertion UI
├── hooks/
│   ├── useSelection.js           # Selection/range management
│   ├── useFormatting.js          # Text formatting operations
│   ├── useVariables.js           # Variable parsing and population
│   ├── useKeyboardShortcuts.js   # Keyboard event handling
│   ├── useClipboard.js           # Modern clipboard API operations
│   └── useEditorContent.js       # Content state management
├── index.js                      # Package entry point
├── index.d.ts                    # TypeScript declarations
└── __tests__/                    # Jest test files
    ├── PotPieJS.test.js          # Integration tests
    ├── Toolbar.test.js           # Toolbar component tests
    ├── Editor.test.js            # Editor component tests
    └── SnippetDropdown.test.js   # Snippet dropdown tests
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
editorRef.current.populateVariables(); // Promise<{html, plainText, variables}>
editorRef.current.getContent(); // Returns current HTML
editorRef.current.setContent(html); // Sets editor content
editorRef.current.getAllVariables(); // Returns array of variable names
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

### CSS Classes

- `.gravy-editor`: Main container
- `.gravy-toolbar`: Toolbar container
- `.gravy-content`: Editable content area
- `.gravy-variable`: Unpopulated variables (blue background)
- `.gravy-variable-populated`: Populated variables (green background)
- `.gravy-snippets-dropdown`: Snippet selection UI

### Snippet Format

```javascript
{
  title: "Snippet Name",
  content: "<p>HTML content with [[variables]]</p>"
}
```

### Variable Population Flow

1. User creates template with variables: `Hello [[name]]`
2. Clicks "Populate Variables" button
3. System prompts for each variable value
4. Generates new content without modifying template
5. User can copy with formatting preserved

### Copy Implementation

```javascript
// Copies both HTML and plain text
await navigator.clipboard.write([
  new ClipboardItem({
    "text/html": new Blob([html], { type: "text/html" }),
    "text/plain": new Blob([plainText], { type: "text/plain" }),
  }),
]);
```

### Important Props

| Prop               | Type     | Default | Purpose                                   |
| ------------------ | -------- | ------- | ----------------------------------------- |
| `variablePrefix`   | string   | `'[['`  | Start delimiter                           |
| `variableSuffix`   | string   | `']]'`  | End delimiter                             |
| `snippets`         | array    | `[]`    | Available snippets                        |
| `onChange`         | function | -       | Content change handler                    |
| `placeholder`      | string   | -       | Editor placeholder                        |
| `onVariablePrompt` | function | -       | Custom variable input function (optional) |
| `noStyles`         | boolean  | `false` | Disable built-in CSS styles               |

### Architecture Benefits

- **Modular Components**: Each component has single responsibility
- **Reusable Hooks**: Logic is extracted into composable hooks
- **Better Testing**: Components can be tested in isolation
- **Easier Debugging**: Problems are isolated to specific areas
- **Professional Scalability**: Can add features without bloating core files

### Component Responsibilities

- **GravyJS.js**: Main orchestrator, manages state and coordinates between components
- **Toolbar.jsx**: All formatting buttons, handles user interactions
- **Editor.jsx**: ContentEditable wrapper with debounced input handling
- **SnippetDropdown.jsx**: Snippet search UI, handles snippet insertion
- **useSelection.js**: Manages cursor position and text selection
- **useFormatting.js**: Text formatting operations (bold, italic, lists, links)
- **useVariables.js**: Variable parsing, population, and insertion logic
- **useKeyboardShortcuts.js**: Keyboard event handling and accessibility features
- **useClipboard.js**: Modern clipboard API with fallbacks for older browsers
- **useEditorContent.js**: Content state management and programmatic content control

### Common Issues

- **Cursor Management**: Solved using proper Selection API management with TreeWalker
- **React contentEditable Warnings**: Handled with careful event management
- **Variable Conflicts**: Configurable delimiters prevent JSX template literal conflicts
- **Import Extensions**: Use explicit .js/.jsx extensions for ES module compatibility

## Build Configuration

### Rollup Output

- **CommonJS**: `dist/index.js` for Node.js compatibility
- **ES Modules**: `dist/index.es.js` for modern bundlers
- **TypeScript**: `dist/index.d.ts` declarations copied from source
- **CSS**: Extracted to `dist/index.css` with postcss processing

### External Dependencies

React and ReactDOM are marked as peer dependencies and external in build.

### Future Roadmap

- v2.0.0: Full TypeScript conversion
- Plugin system
- Table support
- Image upload
- Undo/Redo functionality
- Better accessibility
