// io.js
import { pieces } from './pieces.js';
import { click_points } from './input.js';
import { viewScale, viewOffsetX, viewOffsetY } from './camera.js';
import { fileInput } from './main.js';

//export let fileInput;   --- no em deixa declarar aquí, ho fem a main.js

// in main setup because it is p5.js specific
//export function initFileInput(handleFile) {
//  fileInput = createFileInput(handleFile);
//  fileInput.hide();
//}

export function handleSave() {
  const state = {
    canvasWidth: width,
    canvasHeight: height,
    viewScale,
    viewOffsetX,
    viewOffsetY,
    pieces,
    click_points 
  };
  saveJSON(state, 'jengax-save.json');
}

export function handleLoad() {
  // Trigger the file input click to open the file dialog
  fileInput.elt.click();
  return;
}

export function handleFile(file) {
  if (file.subtype !== 'json') return;
  if (!confirm('Do you want to replace the current drawing?')) {
    // Si cancela, limpiar el input para poder recargar el mismo fichero luego
    fileInput.elt.value = null;
    return;
  }
  const data = file.data;
  resizeCanvas(data.canvasWidth, data.canvasHeight);
  viewScale = data.viewScale;
  viewOffsetX = data.viewOffsetX;
  viewOffsetY = data.viewOffsetY;
  pieces.splice(0, pieces.length, ...data.pieces);  // --> fer un setter i no exportar pieces[]
  click_points.splice(0, click_points.length, ...data.click_points);
  redraw();
  // Reset the fileInput so you can load *the same* file again
  fileInput.elt.value = null;
}