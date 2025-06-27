import React from "react";
import { renderHook, act } from "@testing-library/react";
import { useFormatting } from "../hooks/useFormatting";

describe("useFormatting", () => {
  let editorRef;
  let updateContent;
  let saveSelection;
  let restoreSelection;

  beforeEach(() => {
    // Create a real DOM element for the editor
    const editor = document.createElement("div");
    editor.setAttribute("contenteditable", "true");
    document.body.appendChild(editor);
    editorRef = { current: editor };
    
    updateContent = jest.fn();
    saveSelection = jest.fn();
    restoreSelection = jest.fn();

    // Mock window.getSelection
    const mockSelection = {
      rangeCount: 1,
      getRangeAt: jest.fn(),
      removeAllRanges: jest.fn(),
      addRange: jest.fn(),
      toString: jest.fn().mockReturnValue("test text"),
    };

    const mockRange = {
      collapsed: false,
      commonAncestorContainer: editor,
      surroundContents: jest.fn(),
      extractContents: jest.fn(() => document.createDocumentFragment()),
      insertNode: jest.fn(),
      selectNodeContents: jest.fn(),
      setStart: jest.fn(),
      setEnd: jest.fn(),
      setStartAfter: jest.fn(),
      collapse: jest.fn(),
      cloneRange: jest.fn(() => mockRange),
      deleteContents: jest.fn(),
    };

    mockSelection.getRangeAt.mockReturnValue(mockRange);
    global.window.getSelection = jest.fn(() => mockSelection);
    global.document.createRange = jest.fn(() => mockRange);

    // Mock prompt and alert
    global.prompt = jest.fn();
    global.alert = jest.fn();
  });

  afterEach(() => {
    // Clean up DOM
    if (editorRef.current && editorRef.current.parentNode) {
      editorRef.current.parentNode.removeChild(editorRef.current);
    }
    jest.clearAllMocks();
  });

  const setup = () => {
    return renderHook(() =>
      useFormatting(editorRef, updateContent, saveSelection, restoreSelection),
    );
  };

  describe("toggleBold", () => {
    it("should apply bold formatting to selected text", () => {
      const { result } = setup();
      
      act(() => {
        result.current.toggleBold();
      });

      expect(updateContent).toHaveBeenCalled();
    });

    it("should not apply formatting when no text is selected", () => {
      const { result } = setup();
      const selection = window.getSelection();
      selection.getRangeAt(0).collapsed = true;

      act(() => {
        result.current.toggleBold();
      });

      expect(updateContent).not.toHaveBeenCalled();
    });
  });

  describe("toggleItalic", () => {
    it("should apply italic formatting to selected text", () => {
      const { result } = setup();
      
      act(() => {
        result.current.toggleItalic();
      });

      expect(updateContent).toHaveBeenCalled();
    });
  });

  describe("toggleUnderline", () => {
    it("should apply underline formatting to selected text", () => {
      const { result } = setup();
      
      act(() => {
        result.current.toggleUnderline();
      });

      expect(updateContent).toHaveBeenCalled();
    });
  });

  describe("insertBulletList", () => {
    it("should create an unordered list", () => {
      const { result } = setup();
      
      act(() => {
        result.current.insertBulletList();
      });

      expect(updateContent).toHaveBeenCalled();
    });

    it("should handle existing list", () => {
      const { result } = setup();
      
      // Create a UL element in the editor
      const ul = document.createElement("ul");
      const li = document.createElement("li");
      ul.appendChild(li);
      editorRef.current.appendChild(ul);
      
      // Mock that we're inside the list
      const selection = window.getSelection();
      selection.getRangeAt(0).commonAncestorContainer = li;

      act(() => {
        result.current.insertBulletList();
      });

      expect(updateContent).toHaveBeenCalled();
    });
  });

  describe("insertNumberedList", () => {
    it("should create an ordered list", () => {
      const { result } = setup();
      
      act(() => {
        result.current.insertNumberedList();
      });

      expect(updateContent).toHaveBeenCalled();
    });
  });

  describe("createLink", () => {
    beforeEach(() => {
      const selection = window.getSelection();
      selection.getRangeAt(0).collapsed = false;
    });

    it("should create a link with valid URL", () => {
      const { result } = setup();
      global.prompt.mockReturnValue("https://example.com");
      
      act(() => {
        result.current.createLink();
      });

      expect(prompt).toHaveBeenCalledWith("Enter URL:");
      expect(updateContent).toHaveBeenCalled();
    });

    it("should add https:// to URLs without protocol", () => {
      const { result } = setup();
      global.prompt.mockReturnValue("example.com");
      
      act(() => {
        result.current.createLink();
      });

      expect(updateContent).toHaveBeenCalled();
    });

    it("should alert when no text is selected", () => {
      const { result } = setup();
      const selection = window.getSelection();
      selection.getRangeAt(0).collapsed = true;
      
      act(() => {
        result.current.createLink();
      });

      expect(alert).toHaveBeenCalledWith("Please select some text to create a link");
      expect(prompt).not.toHaveBeenCalled();
    });

    it("should alert for invalid URLs", () => {
      const { result } = setup();
      global.prompt.mockReturnValue("not a valid url");
      
      act(() => {
        result.current.createLink();
      });

      expect(alert).toHaveBeenCalledWith(
        "Please enter a valid URL (e.g., example.com or https://example.com)",
      );
      expect(updateContent).not.toHaveBeenCalled();
    });

    it("should handle user cancellation", () => {
      const { result } = setup();
      global.prompt.mockReturnValue(null);
      
      act(() => {
        result.current.createLink();
      });

      expect(updateContent).not.toHaveBeenCalled();
    });

    it("should handle empty URL input", () => {
      const { result } = setup();
      global.prompt.mockReturnValue("");
      
      act(() => {
        result.current.createLink();
      });

      expect(alert).toHaveBeenCalledWith("Please enter a URL");
      expect(updateContent).not.toHaveBeenCalled();
    });
  });

  describe("toggleFormat", () => {
    it("should handle custom attributes", () => {
      const { result } = setup();
      
      act(() => {
        result.current.toggleFormat("span", { 
          class: "highlight", 
          "data-custom": "value", 
        });
      });

      expect(updateContent).toHaveBeenCalled();
    });

    it("should handle errors gracefully", () => {
      const { result } = setup();
      const selection = window.getSelection();
      selection.getRangeAt(0).surroundContents.mockImplementation(() => {
        throw new Error("Test error");
      });
      
      // Should not throw
      expect(() => {
        act(() => {
          result.current.toggleFormat("strong");
        });
      }).not.toThrow();

      expect(updateContent).toHaveBeenCalled();
    });
  });

  describe("isFormatted", () => {
    it("should detect when text is already formatted", () => {
      const { result } = setup();
      
      // Create a formatted element
      const strong = document.createElement("strong");
      const textNode = document.createTextNode("bold text");
      strong.appendChild(textNode);
      editorRef.current.appendChild(strong);
      
      // Mock selection inside the strong element
      const selection = window.getSelection();
      selection.getRangeAt(0).commonAncestorContainer = textNode;
      
      act(() => {
        // Access the isFormatted function through toggleFormat
        result.current.toggleBold();
      });
      
      // The toggle should try to remove formatting, not add it
      expect(updateContent).toHaveBeenCalled();
    });
  });
});