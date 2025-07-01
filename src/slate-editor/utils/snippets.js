import { Transforms } from "slate";
import { deserialize } from "./serialization";

// Insert a snippet at the current selection
export const insertSnippet = (editor, snippetHtml) => {
  // Parse the HTML snippet into Slate nodes
  const nodes = deserialize(snippetHtml);
  
  // Filter out the fragment wrapper if present
  const nodesToInsert = nodes.length === 1 && nodes[0].type === undefined 
    ? nodes[0].children 
    : nodes;
  
  // Insert the nodes
  Transforms.insertNodes(editor, nodesToInsert);
};