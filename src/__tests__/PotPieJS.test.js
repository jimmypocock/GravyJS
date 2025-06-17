import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import GravyJS from "../GravyJS";

describe("GravyJS", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  test("bold button exists and can be clicked", () => {
    render(<GravyJS />);
    const boldButton = screen.getByTitle(/bold/i);
    expect(boldButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(boldButton);
    });

    expect(window.getSelection).toHaveBeenCalled();
  });

  test("italic button exists and can be clicked", () => {
    render(<GravyJS />);
    const italicButton = screen.getByTitle(/italic/i);
    expect(italicButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(italicButton);
    });

    expect(window.getSelection).toHaveBeenCalled();
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

  test("keyboard shortcuts work", () => {
    render(<GravyJS />);
    const editor = screen.getByRole("textbox");

    act(() => {
      fireEvent.keyDown(editor, { key: "b", ctrlKey: true });
    });
    expect(window.getSelection).toHaveBeenCalled();
  });

  test("variable insertion works", () => {
    global.prompt.mockReturnValue("testVar");

    render(<GravyJS />);
    const variableButton = screen.getByTitle(/insert variable/i);

    act(() => {
      fireEvent.click(variableButton);
    });

    expect(global.prompt).toHaveBeenCalledWith("Enter variable name:");
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
