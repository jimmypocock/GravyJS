import React, { useMemo, useCallback, useState, useImperativeHandle, forwardRef } from "react";
import { createEditor, Transforms, Editor, Element as SlateElement, Node } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { withHistory } from "slate-history";

// Components
import { Toolbar } from "./components/Toolbar.jsx";
import { Element } from "./components/Element.jsx";
import { Leaf } from "./components/Leaf.jsx";
import { VariableElement } from "./components/VariableElement.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";

// Plugins
import { withVariables } from "./plugins/withVariables";
import { withFormatting } from "./plugins/withFormatting";

// Utils
import { serialize, deserialize } from "./utils/serialization";
import { insertVariable, populateVariables, getAllVariables } from "./utils/variables";
import { insertSnippet } from "./utils/snippets";

// Import the original CSS
import "../GravyJS.css";

const SlateGravyJS = forwardRef(({
  initialValue = "",
  onChange,
  snippets = [],
  placeholder = "Start typing...",
  className = "",
  variablePrefix = "[[",
  variableSuffix = "]]",
  onVariablePrompt,
  noStyles = false,
}, ref) => {
  console.log('[SlateGravyJS] Props received:', { initialValue, onChange, snippets, placeholder, className, variablePrefix, variableSuffix, onVariablePrompt, noStyles });
  // Create the Slate editor with plugins
  const editor = useMemo(
    () => withVariables(
      withFormatting(
        withHistory(
          withReact(createEditor()),
        ),
      ),
      { variablePrefix, variableSuffix },
    ),
    [variablePrefix, variableSuffix],
  );

  // Default value for empty editor
  const defaultValue = useMemo(() => [{ type: "paragraph", children: [{ text: "" }] }], []);
  
  // Initialize editor state - ensure we always have a valid value
  const [value, setValue] = useState(() => {
    try {
      if (initialValue && typeof initialValue === 'string' && initialValue.trim()) {
        const deserialized = deserialize(initialValue);
        if (deserialized && Array.isArray(deserialized) && deserialized.length > 0) {
          console.log('[SlateGravyJS] Deserialized initial value:', JSON.stringify(deserialized, null, 2));
          return deserialized;
        }
      }
    } catch (error) {
      console.warn("Failed to deserialize initial value:", error);
    }
    
    console.log('[SlateGravyJS] Using default value');
    return defaultValue;
  });

  const [showSnippets, setShowSnippets] = useState(false);

  // Handle content changes
  const handleChange = useCallback((newValue) => {
    setValue(newValue);
    
    // Only trigger onChange for actual content changes
    const isAstChange = editor.operations.some(
      op => "set_selection" !== op.type,
    );
    
    if (isAstChange && onChange) {
      const html = serialize(newValue);
      onChange(html);
    }
  }, [editor.operations, onChange]);

  // Render element
  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "variable":
        return <VariableElement {...props} />;
      default:
        return <Element {...props} />;
    }
  }, []);

  // Render leaf
  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  // Handle variable insertion
  const handleInsertVariable = useCallback(() => {
    const variableName = onVariablePrompt 
      ? onVariablePrompt()
      : prompt("Enter variable name:");
    
    if (variableName) {
      insertVariable(editor, variableName, variablePrefix, variableSuffix);
    }
  }, [editor, onVariablePrompt, variablePrefix, variableSuffix]);

  // Handle snippet insertion
  const handleInsertSnippet = useCallback((snippet) => {
    insertSnippet(editor, snippet.content);
    setShowSnippets(false);
  }, [editor]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    // Populate variables with values
    populateVariables: (values) => {
      return populateVariables(editor, value, values);
    },
    
    // Get current content as HTML
    getContent: () => {
      return serialize(value);
    },
    
    // Set content from HTML
    setContent: (html) => {
      const nodes = deserialize(html);
      // Clear editor first
      Transforms.delete(editor, {
        at: {
          anchor: Editor.start(editor, []),
          focus: Editor.end(editor, []),
        },
      });
      // Insert new content
      Transforms.insertNodes(editor, nodes);
    },
    
    // Get all variables in the document
    getAllVariables: () => {
      return getAllVariables(editor, value);
    },
    
    // Generate populated content without modifying editor
    generatePopulatedContent: async (values) => {
      const populated = populateVariables(editor, value, values);
      return serialize(populated);
    },
    
    // Copy to clipboard
    copyToClipboard: async () => {
      const html = serialize(value);
      try {
        await navigator.clipboard.writeText(html);
        return true;
      } catch (err) {
        console.error("Failed to copy:", err);
        return false;
      }
    },
  }), [editor, value]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((event) => {
    // Let Slate handle the default shortcuts
    const { selection } = editor;
    
    // Custom shortcuts can be added here
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case "b":
          event.preventDefault();
          editor.toggleBold();
          break;
        case "i":
          event.preventDefault();
          editor.toggleItalic();
          break;
        case "u":
          event.preventDefault();
          editor.toggleUnderline();
          break;
      }
    }
  }, [editor]);

  const editorClassName = noStyles 
    ? className 
    : `gravy-editor ${className}`;

  console.log('[SlateGravyJS] Rendering with value:', JSON.stringify(value, null, 2));

  // Ensure value is never undefined or invalid
  if (!value || !Array.isArray(value) || value.length === 0) {
    console.error('[SlateGravyJS] Invalid value detected, using default');
    return (
      <div className={editorClassName}>
        <ErrorBoundary>
          <Slate editor={editor} initialValue={defaultValue} onChange={handleChange}>
            <Toolbar 
              onInsertVariable={handleInsertVariable}
              snippets={snippets}
              showSnippets={showSnippets}
              onToggleSnippets={() => setShowSnippets(!showSnippets)}
              onInsertSnippet={handleInsertSnippet}
              variablePrefix={variablePrefix}
              variableSuffix={variableSuffix}
            />
            <Editable
              className="gravy-content"
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder={placeholder}
              onKeyDown={handleKeyDown}
              spellCheck
              autoFocus
            />
          </Slate>
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <div className={editorClassName}>
      <ErrorBoundary>
        <Slate editor={editor} initialValue={value} onChange={handleChange}>
          <Toolbar 
            onInsertVariable={handleInsertVariable}
            snippets={snippets}
            showSnippets={showSnippets}
            onToggleSnippets={() => setShowSnippets(!showSnippets)}
            onInsertSnippet={handleInsertSnippet}
            variablePrefix={variablePrefix}
            variableSuffix={variableSuffix}
          />
          
          <Editable
            className="gravy-content"
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            spellCheck
            autoFocus
          />
        </Slate>
      </ErrorBoundary>
    </div>
  );
});

SlateGravyJS.displayName = "SlateGravyJS";

export default SlateGravyJS;