import React from "react";

export interface Snippet {
  title: string;
  content: string;
}

export interface VariableValues {
  [key: string]: string;
}

export interface PopulatedContent {
  html: string;
  variables: VariableValues;
  plainText: string;
}

export interface GravyJSProps {
  /** Initial content of the editor */
  initialValue?: string;

  /** Callback fired when content changes */
  onChange?: (content: string) => void;

  /** Array of snippet objects */
  snippets?: Snippet[];

  /** Placeholder text */
  placeholder?: string;

  /** Custom CSS class */
  className?: string;

  /** Start delimiter for variables */
  variablePrefix?: string;

  /** End delimiter for variables */
  variableSuffix?: string;

  /** Custom function to prompt for variable values. If not provided, uses browser prompt() */
  onVariablePrompt?: (
    variableName: string,
    variablePrefix: string,
    variableSuffix: string,
  ) => Promise<string | null> | string | null;

  /** Disable built-in styles */
  noStyles?: boolean;
}

export interface GravyJSRef {
  /** Populate variables by prompting user for values */
  populateVariables(): Promise<PopulatedContent | null>;

  /** Get current content */
  getContent(): string;

  /** Set content programmatically */
  setContent(content: string): void;

  /** Get all variables in the current content */
  getAllVariables(): string[];

  /** Generate populated content without modifying the original */
  generatePopulatedContent(variableValues: VariableValues): string;
}

declare const GravyJS: React.ForwardRefExoticComponent<
  GravyJSProps & React.RefAttributes<GravyJSRef>
>;

export const GravyJSUnstyled: React.ForwardRefExoticComponent<
  GravyJSProps & React.RefAttributes<GravyJSRef>
>;

export default GravyJS;
