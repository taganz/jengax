// rendering.js
import { pieces, piece_width, piece_border, getWorldXBounds } from './pieces.js';
import { qHeld } from './input.js';
import { screenToWorldX, screenToWorldY, worldToScreenX, worldToScreenY } from './camera.js';
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

export function setDrawModeHand() { drawMode = 'hand-drawn'; console.log('Draw mode set to Hand Drawn')};
export function setDrawModeSolid() {drawMode = 'solid';console.log('Draw mode set to Solid')}
let drawMode = 'hand-drawn'; // 'hand-drawn' or 'solid'

export function draw() {
  if (drawMode==="hand-drawn" && !scribble) initScribble();
  background(background_color);
  rectMode(CENTER);  // 
  // Camera transform (viewScale, viewOffsetX, viewOffsetY)
  push();
    // 1) lleva el origen pantalla a la línea del suelo:
    //    — suelo en pantalla está en bottom, o puedes usar viewOffsetY
    translate(viewOffsetX, viewOffsetY + height);
    // after scaling, origin is at bottom left of screen (plus offset), and Y is inverted
    scale(viewScale, -viewScale);
    

    drawGround();          
    switch (drawMode) {
      case 'solid': 
        pieces.forEach(drawPiece);
        break;
      case 'hand-drawn':
        pieces.forEach(drawHandDrawnPiece);  
        break;
      default:  
        console.log(`Invalid drawMode: ${drawMode}`);
        pieces.forEach(drawHandDrawnPiece);
    }
  pop();
  
  if (qHeld) {
    drawPositionAtCursor();
  }

  if (!qHeld) noLoop();
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
