import React, { forwardRef } from "react";
import GravyJSCore from "./GravyJS.js";
import "./GravyJS.css";

// Default export with styles
const GravyJS = forwardRef((props, ref) => {
  if (props.noStyles) {
    return <GravyJSCore {...props} ref={ref} />;
  }
  
  // This component includes the CSS import
  return <GravyJSCore {...props} ref={ref} />;
});

GravyJS.displayName = "GravyJS";

// Named export for unstyled version
export const GravyJSUnstyled = GravyJSCore;

// Default export includes styles
export default GravyJS;