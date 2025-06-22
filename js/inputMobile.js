// mobile.js
// Mobile-friendly input: tap to place, long press to delete, pinch-to-zoom, two-finger pan

import { screenToWorldX, screenToWorldY, zoomAt, viewOffsetX, viewOffsetY } from './camera.js';
import { getPieceIdUnderWorld, removeLastPiece, deletePiece, addPiece } from './pieces.js';
import { inputMode } from './ui.js';

let isDragging = false;
let lastTouches = [];
let tapTimer = null;
let longPressDetected = false;

export function touchStarted() {
  if (inputMode == 'desktop') return;
  if (touches.length === 1) {
    tapTimer = setTimeout(() => {
      longPressDetected = true;
    }, 500); // 500ms long press
    longPressDetected = false;
  }
  lastTouches = [...touches];
}

export function touchEnded() {
if (inputMode == 'desktop') return;
  clearTimeout(tapTimer);


    const wx = screenToWorldX(mouseX);
    const wy = screenToWorldY(mouseY);

  if (touches.length === 0 && longPressDetected) {
      // longPress - delete piece
    const index = getPieceIdUnderWorld(wx, wy);
    if (index != null) {
        deletePiece(index);
    } else {
        removeLastPiece();
    }
  }
  else {    
       addPiece(wx, wy);
  }
  redraw();

  lastTouches = [...touches];
  longPressDetected = false;
}


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
