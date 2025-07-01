import React, { useState, useMemo } from "react";
import { render } from "@testing-library/react";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";

describe("Slate Basic Test", () => {
  test("can create a basic Slate editor", () => {
    const SimpleEditor = () => {
      const editor = useMemo(() => withReact(createEditor()), []);
      const [value, setValue] = useState([
        {
          type: "paragraph",
          children: [{ text: "Hello World" }],
        },
      ]);
      
      return (
        <Slate 
          editor={editor} 
          value={value} 
          onChange={newValue => setValue(newValue)}
        >
          <Editable role="textbox" />
        </Slate>
      );
    };
    
    const { getByRole } = render(<SimpleEditor />);
    
    const editable = getByRole("textbox");
    expect(editable).toBeInTheDocument();
    // With mocked Slate, we can't test content rendering
  });
});