import { useCallback } from "react";

export const useFormatting = (
  editorRef,
  updateContent,
  _saveSelection,
  _restoreSelection,
) => {
  // Check if the current selection is already wrapped with a specific tag
  const isFormatted = useCallback((tag) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;

    const range = selection.getRangeAt(0);
    let node = range.commonAncestorContainer;
    
    // Check if we're inside the tag
    while (node && node !== editorRef.current) {
      if (node.nodeType === Node.ELEMENT_NODE && 
          node.tagName && 
          node.tagName.toLowerCase() === tag.toLowerCase()) {
        return true;
      }
      node = node.parentNode;
    }
    
    return false;
  }, [editorRef]);

  // Remove formatting from selected text
  const removeFormat = useCallback((tag) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    let node = range.commonAncestorContainer;
    
    // Find the formatting element
    while (node && node !== editorRef.current) {
      if (node.nodeType === Node.ELEMENT_NODE && 
          node.tagName && 
          node.tagName.toLowerCase() === tag.toLowerCase()) {
        // Replace the element with its contents
        const parent = node.parentNode;
        while (node.firstChild) {
          parent.insertBefore(node.firstChild, node);
        }
        parent.removeChild(node);
        break;
      }
      node = node.parentNode;
    }
  }, [editorRef]);

  // Toggle formatting (bold, italic, etc.) on the currently selected text
  const toggleFormat = useCallback(
    (tag, attributes = {}) => {
      try {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        
        // Check if already formatted
        if (isFormatted(tag)) {
          removeFormat(tag);
          updateContent();
          return;
        }

        // If no selection, don't do anything
        if (range.collapsed) {
          // Could implement "type-through" formatting here if desired
          return;
        }

        // Apply new formatting
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
          element.setAttribute(key, value);
        });

        try {
          // Try to wrap the selected content
          range.surroundContents(element);
        } catch (e) {
          // If that fails (e.g., selection spans multiple elements), 
          // extract and wrap the contents
          const contents = range.extractContents();
          element.appendChild(contents);
          range.insertNode(element);
          
          // Reselect the formatted text
          const newRange = document.createRange();
          newRange.selectNodeContents(element);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }

        updateContent();
      } catch (error) {
        console.error("Error toggling format:", error);
      }
    },
    [isFormatted, removeFormat, updateContent],
  );

  // Toggle bold formatting on selected text
  const toggleBold = useCallback(() => toggleFormat("strong"), [toggleFormat]);

  // Toggle italic formatting on selected text
  const toggleItalic = useCallback(() => toggleFormat("em"), [toggleFormat]);

  // Toggle underline formatting on selected text
  const toggleUnderline = useCallback(() => toggleFormat("u"), [toggleFormat]);

  // Insert a list (ordered or unordered) at the current cursor position
  const insertList = useCallback(
    (ordered = false) => {
      try {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        
        // Check if we're already in a list
        let node = range.commonAncestorContainer;
        let existingList = null;
        while (node && node !== editorRef.current) {
          if (node.nodeType === Node.ELEMENT_NODE && 
              (node.tagName === "UL" || node.tagName === "OL")) {
            existingList = node;
            break;
          }
          node = node.parentNode;
        }

        if (existingList) {
          // Add a new list item to existing list
          const newItem = document.createElement("li");
          newItem.innerHTML = "<br>";
          existingList.appendChild(newItem);
          
          // Position cursor in new item
          const newRange = document.createRange();
          newRange.setStart(newItem, 0);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        } else {
          // Create new list
          const listElement = document.createElement(ordered ? "ol" : "ul");
          const listItem = document.createElement("li");

          if (range.collapsed) {
            listItem.innerHTML = "<br>";
          } else {
            listItem.appendChild(range.extractContents());
          }

          listElement.appendChild(listItem);
          range.insertNode(listElement);

          // Position cursor in the list item
          const newRange = document.createRange();
          if (listItem.firstChild) {
            newRange.setStart(listItem.firstChild, 0);
          } else {
            newRange.setStart(listItem, 0);
          }
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }

        updateContent();
      } catch (error) {
        console.error("Error inserting list:", error);
      }
    },
    [editorRef, updateContent],
  );

  // Insert an unordered (bullet) list
  const insertBulletList = useCallback(() => insertList(false), [insertList]);

  // Insert an ordered (numbered) list
  const insertNumberedList = useCallback(() => insertList(true), [insertList]);

  // Validate if a string is a valid URL
  const isValidUrl = useCallback((string) => {
    if (!string) return false;
    
    // Check if it already has a protocol
    if (/^https?:\/\//i.test(string)) {
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
    }
    
    // Try adding https:// if no protocol
    try {
      new URL("https://" + string);
      return true;
    } catch (_) {
      return false;
    }
  }, []);

  // Create a hyperlink from the currently selected text
  const createLink = useCallback(() => {
    try {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        alert("Please select some text first");
        return;
      }

      const range = selection.getRangeAt(0);
      if (range.collapsed) {
        alert("Please select some text to create a link");
        return;
      }

      const selectedText = selection.toString();
      if (!selectedText.trim()) {
        alert("Please select some text first");
        return;
      }

      const url = prompt("Enter URL:");
      if (url === null) return; // User cancelled

      if (!url.trim()) {
        alert("Please enter a URL");
        return;
      }

      let finalUrl = url.trim();
      
      // Add protocol if missing
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = "https://" + finalUrl;
      }

      if (isValidUrl(finalUrl)) {
        toggleFormat("a", { href: finalUrl, target: "_blank", rel: "noopener noreferrer" });
      } else {
        alert("Please enter a valid URL (e.g., example.com or https://example.com)");
      }
    } catch (error) {
      console.error("Error creating link:", error);
    }
  }, [toggleFormat, isValidUrl]);

  return {
    toggleBold,
    toggleItalic,
    toggleUnderline,
    insertBulletList,
    insertNumberedList,
    createLink,
    toggleFormat,
  };
};