// mobile.js
// Mobile-friendly input: tap to place, long press to delete, pinch-to-zoom, two-finger pan

import { screenToWorldX, screenToWorldY, worldToScreenX, worldToScreenY, zoomAt } from './camera.js';
import { piece_width, doPiece, lastPiece } from './pieces/pieces.js';
import { inputMode } from './ui.js';
import { resizeCanvasIfFull } from './rendering.js';

let isDragging = false;
let lastTouches = [];
let tapTimer = null;
let longPressDetected = false;

function mouseIsInsideCanvas() {
  return mouseX >= 0 &&
         mouseX <= width &&
         mouseY >= 0 &&
         mouseY <= height;
}

export function touchStarted() {
  if (inputMode == 'desktop') return;
  if (!mouseIsInsideCanvas()) return;  // ignore clicks off-canvas
  if (touches.length === 1) {
    tapTimer = setTimeout(() => {
      longPressDetected = true;
    }, 500); // 500ms long press
    longPressDetected = false;
  }
  lastTouches = [...touches];
  return false;
}

export function touchEnded() {
if (inputMode == 'desktop') return;
if (!mouseIsInsideCanvas()) return;  // ignore clicks off-canvas

  clearTimeout(tapTimer);


  let wx = screenToWorldX(mouseX);
  let wy = screenToWorldY(mouseY);
  if (touches.length === 0 && longPressDetected) {
      // long tap
  }
  else {    

    doPiece(wx, wy);
    resizeCanvasIfFull();
  }
  redraw();

  lastTouches = [...touches];
  longPressDetected = false;
  return false;
}


/*
// --> doesn't work!!
export function touchMoved(event) {
  if (inputMode == 'desktop') return;
  event.preventDefault(); // evita que el navegador faci zoom/pan del document
  clearTimeout(tapTimer);

  if (touches.length === 2) {
    // pinch and pan
    const [a, b] = touches;
    const [la, lb] = lastTouches;
    if (!la || !lb) return;

    // Pan
    const dx = ((a.x + b.x) / 2) - ((la.x + lb.x) / 2);
    const dy = ((a.y + b.y) / 2) - ((la.y + lb.y) / 2);
    viewOffsetX += dx;
    viewOffsetY += dy;

    // Zoom
    const d1 = dist(a.x, a.y, b.x, b.y);
    const d0 = dist(la.x, la.y, lb.x, lb.y);
    const zoomFactor = d1 / d0;
    const centerX = (a.x + b.x) / 2;
    const centerY = (a.y + b.y) / 2;
    zoomAt(centerX, centerY, zoomFactor);

    lastTouches = [...touches];
    redraw();
  }
}
*/