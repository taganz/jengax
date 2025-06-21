// io.js
import { pieces, loadPieces } from './pieces.js';
import { viewScale, viewOffsetX, viewOffsetY, setCamera } from './camera.js';
//import { fileInput } from './main.js';

let fileInput;  

// in main setup because it is p5.js specific
//export function initFileInput(handleFile) {
//  fileInput = createFileInput(handleFile);
//  fileInput.hide();
//}

export function setFileInput(input) {
  fileInput = input;  
  // Ensure the file input is hidden  
  fileInput.hide();
}

export function handleSave() {

  const state = {
    canvasWidth: width,
    canvasHeight: height,
    viewScale,
    viewOffsetX,
    viewOffsetY,
    pieces
  };
  let dayhour = makeSaveFilename();
  let jsonfilename = `jengax-${dayhour}.json`;
  let pngfilename = `jengax-${dayhour}`;

  saveJSON(state, jsonfilename);
  // 2) save the canvas as a PNG
  //    the first arg can be a p5.Graphics or 'canvas' name, 
  //    if omitted it uses the main canvas. 
  saveCanvas(pngfilename, 'png');
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
  setCamera(data.viewScale, data.viewOffsetX, data.viewOffsetY);
  loadPieces(data.pieces);  

    redraw();
  // Reset the fileInput so you can load *the same* file again
  fileInput.elt.value = null;
}

function makeSaveFilename() {
  const now   = new Date();
  const day   = String(now.getDate()).padStart(2, '0');
  const hour    = String(now.getHours()).padStart(2, '0');
  const minute  = String(now.getMinutes()).padStart(2, '0');

  // e.g. "jengax-state-14-09-05.png" for day=14, hour=09, minute=05
  return `${day}${hour}${minute}`;

}

export function loadSketchFromGallery(data) {
  if (data.renderStatus) {
    resizeCanvas(data.renderStatus.width, data.renderStatus.height);
    setCamera(data.renderStatus.viewScale, data.renderStatus.viewOffsetX, data.renderStatus.viewOffsetY);
  } else {
    resizeCanvas(800, 600); 
    setCamera(1, 0, 0);
  }
  loadPieces(data.pieces);  
  redraw();
}