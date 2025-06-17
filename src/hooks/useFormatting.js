import { useCallback } from "react";

export const useFormatting = (
  editorRef,
  updateContent,
  saveSelection,
  restoreSelection,
) => {
  // Apply HTML formatting (bold, italic, etc.) to the currently selected text
  const applyFormat = useCallback(
    (tag, attributes = {}) => {
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
        console.error("Error applying format:", error);
      }
    },
    [saveSelection, restoreSelection, updateContent],
  );

  // Toggle bold formatting on selected text
  const toggleBold = useCallback(() => applyFormat("strong"), [applyFormat]);

  // Toggle italic formatting on selected text
  const toggleItalic = useCallback(() => applyFormat("em"), [applyFormat]);

  // Toggle underline formatting on selected text
  const toggleUnderline = useCallback(() => applyFormat("u"), [applyFormat]);

  // Insert a list (ordered or unordered) at the current cursor position
  const insertList = useCallback(
    (ordered = false) => {
      try {
        saveSelection();
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const listElement = document.createElement(ordered ? "ol" : "ul");
        const listItem = document.createElement("li");

        if (range.collapsed) {
          listItem.appendChild(document.createTextNode("\u00A0"));
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
        console.error("Error inserting list:", error);
      }
    },
    [saveSelection, updateContent],
  );

  // Insert an unordered (bullet) list
  const insertBulletList = useCallback(() => insertList(false), [insertList]);

  // Insert an ordered (numbered) list
  const insertNumberedList = useCallback(() => insertList(true), [insertList]);

  // Validate if a string is a valid URL (with protocol auto-detection)
  const isValidUrl = useCallback((string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      // Try adding protocol if missing
      try {
        new URL("https://" + string);
        return true;
      } catch (_) {
        return false;
      }
    }
  }, []);

  // Create a hyperlink from the currently selected text
  const createLink = useCallback(() => {
    try {
      saveSelection();
      const selection = window.getSelection();
      if (
        !selection ||
        selection.rangeCount === 0 ||
        selection.toString() === ""
      ) {
        alert("Please select some text first");
        return;
      }

      const url = prompt("Enter URL:");
      if (url && isValidUrl(url)) {
        restoreSelection();
        applyFormat("a", { href: url });
      } else if (url) {
        alert("Please enter a valid URL (e.g., https://example.com)");
      }
    } catch (error) {
      console.error("Error creating link:", error);
    }
  }, [saveSelection, restoreSelection, applyFormat, isValidUrl]);

  return {
    toggleBold,
    toggleItalic,
    toggleUnderline,
    insertBulletList,
    insertNumberedList,
    createLink,
    applyFormat,
  };
};
