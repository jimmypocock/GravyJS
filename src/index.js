import React, { forwardRef } from "react";
import SlateGravyJS from "./slate-editor/SlateGravyJS.js";
import "./GravyJS.css";

// Default export with styles
const GravyJS = forwardRef((props, ref) => {
  console.log('[GravyJS] Props received:', props);
  return <SlateGravyJS {...props} ref={ref} />;
});

GravyJS.displayName = "GravyJS";

// Default export includes styles
export default GravyJS;

// Also export as named export for better compatibility
export { GravyJS };