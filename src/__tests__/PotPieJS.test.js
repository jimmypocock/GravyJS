import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
/* eslint-disable-next-line no-unused-vars */
import GravyJS from "../GravyJS.js";

// Mock Selection API
const mockSelection = {
  rangeCount: 1,
  getRangeAt: jest.fn(),
  removeAllRanges: jest.fn(),
  addRange: jest.fn(),
  toString: jest.fn(),
};

const mockRange = {
  collapsed: false,
  commonAncestorContainer: null,
  surroundContents: jest.fn(),
  extractContents: jest.fn(),
  insertNode: jest.fn(),
  selectNodeContents: jest.fn(),
  setStart: jest.fn(),
  setEnd: jest.fn(),
  collapse: jest.fn(),
  cloneRange: jest.fn(),
};

describe("GravyJS", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup Selection API mocks
    global.window.getSelection = jest.fn(() => mockSelection);
    global.document.createRange = jest.fn(() => ({ ...mockRange }));
    mockSelection.getRangeAt.mockReturnValue(mockRange);
    mockSelection.toString.mockReturnValue("selected text");
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders editor with placeholder", () => {
    render(<GravyJS placeholder="Type here..." />);
    const editor = screen.getByRole("textbox");
    expect(editor).toBeInTheDocument();
    expect(editor).toHaveAttribute("data-placeholder", "Type here...");
  });

  test("handles content changes", async () => {
    const onChange = jest.fn();
    render(<GravyJS onChange={onChange} />);

    const editor = screen.getByRole("textbox");

    await act(async () => {
      editor.innerHTML = "Hello World";
      fireEvent.input(editor);
    });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith("Hello World");
    });
  });

  test("bold button formats selected text", async () => {
    render(<GravyJS />);
    const editor = screen.getByRole("textbox");
    const boldButton = screen.getByTitle(/bold/i);
    
    // Set initial content
    await act(async () => {
      editor.innerHTML = "This is a test sentence with multiple words.";
      fireEvent.input(editor);
    });
    
    // Simulate text selection
    mockSelection.toString.mockReturnValue("test sentence");
    mockRange.collapsed = false;
    
    // Mock element creation
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = jest.fn((tag) => {
      const element = originalCreateElement(tag);
      return element;
    });
    
    act(() => {
      fireEvent.click(boldButton);
    });

    expect(window.getSelection).toHaveBeenCalled();
    expect(document.createElement).toHaveBeenCalledWith("strong");
  });

  test("italic button formats selected text", async () => {
    render(<GravyJS />);
    const editor = screen.getByRole("textbox");
    const italicButton = screen.getByTitle(/italic/i);
    
    // Set initial content with fully formed text
    await act(async () => {
      editor.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
      fireEvent.input(editor);
    });
    
    // Simulate selecting part of the text
    mockSelection.toString.mockReturnValue("dolor sit amet");
    mockRange.collapsed = false;
    
    // Mock element creation
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = jest.fn((tag) => {
      const element = originalCreateElement(tag);
      return element;
    });
    
    act(() => {
      fireEvent.click(italicButton);
    });

    expect(window.getSelection).toHaveBeenCalled();
    expect(document.createElement).toHaveBeenCalledWith("em");
  });

  test("underline button formats selected text", async () => {
    render(<GravyJS />);
    const editor = screen.getByRole("textbox");
    const underlineButton = screen.getByTitle(/underline/i);
    
    // Set content with special characters
    await act(async () => {
      editor.innerHTML = "Important! This text contains special chars: @#$%&*()";
      fireEvent.input(editor);
    });
    
    mockSelection.toString.mockReturnValue("Important! This text");
    mockRange.collapsed = false;
    
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = jest.fn((tag) => {
      const element = originalCreateElement(tag);
      return element;
    });
    
    act(() => {
      fireEvent.click(underlineButton);
    });

    expect(document.createElement).toHaveBeenCalledWith("u");
  });

  test("snippet dropdown functionality", () => {
    const snippets = [{ title: "Test Snippet", content: "This is a test" }];

    render(<GravyJS snippets={snippets} />);
    const snippetButton = screen.getByTitle(/insert snippet/i);

    act(() => {
      fireEvent.click(snippetButton);
    });

    expect(
      screen.getByPlaceholderText("Search snippets..."),
    ).toBeInTheDocument();
    expect(screen.getByText("Test Snippet")).toBeInTheDocument();
  });

  test("snippet search works", () => {
    const snippets = [
      { title: "Hello World", content: "Hello content" },
      { title: "Goodbye", content: "Goodbye content" },
    ];

    render(<GravyJS snippets={snippets} />);
    const snippetButton = screen.getByTitle(/insert snippet/i);

    act(() => {
      fireEvent.click(snippetButton);
    });

    const searchInput = screen.getByPlaceholderText("Search snippets...");

    act(() => {
      fireEvent.change(searchInput, { target: { value: "Hello" } });
    });

    expect(screen.getByText("Hello World")).toBeInTheDocument();
    expect(screen.queryByText("Goodbye")).not.toBeInTheDocument();
  });

  test("bullet list button creates list from selected text", async () => {
    render(<GravyJS />);
    const editor = screen.getByRole("textbox");
    const bulletButton = screen.getByTitle(/bullet list/i);
    
    // Set multi-line content
    await act(async () => {
      editor.innerHTML = "First paragraph of text.\nSecond paragraph here.\nThird paragraph.";
      fireEvent.input(editor);
    });
    
    mockSelection.toString.mockReturnValue("Second paragraph here.");
    mockRange.collapsed = false;
    
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = jest.fn((tag) => {
      const element = originalCreateElement(tag);
      return element;
    });
    
    act(() => {
      fireEvent.click(bulletButton);
    });

    expect(document.createElement).toHaveBeenCalledWith("ul");
    expect(document.createElement).toHaveBeenCalledWith("li");
  });

  test("numbered list button creates ordered list", async () => {
    render(<GravyJS />);
    const editor = screen.getByRole("textbox");
    const numberedButton = screen.getByTitle(/numbered list/i);
    
    // Set content with multiple sentences
    await act(async () => {
      editor.innerHTML = "Step one: Do this first. Step two: Then do this. Step three: Finally this.";
      fireEvent.input(editor);
    });
    
    mockSelection.toString.mockReturnValue("Step two: Then do this.");
    mockRange.collapsed = false;
    
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = jest.fn((tag) => {
      const element = originalCreateElement(tag);
      return element;
    });
    
    act(() => {
      fireEvent.click(numberedButton);
    });

    expect(document.createElement).toHaveBeenCalledWith("ol");
    expect(document.createElement).toHaveBeenCalledWith("li");
  });

  test("link button creates hyperlink from selected text", async () => {
    global.prompt = jest.fn().mockReturnValue("https://example.com");
    
    render(<GravyJS />);
    const editor = screen.getByRole("textbox");
    const linkButton = screen.getByTitle(/insert link/i);
    
    // Set content with link text
    await act(async () => {
      editor.innerHTML = "Visit our website for more information about our products.";
      fireEvent.input(editor);
    });
    
    mockSelection.toString.mockReturnValue("Visit our website");
    mockRange.collapsed = false;
    
    const originalCreateElement = document.createElement.bind(document);
    const aElement = originalCreateElement("a");
    aElement.setAttribute = jest.fn();
    document.createElement = jest.fn((tag) => {
      if (tag === "a") return aElement;
      const element = originalCreateElement(tag);
      return element;
    });
    
    act(() => {
      fireEvent.click(linkButton);
    });

    expect(global.prompt).toHaveBeenCalledWith("Enter URL:");
    expect(document.createElement).toHaveBeenCalledWith("a");
    expect(aElement.setAttribute).toHaveBeenCalledWith("href", "https://example.com");
    expect(aElement.setAttribute).toHaveBeenCalledWith("target", "_blank");
  });

  test("keyboard shortcuts work", async () => {
    render(<GravyJS />);
    const editor = screen.getByRole("textbox");
    
    // Set content
    await act(async () => {
      editor.innerHTML = "This text will be formatted with keyboard shortcuts.";
      fireEvent.input(editor);
    });
    
    mockSelection.toString.mockReturnValue("formatted with keyboard");
    mockRange.collapsed = false;

    // Test Ctrl+B for bold
    act(() => {
      fireEvent.keyDown(editor, { key: "b", ctrlKey: true });
    });
    expect(window.getSelection).toHaveBeenCalled();
    
    // Test Ctrl+I for italic
    act(() => {
      fireEvent.keyDown(editor, { key: "i", ctrlKey: true });
    });
    expect(window.getSelection).toHaveBeenCalled();
    
    // Test Ctrl+U for underline
    act(() => {
      fireEvent.keyDown(editor, { key: "u", ctrlKey: true });
    });
    expect(window.getSelection).toHaveBeenCalled();
  });

  test("variable insertion works with fully formed text", async () => {
    global.prompt = jest.fn().mockReturnValue("userName");

    render(<GravyJS />);
    const editor = screen.getByRole("textbox");
    const variableButton = screen.getByTitle(/insert variable/i);
    
    // Set content with complete sentences
    await act(async () => {
      editor.innerHTML = "Hello there! Welcome to our application. We hope you enjoy your experience.";
      fireEvent.input(editor);
    });
    
    // Position cursor after "Hello"
    mockRange.collapsed = true;

    act(() => {
      fireEvent.click(variableButton);
    });

    expect(global.prompt).toHaveBeenCalledWith("Enter variable name:");
  });

  test("formatting buttons toggle on and off", async () => {
    render(<GravyJS />);
    const editor = screen.getByRole("textbox");
    const boldButton = screen.getByTitle(/bold/i);
    
    // Set content
    await act(async () => {
      editor.innerHTML = "This text will be toggled bold on and off.";
      fireEvent.input(editor);
    });
    
    mockSelection.toString.mockReturnValue("toggled bold");
    mockRange.collapsed = false;
    
    // First click - apply bold
    const strongElement = { tagName: "STRONG", parentNode: editor, nodeType: Node.ELEMENT_NODE };
    mockRange.commonAncestorContainer = editor;
    
    act(() => {
      fireEvent.click(boldButton);
    });
    
    // Clear previous calls
    jest.clearAllMocks();
    global.window.getSelection = jest.fn(() => mockSelection);
    
    // Second click - remove bold (simulate being inside strong element)
    mockRange.commonAncestorContainer = strongElement;
    
    act(() => {
      fireEvent.click(boldButton);
    });
    
    expect(window.getSelection).toHaveBeenCalled();
  });

  test("handles complex formatting scenarios", async () => {
    render(<GravyJS />);
    const editor = screen.getByRole("textbox");
    const boldButton = screen.getByTitle(/bold/i);
    const italicButton = screen.getByTitle(/italic/i);
    const underlineButton = screen.getByTitle(/underline/i);
    
    // Set a paragraph of text
    await act(async () => {
      editor.innerHTML = `<p>This is a comprehensive test with multiple formatting options. 
      It includes various sentences to test the editor's capability to handle 
      complex text formatting scenarios with nested elements.</p>`;
      fireEvent.input(editor);
    });
    
    // Select middle portion
    mockSelection.toString.mockReturnValue("multiple formatting options");
    mockRange.collapsed = false;
    
    // Apply multiple formats
    act(() => {
      fireEvent.click(boldButton);
    });
    
    // Clear and reset mocks between clicks
    jest.clearAllMocks();
    global.window.getSelection = jest.fn(() => mockSelection);
    
    act(() => {
      fireEvent.click(italicButton);
    });
    
    jest.clearAllMocks();
    global.window.getSelection = jest.fn(() => mockSelection);
    
    act(() => {
      fireEvent.click(underlineButton);
    });
    
    expect(window.getSelection).toHaveBeenCalled();
    // Verify at least one formatting element was created
    expect(document.createElement).toHaveBeenCalled();
  });

  test("exposed methods work with ref", async () => {
    const editorRef = React.createRef();

    render(<GravyJS ref={editorRef} />);

    await act(async () => {
      editorRef.current.populateVariables({ test: "value" });
    });

    const content = editorRef.current.getContent();
    expect(typeof content).toBe("string");

    await act(async () => {
      editorRef.current.setContent("<p>New content</p>");
    });

    await waitFor(() => {
      expect(editorRef.current.getContent()).toBe("<p>New content</p>");
    });
  });
});
