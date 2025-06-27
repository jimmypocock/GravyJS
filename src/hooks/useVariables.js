import { useCallback } from "react";

export const useVariables = (
  editorRef,
  variablePrefix,
  variableSuffix,
  onVariablePrompt,
) => {
  // Escape HTML content to prevent XSS attacks
  const escapeHtml = useCallback((text) => {
    try {
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    } catch (error) {
      console.error("Error escaping HTML:", error);
      return String(text).replace(/[&<>"']/g, (char) => {
        const entities = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "\"": "&quot;",
          "'": "&#39;",
        };
        return entities[char];
      });
    }
  }, []);

  // Extract plain text content from HTML, removing all tags
  const extractPlainText = useCallback((html) => {
    try {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      return tempDiv.textContent || tempDiv.innerText || "";
    } catch (error) {
      console.error("Error extracting plain text:", error);
      return "";
    }
  }, []);

  // Find all variables in the editor content using regex pattern matching
  const getAllVariables = useCallback(() => {
    if (!editorRef.current) return [];

    try {
      // Get both HTML and plain text content for comprehensive detection
      const htmlContent = editorRef.current.innerHTML || "";
      const textContent = editorRef.current.textContent || "";

      // Escape delimiters for regex
      const escapedPrefix = variablePrefix.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );
      const escapedSuffix = variableSuffix.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );
      const regex = new RegExp(
        `${escapedPrefix}([a-zA-Z_][a-zA-Z0-9_]*)${escapedSuffix}`,
        "g",
      );

      const variables = new Set();

      // Check both HTML and text content
      [htmlContent, textContent].forEach((content) => {
        let match;
        while ((match = regex.exec(content)) !== null) {
          variables.add(match[1]);
        }
      });

      return Array.from(variables);
    } catch (error) {
      console.error("Error extracting variables:", error);
      return [];
    }
  }, [editorRef, variablePrefix, variableSuffix]);

  // Replace variables in editor content with provided values
  const generatePopulatedContent = useCallback(
    (variableValues) => {
      if (!editorRef.current) return "";

      try {
        let content = editorRef.current.innerHTML;

        // Replace each variable with its value
        for (const [variable, value] of Object.entries(variableValues)) {
          const escapedPrefix = variablePrefix.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&",
          );
          const escapedSuffix = variableSuffix.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&",
          );
          const regex = new RegExp(
            `${escapedPrefix}${variable}${escapedSuffix}`,
            "g",
          );

          // Escape HTML to prevent XSS
          const escapedValue = escapeHtml(value);
          content = content.replace(regex, escapedValue);
        }

        return content;
      } catch (error) {
        console.error("Error generating populated content:", error);
        return "";
      }
    },
    [editorRef, variablePrefix, variableSuffix, escapeHtml],
  );

  // Prompt user for variable values and generate populated content
  const populateVariables = useCallback(async () => {
    try {
      const variables = getAllVariables();

      if (variables.length === 0) {
        alert(
          `No variables found in the template. Insert variables using the format ${variablePrefix}variable_name${variableSuffix}`,
        );
        return null;
      }

      const variableValues = {};
      let allValuesProvided = true;

      // Prompt for each variable value using custom or default prompt
      for (const variable of variables) {
        let value;

        if (onVariablePrompt) {
          // Use custom prompt function provided by user
          try {
            value = await onVariablePrompt(
              variable,
              variablePrefix,
              variableSuffix,
            );
          } catch (error) {
            console.error("Error with custom variable prompt:", error);
            return null;
          }
        } else {
          // Fall back to browser prompt
          value = prompt(
            `Enter value for ${variablePrefix}${variable}${variableSuffix}:`,
          );
        }

        if (value === null || value === undefined) {
          // User cancelled
          return null;
        }
        if (value === "") {
          allValuesProvided = false;
        }
        variableValues[variable] = String(value);
      }

      if (!allValuesProvided) {
        const proceed = confirm(
          "Some variables were left empty. Continue anyway?",
        );
        if (!proceed) return null;
      }

      // Generate the populated content
      const populatedContent = generatePopulatedContent(variableValues);

      return {
        html: populatedContent,
        variables: variableValues,
        plainText: extractPlainText(populatedContent),
      };
    } catch (error) {
      console.error("Error populating variables:", error);
      alert("An error occurred while populating variables. Please try again.");
      return null;
    }
  }, [
    getAllVariables,
    generatePopulatedContent,
    extractPlainText,
    variablePrefix,
    variableSuffix,
    onVariablePrompt,
  ]);

  // Insert a new variable placeholder at the current cursor position
  const insertVariable = useCallback(
    (currentRange, saveSelection, restoreSelection, updateContent) => {
      try {
        saveSelection();
        const variableName = prompt("Enter variable name:");
        if (!variableName || !variableName.trim()) return;

        // Input validation - only allow valid variable names
        const trimmedName = variableName.trim();
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmedName)) {
          alert(
            "Variable names must start with a letter or underscore and contain only letters, numbers, and underscores.",
          );
          return;
        }

        const selection = window.getSelection();
        if (currentRange) {
          selection.removeAllRanges();
          selection.addRange(currentRange);
        }

        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

        if (range) {
          // Insert as plain text (bulletproof approach)
          const variableText = `${variablePrefix}${trimmedName}${variableSuffix}`;
          const textNode = document.createTextNode(variableText);

          range.deleteContents();
          range.insertNode(textNode);

          // Move cursor after the variable
          const newRange = document.createRange();
          newRange.setStartAfter(textNode);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);

          updateContent();
        }
      } catch (error) {
        console.error("Error inserting variable:", error);
        alert("An error occurred while inserting the variable.");
      }
    },
    [variablePrefix, variableSuffix],
  );

  return {
    getAllVariables,
    generatePopulatedContent,
    populateVariables,
    insertVariable,
    extractPlainText,
    escapeHtml,
  };
};
