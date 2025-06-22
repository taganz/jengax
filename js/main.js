

// main.js
import { draw as p5draw }            from './rendering.js';
import { mousePressed, mouseReleased, mouseDragged }  from './input.js';
import { keyPressed, keyReleased, handleZoom }   from './input.js';
import { handleFile, setFileInput } from './io.js';
import { initUI } from './ui.js';
import { touchEnded, touchMoved, touchStarted } from './inputMobile.js';

export let cnv; // p5.js canvas element
export const snapToGrid = true; 


// ─── p5.js setup & draw ─────────────────────────────────────────────────
export function setup() {

  createCanvasAdaptedToWindow();
  noLoop();

  initUI();

  // Prevent right-click menu
  let cnv2 = document.querySelector('canvas');   // cnv es un p5.Element
  cnv2.addEventListener('contextmenu', e => e.preventDefault());

  // Prevent page scroll on canvas wheel
  //cnv.addEventListener('wheel', e => e.preventDefault(), { passive: false });
  cnv2.addEventListener('wheel', handleZoom, { passive: false });

    // Hidden file input for “Load” (L). 
  // It is created here because it is a p5.js specific function
  setFileInput(createFileInput(handleFile));
}

function createCanvasAdaptedToWindow() {
  let canvasWidth = min(800, windowWidth);
  let canvasHeight = min(600, windowHeight);
  console.log(`canvas created: ${canvasWidth}x${canvasHeight}`);
  cnv = createCanvas(canvasWidth, canvasHeight);
}

function windowResized() {
  let canvasWidth = min(800, windowWidth);
  let canvasHeight = min(600, windowHeight);
  console.log(`canvas resized: ${canvasWidth}x${canvasHeight}`);
  resizeCanvas(canvasWidth, canvasHeight);
}
// Bind p5’s globals
// p5js espera trobar els callbacks en window i ho posem com modul no ho troba

window.setup        = setup;
window.draw         = p5draw;
window.windowResized  = windowResized;
window.mousePressed = mousePressed;
window.mouseReleased = mouseReleased;
window.mouseDragged = mouseDragged;
//window.mouseWheel   = mouseWheel;
window.keyPressed   = keyPressed;
window.keyReleased  = keyReleased;
window.touchStarted = touchStarted;
//window.touchMoved = touchMoved;
window.touchEnded = touchEnded;


// --> no se qui fa servir aixo
//window.worldMaxX = () => worldMinX + width / viewScale;
//window.worldMinX = () => worldMinX;


