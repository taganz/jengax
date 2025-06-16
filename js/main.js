

// main.js
import { draw as p5draw }            from './rendering.js';
import { mousePressed, mouseReleased, mouseDragged }  from './input.js';
import { keyPressed, keyReleased, handleZoom }   from './input.js';
import { handleFile, setFileInput } from './io.js';
import { initUI } from './ui.js';


export let cnv; // p5.js canvas element
export let cnv2;  // no se quin es el canvas de veritat. 
export const snapToGrid = true; 



// ─── Firebase Auth ──────────────────────────────────────────────────────



// ─── p5.js setup & draw ─────────────────────────────────────────────────
export function setup() {
  cnv2 = createCanvas(800, 600);
  noLoop();

  initUI();

  // Prevent right-click menu
  cnv = document.querySelector('canvas');   // cnv es un p5.Element
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
window.mouseReleased = mouseReleased;
window.mouseDragged = mouseDragged;
//window.mouseWheel   = mouseWheel;
window.keyPressed   = keyPressed;
window.keyReleased  = keyReleased;


// --> no se qui fa servir aixo
//window.worldMaxX = () => worldMinX + width / viewScale;
//window.worldMinX = () => worldMinX;


