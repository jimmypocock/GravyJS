import React, { useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import Toolbar from './components/Toolbar.jsx';
import Editor from './components/Editor.jsx';
import SnippetDropdown from './components/SnippetDropdown.jsx';
import { useSelection } from './hooks/useSelection.js';
import { useFormatting } from './hooks/useFormatting.js';
import { useVariables } from './hooks/useVariables.js';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts.js';
import { useClipboard } from './hooks/useClipboard.js';
import { useEditorContent } from './hooks/useEditorContent.js';
import './GravyJS.css';

const GravyJS = forwardRef(({
  initialValue = '',
  onChange,
  snippets = [],
  placeholder = 'Start typing...',
  className = '',
  variablePrefix = '[[',
  variableSuffix = ']]',
  onVariablePrompt
}, ref) => {
  const [showSnippets, setShowSnippets] = useState(false);

  // Custom hooks
  const { content, editorRef, updateContent, setEditorContent, getContent } = useEditorContent(initialValue, onChange);
  const { currentRange, saveSelection, restoreSelection, handleMouseUp } = useSelection(editorRef);
  const { populateVariables, insertVariable, getAllVariables, generatePopulatedContent } = useVariables(
    editorRef,
    variablePrefix,
    variableSuffix,
    onVariablePrompt
  );
  const {
    toggleBold,
    toggleItalic,
    toggleUnderline,
    insertBulletList,
    insertNumberedList,
    createLink
  } = useFormatting(editorRef, updateContent, saveSelection, restoreSelection);
  const { copyToClipboard } = useClipboard();

  // Focus the first button in the toolbar (used for F10 accessibility)
  const handleToolbarFocus = useCallback(() => {
    const firstToolbarButton = document.querySelector('.gravy-toolbar .toolbar-btn');
    if (firstToolbarButton) {
      firstToolbarButton.focus();
    }
  }, []);

  const { handleKeyDown, handleToolbarKeyDown } = useKeyboardShortcuts(editorRef, {
    toggleBold,
    toggleItalic,
    toggleUnderline,
    onToolbarFocus: handleToolbarFocus
  });

  // Insert a snippet's content at the current cursor position
  const insertSnippet = useCallback((snippet) => {
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
      updateContent();
    } catch (error) {
      console.error('Error inserting snippet:', error);
    }
  }, [saveSelection, currentRange, updateContent]);

  // Handle the variable insertion button click
  const handleInsertVariable = useCallback(() => {
    insertVariable(currentRange, saveSelection, restoreSelection, updateContent);
  }, [insertVariable, currentRange, saveSelection, restoreSelection, updateContent]);

  // Toggle the snippet dropdown visibility
  const handleToggleSnippets = useCallback(() => {
    setShowSnippets(!showSnippets);
  }, [showSnippets]);

  // Close the snippet dropdown
  const handleCloseSnippets = useCallback(() => {
    setShowSnippets(false);
  }, []);

  // Handle input events from the editor and update content
  const handleEditorInput = useCallback(() => {
    updateContent();
  }, [updateContent]);

  // Expose methods through ref
  useImperativeHandle(ref, () => ({
    populateVariables,
    getContent,
    setContent: setEditorContent,
    getAllVariables,
    generatePopulatedContent,
    copyToClipboard
  }), [populateVariables, getContent, setEditorContent, getAllVariables, generatePopulatedContent, copyToClipboard]);

  return (
    <div className={`gravy-editor ${className}`}>
      <Toolbar
        onBold={toggleBold}
        onItalic={toggleItalic}
        onUnderline={toggleUnderline}
        onBulletList={insertBulletList}
        onNumberedList={insertNumberedList}
        onCreateLink={createLink}
        onInsertVariable={handleInsertVariable}
        onToggleSnippets={handleToggleSnippets}
        showSnippets={showSnippets}
        variablePrefix={variablePrefix}
        variableSuffix={variableSuffix}
        onKeyDown={handleToolbarKeyDown}
      />

      <Editor
        ref={editorRef}
        placeholder={placeholder}
        onInput={handleEditorInput}
        onKeyDown={handleKeyDown}
        onMouseUp={handleMouseUp}
        aria-label={placeholder}
      />

      <SnippetDropdown
        snippets={snippets}
        onInsertSnippet={insertSnippet}
        onClose={handleCloseSnippets}
        isVisible={showSnippets}
      />
    </div>
  );
});

GravyJS.displayName = 'GravyJS';

export default GravyJS;