// input.js
import { piece_width, undoPiece, doPiece } from './pieces.js';
import { zoomAt, pan } from './camera.js';
import { handleSave, handleLoad } from './io.js';
import { snapToGrid } from './main.js';
import { screenToWorldX, screenToWorldY } from './camera.js';
import { logCursorPosition } from './utils.js';
import { setDrawModeHand, setDrawModeSolid, toogleAutoDraw } from './rendering.js';
import { inputMode } from './ui.js';

let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

export let qHeld;


function mouseIsInsideCanvas() {
  return mouseX >= 0 &&
         mouseX <= width &&
         mouseY >= 0 &&
         mouseY <= height;
}

export function mousePressed() {
  if (inputMode == 'touch') return;
  if (!mouseIsInsideCanvas()) return;  // ignore clicks off-canvas

  if (mouseButton === CENTER || (mouseButton === LEFT && keyIsDown(SHIFT))) {
    isDragging = true;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    posthog.capture('input_drag');
    return false; // prevent interaction
  }

  let wx = screenToWorldX(mouseX);
  let wy = screenToWorldY(mouseY);
  if (snapToGrid) {
    wx = Math.round(wx / piece_width) * piece_width;
    wy = Math.round(wy / piece_width) * piece_width;
  }
  // borrar piezas
  if (mouseButton === RIGHT) {
    undoPiece();
    redraw();
    return false;
  }

  
  doPiece(wx, wy);
  redraw();
  return false;
}

export function mouseReleased() {
 if (inputMode == 'touch') return;
  isDragging = false;
}

export function mouseDragged() {
  if (inputMode == 'touch') return;
  if (isDragging) {
    pan(mouseX - lastMouseX, mouseY - lastMouseY);
    lastMouseX = mouseX;  
    lastMouseY = mouseY;
    redraw();
  }
}

export function keyPressed() {
  if (inputMode == 'touch') return;
  // save state to file
  if (key==='S'||key==='s') { handleSave();   posthog.capture('input_save'); return; }
  // load state from file
  if (key==='L'||key==='l') { handleLoad();   posthog.capture('input_load'); return; }
  // position tooltip at cursor
  if (key==='Q'||key==='q') { qHeld=true;   posthog.capture('input_q_tooltip'); loop(); }
  // log cursor position
  if (key==='W'||key==='w') { logCursorPosition();   posthog.capture('input_w_log'); }
  // arrow keys for pan
  if (keyCode===LEFT_ARROW)  { pan(20,0); redraw();   posthog.capture('input_pan'); }
  if (keyCode===RIGHT_ARROW) { pan(-20,0); redraw(); posthog.capture('input_pan'); }
  if (keyCode===UP_ARROW)    { pan(0,20); redraw(); posthog.capture('input_pan'); }
  if (keyCode===DOWN_ARROW)  { pan(0,-20); redraw(); posthog.capture('input_pan'); }
  // draw mode
  if (key==='1') {setDrawModeHand(); redraw(); posthog.capture('input_draw_mode_1'); }
  if (key==='2') {setDrawModeSolid(); redraw(); posthog.capture('input_draw_mode_2'); }
  // auto draw
  if (key==='A' || key==='a') {toogleAutoDraw();redraw(); posthog.capture('input_auto_draw_toogle'); }
  

}

export function keyReleased() {
  if (inputMode == 'touch') return;
  if (key==='Q'||key==='q') { qHeld=false; loop(); }
}

export function handleZoom(event) {

  if (inputMode == 'touch') return;

  // 1) stop the page from scrolling if the user scrolls over the canvas
  event.preventDefault();

  // 2) pick a zoom factor
  //const sensitivity = 0.01;
  //const zoomFactor = 1 - event.delta * sensitivity;
  const zoomFactor = event.deltaY < 0 ? 1.03 : 0.97;

  // 3) apply it around the mouse cursor
  zoomAt(event.clientX, event.clientY, zoomFactor);
 
  // 4) redraw the sketch
  redraw();
  
  // 5) signal we handled it
  return false;
}