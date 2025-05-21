import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import './GravyJS.css';

const GravyJS = forwardRef(({
  initialValue = '',
  onChange,
  snippets = [],
  placeholder = 'Start typing...',
  className = '',
  variablePrefix = '[[',
  variableSuffix = ']]'
}, ref) => {
  const [content, setContent] = useState(initialValue);
  const [showSnippets, setShowSnippets] = useState(false);
  const [snippetSearch, setSnippetSearch] = useState('');
  const [currentRange, setCurrentRange] = useState(null);
  const editorRef = useRef(null);
  const isUpdatingRef = useRef(false);

  // Utility function to escape HTML (XSS Protection)
  const escapeHtml = (text) => {
    try {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    } catch (error) {
      console.error('Error escaping HTML:', error);
      return String(text).replace(/[&<>"']/g, (char) => {
        const entities = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        };
        return entities[char];
      });
    }
  };

  // Extract plain text from HTML
  const extractPlainText = (html) => {
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      return tempDiv.textContent || tempDiv.innerText || '';
    } catch (error) {
      console.error('Error extracting plain text:', error);
      return '';
    }
  };

  // Text-based variable detection (bulletproof)
  const getAllVariables = () => {
    if (!editorRef.current) return [];

    try {
      // Get both HTML and plain text content for comprehensive detection
      const htmlContent = editorRef.current.innerHTML || '';
      const textContent = editorRef.current.textContent || '';

      // Escape delimiters for regex
      const escapedPrefix = variablePrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const escapedSuffix = variableSuffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`${escapedPrefix}([a-zA-Z_][a-zA-Z0-9_]*)${escapedSuffix}`, 'g');

      const variables = new Set();

      // Check both HTML and text content
      [htmlContent, textContent].forEach(content => {
        let match;
        while ((match = regex.exec(content)) !== null) {
          variables.add(match[1]);
        }
      });

      return Array.from(variables);
    } catch (error) {
      console.error('Error extracting variables:', error);
      return [];
    }
  };

  // Generate populated content using text replacement (bulletproof)
  const generatePopulatedContent = (variableValues) => {
    if (!editorRef.current) return '';

    try {
      let content = editorRef.current.innerHTML;

      // Replace each variable with its value
      for (const [variable, value] of Object.entries(variableValues)) {
        const escapedPrefix = variablePrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const escapedSuffix = variableSuffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`${escapedPrefix}${variable}${escapedSuffix}`, 'g');

        // Escape HTML to prevent XSS
        const escapedValue = escapeHtml(value);
        content = content.replace(regex, escapedValue);
      }

      return content;
    } catch (error) {
      console.error('Error generating populated content:', error);
      return '';
    }
  };

  // Populate variables by prompting user for values
  const populateVariables = async () => {
    try {
      const variables = getAllVariables();

      if (variables.length === 0) {
        alert(`No variables found in the template. Insert variables using the format ${variablePrefix}variable_name${variableSuffix}`);
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

      return {
        html: populatedContent,
        variables: variableValues,
        plainText: extractPlainText(populatedContent)
      };
    } catch (error) {
      console.error('Error populating variables:', error);
      alert('An error occurred while populating variables. Please try again.');
      return null;
    }
  };

  // Copy content to clipboard with formatting (Modern Clipboard API)
  const copyToClipboard = async (content) => {
    try {
      if (!content) {
        throw new Error('No content to copy');
      }

      // Try modern Clipboard API with both HTML and plain text
      if (navigator.clipboard && navigator.clipboard.write) {
        const clipboardItem = new ClipboardItem({
          'text/html': new Blob([content.html], { type: 'text/html' }),
          'text/plain': new Blob([content.plainText], { type: 'text/plain' })
        });
        await navigator.clipboard.write([clipboardItem]);
        return true;
      }

      // Fallback to plain text only
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(content.plainText);
        return true;
      }

      // Final fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = content.plainText;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  };

  // Save current selection/range
  const saveSelection = () => {
    try {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        setCurrentRange(selection.getRangeAt(0).cloneRange());
      }
    } catch (error) {
      console.error('Error saving selection:', error);
    }
  };

  // Restore saved selection/range
  const restoreSelection = () => {
    try {
      if (currentRange && editorRef.current) {
        const selection = window.getSelection();
        selection.removeAllRanges();

        try {
          selection.addRange(currentRange);
        } catch (error) {
          // If the range is invalid, position cursor at end
          const newRange = document.createRange();
          newRange.selectNodeContents(editorRef.current);
          newRange.collapse(false);
          selection.addRange(newRange);
        }
      }
    } catch (error) {
      console.error('Error restoring selection:', error);
    }
  };

  // Apply formatting to selected text
  const applyFormat = (tag, attributes = {}) => {
    try {
      saveSelection();
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      if (range.collapsed) return;

      const element = document.createElement(tag);
      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });

      try {
        range.surroundContents(element);
      } catch (e) {
        // Fallback if range spans multiple elements
        element.appendChild(range.extractContents());
        range.insertNode(element);
      }

      selection.removeAllRanges();
      updateContent();
      restoreSelection();
    } catch (error) {
      console.error('Error applying format:', error);
    }
  };

  // Text formatting functions
  const toggleBold = () => applyFormat('strong');
  const toggleItalic = () => applyFormat('em');
  const toggleUnderline = () => applyFormat('u');

  // List insertion
  const insertList = (ordered = false) => {
    try {
      saveSelection();
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

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
    } catch (error) {
      console.error('Error inserting list:', error);
    }
  };

  const insertBulletList = () => insertList(false);
  const insertNumberedList = () => insertList(true);

  // Link creation
  const createLink = () => {
    try {
      saveSelection();
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.toString() === '') {
        alert('Please select some text first');
        return;
      }

      const url = prompt('Enter URL:');
      if (url && isValidUrl(url)) {
        restoreSelection();
        applyFormat('a', { href: url });
      } else if (url) {
        alert('Please enter a valid URL (e.g., https://example.com)');
      }
    } catch (error) {
      console.error('Error creating link:', error);
    }
  };

  // URL validation
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      // Try adding protocol if missing
      try {
        new URL('https://' + string);
        return true;
      } catch (_) {
        return false;
      }
    }
  };

  // Variable insertion (text-based, no DOM elements)
  const insertVariable = () => {
    try {
      saveSelection();
      const variableName = prompt('Enter variable name:');
      if (!variableName || !variableName.trim()) return;

      // Input validation - only allow valid variable names
      const trimmedName = variableName.trim();
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmedName)) {
        alert('Variable names must start with a letter or underscore and contain only letters, numbers, and underscores.');
        return;
      }

      const selection = window.getSelection();
      if (currentRange) {
        selection.removeAllRanges();
        selection.addRange(currentRange);
      }

      const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

      if (range) {
        // Insert as plain text (bulletproof approach)
        const variableText = `${variablePrefix}${trimmedName}${variableSuffix}`;
        const textNode = document.createTextNode(variableText);

        range.deleteContents();
        range.insertNode(textNode);

        // Move cursor after the variable
        const newRange = document.createRange();
        newRange.setStartAfter(textNode);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);

        updateContent();
      }
    } catch (error) {
      console.error('Error inserting variable:', error);
      alert('An error occurred while inserting the variable.');
    }
  };

  // Snippet insertion
  const insertSnippet = (snippet) => {
    try {
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
        newRange.setStartAfter(fragment);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }

      setShowSnippets(false);
      setSnippetSearch('');
      updateContent();
    } catch (error) {
      console.error('Error inserting snippet:', error);
    }
  };

  // Update content state with debouncing
  const updateContent = () => {
    if (editorRef.current && !isUpdatingRef.current) {
      try {
        const newContent = editorRef.current.innerHTML;
        setContent(newContent);
        if (onChange) {
          onChange(newContent);
        }
      } catch (error) {
        console.error('Error updating content:', error);
      }
    }
  };

  // Debounced input handler
  let inputTimeout;
  const handleInput = () => {
    clearTimeout(inputTimeout);
    inputTimeout = setTimeout(() => {
      updateContent();
    }, 100);
  };

  // Handle key events with accessibility
  const handleKeyDown = (e) => {
    try {
      // Keyboard shortcuts
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

      // Accessibility: Handle toolbar navigation with keyboard
      if (e.key === 'F10' && e.target === editorRef.current) {
        e.preventDefault();
        const firstToolbarButton = document.querySelector('.gravy-toolbar .toolbar-btn');
        if (firstToolbarButton) {
          firstToolbarButton.focus();
        }
      }
    } catch (error) {
      console.error('Error handling key down:', error);
    }
  };

  // Handle mouse up for selection
  const handleMouseUp = () => {
    saveSelection();
  };

  // Filter snippets with error handling
  const filteredSnippets = snippets.filter(snippet => {
    try {
      return snippet.title.toLowerCase().includes(snippetSearch.toLowerCase()) ||
        snippet.content.toLowerCase().includes(snippetSearch.toLowerCase());
    } catch (error) {
      console.error('Error filtering snippets:', error);
      return false;
    }
  });

  // Expose methods through ref
  useImperativeHandle(ref, () => ({
    populateVariables,
    getContent: () => editorRef.current ? editorRef.current.innerHTML : '',
    setContent: (newContent) => {
      try {
        if (editorRef.current) {
          isUpdatingRef.current = true;
          editorRef.current.innerHTML = newContent || '';
          setContent(newContent || '');
          if (onChange) {
            onChange(newContent || '');
          }
          isUpdatingRef.current = false;
        }
      } catch (error) {
        console.error('Error setting content:', error);
      }
    },
    getAllVariables,
    generatePopulatedContent,
    copyToClipboard
  }));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      try {
        const snippetDropdown = event.target.closest('.gravy-snippets-dropdown');
        const snippetButton = event.target.closest('.toolbar-btn[title="Insert Snippet"]');

        if (!snippetDropdown && !snippetButton) {
          setShowSnippets(false);
        }
      } catch (error) {
        console.error('Error handling click outside:', error);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Set initial content with error handling
  useEffect(() => {
    try {
      if (editorRef.current && initialValue && !content) {
        isUpdatingRef.current = true;
        editorRef.current.innerHTML = initialValue;
        setContent(initialValue);
        isUpdatingRef.current = false;
      }
    } catch (error) {
      console.error('Error setting initial content:', error);
    }
  }, [initialValue, content]);

  // Keyboard navigation for toolbar
  const handleToolbarKeyDown = (e) => {
    try {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const buttons = Array.from(document.querySelectorAll('.gravy-toolbar .toolbar-btn'));
        const currentIndex = buttons.indexOf(e.target);

        if (currentIndex !== -1) {
          e.preventDefault();
          let nextIndex = currentIndex + (e.key === 'ArrowRight' ? 1 : -1);
          if (nextIndex >= buttons.length) nextIndex = 0;
          if (nextIndex < 0) nextIndex = buttons.length - 1;
          buttons[nextIndex].focus();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        editorRef.current?.focus();
      }
    } catch (error) {
      console.error('Error handling toolbar keyboard navigation:', error);
    }
  };

  return (
    <div className={`gravy-editor ${className}`}>
      <div
        className="gravy-toolbar"
        role="toolbar"
        aria-label="Text formatting tools"
        onKeyDown={handleToolbarKeyDown}
      >
        <button
          onClick={toggleBold}
          className="toolbar-btn"
          title="Bold (Ctrl+B)"
          aria-label="Toggle bold formatting"
          type="button"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={toggleItalic}
          className="toolbar-btn"
          title="Italic (Ctrl+I)"
          aria-label="Toggle italic formatting"
          type="button"
        >
          <em>I</em>
        </button>
        <button
          onClick={toggleUnderline}
          className="toolbar-btn"
          title="Underline (Ctrl+U)"
          aria-label="Toggle underline formatting"
          type="button"
        >
          <u>U</u>
        </button>
        <div className="toolbar-divider" aria-hidden="true"></div>
        <button
          onClick={insertBulletList}
          className="toolbar-btn"
          title="Bullet List"
          aria-label="Insert bullet list"
          type="button"
        >
          •
        </button>
        <button
          onClick={insertNumberedList}
          className="toolbar-btn"
          title="Numbered List"
          aria-label="Insert numbered list"
          type="button"
        >
          1.
        </button>
        <div className="toolbar-divider" aria-hidden="true"></div>
        <button
          onClick={createLink}
          className="toolbar-btn"
          title="Insert Link"
          aria-label="Insert hyperlink"
          type="button"
        >
          🔗
        </button>
        <button
          onClick={insertVariable}
          className="toolbar-btn"
          title="Insert Variable"
          aria-label={`Insert variable placeholder using ${variablePrefix}${variableSuffix} format`}
          type="button"
        >
          {variablePrefix}{variableSuffix}
        </button>
        <button
          onClick={() => setShowSnippets(!showSnippets)}
          className="toolbar-btn"
          title="Insert Snippet"
          aria-label="Insert text snippet"
          aria-expanded={showSnippets}
          type="button"
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
        aria-multiline="true"
        aria-label={placeholder}
        tabIndex={0}
      />

      {showSnippets && (
        <div className="gravy-snippets-dropdown" role="listbox" aria-label="Available snippets">
          <input
            type="text"
            placeholder="Search snippets..."
            value={snippetSearch}
            onChange={(e) => setSnippetSearch(e.target.value)}
            className="snippet-search"
            autoFocus
            aria-label="Search snippets"
          />
          <div className="snippet-list">
            {filteredSnippets.length > 0 ? (
              filteredSnippets.map((snippet, index) => (
                <div
                  key={index}
                  className="snippet-item"
                  onClick={() => insertSnippet(snippet)}
                  role="option"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      insertSnippet(snippet);
                    }
                  }}
                  aria-label={`Insert snippet: ${snippet.title}`}
                >
                  <div className="snippet-title">{snippet.title}</div>
                  <div className="snippet-preview">
                    {snippet.content.replace(/<[^>]*>/g, '').substring(0, 50)}...
                  </div>
                </div>
              ))
            ) : (
              <div className="snippet-item snippet-empty" role="option">
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