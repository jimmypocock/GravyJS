import { useCallback } from "react";

export const useClipboard = () => {
  // Copy content to clipboard with formatting, supporting modern and legacy browsers
  const copyToClipboard = useCallback(async (content) => {
    try {
      if (!content) {
        throw new Error("No content to copy");
      }

      // Try modern Clipboard API with both HTML and plain text
      if (navigator.clipboard && navigator.clipboard.write) {
        const clipboardItem = new ClipboardItem({
          "text/html": new Blob([content.html], { type: "text/html" }),
          "text/plain": new Blob([content.plainText], { type: "text/plain" }),
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
      const textArea = document.createElement("textarea");
      textArea.value = content.plainText;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textArea);
      return success;
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      return false;
    }
  }, []);

  return {
    copyToClipboard,
  };
};
