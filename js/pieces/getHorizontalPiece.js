

// pieces.js
import { pieces, piece_width, piece_sizes, divideVerticalPieces,
  existHorizontal
 } from './pieces.js';



export function getHorizontalPiece(wx, wy) {
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

/**
 * Encuentra los dos soportes verticales (uno a la izquierda y otro a la derecha)
 * con la menor distancia horizontal posible y al mismo nivel, sin interferencias.
 * Devuelve { left, right, spanX} o null si no hay pareja válida.
 */
export function _getHorizontalSupport(x, y) {
  const maxDist = piece_width * piece_sizes[piece_sizes.length - 1];
  let bestPair = null;

  // 1) Separar piezas verticales en candidatos izquierda o derecha
  const division = divideVerticalPieces(x, y, maxDist);
  const leftCandidates = division.left;
  const rightCandidates = division.right;
  
    // ignora los que quedan muy lejos de la y del cursor
    //  if (y - top > 3*piece_width) continue;  // <---


  let bestHeight = -Infinity;
  let bestSpan = Infinity;

  // 2) Probar cada combinación de candidatos para 1) mayor altura, 2) mas cercanos
  for (const left of leftCandidates) {
    if (left.top < bestHeight) continue;
    
    for (const right of rightCandidates) {

      // para formar un par deben estar casi al mismo nivel
      if (Math.abs(left.top - right.top) > 1) continue;

      const span = Math.abs(right.piece.x - left.piece.x);
      if (span < bestSpan) {
        // si hay una horizontal que cubre este espacio descartamos
        if (!existHorizontal((left.piece.x + right.piece.x)/2, left.top+piece_width/2, y)) {
          bestPair = {left: left.piece, right: right.piece}
          bestSpan = Infinity;
          bestHeight  = left.top;
        }
      }
    }
  }
  
  return bestPair;
}



