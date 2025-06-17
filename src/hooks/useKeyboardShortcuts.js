import { useCallback } from "react";

export const useKeyboardShortcuts = (editorRef, handlers) => {
  const { toggleBold, toggleItalic, toggleUnderline, onToolbarFocus } =
    handlers;

  // Handle keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U) and accessibility features
  const handleKeyDown = useCallback(
    (e) => {
      try {
        // Keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
          switch (e.key) {
            case "b":
              e.preventDefault();
              toggleBold();
              break;
            case "i":
              e.preventDefault();
              toggleItalic();
              break;
            case "u":
              e.preventDefault();
              toggleUnderline();
              break;
            default:
              break;
          }
        }

        // Accessibility: Handle toolbar navigation with keyboard (F10)
        if (e.key === "F10" && e.target === editorRef.current) {
          e.preventDefault();
          if (onToolbarFocus) {
            onToolbarFocus();
          }
        }
      } catch (error) {
        console.error("Error handling key down:", error);
      }
    },
    [toggleBold, toggleItalic, toggleUnderline, onToolbarFocus, editorRef],
  );

  // Handle arrow key navigation within the toolbar for accessibility
  const handleToolbarKeyDown = useCallback(
    (e) => {
      try {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          const buttons = Array.from(
            document.querySelectorAll(".gravy-toolbar .toolbar-btn"),
          );
          const currentIndex = buttons.indexOf(e.target);

          if (currentIndex !== -1) {
            e.preventDefault();
            let nextIndex = currentIndex + (e.key === "ArrowRight" ? 1 : -1);
            if (nextIndex >= buttons.length) nextIndex = 0;
            if (nextIndex < 0) nextIndex = buttons.length - 1;
            buttons[nextIndex].focus();
          }
        } else if (e.key === "Escape") {
          e.preventDefault();
          editorRef.current?.focus();
        }
      } catch (error) {
        console.error("Error handling toolbar keyboard navigation:", error);
      }
    },
    [editorRef],
  );

  return {
    handleKeyDown,
    handleToolbarKeyDown,
  };
};
