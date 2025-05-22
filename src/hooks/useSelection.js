import { useState, useCallback } from 'react';

export const useSelection = (editorRef) => {
  const [currentRange, setCurrentRange] = useState(null);

  // Save the current text selection/range for later restoration
  const saveSelection = useCallback(() => {
    try {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        setCurrentRange(selection.getRangeAt(0).cloneRange());
      }
    } catch (error) {
      console.error('Error saving selection:', error);
    }
  }, []);

  // Restore a previously saved text selection/range
  const restoreSelection = useCallback(() => {
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
  }, [currentRange, editorRef]);

  // Handle mouse up events to automatically save the current selection
  const handleMouseUp = useCallback(() => {
    saveSelection();
  }, [saveSelection]);

  return {
    currentRange,
    saveSelection,
    restoreSelection,
    handleMouseUp
  };
};