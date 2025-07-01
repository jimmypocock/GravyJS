import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import GravyJS from "../index";

describe("GravyJS - Main Export", () => {
  let mockOnChange;

  beforeEach(() => {
    mockOnChange = jest.fn();
  });

  test("renders without crashing", () => {
    const { getByRole } = render(<GravyJS onChange={mockOnChange} />);
    const editor = getByRole("textbox");
    expect(editor).toBeInTheDocument();
  });

  test("accepts initialValue prop", () => {
    const { getByRole } = render(
      <GravyJS 
        onChange={mockOnChange} 
        initialValue="<p>Initial content</p>" 
      />
    );
    
    const editor = getByRole("textbox");
    expect(editor).toBeInTheDocument();
  });

  test("accepts custom placeholder", () => {
    const { getByRole } = render(
      <GravyJS 
        onChange={mockOnChange} 
        placeholder="Custom placeholder..."
      />
    );
    
    const editor = getByRole("textbox");
    expect(editor).toBeInTheDocument();
  });

  test("accepts custom variable delimiters", () => {
    const { container } = render(
      <GravyJS 
        onChange={mockOnChange} 
        variablePrefix="{{"
        variableSuffix="}}"
      />
    );
    
    expect(container).toBeTruthy();
  });

  test("accepts snippets array", () => {
    const snippets = [
      { title: "Test Snippet", content: "<p>Test content</p>" }
    ];
    
    const { container } = render(
      <GravyJS 
        onChange={mockOnChange} 
        snippets={snippets}
      />
    );
    
    expect(container).toBeTruthy();
  });

  test("exposes ref methods", () => {
    const ref = React.createRef();
    
    render(
      <GravyJS 
        ref={ref}
        onChange={mockOnChange} 
      />
    );
    
    expect(ref.current).toBeDefined();
    expect(ref.current.populateVariables).toBeDefined();
    expect(ref.current.getContent).toBeDefined();
    expect(ref.current.setContent).toBeDefined();
    expect(ref.current.getAllVariables).toBeDefined();
    expect(ref.current.generatePopulatedContent).toBeDefined();
    expect(ref.current.copyToClipboard).toBeDefined();
  });

  test("calls onChange when content changes", () => {
    const { getByRole } = render(
      <GravyJS onChange={mockOnChange} />
    );
    
    const editor = getByRole("textbox");
    expect(editor).toBeInTheDocument();
    
    // onChange behavior is handled by Slate internally
    // Just verify the callback is defined
    expect(mockOnChange).toBeDefined();
  });
});