// rendering.js
import { pieces, piece_width, piece_border, getWorldXBounds } from './pieces.js';
import { click_points, qHeld } from './input.js';
import { screenToWorldX, screenToWorldY, worldToScreenX, worldToScreenY } from './camera.js';
import { viewScale, viewOffsetX, viewOffsetY } from './camera.js';

let ground_border  = 1;

const ground_color     = '#505050';   
const piece_color      = '#964B00';
const background_color = '#F0F0F0';


export function draw() {
  background(background_color);
  rectMode(CENTER);
  // Camera transform (viewScale, viewOffsetX, viewOffsetY)
  push();
    // 1) lleva el origen pantalla a la línea del suelo:
    //    — suelo en pantalla está en bottom, o puedes usar viewOffsetY
    translate(viewOffsetX, viewOffsetY + height);
    // 2) escala X y Y, pero en Y pon un - para invertir:
    scale(viewScale, -viewScale);

    drawGround();          
    pieces.forEach(drawPiece);
    drawAllClickPoints();
    //drawHoveredPointIfNeeded();
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
  // ground spans entire width in world coords
  // Un rect que en world va de X=0 hasta canvasWidth/viewScale,
  // y en Y de y=0 hacia “abajo” en world (que tras el -scale queda hacia pantalla → abajo)
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

export function drawAllClickPoints() {
  noStroke();
  const count = min(3, click_points.length);
  for (let i = 0; i < count; i++) {
    const pt = click_points[click_points.length - 1 - i];
    const size = 6 - i*2;
    const gray = i*80;
    fill(gray);
    ellipse(pt.x, pt.y, size, size);
  }
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
