import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Toolbar from "../components/Toolbar";

describe("Toolbar", () => {
  const defaultProps = {
    onBold: jest.fn(),
    onItalic: jest.fn(),
    onUnderline: jest.fn(),
    onBulletList: jest.fn(),
    onNumberedList: jest.fn(),
    onCreateLink: jest.fn(),
    onInsertVariable: jest.fn(),
    onToggleSnippets: jest.fn(),
    showSnippets: false,
    variablePrefix: "[[",
    variableSuffix: "]]",
    onKeyDown: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all toolbar buttons", () => {
    render(<Toolbar {...defaultProps} />);

    expect(screen.getByTitle(/bold/i)).toBeInTheDocument();
    expect(screen.getByTitle(/italic/i)).toBeInTheDocument();
    expect(screen.getByTitle(/underline/i)).toBeInTheDocument();
    expect(screen.getByTitle(/bullet list/i)).toBeInTheDocument();
    expect(screen.getByTitle(/numbered list/i)).toBeInTheDocument();
    expect(screen.getByTitle(/insert link/i)).toBeInTheDocument();
    expect(screen.getByTitle(/insert variable/i)).toBeInTheDocument();
    expect(screen.getByTitle(/insert snippet/i)).toBeInTheDocument();
  });

  test("calls correct handlers when buttons are clicked", () => {
    render(<Toolbar {...defaultProps} />);

    fireEvent.click(screen.getByTitle(/bold/i));
    expect(defaultProps.onBold).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTitle(/italic/i));
    expect(defaultProps.onItalic).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTitle(/underline/i));
    expect(defaultProps.onUnderline).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTitle(/insert variable/i));
    expect(defaultProps.onInsertVariable).toHaveBeenCalledTimes(1);
  });

  test("displays variable delimiters correctly", () => {
    const customProps = {
      ...defaultProps,
      variablePrefix: "{{",
      variableSuffix: "}}",
    };

    render(<Toolbar {...customProps} />);

    const variableButton = screen.getByTitle(/insert variable/i);
    expect(variableButton).toHaveTextContent("{{}}");
  });

  test("shows correct aria-expanded state for snippets button", () => {
    const { rerender } = render(
      <Toolbar {...defaultProps} showSnippets={false} />,
    );

    const snippetButton = screen.getByTitle(/insert snippet/i);
    expect(snippetButton).toHaveAttribute("aria-expanded", "false");

    rerender(<Toolbar {...defaultProps} showSnippets={true} />);
    expect(snippetButton).toHaveAttribute("aria-expanded", "true");
  });
});
