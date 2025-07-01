import React, { useState, useEffect, useRef } from "react";

export const SnippetDropdown = ({ snippets, onInsertSnippet, onClose, isVisible }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (isVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isVisible]);

  const filteredSnippets = snippets.filter(snippet =>
    snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    snippet.content.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSnippets.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case "Enter":
        e.preventDefault();
        if (filteredSnippets[selectedIndex]) {
          onInsertSnippet(filteredSnippets[selectedIndex]);
        }
        break;
      case "Escape":
        onClose();
        break;
    }
  };

  useEffect(() => {
    // Scroll selected item into view
    if (listRef.current && listRef.current.children[selectedIndex]) {
      listRef.current.children[selectedIndex].scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  if (!isVisible) return null;

  return (
    <div className="gravy-snippets-dropdown">
      <input
        ref={searchInputRef}
        type="text"
        className="snippet-search"
        placeholder="Search snippets..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setSelectedIndex(0);
        }}
        onKeyDown={handleKeyDown}
      />
      <div ref={listRef} className="snippet-list">
        {filteredSnippets.length > 0 ? (
          filteredSnippets.map((snippet, index) => (
            <div
              key={index}
              className={`snippet-item ${index === selectedIndex ? "selected" : ""}`}
              onClick={() => onInsertSnippet(snippet)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="snippet-title">{snippet.title}</div>
              <div className="snippet-preview">
                {snippet.content.replace(/<[^>]+>/g, "").substring(0, 50)}...
              </div>
            </div>
          ))
        ) : (
          <div className="snippet-item">No snippets found</div>
        )}
      </div>
    </div>
  );
};