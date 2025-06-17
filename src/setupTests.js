require("@testing-library/jest-dom");

// Mock window.getSelection for editor testing
Object.defineProperty(window, "getSelection", {
  writable: true,
  value: jest.fn(() => ({
    removeAllRanges: jest.fn(),
    addRange: jest.fn(),
    rangeCount: 1,
    getRangeAt: jest.fn(() => ({
      cloneRange: jest.fn(),
      collapsed: false,
      commonAncestorContainer: document.createElement("div"),
      insertNode: jest.fn(),
      extractContents: jest.fn(() => document.createDocumentFragment()),
      deleteContents: jest.fn(),
      setStart: jest.fn(),
      setEnd: jest.fn(),
      setStartAfter: jest.fn(),
      collapse: jest.fn(),
      surroundContents: jest.fn(),
      startContainer: document.createElement("div"),
      startOffset: 0,
      endOffset: 5,
    })),
    toString: jest.fn(() => "selected text"),
  })),
});

// Mock document.createRange
Object.defineProperty(document, "createRange", {
  writable: true,
  value: jest.fn(() => ({
    setStart: jest.fn(),
    setEnd: jest.fn(),
    collapse: jest.fn(),
    cloneRange: jest.fn(),
    insertNode: jest.fn(),
    extractContents: jest.fn(() => document.createDocumentFragment()),
    deleteContents: jest.fn(),
    setStartAfter: jest.fn(),
    commonAncestorContainer: document.createElement("div"),
    surroundContents: jest.fn(),
  })),
});

// Mock alert and prompt
global.alert = jest.fn();
global.prompt = jest.fn();
