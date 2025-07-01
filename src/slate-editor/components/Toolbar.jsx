import React from "react";
import { useSlate } from "slate-react";
import { isFormatActive, toggleFormat, isBlockActive, toggleBlock } from "../utils/formatting";
import { SnippetDropdown } from "./SnippetDropdown.jsx";

export const Toolbar = ({ 
  onInsertVariable, 
  snippets, 
  showSnippets, 
  onToggleSnippets,
  onInsertSnippet,
  variablePrefix,
  variableSuffix, 
}) => {
  const editor = useSlate();

  const FormatButton = ({ format, icon, title }) => {
    const isActive = isFormatActive(editor, format);
    return (
      <button
        type="button"
        className={`toolbar-btn ${isActive ? "active" : ""}`}
        title={title}
        aria-label={`Toggle ${format} formatting`}
        aria-pressed={isActive}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleFormat(editor, format);
        }}
      >
        {icon}
      </button>
    );
  };

  const BlockButton = ({ format, icon, title }) => {
    const isActive = isBlockActive(editor, format);
    return (
      <button
        type="button"
        className={`toolbar-btn ${isActive ? "active" : ""}`}
        title={title}
        aria-label={`Insert ${format}`}
        aria-pressed={isActive}
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlock(editor, format);
        }}
      >
        {icon}
      </button>
    );
  };

  const createLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      toggleFormat(editor, "link", { url });
    }
  };

  return (
    <>
      <div className="gravy-toolbar" role="toolbar" aria-label="Text formatting tools">
        <FormatButton format="bold" icon={<strong>B</strong>} title="Bold (Ctrl+B)" />
        <FormatButton format="italic" icon={<em>I</em>} title="Italic (Ctrl+I)" />
        <FormatButton format="underline" icon={<u>U</u>} title="Underline (Ctrl+U)" />
        
        <div className="toolbar-divider" aria-hidden="true" />
        
        <BlockButton format="bulleted-list" icon="•" title="Bullet List" />
        <BlockButton format="numbered-list" icon="1." title="Numbered List" />
        
        <div className="toolbar-divider" aria-hidden="true" />
        
        <button
          type="button"
          className={`toolbar-btn ${isFormatActive(editor, "link") ? "active" : ""}`}
          title="Insert Link"
          aria-label="Insert hyperlink"
          aria-pressed={isFormatActive(editor, "link")}
          onMouseDown={(e) => {
            e.preventDefault();
            createLink();
          }}
        >
          🔗
        </button>
        
        <button
          type="button"
          className="toolbar-btn"
          title="Insert Variable"
          aria-label={`Insert variable placeholder using ${variablePrefix}${variableSuffix} format`}
          onMouseDown={(e) => {
            e.preventDefault();
            onInsertVariable();
          }}
        >
          {variablePrefix}{variableSuffix}
        </button>
        
        <button
          type="button"
          className="toolbar-btn"
          title="Insert Snippet"
          aria-label="Insert text snippet"
          aria-expanded={showSnippets}
          onMouseDown={(e) => {
            e.preventDefault();
            onToggleSnippets();
          }}
        >
          📝
        </button>
      </div>
      
      {showSnippets && (
        <SnippetDropdown
          snippets={snippets}
          onInsertSnippet={onInsertSnippet}
          onClose={onToggleSnippets}
          isVisible={showSnippets}
        />
      )}
    </>
  );
};