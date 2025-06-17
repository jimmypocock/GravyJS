import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SnippetDropdown from "../components/SnippetDropdown";

describe("SnippetDropdown", () => {
  const mockSnippets = [
    { title: "Greeting", content: "<p>Hello [[name]]!</p>" },
    { title: "Farewell", content: "<p>Goodbye [[name]]!</p>" },
    { title: "Meeting", content: "<p>Meeting at [[time]]</p>" },
  ];

  const defaultProps = {
    snippets: mockSnippets,
    onInsertSnippet: jest.fn(),
    onClose: jest.fn(),
    isVisible: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders when visible", () => {
    render(<SnippetDropdown {...defaultProps} />);

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search snippets..."),
    ).toBeInTheDocument();
    expect(screen.getByText("Greeting")).toBeInTheDocument();
    expect(screen.getByText("Farewell")).toBeInTheDocument();
  });

  test("does not render when not visible", () => {
    render(<SnippetDropdown {...defaultProps} isVisible={false} />);

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  test("filters snippets based on search", () => {
    render(<SnippetDropdown {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText("Search snippets...");
    fireEvent.change(searchInput, { target: { value: "meet" } });

    expect(screen.getByText("Meeting")).toBeInTheDocument();
    expect(screen.queryByText("Greeting")).not.toBeInTheDocument();
    expect(screen.queryByText("Farewell")).not.toBeInTheDocument();
  });

  test('shows "No snippets found" when no matches', () => {
    render(<SnippetDropdown {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText("Search snippets...");
    fireEvent.change(searchInput, { target: { value: "nonexistent" } });

    expect(screen.getByText("No snippets found")).toBeInTheDocument();
  });

  test("calls onInsertSnippet when snippet is clicked", () => {
    render(<SnippetDropdown {...defaultProps} />);

    const greetingSnippet = screen.getByText("Greeting");
    fireEvent.click(greetingSnippet);

    expect(defaultProps.onInsertSnippet).toHaveBeenCalledWith(mockSnippets[0]);
  });

  test("handles keyboard navigation (Enter key)", () => {
    render(<SnippetDropdown {...defaultProps} />);

    const greetingSnippet = screen.getByText("Greeting");
    fireEvent.keyDown(greetingSnippet, { key: "Enter" });

    expect(defaultProps.onInsertSnippet).toHaveBeenCalledWith(mockSnippets[0]);
  });

  test("handles keyboard navigation (Space key)", () => {
    render(<SnippetDropdown {...defaultProps} />);

    const greetingSnippet = screen.getByText("Greeting");
    fireEvent.keyDown(greetingSnippet, { key: " " });

    expect(defaultProps.onInsertSnippet).toHaveBeenCalledWith(mockSnippets[0]);
  });

  test("resets search when dropdown closes", async () => {
    const { rerender } = render(<SnippetDropdown {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText("Search snippets...");
    fireEvent.change(searchInput, { target: { value: "test" } });

    expect(searchInput.value).toBe("test");

    rerender(<SnippetDropdown {...defaultProps} isVisible={false} />);
    rerender(<SnippetDropdown {...defaultProps} isVisible={true} />);

    await waitFor(() => {
      const newSearchInput = screen.getByPlaceholderText("Search snippets...");
      expect(newSearchInput.value).toBe("");
    });
  });

  test("snippet preview truncates content correctly", () => {
    const longSnippet = {
      title: "Long Content",
      content:
        "<p>This is a very long snippet content that should be truncated after 50 characters</p>",
    };

    render(<SnippetDropdown {...defaultProps} snippets={[longSnippet]} />);

    const preview = screen.getByText(
      /This is a very long snippet content that should be/,
    );
    expect(preview.textContent).toMatch(/\.\.\.$/);
  });
});
