import React from "react";
import { useFocused, useSelected } from "slate-react";

export const VariableElement = ({ attributes, children, element }) => {
  const selected = useSelected();
  const focused = useFocused();
  
  const className = `gravy-variable ${
    selected && focused ? "gravy-variable-selected" : ""
  } ${
    element.populated ? "gravy-variable-populated" : ""
  }`;

  return (
    <span {...attributes} className={className} contentEditable={false}>
      {element.populated ? (
        <span className="gravy-variable-value">{element.populatedValue}</span>
      ) : (
        <span className="gravy-variable-placeholder">
          {element.prefix}{element.name}{element.suffix}
        </span>
      )}
      {children}
    </span>
  );
};