require("@testing-library/jest-dom");

// Mock Slate modules for all tests
jest.mock('slate');
jest.mock('slate-react');
jest.mock('slate-history');

// Enhanced DOM mocks for contentEditable testing
const createMockRange = () => {
  const range = {
    collapsed: false,
    commonAncestorContainer: document.createElement("div"),
    startContainer: document.createElement("div"),
    endContainer: document.createElement("div"),
    startOffset: 0,
    endOffset: 5,
    
    // Methods
    cloneRange: jest.fn(function() { return createMockRange(); }),
    insertNode: jest.fn(function(node) {
      if (this.startContainer && this.startContainer.appendChild) {
        this.startContainer.appendChild(node);
      }
    }),
    extractContents: jest.fn(() => {
      const fragment = document.createDocumentFragment();
      const span = document.createElement("span");
      span.textContent = "extracted";
      fragment.appendChild(span);
      return fragment;
    }),
    deleteContents: jest.fn(),
    setStart: jest.fn(),
    setEnd: jest.fn(),
    setStartAfter: jest.fn(),
    setEndAfter: jest.fn(),
    setStartBefore: jest.fn(),
    setEndBefore: jest.fn(),
    collapse: jest.fn(function(toStart) { 
      this.collapsed = true; 
    }),
    selectNode: jest.fn(),
    selectNodeContents: jest.fn(),
    surroundContents: jest.fn(function(newParent) {
      // Simulate the surroundContents behavior
      if (typeof newParent.appendChild === "function") {
        const contents = this.extractContents();
        newParent.appendChild(contents);
        this.insertNode(newParent);
      }
    }),
    toString: jest.fn(() => "selected text"),
  };
  
  return range;
};

// Mock window.getSelection for editor testing
const mockSelection = {
  rangeCount: 1,
  isCollapsed: false,
  anchorNode: null,
  focusNode: null,
  removeAllRanges: jest.fn(),
  addRange: jest.fn(),
  getRangeAt: jest.fn((index) => createMockRange()),
  toString: jest.fn(() => "selected text"),
  collapse: jest.fn(),
  collapseToStart: jest.fn(),
  collapseToEnd: jest.fn(),
  extend: jest.fn(),
  selectAllChildren: jest.fn(),
  deleteFromDocument: jest.fn(),
  containsNode: jest.fn(),
};

Object.defineProperty(window, "getSelection", {
  writable: true,
  value: jest.fn(() => mockSelection),
});

// Mock document.createRange
Object.defineProperty(document, "createRange", {
  writable: true,
  value: jest.fn(() => createMockRange()),
});

// Mock TreeWalker for format detection
Object.defineProperty(document, "createTreeWalker", {
  writable: true,
  value: jest.fn((root, whatToShow, filter) => ({
    currentNode: root,
    nextNode: jest.fn(() => null),
    previousNode: jest.fn(() => null),
    parentNode: jest.fn(() => null),
    firstChild: jest.fn(() => null),
    lastChild: jest.fn(() => null),
    previousSibling: jest.fn(() => null),
    nextSibling: jest.fn(() => null),
  })),
});

// Mock DOMParser for content handling
global.DOMParser = class DOMParser {
  parseFromString(string, type) {
    const doc = document.implementation.createHTMLDocument();
    doc.body.innerHTML = string;
    return doc;
  }
};

// Mock alert and prompt
global.alert = jest.fn();
global.prompt = jest.fn(() => "test");

// Mock console methods to reduce noise in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    // Filter out expected React warnings
    if (
      typeof args[0] === "string" && 
      (args[0].includes("Warning: An invalid form control") ||
       args[0].includes("contentEditable") ||
       args[0].includes("Error toggling format") ||
       args[0].includes("Error inserting list") ||
       args[0].includes("Error inserting variable"))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
  
  console.warn = (...args) => {
    if (
      typeof args[0] === "string" && 
      args[0].includes("contentEditable")
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
