// rendering.js
import { pieces, piece_width, piece_border, getWorldXBounds, clearPieces } from './pieces.js';
import { qHeld } from './input.js';
import { resetCamera, screenToWorldX, screenToWorldY, worldToScreenX, worldToScreenY } from './camera.js';
import { viewScale, viewOffsetX, viewOffsetY } from './camera.js';

let ground_border  = 1;

const ground_color     = '#505050';   
const piece_color      = '#964B00';
const background_color = '#F0F0F0';

let scribble;
 
function initScribble() {
  scribble = new Scribble();
  scribble.bowing = 0.5;
  scribble.roughness = 1.2;
}

let autoDraw = false;
let autoDrawCurrentPieceId;
export function toogleAutoDraw(){
  
  if (autoDraw) setAutoDrawOff();
  else setAutoDrawOn();
}
function setAutoDrawOn() {
  autoDraw = true;
  autoDrawCurrentPieceId = 0;
  background(background_color);
  const x = pieces.length;
  const frate = x => int(x <= 20 ? 10 : x >= 100 ? 60 : map(x, 20, 100, 10, 60));
  console.log(`num pieces = ${x} and frame rate set to ${frate(x)}`);
  frameRate(frate(x));
  noLoop();
}
function setAutoDrawOff() {
  autoDraw = false;
  frameRate();
  loop();
}

export function setDrawModeHand() { drawMode = 'hand-drawn'; console.log('Draw mode set to Hand Drawn')};
export function setDrawModeSolid() {drawMode = 'solid';console.log('Draw mode set to Solid')}
let drawMode = 'hand-drawn'; // 'hand-drawn' or 'solid'

export function draw() {
  if (drawMode==="hand-drawn" && !scribble) initScribble();
  if (!autoDraw) background(background_color);
  rectMode(CENTER);  // 
  // Camera transform (viewScale, viewOffsetX, viewOffsetY)
  push();
    // 1) lleva el origen pantalla a la línea del suelo:
    //    — suelo en pantalla está en bottom, o puedes usar viewOffsetY
    translate(viewOffsetX, viewOffsetY + height);
    // after scaling, origin is at bottom left of screen (plus offset), and Y is inverted
    scale(viewScale, -viewScale);
    

    drawGround();          
    let drawModeFunction;
    switch (drawMode) {
      case 'solid': 
        drawModeFunction = drawPiece;
        break;
      case 'hand-drawn':
        drawModeFunction = drawHandDrawnPiece;  
        break;
      default:  
        console.log(`Invalid drawMode: ${drawMode}`);
        drawModeFunction = drawHandDrawnPiece;
    }
  if (!autoDraw) {
    pieces.forEach(drawModeFunction);  
   if (!qHeld) noLoop();
  } else {
    drawModeFunction(pieces[autoDrawCurrentPieceId++]);
    if (autoDrawCurrentPieceId == pieces.length) { 
      setAutoDrawOff();
    } else {
      loop();
    }
  }
  pop();
  
  if (qHeld) {
    drawPositionAtCursor();
  }
}

export function drawGround() { //width, piece_width, ground_border, ground_color) {
  stroke(0); 
  strokeWeight(ground_border);
  fill(ground_color);
  // ground spans entire world 
  let worldMinX, worldMaxX;
  ({ worldMinX, worldMaxX } = getWorldXBounds());
  let smin = min (screenToWorldX(-width/2), worldMinX); // left edge in screen coords
  let smax = max (screenToWorldX(width/2), worldMaxX); // right edge in screen coords 
  let groundWidth = smax - smin; // width in screen coords
  rect(width/2+(smin+smax)/2, 0, groundWidth, piece_width); 
  //console.log('canvas: ', width, height);
  //console.log(`World bounds: ${worldMinX}, ${worldMaxX}`);
  //console.log(`smin, smax, groundWidth: ${smin}, ${smax}, ${groundWidth}`);
  
}

export function drawPiece(p) { //}, piece_border, piece_color) {
  stroke(0); 
  strokeWeight(piece_border);
  fill(piece_color);
  rect(p.x, p.y, p.width, p.height);
}



export function drawHandDrawnPiece(p) {
  if (!scribble) { console.log('Scribble not initialized'); return};
  let x = p.x, y = p.y, w = p.width, h = p.height;
  const xCoords = [x - w / 2, x + w / 2, x + w / 2, x - w / 2];
  const yCoords = [y - h / 2, y - h / 2, y + h / 2, y + h / 2];
  stroke(0);
  noFill();
  scribble.scribbleFilling(xCoords, yCoords, 2);
  scribble.scribbleRect(x, y, w, h);
  scribble.scribbleFilling( xCoords, yCoords, 2, PI/8 );

}

export function drawTooltip(label, sx, sy) {
  textSize(12);
  const pad = 6, h = 20;
  const w = textWidth(label) + pad*2;
  const tx = sx + 10, ty = sy - h - 5;
  push(); 
    rectMode(CORNER);
    fill(255);
    stroke(0);
    strokeWeight(1);
    rect(tx, ty, w, h, 5);
  pop();
  noStroke(); fill(0);
  textAlign(LEFT, CENTER);
  text(label, tx + pad, ty + h/2);
}

function drawPositionAtCursor() {
  let wx = screenToWorldX(mouseX), wy = screenToWorldY(mouseY);
  let label = `World: ${int(wx)}, ${int(wy)}, Screen: ${int(mouseX)}, ${int(mouseY)}`;
  drawTooltip(label, mouseX, mouseY);
}

export function clearCanvas() {
  clearPieces();
  background(background_color);
  autoDraw = false;
  resetCamera();
}

/**
 * Returns a scaled PNG data URL of the canvas with max width or height = maxSize
 * @param {number} maxSize - Maximum width or height in pixels
 * @returns {string} - A base64 PNG string
 */
export function getScaledImagePNG(maxSize) {
  // 1. Get the original canvas
  const originalCanvas = document.querySelector('canvas');
  const ow = originalCanvas.width;
  const oh = originalCanvas.height;

  // 2. Calculate scaled dimensions
  const scale = Math.min(1, maxSize / Math.max(ow, oh));
  const sw = ow * scale;
  const sh = oh * scale;

  // 3. Create an offscreen canvas
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = sw;
  tempCanvas.height = sh;
  const ctx = tempCanvas.getContext('2d');

  // 4. Draw scaled content
  ctx.drawImage(originalCanvas, 0, 0, sw, sh);

  // 5. Return PNG data URL
  return tempCanvas.toDataURL('image/png');
}
