export const withVariables = (editor, options = {}) => {
  const { variablePrefix = "[[", variableSuffix = "]]" } = options;
  const { isInline, isVoid } = editor;

  // Variables are inline void elements
  editor.isInline = (element) => {
    return element.type === "variable" || isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === "variable" || isVoid(element);
  };

  // Store options on editor for access in other functions
  editor.variablePrefix = variablePrefix;
  editor.variableSuffix = variableSuffix;

  return editor;
};