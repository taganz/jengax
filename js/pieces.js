

// pieces.js
import { getMinSizeToCover } from './utils.js';


export const piece_width    = 20;
export const piece_sizes    = [1, 2, 3, 5, 8, 13];
export const piece_border   = 1;


export const pieces = [];
export let lastDeletedPiece = null;


export function addPiece(wx, wy) {

  let phori = _getPotentialHorizontalPiece(wx, wy);
  if (phori) {
    pieces.push(phori);
    posthog.capture('input_add_horizontal');
  } else {  
    let pvert = _getPotentialVerticalPiece(wx, wy);
    if (pvert) {
      posthog.capture('input_add_vertical');
      pieces.push(pvert);
    } else {
      posthog.capture('error_pieces_no_potential_pieces')
      console.log("No potencial pieces at addPiece???");
    }
  }
  lastDeletedPiece = null;
}

export function undoPiece() {
  posthog.capture('input_undo');
  if (lastDeletedPiece != null) {
     _restoreLastDeletedPiece();
  }
  else {
    _removeLastPiece(); 
  }
  redraw();
}

export function piecesIsEmpty() {
  return pieces.length == 0;
}

export function clearPieces() {
  pieces.splice(0, pieces.length);  
}

export function loadPieces(piecesToLoad) {
  pieces.splice(0, pieces.length, ...piecesToLoad);  
}

function _removeLastPiece() {
  lastDeletedPiece = null;
  if (pieces.length > 0) pieces.pop();
  redraw();
}

export function deletePiece(wx, wy) {
  const index = _getPieceIdUnderWorld(wx, wy);
  if (index != null) { 
    posthog.capture('input_delete');
    lastDeletedPiece = pieces[index];
   pieces.splice(index,1);
  }
  return (index != null);
}

export function _getPieceIdUnderWorld(wx, wy) {
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

function _restoreLastDeletedPiece() {
  if (!lastDeletedPiece) return false;
  pieces.push(lastDeletedPiece);
  lastDeletedPiece = null;
  return;
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

/**
 * Encuentra los dos soportes verticales (uno a la izquierda y otro a la derecha)
 * con la menor distancia horizontal posible y al mismo nivel, sin interferencias.
 * Devuelve { left, right } o null si no hay pareja válida.
 */
export function _getHorizontalSupport(x, y) {
  const maxDist = piece_width * piece_sizes[piece_sizes.length - 1];
  const leftCandidates = [];
  const rightCandidates = [];

  // 1) Separar piezas verticales en candidatos izquierda o derecha
  for (const p of pieces) {
    if (p.horizontal) continue;
    const top = p.y + p.height / 2;
    // ignora los que quedan muy lejos de la y del cursor
    if (y - top > 3*piece_width) continue;
    const dx  = Math.abs(p.x - x);
    if (top > y || dx > maxDist) continue;
    if (p.x < x) leftCandidates.push({ piece: p, top });
    else if (p.x > x) rightCandidates.push({ piece: p, top });
  }

  let bestPair = null;
  let minSpan  = Infinity;

  // 2) Probar cada combinación de candidatos
  for (const left of leftCandidates) {
    for (const right of rightCandidates) {
      // deben estar casi al mismo nivel
      if (Math.abs(left.top - right.top) < 1) {
        const span = right.piece.x - left.piece.x;
        if (span < minSpan) {
          const supportY = left.top;
          // 3) Comprobar que no hay pieza horizontal encima de este nivel
          let interference = false;
          for (const hp of pieces) {
            if (!hp.horizontal) continue;
            const bottom = hp.y - hp.height / 2;
            const l      = hp.x - hp.width  / 2;
            const r      = hp.x + hp.width  / 2;
            if (
              Math.abs(bottom - supportY) < 1 &&
              x >= l && x <= r
            ) {
              interference = true;
              break;
            }
          }
          // 4) Si no hay interferencia, lo consideramos
          if (!interference) {
            bestPair = { left: left.piece, right: right.piece };
            minSpan  = span;
          }
        }
      }
    }
  }

  return bestPair;
}

export function _getHorizontalFromSupport(pleft, pright) {

}
export function _getPotentialHorizontalPiece(wx, wy) {
  const horizontal = _getHorizontalSupport(wx, wy);
  if (horizontal) {
    const cX = (horizontal.left.x + horizontal.right.x) / 2; // centro entre los dos soportes 
    const tY = horizontal.left.y + horizontal.left.height / 2; // top Y de los soportes
    const w = Math.abs(horizontal.right.x - horizontal.left.x) + 2 * piece_width;
    const h = piece_width;
    const horizontalPiece = { x: cX, y: tY + h / 2, width: w, height: h, horizontal: true };
    return horizontalPiece;
  }
  return null;
}

function _getPotentialVerticalPiece(wx, wy) {
  let support = getHighestPieceBelow(wx, wy);
    // el top de la peça que te a sota
    let baseY   = support
                  ? support.y + support.height/2
                  : 0;
  
    let needed = wy - baseY;
    let size   = getMinSizeToCover(Math.abs(needed));
    let pH     = size * piece_width;
    pH         = Math.min (needed, pH);
    let cY     = baseY + pH/2;
    //console.log(`needed ${needed} size ${size} pH ${pH} cY ${cY} `);
    return { x: wx, y: cY, width: piece_width, height: pH, horizontal: false };

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


