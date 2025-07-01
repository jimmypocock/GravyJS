import { Editor, Transforms, Text } from "slate";

export const withFormatting = (editor) => {
  const { isInline } = editor;

  // Links are inline elements
  editor.isInline = (element) => {
    return element.type === "link" || isInline(element);
  };

  // Add formatting methods to editor
  editor.toggleBold = () => {
    toggleFormat(editor, "bold");
  };

  editor.toggleItalic = () => {
    toggleFormat(editor, "italic");
  };

  editor.toggleUnderline = () => {
    toggleFormat(editor, "underline");
  };

  return editor;
};

// Helper to toggle format marks
const toggleFormat = (editor, format) => {
  const isActive = isFormatActive(editor, format);
  
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

// Check if format is active
const isFormatActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};