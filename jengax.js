let piece_width = 10;
let piece_sizes = [1, 2, 3, 5, 8, 13];
let ground_color;
let ground_border = 1;
let piece_color;
let piece_border = 1;

let groundY;
let pieces = [];
let click_points = [];
let qHeld = false;

function setup() {
  console.log('setup');
  createCanvas(800, 600);
  rectMode(CENTER);
  ground_color = color(80);
  piece_color = color(150, 75, 0);
  groundY = height - piece_width / 2;
  noLoop()

  // Prevenir menú contextual del navegador
  canvas = document.querySelector('canvas');
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
}

function draw() {
  console.log('draw');
  background(240);
  drawGround();
  for (let p of pieces) drawPiece(p);
  drawAllClickPoints();
  drawHoveredPointIfNeeded();
  drawPositionIfkeyQPressed();
  if (!qHeld) {
    noLoop();
  } 
}

function drawGround() {
  stroke(0);
  strokeWeight(ground_border);
  fill(ground_color);
  rect(width / 2, groundY, width, piece_width);
}

function drawHoveredPointIfNeeded() {
  let hover = getHoveredPoint();
  if (hover) {
    let label = `${int(hover.x)}, ${int(hover.y)}`;
    drawTooltipAtCursor(label);
  }
}

function drawPositionIfkeyQPressed() {
  let isQPressed = keyIsDown(81); // tecla Q
  if (isQPressed) {
    let label = `${int(mouseX)}, ${int(mouseY)}`;
    drawTooltipAtCursor(label);
  }
}

function drawAllClickPoints() {
  noStroke();
  let count = Math.min(3, click_points.length);

  for (let i = 0; i < count; i++) {
    let pt = click_points[click_points.length - 1 - i];
    let size = 6 - i * 2; // Tamaños: 6, 4, 2

    // Colores: del negro al gris claro
    let gray = 0 + i * 80; // 0, 80, 160
    fill(gray);
    ellipse(pt.x, pt.y, size, size);
  }
}


function getHoveredPoint() {
  for (let pt of click_points) {
    let isNear = dist(mouseX, mouseY, pt.x, pt.y) < 6;
    if (isNear ) {
      return pt;
    }
  }
  return null;
}

function drawTooltipAtCursor(label) {
  textSize(12);
  let padding = 6;
  let w = textWidth(label) + padding * 2;
  let h = 20;
  let tx = mouseX + 10;
  let ty = mouseY - h - 5;

  // Fondo de la etiqueta
  push();
  rectMode(CORNER);
  fill(255);
  stroke(0);
  strokeWeight(1);
  rect(tx, ty, w, h, 5);
  pop();

  // Texto
  noStroke();
  fill(0);
  textAlign(LEFT, CENTER);
  text(label, tx + padding, ty + h / 2);
}


function drawPiece(p) {
  stroke(0);
  strokeWeight(piece_border);
  fill(piece_color);
  rect(p.x, p.y, p.width, p.height);
}

function keyPressed() {
  if (key === 'q' || key === 'Q') {
    qHeld = true;
    loop();
  }
}

function keyReleased() {
  if (key === 'q' || key === 'Q') {
    qHeld = false;
    loop();
  }
}

function mousePressed() {

  if (mouseButton === RIGHT) {
    removeLastPiece();
    return false; // prevenir menú contextual
  }


  let x = mouseX;
  let y = mouseY;

  click_points.push({ x, y });

  let horizontal = getHorizontalSupport(x, y);
  if (horizontal) {
    let centerX = (horizontal.left.x + horizontal.right.x) / 2;
    let topY = horizontal.left.y - horizontal.left.height / 2;
    let width = abs(horizontal.right.x - horizontal.left.x) + 2*piece_width;
    let height = piece_width;

    pieces.push({
      x: centerX,
      y: topY - height / 2,
      width,
      height,
      horizontal: true
    });
    console.log('Horizontal piece added:', pieces[pieces.length - 1]);
    redraw()
    return;
  }

  let baseX = x;
  let baseY;
  let supportPiece = getHighestPieceBelow(x, y);
  if (supportPiece) {
    baseY = supportPiece.y - supportPiece.height / 2;
  } else {
    baseY = groundY - piece_width / 2;
  }

  let height_needed = baseY - y;
  let selected_size = getMinSizeToCover(Math.abs(height_needed));
  let piece_height = selected_size * piece_width;
  let centerY = baseY - piece_height / 2;

  pieces.push({
    x: baseX,
    y: centerY,
    width: piece_width,
    height: piece_height,
    horizontal: false
  });
  console.log('Vertical piece added:', pieces[pieces.length - 1]);
  redraw()
}

function removeLastPiece() {
  if (pieces.length > 0) {
    pieces.pop();
    redraw(); // si estás usando noLoop()
  }
}

function getHighestPieceBelow(x, y) {
  let best = null;
  let bestTopY = Infinity;

  for (let p of pieces) {
    let top = p.y - p.height / 2;
    let bottom = p.y + p.height / 2;
    let left = p.x - p.width / 2;
    let right = p.x + p.width / 2;

    // Alineado en X y el punto está justo por encima o dentro del alto de la pieza
    if (x >= left && x <= right && bottom >= y) {
      if (top < bestTopY) {
        bestTopY = top;
        best = p;
      }
    }
  }

  return best;
}

function getHorizontalSupport(x, y) {
  let max_dist = piece_width * piece_sizes[piece_sizes.length - 1];
  let left_support = null;
  let right_support = null;
  let bestTopLeft = Infinity;
  let bestTopRight = Infinity;

  for (let p of pieces) {
    let top = p.y - p.height / 2;
    let left = p.x - p.width / 2;
    let right = p.x + p.width / 2;

    // Ignorar si el top está por encima del punto clicado
    if (top < y) continue;

    // Piezas suficientemente cerca a la izquierda
    if (right < x && Math.abs(p.x - x) <= max_dist) {
      if (top < bestTopLeft) {
        bestTopLeft = top;
        left_support = p;
      }
    }

    // Piezas suficientemente cerca a la derecha
    if (left > x && Math.abs(p.x - x) <= max_dist) {
      if (top < bestTopRight) {
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

      let top = p.y - p.height / 2;
      let bottom = p.y + p.height / 2;
      let left = p.x - p.width / 2;
      let right = p.x + p.width / 2;

      if (
        top < supportY && // está por encima del nivel de soporte
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


