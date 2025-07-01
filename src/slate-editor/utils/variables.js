import { Transforms, Editor, Node } from "slate";

// Insert a variable at the current selection
export const insertVariable = (editor, name, prefix = "[[", suffix = "]]") => {
  const variable = {
    type: "variable",
    name,
    prefix,
    suffix,
    populated: false,
    children: [{ text: "" }],
  };
  
  Transforms.insertNodes(editor, variable);
};

// Get all variables in the document
export const getAllVariables = (editor, nodes) => {
  const variables = [];
  
  const iterate = (node, path = []) => {
    if (node.type === "variable" && !node.populated) {
      variables.push(node.name);
    }
    
    if (node.children) {
      node.children.forEach((child, index) => {
        iterate(child, [...path, index]);
      });
    }
  };
  
  nodes.forEach((node, index) => iterate(node, [index]));
  
  // Return unique variable names
  return [...new Set(variables)];
};

// Populate variables with values (returns new nodes, doesn't modify editor)
export const populateVariables = (editor, nodes, values) => {
  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
  const clonedNodes = deepClone(nodes);
  
  const populate = (node) => {
    if (node.type === "variable" && values[node.name] !== undefined) {
      node.populated = true;
      node.populatedValue = values[node.name];
    }
    
    if (node.children) {
      node.children.forEach(child => populate(child));
    }
  };
  
  clonedNodes.forEach(node => populate(node));
  return clonedNodes;
};

// Find and replace variables in the editor (modifies the editor)
export const replaceVariables = (editor, values) => {
  const nodes = Array.from(
    Editor.nodes(editor, {
      at: [],
      match: n => n.type === "variable",
    }),
  );
  
  for (const [node, path] of nodes) {
    if (values[node.name] !== undefined) {
      Transforms.setNodes(
        editor,
        {
          populated: true,
          populatedValue: values[node.name],
        },
        { at: path },
      );
    }
  }
};