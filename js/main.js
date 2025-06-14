

// main.js
import { draw as p5draw }            from './rendering.js';
import { mousePressed }  from './input.js';
import { keyPressed, keyReleased, handleZoom }   from './input.js';
import { handleFile, setFileInput } from './io.js';

export const snapToGrid = true;

// ─── p5.js setup & draw ─────────────────────────────────────────────────
export function setup() {
  createCanvas(800, 600);
  noLoop();

  //let worldMinX = width /2 / viewScale;   // --> SERIA / O *?
  //let worldMinY = height /2 / viewScale;  // --> SERIA / O *?

  // Prevent right-click menu
  let cnv = document.querySelector('canvas');
  cnv.addEventListener('contextmenu', e => e.preventDefault());

  // Prevent page scroll on canvas wheel
  //cnv.addEventListener('wheel', e => e.preventDefault(), { passive: false });
  cnv.addEventListener('wheel', handleZoom, { passive: false });

  // Hidden file input for “Load” (L). 
  // It is created here because it is a p5.js specific function
  setFileInput(createFileInput(handleFile));
 
}

// Bind p5’s globals
// p5js espera trobar els callbacks en window i ho posem com modul no ho troba

window.setup        = setup;
window.draw         = p5draw;
window.mousePressed = mousePressed;
//window.mouseWheel   = mouseWheel;
window.keyPressed   = keyPressed;
window.keyReleased  = keyReleased;


// --> no se qui fa servir aixo
//window.worldMaxX = () => worldMinX + width / viewScale;
//window.worldMinX = () => worldMinX;


