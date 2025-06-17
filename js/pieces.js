

// pieces.js
import { getMinSizeToCover } from './utils.js';


export let piece_width    = 20;
export let piece_sizes    = [1, 2, 3, 5, 8, 13];
export let piece_border   = 1;


export let pieces = [];
export let lastDeletedPiece = null;

export function removeLastPiece() {
  lastDeletedPiece = null;
  if (pieces.length > 0) pieces.pop();
  redraw();
}
export function deletePiece(index) {
  lastDeletedPiece = pieces[index];
  pieces.splice(index,1);

}
export function getPieceIdUnderWorld(wx, wy) {
  for (let i = pieces.length - 1; i >= 0; i--) {
    const p = pieces[i];
    const left = p.x - p.width/2;
    const right = p.x + p.width/2;
    const top = p.y - p.height/2;
    const bottom = p.y + p.height/2;
    if (wx >= left && wx <= right && wy >= top && wy <= bottom) {
      return  i; // devuelve el índice de la pieza
    }
  }
  return null;
}

export function restoreLastDeletedPiece(wx, wy) {
  if (!lastDeletedPiece) return false;
  const p = lastDeletedPiece;
  const left = p.x - p.width/2;
  const right = p.x + p.width/2;
  const top = p.y - p.height/2;
  const bottom = p.y + p.height/2;
  lastDeletedPiece = null;
  if (wx >= left && wx <= right && wy >= top && wy <= bottom) {
    pieces.push(p);
    return true;
  }
  return false;
}

export function getHighestPieceBelow(x, y) {
  let best = null;
  let bestTop = -Infinity;
  for (const p of pieces) {
    const top = p.y + p.height/2;   // world‐Y of the piece’s top
    const bottom = p.y - p.height/2;
    const left = p.x - p.width/2;
    const right = p.x + p.width/2;
    // 1) must be horizontally under the click
    // 2) the piece’s bottom must lie at or below the click
    if (x >= left && x <= right && bottom <= y) {
      // 3) pick the piece whose top is highest (largest Y)
      if (top > bestTop) {
        bestTop = top;
        best = p;
      }
    }
  }
  return best;
}

export function getHorizontalSupport(x, y, piece_width, piece_sizes) {
  const maxDist = piece_width * piece_sizes[piece_sizes.length - 1];
  let leftSup = null, rightSup = null;
  let bestTopLeft = -Infinity, bestTopRight = -Infinity;
  for (const p of pieces) {
    if (p.horizontal) continue;
    const top = p.y + p.height/2;
    const left = p.x - p.width/2;
    const right = p.x + p.width/2;
    const dx = Math.abs(p.x - x);
    // Ignorar si el top está por encima del punto clicado
    if (top > y) continue;
    // Piezas suficientemente cerca a la izquierda
    if (right < x && dx <= maxDist && top > bestTopLeft) {
      bestTopLeft = top; leftSup = p;
    }
    // Piezas suficientemente cerca a la derecha
    if (left > x && dx <= maxDist && top > bestTopRight) {
      bestTopRight = top; rightSup = p;
    }
  }
  if (leftSup && rightSup && Math.abs(bestTopLeft - bestTopRight) < 1) {
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
    
    return { left: leftSup, right: rightSup };
  }
  return null;
}

export function addHorizontalPieceIfPossible(wx, wy) {
  const horizontal = getHorizontalSupport(wx, wy, piece_width, piece_sizes);
  if (horizontal) {
    const cX = (horizontal.left.x + horizontal.right.x) / 2; // centro entre los dos soportes 
    const tY = horizontal.left.y + horizontal.left.height / 2; // top Y de los soportes
    const w = Math.abs(horizontal.right.x - horizontal.left.x) + 2 * piece_width;
    const h = piece_width;
    pieces.push({ x: cX, y: tY + h / 2, width: w, height: h, horizontal: true });
    return true;
  }
  return false;
}

export function drawVerticalPiece(wx, wy) {
  let support = getHighestPieceBelow(wx, wy);
    // el top de la peça que te a sota
    let baseY   = support
                  ? support.y + support.height/2
                  : 0;
  
    let needed = wy - baseY;
    let size   = getMinSizeToCover(abs(needed));
    let pH     = size * piece_width;
    pH         = min (needed, pH);
    let cY     = baseY + pH/2;
    console.log(`needed ${needed} size ${size} pH ${pH} cY ${cY} `);
    pieces.push({ x: wx, y: cY, width: piece_width, height: pH, horizontal: false });

}
export function getWorldXBounds() {
  if (pieces.length === 0) {
    return { worldMinX: 0, worldMaxX: 0 };
  }
  let wMinX =  Infinity;
  let wMaxX = -Infinity;

  for (let p of pieces) {
    // en mundo, la pieza ocupa desde (p.x - p.width/2) hasta (p.x + p.width/2)
    const leftEdge  = p.x - p.width / 2;
    const rightEdge = p.x + p.width / 2;

    if (leftEdge  < wMinX) wMinX = leftEdge;
    if (rightEdge > wMaxX) wMaxX = rightEdge;
  }

  return { worldMinX: wMinX, worldMaxX: wMaxX };
}