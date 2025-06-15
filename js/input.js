// input.js
import { piece_width, 
      deletePiece,
      getPieceIdUnderWorld,
      restoreLastDeletedPiece,
      removeLastPiece,
      addHorizontalPieceIfPossible,
      drawVerticalPiece
      } from './pieces.js';
import { zoomAt, pan } from './camera.js';
import { handleSave, handleLoad } from './io.js';
import { snapToGrid } from './main.js';
import { screenToWorldX, screenToWorldY } from './camera.js';
import { logCursorPosition } from './utils.js';


export let qHeld;


function mouseIsInsideCanvas() {
  return mouseX >= 0 &&
         mouseX <= width &&
         mouseY >= 0 &&
         mouseY <= height;
}
export function mousePressed() {
  if (!mouseIsInsideCanvas()) return;  // ignore clicks off-canvas
  let wx = screenToWorldX(mouseX);
  let wy = screenToWorldY(mouseY);
  if (snapToGrid) {
    wx = Math.round(wx / piece_width) * piece_width;
  }
  // borrar piezas
  if (mouseButton === RIGHT) {
    // Si hay una pieza bajo el cursor, la borra
    const index = getPieceIdUnderWorld(wx, wy);
    if (index) { 
      //console.log('Borrando pieza id: ', index, ' at ', wx, wy);
      deletePiece(index);
    }
    else {
      // si no borra la ultima dibujada
      //console.log(`Borrando ultima pieza dibujada at `);
      removeLastPiece(); 
    }
    redraw(); 
    return false;
  }
  if (restoreLastDeletedPiece(wx, wy)) {
    redraw();
    return;
  }
  
  if (addHorizontalPieceIfPossible(wx, wy)) {
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