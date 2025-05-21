# GravyJS [WIP: Not Yet Working]

A powerful, customizable WYSIWYG editor component for React and NextJS applications with support for variables, snippets, and rich text formatting.

## ✨ Features

- 🖋️ **Rich Text Editing**: Bold, italic, underline, lists, and links
- 🔄 **Variable Templates**: Configurable variable delimiters (default: `[[variable]]`)
- 📝 **Snippets**: Searchable text snippets with variables
- 📋 **Smart Copy**: Copy with formatting preserved
- ⌨️ **Keyboard Shortcuts**: Standard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U)
- 🎨 **Customizable**: Easy theming and styling
- 📱 **Responsive**: Works on all screen sizes
- 🚀 **NextJS Ready**: Perfect for NextJS applications
- ⚡ **Modern APIs**: Uses Selection and Range APIs (no deprecated `document.execCommand`)

## 🚀 Installation

```bash
npm install gravyjs
# or
yarn add gravyjs
```

## 📖 Quick Start

```jsx
import React, { useState, useRef } from 'react';
import GravyJS from 'gravyjs';
import 'gravyjs/dist/index.css';

function App() {
  const [content, setContent] = useState('');
  const editorRef = useRef(null);

  const snippets = [
    {
      title: 'Greeting',
      content: 'Hello [[name]], welcome to [[company]]!'
    }
  ];

  return (
    <GravyJS
      ref={editorRef}
      initialValue=""
      onChange={setContent}
      snippets={snippets}
      placeholder="Start typing..."
      variablePrefix="[["
      variableSuffix="]]"
    />
  );
}
```

## 📚 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialValue` | `string` | `''` | Initial content of the editor |
| `onChange` | `function` | `undefined` | Callback fired when content changes |
| `snippets` | `array` | `[]` | Array of snippet objects |
| `placeholder` | `string` | `'Start typing...'` | Placeholder text |
| `className` | `string` | `''` | Custom CSS class |
| `variablePrefix` | `string` | `'[['` | Start delimiter for variables |
| `variableSuffix` | `string` | `']]'` | End delimiter for variables |

### Snippet Object Structure

```javascript
{
  title: "Snippet Title",
  content: "<p>HTML content with [[variables]]</p>"
}
```

### Exposed Methods (via ref)

```javascript
const editorRef = useRef();

// Populate variables (prompts user for values)
editorRef.current.populateVariables().then(result => {
  if (result) {
    console.log('Populated HTML:', result.html);
    console.log('Plain text:', result.plainText);
    console.log('Variables used:', result.variables);
  }
});

// Get current content
const content = editorRef.current.getContent();

// Set content programmatically
editorRef.current.setContent('<p>New content</p>');

// Get all variables in the current content
const variables = editorRef.current.getAllVariables();
```

## 🎯 Variable Templates

GravyJS supports configurable variable delimiters to avoid conflicts with templating engines like React/JSX.

### Default Syntax (React-Safe)

```html
Hello [[name]], welcome to [[company]]!
```

### Custom Delimiters

```jsx
// Using percent signs
<GravyJS variablePrefix="%%" variableSuffix="%%" />
// Variables: %%name%%

// Using at symbols
<GravyJS variablePrefix="@@" variableSuffix="@@" />
// Variables: @@name@@

// Using angle brackets
<GravyJS variablePrefix="<<" variableSuffix=">>" />
// Variables: <<name>>
```

### Variable Workflow

1. **Insert Variables**: Click the `[[]]` button and enter variable names
2. **Populate Variables**: Click "Populate Variables" to enter values
3. **Copy Content**: Copy the populated content with formatting preserved
4. **Template Stays**: Original template remains unchanged for reuse

## 📋 Copy with Formatting

```javascript
// Copy to clipboard with formatting preserved
const result = await editorRef.current.populateVariables();
if (result) {
  // Copy HTML with formatting
  await navigator.clipboard.write([
    new ClipboardItem({
      'text/html': new Blob([result.html], { type: 'text/html' }),
      'text/plain': new Blob([result.plainText], { type: 'text/plain' })
    })
  ]);
}
```

## 🛠️ Development

### Setting Up the Demo

1. **Clone and setup**:
```bash
git clone https://github.com/yourusername/gravyjs.git
cd gravyjs
npm install
```

2. **Create demo environment**:
```bash
mkdir demo
cd demo
npm init -y
npm install react react-dom
npm install --save-dev vite @vitejs/plugin-react
```

3. **Link for development**:
```bash
# From project root
npm link
cd demo
npm link gravyjs
```

4. **Start demo server**:
```bash
npm run dev
```

### Demo Features

The demo includes:
- Live variable delimiter configuration
- Sample templates and snippets
- Copy functionality testing
- All features demonstration

## 🎨 Styling

### Default Styles

```css
/* Variables */
.gravy-variable {
  background: #e7f3ff;
  padding: 2px 4px;
  border-radius: 3px;
  color: #0066cc;
  font-weight: 500;
}

/* Populated variables */
.gravy-variable-populated {
  background: #d4edda;
  color: #155724;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: 500;
}
```

### Custom Styling

```jsx
<GravyJS
  className="my-custom-editor"
  // ... other props
/>
```

```css
.my-custom-editor {
  border: 2px solid #4a90e2;
  border-radius: 8px;
}

.my-custom-editor .gravy-toolbar {
  background: #f8f9fa;
}
```

## 📱 NextJS Integration

```jsx
// pages/editor.js
import dynamic from 'next/dynamic';

const GravyJS = dynamic(() => import('gravyjs'), {
  ssr: false // Disable SSR for the editor
});

export default function EditorPage() {
  return (
    <div>
      <GravyJS
        placeholder="Start writing..."
        // ... other props
      />
    </div>
  );
}
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+U` | Underline |

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 📦 Building

```bash
# Build for production
npm run build

# Build and watch for changes
npm run build -- --watch
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Create a Pull Request

### Code Style

- Use ES6+ features
- Follow React best practices
- Write meaningful commit messages
- Add JSDoc comments for public methods

## 🐛 Troubleshooting

### Common Issues

**Variables not working?**
- Make sure you're using the correct delimiters
- Check that variables have the correct `data-variable` attribute
- Ensure CSS is properly imported

**Cursor jumping around?**
- This is fixed in the latest version using proper selection management
- Make sure you're using the latest version of GravyJS

**Copy not preserving formatting?**
- Use the "Copy with Formatting" option
- Ensure your target application supports rich text paste
- Check browser clipboard permissions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [QuillJS](https://quilljs.com/) and [EditorJS](https://editorjs.io/)
- Built with modern React and DOM APIs
- Icons from various open-source icon sets

## 📈 Roadmap

- [ ] **v2.0.0**
  - [ ] TypeScript support
  - [ ] Plugin system
  - [ ] Table support
  - [ ] Image upload
  - [ ] Undo/Redo
  - [ ] Better accessibility

- [ ] **v2.1.0**
  - [ ] Markdown export
  - [ ] Custom toolbar configuration
  - [ ] Collaborative editing
  - [ ] Mobile optimizations

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/gravyjs/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/gravyjs/discussions)
- 📚 **Documentation**: [https://gravyjs.dev](https://gravyjs.dev)

---

Made with ❤️ by the GravyJS team
