import React, { useState, useEffect } from "react";

const SnippetDropdown = ({ snippets, onInsertSnippet, onClose, isVisible }) => {
  const [snippetSearch, setSnippetSearch] = useState("");

  // Filter snippets with error handling
  const filteredSnippets = snippets.filter((snippet) => {
    try {
      return (
        snippet.title.toLowerCase().includes(snippetSearch.toLowerCase()) ||
        snippet.content.toLowerCase().includes(snippetSearch.toLowerCase())
      );
    } catch (error) {
      console.error("Error filtering snippets:", error);
      return false;
    }
  });

  // Handle snippet insertion
  const handleSnippetClick = (snippet) => {
    onInsertSnippet(snippet);
    setSnippetSearch("");
  };

  // Handle keyboard navigation for snippets
  const handleSnippetKeyDown = (e, snippet) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSnippetClick(snippet);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      try {
        const snippetDropdown = event.target.closest(
          ".gravy-snippets-dropdown",
        );
        const snippetButton = event.target.closest(
          '.toolbar-btn[title="Insert Snippet"]',
        );

        if (!snippetDropdown && !snippetButton) {
          onClose();
        }
      } catch (error) {
        console.error("Error handling click outside:", error);
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isVisible, onClose]);

  // Reset search when dropdown closes
  useEffect(() => {
    if (!isVisible) {
      setSnippetSearch("");
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="gravy-snippets-dropdown"
      role="listbox"
      aria-label="Available snippets"
    >
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
              onClick={() => handleSnippetClick(snippet)}
              role="option"
              tabIndex={0}
              onKeyDown={(e) => handleSnippetKeyDown(e, snippet)}
              aria-label={`Insert snippet: ${snippet.title}`}
            >
              <div className="snippet-title">{snippet.title}</div>
              <div className="snippet-preview">
                {snippet.content.replace(/<[^>]*>/g, "").substring(0, 50)}...
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
  );
};

export default SnippetDropdown;
