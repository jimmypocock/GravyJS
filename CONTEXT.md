# GravyJS Project Context

## Project Overview
GravyJS is a WYSIWYG editor component for React/NextJS applications featuring variable templates and snippet management. The editor allows users to create templates with configurable variables (e.g., `[[name]]`), populate them dynamically, and copy the result with formatting preserved.

## Current Architecture

### Tech Stack
- **Framework**: React with forwardRef pattern
- **Build**: Rollup for bundling
- **Styling**: CSS modules
- **Testing**: Jest with React Testing Library
- **Demo**: Vite-based development environment

### Core Features
1. **Rich Text Editing**: Bold, italic, underline, lists, links
2. **Variable System**: Configurable delimiters (default `[[]]` to avoid React JSX conflicts)
3. **Variable Population**: Prompts user for values, generates new content without modifying template
4. **Snippet System**: Predefined text snippets with search functionality
5. **Copy with Formatting**: Preserves rich text when copying to clipboard
6. **Keyboard Shortcuts**: Ctrl+B, Ctrl+I, Ctrl+U

## Key Implementation Details

### Modern API Usage
- Uses Selection and Range APIs instead of deprecated `document.execCommand`
- Proper cursor position management using TreeWalker API
- Debounced input handling to prevent cursor jumping

### Variable System
```javascript
// Variables are stored as spans with data attributes
<span class="gravy-variable" data-variable="name">[[name]]</span>

// Populated variables become:
<span class="gravy-variable-populated">John Doe</span>
```

### File Structure
```
gravy-js/
├── src/
│   ├── GravyJS.js         # Main component
│   ├── GravyJS.css        # Styles
│   ├── index.js            # Entry point
│   └── setupTests.js       # Test configuration
├── demo/                   # Development demo
│   ├── src/App.jsx         # Demo application
│   └── src/App.css         # Demo styles
├── jest.config.js          # Test configuration
├── rollup.config.js        # Build configuration
└── package.json            # Package configuration
```

## Important Design Decisions

1. **Template Preservation**: Original templates never change when variables are populated
2. **Configurable Delimiters**: Default `[[]]` instead of `{{}}` to avoid React conflicts
3. **Modern APIs**: No deprecated methods, future-proof implementation
4. **Copy Functionality**: Returns both HTML and plain text for maximum compatibility
5. **Ref-based API**: All methods exposed through imperative ref interface

## Current State

### Working Features
- Complete text editing functionality
- Variable insertion and population
- Snippet management with search
- Copy with formatting preserved
- Configurable variable delimiters
- Demo application with all features

### Key Methods (exposed via ref)
```javascript
editorRef.current.populateVariables()      // Returns Promise<PopulatedContent>
editorRef.current.getContent()             // Returns string
editorRef.current.setContent(html)         // Sets content
editorRef.current.getAllVariables()        // Returns string[]
```

## Known Issues & Considerations

1. **Cursor Management**: Solved cursor jumping issues with proper selection management
2. **React JSX Conflicts**: Solved with configurable delimiters
3. **contentEditable**: Carefully handled to avoid React warnings
4. **TypeScript**: Currently JavaScript with declaration files (full TS conversion planned for v2.0.0)

## Configuration Examples

### Default Usage
```jsx
<GravyJS
  ref={editorRef}
  onChange={setContent}
  snippets={snippets}
  variablePrefix="[["
  variableSuffix="]]"
/>
```

### TypeScript Usage
```typescript
const editorRef = useRef<GravyJSRef>(null);
```

## Development Setup

### Build Commands
```bash
npm run build          # Build package
npm test              # Run tests
npm run dev           # Start demo
```

### Demo Setup
```bash
mkdir demo && cd demo
npm init -y
npm install react react-dom
npm install --save-dev vite @vitejs/plugin-react
cd .. && npm link && cd demo && npm link gravy-js
```

## Styling Structure

### CSS Classes
- `.gravy-editor`: Main container
- `.gravy-toolbar`: Toolbar container
- `.gravy-content`: Editable content area
- `.gravy-variable`: Unpopulated variables (blue background)
- `.gravy-variable-populated`: Populated variables (green background)
- `.gravy-snippets-dropdown`: Snippet selection UI

## Snippet Format
```javascript
{
  title: "Snippet Name",
  content: "<p>HTML content with [[variables]]</p>"
}
```

## Variable Population Flow
1. User creates template with variables: `Hello [[name]]`
2. Clicks "Populate Variables" button
3. System prompts for each variable value
4. Generates new content without modifying template
5. User can copy with formatting preserved

## Important Props

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `variablePrefix` | string | `'[['` | Start delimiter |
| `variableSuffix` | string | `']]'` | End delimiter |
| `snippets` | array | `[]` | Available snippets |
| `onChange` | function | - | Content change handler |
| `placeholder` | string | - | Editor placeholder |

## Copy Implementation
```javascript
// Copies both HTML and plain text
await navigator.clipboard.write([
  new ClipboardItem({
    'text/html': new Blob([html], { type: 'text/html' }),
    'text/plain': new Blob([plainText], { type: 'text/plain' })
  })
]);
```

## Testing Setup
- Uses Jest with jsdom environment
- React Testing Library for component testing
- Mocks for Selection and Range APIs
- CommonJS in setup files to avoid import issues

## Future Roadmap
- v2.0.0: Full TypeScript conversion
- Plugin system
- Table support
- Image upload
- Undo/Redo functionality
- Better accessibility

This context should provide sufficient information for any AI to continue development work on GravyJS.