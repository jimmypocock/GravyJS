// Mock withHistory
export const withHistory = (editor) => {
  editor.history = {
    undos: [],
    redos: [],
  };
  editor.undo = jest.fn();
  editor.redo = jest.fn();
  return editor;
};