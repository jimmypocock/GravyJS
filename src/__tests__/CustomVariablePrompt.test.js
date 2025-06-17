import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import GravyJS from "../GravyJS";

describe("GravyJS Custom Variable Prompt", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("uses browser prompt when onVariablePrompt not provided", async () => {
    global.prompt.mockReturnValue("John");
    const editorRef = React.createRef();

    render(<GravyJS ref={editorRef} />);

    // Set content with a variable
    act(() => {
      editorRef.current.setContent("Hello [[name]]!");
    });

    const result = await editorRef.current.populateVariables();

    expect(global.prompt).toHaveBeenCalledWith("Enter value for [[name]]:");
    expect(result.html).toContain("John");
  });

  test("uses custom prompt function when provided", async () => {
    const customPrompt = jest.fn().mockResolvedValue("Jane");
    const editorRef = React.createRef();

    render(<GravyJS ref={editorRef} onVariablePrompt={customPrompt} />);

    // Set content with a variable
    act(() => {
      editorRef.current.setContent("Hello [[name]]!");
    });

    const result = await editorRef.current.populateVariables();

    expect(customPrompt).toHaveBeenCalledWith("name", "[[", "]]");
    expect(global.prompt).not.toHaveBeenCalled();
    expect(result.html).toContain("Jane");
  });

  test("handles custom prompt returning null (user cancellation)", async () => {
    const customPrompt = jest.fn().mockResolvedValue(null);
    const editorRef = React.createRef();

    render(<GravyJS ref={editorRef} onVariablePrompt={customPrompt} />);

    // Set content with a variable
    act(() => {
      editorRef.current.setContent("Hello [[name]]!");
    });

    const result = await editorRef.current.populateVariables();

    expect(customPrompt).toHaveBeenCalledWith("name", "[[", "]]");
    expect(result).toBeNull();
  });

  test("handles custom prompt errors gracefully", async () => {
    const customPrompt = jest.fn().mockRejectedValue(new Error("Custom error"));
    const editorRef = React.createRef();
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<GravyJS ref={editorRef} onVariablePrompt={customPrompt} />);

    // Set content with a variable
    act(() => {
      editorRef.current.setContent("Hello [[name]]!");
    });

    const result = await editorRef.current.populateVariables();

    expect(customPrompt).toHaveBeenCalledWith("name", "[[", "]]");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error with custom variable prompt:",
      expect.any(Error),
    );
    expect(result).toBeNull();

    consoleSpy.mockRestore();
  });

  test("custom prompt receives correct variable delimiters", async () => {
    const customPrompt = jest.fn().mockResolvedValue("Test");
    const editorRef = React.createRef();

    render(
      <GravyJS
        ref={editorRef}
        onVariablePrompt={customPrompt}
        variablePrefix="{{"
        variableSuffix="}}"
      />,
    );

    // Set content with a variable using custom delimiters
    act(() => {
      editorRef.current.setContent("Hello {{name}}!");
    });

    await editorRef.current.populateVariables();

    expect(customPrompt).toHaveBeenCalledWith("name", "{{", "}}");
  });

  test("custom prompt works with multiple variables", async () => {
    const customPrompt = jest
      .fn()
      .mockResolvedValueOnce("John")
      .mockResolvedValueOnce("Engineer");
    const editorRef = React.createRef();

    render(<GravyJS ref={editorRef} onVariablePrompt={customPrompt} />);

    // Set content with multiple variables
    act(() => {
      editorRef.current.setContent("Hello [[name]], you are a [[role]]!");
    });

    const result = await editorRef.current.populateVariables();

    expect(customPrompt).toHaveBeenCalledTimes(2);
    expect(customPrompt).toHaveBeenNthCalledWith(1, "name", "[[", "]]");
    expect(customPrompt).toHaveBeenNthCalledWith(2, "role", "[[", "]]");
    expect(result.html).toContain("John");
    expect(result.html).toContain("Engineer");
  });

  test("custom prompt can return synchronous values", async () => {
    const customPrompt = jest.fn().mockReturnValue("Sync Value");
    const editorRef = React.createRef();

    render(<GravyJS ref={editorRef} onVariablePrompt={customPrompt} />);

    // Set content with a variable
    act(() => {
      editorRef.current.setContent("Hello [[name]]!");
    });

    const result = await editorRef.current.populateVariables();

    expect(customPrompt).toHaveBeenCalledWith("name", "[[", "]]");
    expect(result.html).toContain("Sync Value");
  });
});
