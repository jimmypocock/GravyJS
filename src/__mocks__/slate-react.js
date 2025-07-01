import React from 'react';

// Mock Slate component that doesn't validate initialValue
export const Slate = ({ children, value, onChange }) => {
  return <div data-testid="slate-editor">{children}</div>;
};

// Mock Editable component
export const Editable = (props) => {
  return (
    <div 
      {...props}
      contentEditable 
      role="textbox"
      data-testid="slate-editable"
    />
  );
};

// Mock useSlate hook
export const useSlate = () => ({
  toggleBold: jest.fn(),
  toggleItalic: jest.fn(),
  toggleUnderline: jest.fn(),
  insertBreak: jest.fn(),
  deleteBackward: jest.fn(),
  selection: null,
});

// Mock withReact
export const withReact = (editor) => {
  editor.children = [{ type: 'paragraph', children: [{ text: '' }] }];
  editor.onChange = jest.fn();
  editor.selection = null;
  editor.operations = [];
  editor.marks = null;
  return editor;
};

// Mock ReactEditor
export const ReactEditor = {
  focus: jest.fn(),
  blur: jest.fn(),
  deselect: jest.fn(),
  isFocused: jest.fn(() => false),
  hasFocus: jest.fn(() => false),
};