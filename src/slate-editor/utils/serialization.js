import escapeHtml from "escape-html";
import { Text } from "slate";

// Serialize Slate nodes to HTML
export const serialize = (nodes) => {
  return nodes.map(n => serializeNode(n)).join("");
};

const serializeNode = (node) => {
  if (Text.isText(node)) {
    let string = escapeHtml(node.text);
    if (node.bold) {
      string = `<strong>${string}</strong>`;
    }
    if (node.italic) {
      string = `<em>${string}</em>`;
    }
    if (node.underline) {
      string = `<u>${string}</u>`;
    }
    if (node.link) {
      string = `<a href="${escapeHtml(node.url || "")}" target="_blank" rel="noopener noreferrer">${string}</a>`;
    }
    return string;
  }

  const children = node.children ? node.children.map(n => serializeNode(n)).join("") : "";

  switch (node.type) {
    case "paragraph":
      return `<p>${children}</p>`;
    case "bulleted-list":
      return `<ul>${children}</ul>`;
    case "numbered-list":
      return `<ol>${children}</ol>`;
    case "list-item":
      return `<li>${children}</li>`;
    case "heading":
      const level = node.level || 1;
      return `<h${level}>${children}</h${level}>`;
    case "variable":
      const varName = node.variableName || "variable";
      if (node.populated) {
        return `<span class="gravy-variable-populated">${escapeHtml(node.populatedValue || "")}</span>`;
      }
      return `<span class="gravy-variable" data-variable="${escapeHtml(varName)}">[[${escapeHtml(varName)}]]</span>`;
    default:
      return children;
  }
};

// Deserialize HTML string to Slate nodes
export const deserialize = (html) => {
  if (!html || html.trim() === "") {
    return [{ type: "paragraph", children: [{ text: "" }] }];
  }
  
  const document = new DOMParser().parseFromString(html, "text/html");
  const nodes = deserializeChildren(document.body);
  
  // Ensure at least one paragraph
  if (nodes.length === 0) {
    return [{ type: "paragraph", children: [{ text: "" }] }];
  }
  
  // Ensure all nodes have proper structure
  return nodes.map(node => {
    if (Text.isText(node)) {
      // Wrap loose text nodes in paragraphs
      return { type: "paragraph", children: [node] };
    }
    return node;
  });
};

const deserializeChildren = (parent) => {
  const nodes = [];
  
  Array.from(parent.childNodes).forEach(node => {
    const deserialized = deserializeNode(node);
    if (deserialized) {
      if (Array.isArray(deserialized)) {
        nodes.push(...deserialized);
      } else {
        nodes.push(deserialized);
      }
    }
  });
  
  return nodes;
};

const deserializeNode = (node) => {
  if (node.nodeType === 3) {
    // Text node
    const text = node.textContent || "";
    if (!text) return null;
    
    // Check for formatting from parent
    const formats = {};
    let parent = node.parentElement;
    while (parent && parent.tagName !== "BODY") {
      switch (parent.tagName) {
        case "STRONG":
        case "B":
          formats.bold = true;
          break;
        case "EM":
        case "I":
          formats.italic = true;
          break;
        case "U":
          formats.underline = true;
          break;
        case "A":
          formats.link = true;
          formats.url = parent.getAttribute("href") || "";
          break;
      }
      parent = parent.parentElement;
    }
    
    return { text, ...formats };
  }
  
  if (node.nodeType !== 1) return null;
  
  // Check for variable spans first
  if (node.tagName === "SPAN" && node.classList.contains("gravy-variable")) {
    const variableName = node.getAttribute("data-variable") || 
                        node.textContent.replace(/^\[\[|\]\]$/g, "");
    return {
      type: "variable",
      variableName,
      children: [{ text: "" }],
    };
  }
  
  const children = deserializeChildren(node);
  
  // Handle block-level elements
  switch (node.tagName) {
    case "P":
      return {
        type: "paragraph",
        children: children.length > 0 ? children : [{ text: "" }],
      };
      
    case "H1":
    case "H2":
    case "H3":
    case "H4":
    case "H5":
    case "H6":
      return {
        type: "heading",
        level: parseInt(node.tagName[1]),
        children: children.length > 0 ? children : [{ text: "" }],
      };
      
    case "UL":
      return {
        type: "bulleted-list",
        children: children.length > 0 ? children : [{ type: "list-item", children: [{ text: "" }] }],
      };
      
    case "OL":
      return {
        type: "numbered-list",
        children: children.length > 0 ? children : [{ type: "list-item", children: [{ text: "" }] }],
      };
      
    case "LI":
      return {
        type: "list-item",
        children: children.length > 0 ? children : [{ text: "" }],
      };
      
    case "BR":
      return { text: "\n" };
      
    case "DIV":
      // Return children directly for DIV, they'll be wrapped if needed
      return children;
      
    default:
      // For inline elements, return children
      return children.length > 0 ? children : null;
  }
};