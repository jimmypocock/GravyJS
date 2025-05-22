import { useState, useRef, useCallback, useEffect } from 'react';

export const useEditorContent = (initialValue, onChange) => {
  const [content, setContent] = useState(initialValue);
  const editorRef = useRef(null);
  const isUpdatingRef = useRef(false);

  // Update the content state when editor content changes
  const updateContent = useCallback(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      try {
        const newContent = editorRef.current.innerHTML;
        setContent(newContent);
        if (onChange) {
          onChange(newContent);
        }
      } catch (error) {
        console.error('Error updating content:', error);
      }
    }
  }, [onChange]);

  // Set editor content programmatically (used by the ref API)
  const setEditorContent = useCallback((newContent) => {
    try {
      if (editorRef.current) {
        isUpdatingRef.current = true;
        editorRef.current.innerHTML = newContent || '';
        setContent(newContent || '');
        if (onChange) {
          onChange(newContent || '');
        }
        isUpdatingRef.current = false;
      }
    } catch (error) {
      console.error('Error setting content:', error);
    }
  }, [onChange]);

  // Get the current HTML content from the editor
  const getContent = useCallback(() => {
    return editorRef.current ? editorRef.current.innerHTML : '';
  }, []);

  // Set initial content with error handling
  useEffect(() => {
    try {
      if (editorRef.current && initialValue && !content) {
        isUpdatingRef.current = true;
        editorRef.current.innerHTML = initialValue;
        setContent(initialValue);
        isUpdatingRef.current = false;
      }
    } catch (error) {
      console.error('Error setting initial content:', error);
    }
  }, [initialValue, content]);

  return {
    content,
    editorRef,
    updateContent,
    setEditorContent,
    getContent
  };
};