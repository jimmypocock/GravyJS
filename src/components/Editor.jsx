import React, { forwardRef, useCallback } from "react";

const Editor = forwardRef(
  (
    {
      placeholder,
      className = "",
      onInput,
      onKeyDown,
      onMouseUp,
      "aria-label": ariaLabel,
    },
    ref,
  ) => {
    // Debounced input handler
    let inputTimeout;
    const handleInput = useCallback(
      (e) => {
        clearTimeout(inputTimeout);
        inputTimeout = setTimeout(() => {
          if (onInput) {
            onInput(e);
          }
        }, 100);
      },
      [onInput],
    );

    return (
      <div
        ref={ref}
        className={`gravy-content ${className}`}
        contentEditable
        suppressContentEditableWarning={true}
        onInput={handleInput}
        onKeyDown={onKeyDown}
        onMouseUp={onMouseUp}
        data-placeholder={placeholder}
        role="textbox"
        aria-multiline="true"
        aria-label={ariaLabel || placeholder}
        tabIndex={0}
      />
    );
  },
);

Editor.displayName = "Editor";

export default Editor;
