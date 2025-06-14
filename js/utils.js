import { piece_sizes, piece_width, getWorldXBounds } from "./pieces.js";
import { screenToWorldX, screenToWorldY, worldToScreenX } from "./camera.js";
import { viewScale, viewOffsetX, viewOffsetY } from "./camera.js"; 

// utils.js
export function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}
export function getMinSizeToCover(dist) {
  for (let s of piece_sizes) {
    if (s * piece_width >= dist) return s;
  }
  return piece_sizes[piece_sizes.length - 1];
}

export function logCursorPosition() {
  console.log("---------------------------");
  let worldMinX, worldMaxX;
  ({ worldMinX, worldMaxX } = getWorldXBounds());
  console.log(`World bounds: ${worldMinX}, ${worldMaxX}`);
  console.log("World bounds to screen:", worldToScreenX(worldMinX), worldToScreenX(worldMaxX));
  console.log(`Cursor position: (${mouseX}, ${mouseY})`);
  console.log(`World position: (${screenToWorldX(mouseX)}, ${screenToWorldY(mouseY)})`);
  console.log(`Camera scale: ${viewScale}`);
  console.log(`Camera offset: (${viewOffsetX}, ${viewOffsetY})`);
}
