// JENGAX 
// A simple sketching tool inspired by Townscaper and Jenga
// Ricard Dalmau, 2025
// github: https://github.com/taganz/jengax
// --------------------------------------------------
// Left-click to place a piece at the clicked position.
// Right-click to remove a specific piece or undo last piece addition
// Mouse wheel Zoom in/out the canvas under the cursor
// Arrow keys Pan the canvas
// Hold Q to show current mouse coordinates
// S to save the current drawing to a JSON file
// L to load a drawing from a JSON file
// Vertical pieces rest on the ground or on the top of other pieces.
// Horizontal pieces can only be placed if two supporting vertical pieces are aligned and close enough.

// ─── Configuration ─────────────────────────────────────────────────────
let piece_width    = 20;
let piece_sizes    = [1, 2, 3, 5, 8, 13];
let ground_border  = 1;
let piece_border   = 1;
const snapToGrid = true;
const ground_color     = '#505050';
const piece_color      = '#964B00';
const background_color = '#F0F0F0';

// ─── World & Camera State ──────────────────────────────────────────────
let viewScale    = 1;
let viewOffsetX  = 0;
let viewOffsetY  = 0;
let worldMinX;
let worldMinY;
// ─── Game State ─────────────────────────────────────────────────────────
let pieces           = [];
let click_points     = [];
let lastDeletedPiece = null;
let qHeld            = false;

// ─── File I/O ────────────────────────────────────────────────────────────
let fileInput;

// ─── p5.js setup & draw ─────────────────────────────────────────────────
export function setup() {
  createCanvas(800, 600);
  rectMode(CENTER);
  noLoop();

  let worldMinX = width /2 / viewScale;   // --> SERIA / O *?
  let worldMinY = height /2 / viewScale;  // --> SERIA / O *?

  // Prevent right-click menu
  let cnv = document.querySelector('canvas');
  cnv.addEventListener('contextmenu', e => e.preventDefault());

  // Prevent page scroll on canvas wheel
  cnv.addEventListener('wheel', e => e.preventDefault());

  // Hidden file input for “Load” (L)
  fileInput = createFileInput(handleFile);
  fileInput.hide();
}

export function draw() {
  background(background_color);

  // compute ground Y in screen coords:
  let groundYScreen = viewOffsetY + height;
  /*
  rectMode(CORNER);
  rect(
    0,                      // x
    groundYScreen,          // y
    width,                 // w
    height - groundYScreen // h (fills from ground down)
  );
  */
  // Camera transform
  push();
    // 1) lleva el origen pantalla a la línea del suelo:
    //    — suelo en pantalla está en bottom, o puedes usar viewOffsetY
    translate(viewOffsetX, viewOffsetY + height);
    // 2) escala X y Y, pero en Y pon un - para invertir:
    scale(viewScale, -viewScale);

    // ahora en world‐space:
    //   (0,0) → suelo
    //   Y positivo → hacia arriba
    drawGround();           // dibuja un suelo en y=0
    pieces.forEach(drawPiece);
    drawAllClickPoints();
    //drawHoveredPointIfNeeded();
  pop();

  drawPositionIfKeyQPressed();

  if (!qHeld) noLoop();
}

// ─── Drawing Helpers ────────────────────────────────────────────────────
function drawGround() {
  stroke(0);
  strokeWeight(ground_border);
  fill(ground_color);
  // ground spans entire width in world coords
  // Un rect que en world va de X=0 hasta canvasWidth/viewScale,
  // y en Y de y=0 hacia “abajo” en world (que tras el -scale queda hacia pantalla → abajo)
  ({ worldMinX, worldMaxX } = getWorldXBounds());
  rect(width/2, 0, width/viewScale, -piece_width);
}

function drawPiece(p) {
  stroke(0);
  strokeWeight(piece_border);
  fill(piece_color);
  rect(p.x, p.y, p.width, p.height);
}

/*
function drawHoveredPointIfNeeded() {
  let hover = getHoveredPoint();
  if (hover) {
    let label = `${int(hover.x)}, ${int(hover.y)}`;
    drawTooltipAtCursor(label);
  }
}
*/
function drawPositionIfKeyQPressed() {
  if (qHeld) {
    let wx = screenToWorldX(mouseX), wy = screenToWorldY(mouseY);
    let label = `${int(wx)}, ${int(wy)}`;
    drawTooltipAtCursor(label);
  }
}

function drawAllClickPoints() {
  noStroke();
  let count = min(3, click_points.length);
  for (let i = 0; i < count; i++) {
    let pt   = click_points[click_points.length - 1 - i];
    let size = 6 - i * 2;
    let gray = i * 80;
    fill(gray);
    ellipse(pt.x, pt.y, size, size);
  }
}



function getHoveredPoint() {
  let wx = screenToWorldX(mouseX), wy = screenToWorldY(mouseY);
  for (let pt of click_points) {
    if (dist(wx, wy, pt.x, pt.y) < 6/viewScale) return pt;
  }
  return null;
}

function drawTooltipAtCursor(label) {
  textSize(12);
  let pad = 6, h = 20;
  let w  = textWidth(label) + pad*2;
  let tx = mouseX + 10, ty = mouseY - h - 5;

  push();
    rectMode(CORNER);
    fill(255);
    stroke(0);
    strokeWeight(1);
    rect(tx, ty, w, h, 5);
  pop();

  noStroke();
  fill(0);
  textAlign(LEFT, CENTER);
  text(label, tx + pad, ty + h/2);
}

// ─── User input ────────────────────────────────────────────────

function keyPressed() {
  // Save state
  if (key === 'S' || key === 's') {
    let state = {
      canvasWidth:  width,
      canvasHeight: height,
      viewScale,
      viewOffsetX,
      viewOffsetY,
      pieces,
      click_points
    };
    saveJSON(state, 'jengax-save.json');
    return;
  }
  // Load state
  if (key === 'L' || key === 'l') {
    fileInput.elt.click();
    return;
  }
  // Q for tooltip
  if (key === 'Q' || key === 'q') {
    qHeld = true;
    loop();
  }
  // Arrow keys for pan
  if (keyCode === LEFT_ARROW)  { viewOffsetX += 20; redraw(); }
  if (keyCode === RIGHT_ARROW) { viewOffsetX -= 20; redraw(); }
  if (keyCode === UP_ARROW)    { viewOffsetY += 20; redraw(); }
  if (keyCode === DOWN_ARROW)  { viewOffsetY -= 20; redraw(); }
}


function keyReleased() {
  if (key === 'Q' || key === 'q') {
    qHeld = false;
    loop();
  }
}

function mousePressed() {
  
  let wx = screenToWorldX(mouseX),
      wy = screenToWorldY(mouseY);

  // snap to grid en X
 if (snapToGrid) {
   wx = Math.round(wx / piece_width) * piece_width;
 }

 // borrar piezas
  if (mouseButton === RIGHT) {
    const result = getPieceUnderWorld(wx, wy);
    if (result) {
      lastDeletedPiece = result.piece;
      pieces.splice(result.index, 1);
    } else {
      lastDeletedPiece = null;
      removeLastPiece();
    }
    redraw();
    return false;
  }

  if (restoreLastDeletedPiece(wx, wy)) {
    redraw();
    return; 
  }
  lastDeletedPiece = null;

  click_points.push({ x: wx, y: wy });

  let horizontal = getHorizontalSupport(wx, wy);

  // Si hay soporte horizontal, dibuja una pieza horizontal
  if (horizontal) {
    let cX = (horizontal.left.x + horizontal.right.x)/2;   // centro entre los dos soportes 
    let tY = horizontal.left.y + horizontal.left.height/2;  // top Y de los soportes
    let w  = abs(horizontal.right.x - horizontal.left.x) + 2*piece_width;
    let h  = piece_width;
    pieces.push({ x: cX, y: tY + h/2, width: w, height: h, horizontal: true });
    redraw();
    return;
  }

  let support = getHighestPieceBelow(wx, wy);
  let baseY   = support
                ? support.y + support.height/2
                : 0;

  let needed = baseY - wy;
  let size   = getMinSizeToCover(abs(needed));
  let pH     = size * piece_width;
  let cY     = baseY + pH/2;
  pieces.push({ x: wx, y: cY, width: piece_width, height: pH, horizontal: false });
  redraw();
}

// zoom bajo el cursor
function mouseWheel(event) {
  let factor = event.deltaY < 0 ? 1.1 : 0.9;

  // punto world antes de zoom
  let wx = screenToWorldX(mouseX),
      wy = screenToWorldY(mouseY);

  // actualiza escala
  viewScale *= factor;

  // recalc offset para mantener (wx,wy) bajo el cursor
  viewOffsetX = mouseX - wx * viewScale;
 // viewOffsetY = mouseY - wy * viewScale;

  redraw();
  return false;
}
function mouseWheel_OLD(event) {
  let factor = event.deltaY < 0 ? 1.1 : 0.9;

  // punto world antes de zoom
  let wx = screenToWorldX(mouseX),
      wy = screenToWorldY(mouseY);

  // actualiza escala
  viewScale *= factor;

  // recalc offset para mantener (wx,wy) bajo el cursor
  viewOffsetX = mouseX - wx * viewScale;
  viewOffsetY = mouseY - wy * viewScale;

  redraw();
  return false;
}

function removePieceUnderMouse() {
  const result = getPieceUnderMouse();
  if (result) {
    lastDeletedPiece = result.piece;
    pieces.splice(result.index, 1);
    redraw();
  }
}


function getHighestPieceBelow(x, y) {
  let best = null;
  let bestTop = -Infinity;

  for (let p of pieces) {
    let top    = p.y + p.height/2;   // world‐Y of the piece’s top
    let bottom = p.y - p.height/2;   // world‐Y of its bottom
    let left   = p.x - p.width/2;
    let right  = p.x + p.width/2;

    // 1) must be horizontally under the click
    // 2) the piece’s bottom must lie at or below the click
    if (x >= left && x <= right && bottom <= y) {
      // 3) pick the piece whose top is highest (largest Y)
      if (top > bestTop) {
        bestTop = top;
        best    = p;
      }
    }
  }

  return best;
}

function getHorizontalSupport(x, y) {
  let max_dist = piece_width * piece_sizes[piece_sizes.length - 1];
  let left_support = null;
  let right_support = null;
  let bestTopLeft = -Infinity;
  let bestTopRight = -Infinity;

  for (let p of pieces) {
    let top = p.y + p.height / 2;
    let left = p.x - p.width / 2;
    let right = p.x + p.width / 2;

    // Ignorar si el top está por encima del punto clicado
    if (top > y) continue;

    // Piezas suficientemente cerca a la izquierda
    if (right < x && Math.abs(p.x - x) <= max_dist) {
      if (top > bestTopLeft) {
        bestTopLeft = top;
        left_support = p;
      }
    }

    // Piezas suficientemente cerca a la derecha
    if (left > x && Math.abs(p.x - x) <= max_dist) {
      if (top > bestTopRight) {
        bestTopRight = top;
        right_support = p;
      }
    }
  }

  if (
    left_support &&
    right_support &&
    Math.abs(bestTopLeft - bestTopRight) < 1
  ) {
    const supportY = bestTopLeft;

    // ❗ Nueva condición: buscar pieza horizontal por encima del soporte y solapando con x
    for (let p of pieces) {
      if (!p.horizontal) continue;

      let top = p.y + p.height / 2;
      let bottom = p.y - p.height / 2;
      let left = p.x - p.width / 2;
      let right = p.x + p.width / 2;

      if (
        Math.abs(bottom - supportY) < 1 && // evitar repetir piezas horizontales
        x >= left && x <= right // se solapa con la posición del clic
      ) {
        return null; // ❌ No hay soporte válido si hay interferencia encima
      }
    }

    // ✅ No hay interferencia → se puede usar soporte
    return {
      left: left_support,
      right: right_support
    };
  }

  return null;
}

function getMinSizeToCover(dist) {
  for (let s of piece_sizes) {
    if (s * piece_width >= dist) return s;
  }
  return piece_sizes[piece_sizes.length - 1];
}


// ─── Save/Load Callbacks ────────────────────────────────────────────────
function handleFile(file) {
  if (file.subtype !== 'json') return;
  // 1. Preguntar al usuario
  const confirmText = 'Do you want to replace the current drawing?';
  if (!window.confirm(confirmText)) {
    // Si cancela, limpiar el input para poder recargar el mismo fichero luego
    fileInput.elt.value = null;
    return;
  }
  let data = file.data;
  // resize canvas
  resizeCanvas(data.canvasWidth, data.canvasHeight);
  // restore camera
  viewScale    = data.viewScale;
  viewOffsetX  = data.viewOffsetX;
  viewOffsetY  = data.viewOffsetY;
  // restore world state
  pieces       = data.pieces;
  click_points = data.click_points;
  
  redraw();
  // Reset the fileInput so you can load *the same* file again
  fileInput.elt.value = null;
}

// ─── Utility Functions ──────────────────────────────────────────────────
function removeLastPiece() {
  if (pieces.length > 0) {
    pieces.pop();
    redraw();
  }
}

function getPieceUnderWorld(wx, wy) {
  for (let i = pieces.length-1; i >= 0; i--) {
    let p = pieces[i];
    let l = p.x - p.width/2,
        r = p.x + p.width/2,
        t = p.y - p.height/2,
        b = p.y + p.height/2;
    if (wx >= l && wx <= r && wy >= t && wy <= b) {
      return { piece: p, index: i };
    }
  }
  return null;
}

function restoreLastDeletedPiece(wx, wy) {
  if (!lastDeletedPiece) return false;
  let p = lastDeletedPiece;
  let l = p.x - p.width/2,
      r = p.x + p.width/2,
      t = p.y - p.height/2,
      b = p.y + p.height/2;
  if (wx >= l && wx <= r && wy >= t && wy <= b) {
    pieces.push(p);
    lastDeletedPiece = null;
    redraw();
    return true;
  }
  return false;
}

function getWorldXBounds() {
  if (pieces.length === 0) {
    return { worldMinX: 0, worldMaxX: 0 };
  }
  worldMinX =  Infinity;
  worldMaxX = -Infinity;

  for (let p of pieces) {
    // en mundo, la pieza ocupa desde (p.x - p.width/2) hasta (p.x + p.width/2)
    const leftEdge  = p.x - p.width / 2;
    const rightEdge = p.x + p.width / 2;

    if (leftEdge  < worldMinX) worldMinX = leftEdge;
    if (rightEdge > worldMaxX) worldMaxX = rightEdge;
  }

  return { worldMinX, worldMaxX };
}
// ─── Camera & Coordinate Helpers ────────────────────────────────────────
function screenToWorldX(sx) {
  return (sx - viewOffsetX) / viewScale;
}
function screenToWorldY(sy) {
  return ( (height + viewOffsetY) - sy ) / viewScale;
}

function worldToScreenX(wx) {
  return wx * viewScale + viewOffsetX;
}

function worldToScreenY(wy) {
  return (height + viewOffsetY) - wy * viewScale;
}


// p5js espera trobar els callbacks en window i ho posem com modul no ho troba
window.setup        = setup;
window.draw         = draw;
window.mousePressed = mousePressed;
window.mouseWheel   = mouseWheel;
// --> no se qui fa servir aixo
window.worldMaxX = () => worldMinX + width / viewScale;
window.worldMinX = () => worldMinX;
