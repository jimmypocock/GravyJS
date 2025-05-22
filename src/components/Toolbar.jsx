import React from 'react';

const Toolbar = ({
  onBold,
  onItalic,
  onUnderline,
  onBulletList,
  onNumberedList,
  onCreateLink,
  onInsertVariable,
  onToggleSnippets,
  showSnippets,
  variablePrefix,
  variableSuffix,
  onKeyDown
}) => {
  return (
    <div
      className="gravy-toolbar"
      role="toolbar"
      aria-label="Text formatting tools"
      onKeyDown={onKeyDown}
    >
      <button
        onClick={onBold}
        className="toolbar-btn"
        title="Bold (Ctrl+B)"
        aria-label="Toggle bold formatting"
        type="button"
      >
        <strong>B</strong>
      </button>
      <button
        onClick={onItalic}
        className="toolbar-btn"
        title="Italic (Ctrl+I)"
        aria-label="Toggle italic formatting"
        type="button"
      >
        <em>I</em>
      </button>
      <button
        onClick={onUnderline}
        className="toolbar-btn"
        title="Underline (Ctrl+U)"
        aria-label="Toggle underline formatting"
        type="button"
      >
        <u>U</u>
      </button>
      <div className="toolbar-divider" aria-hidden="true"></div>
      <button
        onClick={onBulletList}
        className="toolbar-btn"
        title="Bullet List"
        aria-label="Insert bullet list"
        type="button"
      >
        •
      </button>
      <button
        onClick={onNumberedList}
        className="toolbar-btn"
        title="Numbered List"
        aria-label="Insert numbered list"
        type="button"
      >
        1.
      </button>
      <div className="toolbar-divider" aria-hidden="true"></div>
      <button
        onClick={onCreateLink}
        className="toolbar-btn"
        title="Insert Link"
        aria-label="Insert hyperlink"
        type="button"
      >
        🔗
      </button>
      <button
        onClick={onInsertVariable}
        className="toolbar-btn"
        title="Insert Variable"
        aria-label={`Insert variable placeholder using ${variablePrefix}${variableSuffix} format`}
        type="button"
      >
        {variablePrefix}{variableSuffix}
      </button>
      <button
        onClick={onToggleSnippets}
        className="toolbar-btn"
        title="Insert Snippet"
        aria-label="Insert text snippet"
        aria-expanded={showSnippets}
        type="button"
      >
        📝
      </button>
    </div>
  );
};

export default Toolbar;