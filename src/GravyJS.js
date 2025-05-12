import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import './GravyJS.css';

const GravyJS = forwardRef(({
  initialValue = '',
  onChange,
  snippets = [],
  placeholder = 'Start typing...',
  className = '',
  variablePrefix = '[[',  // Configurable prefix
  variableSuffix = ']]'   // Configurable suffix
}, ref) => {
  const [content, setContent] = useState(initialValue);
  const [showSnippets, setShowSnippets] = useState(false);
  const [snippetSearch, setSnippetSearch] = useState('');
  const [currentRange, setCurrentRange] = useState(null);
  const editorRef = useRef(null);
  const isUpdatingRef = useRef(false);

  // Expose methods through ref
  useImperativeHandle(ref, () => ({
    populateVariables: populateVariables,
    getContent: () => editorRef.current ? editorRef.current.innerHTML : '',
    setContent: (newContent) => {
      if (editorRef.current) {
        isUpdatingRef.current = true;
        editorRef.current.innerHTML = newContent;
        setContent(newContent);
        if (onChange) {
          onChange(newContent);
        }
        isUpdatingRef.current = false;
      }
    },
    getAllVariables: getAllVariables,
    generatePopulatedContent: generatePopulatedContent
  }));

  // Create regex for finding variables based on configurable delimiters
  const createVariableRegex = () => {
    const escapedPrefix = variablePrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedSuffix = variableSuffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`${escapedPrefix}([a-zA-Z_][a-zA-Z0-9_]*)${escapedSuffix}`, 'g');
  };

  // Get all unique variables from the content
  const getAllVariables = () => {
    if (!editorRef.current) return [];

    const variableSpans = editorRef.current.querySelectorAll('.gravy-variable');
    const variables = new Set();

    variableSpans.forEach(span => {
      const variableName = span.getAttribute('data-variable');
      if (variableName) {
        variables.add(variableName);
      }
    });

    return Array.from(variables);
  };

  // Generate populated content without modifying the original
  const generatePopulatedContent = (variableValues) => {
    if (!editorRef.current) return '';

    // Clone the current content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = editorRef.current.innerHTML;

    // Find all variable spans in the clone
    const variableSpans = tempDiv.querySelectorAll('.gravy-variable');

    variableSpans.forEach(span => {
      const variableName = span.getAttribute('data-variable');
      if (variableName && variableValues[variableName] !== undefined) {
        // Create a text node with the replacement value
        const textNode = document.createTextNode(variableValues[variableName]);
        span.parentNode.replaceChild(textNode, span);
      }
    });

    return tempDiv.innerHTML;
  };

  // Populate variables by prompting user for values
  const populateVariables = async () => {
    const variables = getAllVariables();

    if (variables.length === 0) {
      alert(`No variables found in the template. Insert variables using the ${variablePrefix}${variableSuffix} button first.`);
      return null;
    }

    const variableValues = {};
    let allValuesProvided = true;

    // Prompt for each variable value
    for (const variable of variables) {
      const value = prompt(`Enter value for ${variablePrefix}${variable}${variableSuffix}:`);
      if (value === null) {
        // User cancelled
        return null;
      }
      if (value === '') {
        allValuesProvided = false;
      }
      variableValues[variable] = value;
    }

    if (!allValuesProvided) {
      const proceed = confirm('Some variables were left empty. Continue anyway?');
      if (!proceed) return null;
    }

    // Generate the populated content
    const populatedContent = generatePopulatedContent(variableValues);

    // Return both the HTML and the variable values used
    return {
      html: populatedContent,
      variables: variableValues,
      plainText: extractPlainText(populatedContent)
    };
  };

  // Extract plain text from HTML
  const extractPlainText = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  // Save current selection/range
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      setCurrentRange(selection.getRangeAt(0).cloneRange());
    }
  };

  // Restore saved selection/range
  const restoreSelection = () => {
    if (currentRange) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      try {
        selection.addRange(currentRange);
      } catch (error) {
        // If the range is invalid, just position cursor at end
        const newRange = document.createRange();
        newRange.selectNodeContents(editorRef.current);
        newRange.collapse(false);
        selection.addRange(newRange);
      }
    }
  };

  // Apply formatting to selected text
  const applyFormat = (tag, attributes = {}) => {
    saveSelection();
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });

    try {
      range.surroundContents(element);
    } catch (e) {
      element.appendChild(range.extractContents());
      range.insertNode(element);
    }

    selection.removeAllRanges();
    updateContent();
    restoreSelection();
  };

  // Text formatting functions
  const toggleBold = () => {
    applyFormat('strong');
  };

  const toggleItalic = () => {
    applyFormat('em');
  };

  const toggleUnderline = () => {
    applyFormat('u');
  };

  // List insertion
  const insertList = (ordered = false) => {
    saveSelection();
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const listElement = document.createElement(ordered ? 'ol' : 'ul');
    const listItem = document.createElement('li');

    if (range.collapsed) {
      listItem.appendChild(document.createTextNode('\u00A0'));
    } else {
      listItem.appendChild(range.extractContents());
    }

    listElement.appendChild(listItem);
    range.insertNode(listElement);

    // Position cursor in the list item
    const newRange = document.createRange();
    newRange.setStart(listItem, listItem.childNodes.length);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);

    updateContent();
  };

  const insertBulletList = () => insertList(false);
  const insertNumberedList = () => insertList(true);

  // Link creation
  const createLink = () => {
    saveSelection();
    const selection = window.getSelection();
    if (selection.rangeCount === 0 || selection.toString() === '') {
      alert('Please select some text first');
      return;
    }

    const url = prompt('Enter URL:');
    if (url) {
      restoreSelection();
      applyFormat('a', { href: url });
    }
  };

  // Variable insertion
  const insertVariable = () => {
    saveSelection();
    const variableName = prompt('Enter variable name:');
    if (!variableName) return;

    const selection = window.getSelection();
    if (currentRange) {
      selection.removeAllRanges();
      selection.addRange(currentRange);
    }

    const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    if (range) {
      const variableElement = document.createElement('span');
      variableElement.className = 'gravy-variable';
      variableElement.setAttribute('data-variable', variableName);
      variableElement.textContent = `${variablePrefix}${variableName}${variableSuffix}`;

      range.deleteContents();
      range.insertNode(variableElement);

      // Move cursor after the variable
      const newRange = document.createRange();
      newRange.setStartAfter(variableElement);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);

      updateContent();
    }
  };

  // Snippet insertion
  const insertSnippet = (snippet) => {
    saveSelection();
    const selection = window.getSelection();

    if (currentRange) {
      selection.removeAllRanges();
      selection.addRange(currentRange);
    }

    const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    if (range) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = snippet.content;

      const fragment = document.createDocumentFragment();
      while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
      }

      range.deleteContents();
      range.insertNode(fragment);

      // Move cursor to end of inserted content
      const newRange = document.createRange();
      newRange.selectNodeContents(fragment);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }

    setShowSnippets(false);
    setSnippetSearch('');
    updateContent();
  };

  // Update content state (called less frequently to avoid cursor issues)
  const updateContent = () => {
    if (editorRef.current && !isUpdatingRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      if (onChange) {
        onChange(newContent);
      }
    }
  };

  // Handle input events - we'll debounce this to avoid cursor jumping
  let inputTimeout;
  const handleInput = () => {
    // Clear any pending timeouts
    clearTimeout(inputTimeout);

    // Debounce the input to avoid excessive state updates
    inputTimeout = setTimeout(() => {
      updateContent();
    }, 100);
  };

  // Handle key events
  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          toggleBold();
          break;
        case 'i':
          e.preventDefault();
          toggleItalic();
          break;
        case 'u':
          e.preventDefault();
          toggleUnderline();
          break;
        default:
          break;
      }
    }
  };

  // Handle mouse up for selection
  const handleMouseUp = () => {
    saveSelection();
  };

  // Filter snippets
  const filteredSnippets = snippets.filter(snippet =>
    snippet.title.toLowerCase().includes(snippetSearch.toLowerCase()) ||
    snippet.content.toLowerCase().includes(snippetSearch.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const snippetDropdown = event.target.closest('.gravy-snippets-dropdown');
      const snippetButton = event.target.closest('.toolbar-btn[title="Insert Snippet"]');

      if (!snippetDropdown && !snippetButton) {
        setShowSnippets(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Set initial content only once
  useEffect(() => {
    if (editorRef.current && initialValue && !content) {
      isUpdatingRef.current = true;
      editorRef.current.innerHTML = initialValue;
      setContent(initialValue);
      isUpdatingRef.current = false;
    }
  }, [initialValue, content]);

  return (
    <div className={`gravy-editor ${className}`}>
      <div className="gravy-toolbar">
        <button onClick={toggleBold} className="toolbar-btn" title="Bold (Ctrl+B)">
          <strong>B</strong>
        </button>
        <button onClick={toggleItalic} className="toolbar-btn" title="Italic (Ctrl+I)">
          <em>I</em>
        </button>
        <button onClick={toggleUnderline} className="toolbar-btn" title="Underline (Ctrl+U)">
          <u>U</u>
        </button>
        <div className="toolbar-divider"></div>
        <button onClick={insertBulletList} className="toolbar-btn" title="Bullet List">
          •
        </button>
        <button onClick={insertNumberedList} className="toolbar-btn" title="Numbered List">
          1.
        </button>
        <div className="toolbar-divider"></div>
        <button onClick={createLink} className="toolbar-btn" title="Insert Link">
          🔗
        </button>
        <button onClick={insertVariable} className="toolbar-btn" title="Insert Variable">
          {variablePrefix}{variableSuffix}
        </button>
        <button
          onClick={() => setShowSnippets(!showSnippets)}
          className="toolbar-btn"
          title="Insert Snippet"
        >
          📝
        </button>
      </div>

      <div
        ref={editorRef}
        className="gravy-content"
        contentEditable
        suppressContentEditableWarning={true}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onMouseUp={handleMouseUp}
        data-placeholder={placeholder}
        role="textbox"
      />

      {showSnippets && (
        <div className="gravy-snippets-dropdown">
          <input
            type="text"
            placeholder="Search snippets..."
            value={snippetSearch}
            onChange={(e) => setSnippetSearch(e.target.value)}
            className="snippet-search"
            autoFocus
          />
          <div className="snippet-list">
            {filteredSnippets.length > 0 ? (
              filteredSnippets.map((snippet, index) => (
                <div
                  key={index}
                  className="snippet-item"
                  onClick={() => insertSnippet(snippet)}
                >
                  <div className="snippet-title">{snippet.title}</div>
                  <div className="snippet-preview">
                    {snippet.content.replace(/<[^>]*>/g, '').substring(0, 50)}...
                  </div>
                </div>
              ))
            ) : (
              <div className="snippet-item snippet-empty">
                No snippets found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

GravyJS.displayName = 'GravyJS';

export default GravyJS;