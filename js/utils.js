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
  console.log(`World bounds: ${worldMinX.toFixed(1)}, ${worldMaxX.toFixed(1)}`);
  console.log("World bounds to screen:", worldToScreenX(worldMinX).toFixed(1), worldToScreenX(worldMaxX).toFixed(1));
  console.log(`Cursor position: (${mouseX.toFixed(1)}, ${mouseY.toFixed(1)})`);
  console.log(`World position: (${screenToWorldX(mouseX).toFixed(1)}, ${screenToWorldY(mouseY).toFixed(1)})`);
  console.log(`Camera scale: ${viewScale.toFixed(1)}`);
  console.log(`Camera offset: (${viewOffsetX.toFixed(1)}, ${viewOffsetY.toFixed(1)})`);
}

export function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
}

