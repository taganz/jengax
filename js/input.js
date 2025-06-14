// input.js
import { piece_width, 
      deletePiece,
      getPieceUnderWorld,
      restoreLastDeletedPiece,
      removeLastPiece,
      tryHorizontalPiece,
      drawVerticalPiece
      } from './pieces.js';
import { zoomAt, pan } from './camera.js';
import { handleSave, handleLoad } from './io.js';
import { snapToGrid } from './main.js';
import { screenToWorldX, screenToWorldY } from './camera.js';
import { logCursorPosition } from './utils.js';

export let click_points     = [];

export let qHeld;

export function mousePressed() {
  let wx = screenToWorldX(mouseX);
  let wy = screenToWorldY(mouseY);
  if (snapToGrid) {
    wx = Math.round(wx / piece_width) * piece_width;
  }
  // borrar piezas
  if (mouseButton === RIGHT) {
    // Si hay una pieza bajo el cursor, la borra
    const res = getPieceUnderWorld(wx, wy);
    if (res) { 
      deletePiece(res.piece);
    }
    else {
      // si no borra la ultima dibujada
      removeLastPiece(); 
    }
    redraw(); 
    return false;
  }
  if (restoreLastDeletedPiece(wx, wy)) {
    redraw();
    return;
  }
  click_points.push({ x: wx, y: wy });
  
  if (tryHorizontalPiece(wx, wy)) {
    redraw();
    return;
  }

  drawVerticalPiece(wx, wy);
  redraw();
  return;
}


export function keyPressed() {
  // save state to file
  if (key==='S'||key==='s') { handleSave(); return; }
  // load state from file
  if (key==='L'||key==='l') { handleLoad(); return; }
  // position tooltip at cursor
  if (key==='Q'||key==='q') { qHeld=true; loop(); }
  // log cursor position
  if (key==='W'||key==='w') { logCursorPosition(); }
  // arrow keys for pan
  if (keyCode===LEFT_ARROW)  { pan(20,0); redraw(); }
  if (keyCode===RIGHT_ARROW) { pan(-20,0); redraw(); }
  if (keyCode===UP_ARROW)    { pan(0,20); redraw(); }
  if (keyCode===DOWN_ARROW)  { pan(0,-20); redraw(); }
}

export function keyReleased() {
  if (key==='Q'||key==='q') { qHeld=false; loop(); }
}


// --> decidir amb quina em quedo d'aquestes dues funcions

// zoom bajo el cursor
export function mouseWheel(event) {
  const factor = event.deltaY < 0 ? 1.1 : 0.9;
  zoomAt(mouseX, mouseY, factor);
  redraw(); 
  return false;
}

export function handleZoom(event) {
  // 1) stop the page from scrolling
  event.preventDefault();

  // 2) pick a zoom factor
  const factor = event.deltaY < 0 ? 1.1 : 0.9;

  // 3) apply it around the mouse cursor
  zoomAt(event.clientX, event.clientY, factor);
 
  // 4) redraw the sketch
  redraw();
  
  // 5) signal we handled it
  return false;
}