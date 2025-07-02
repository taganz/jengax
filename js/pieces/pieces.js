

// pieces.js
import { screenToWorldX, screenToWorldY} from '../camera.js';
import { getMinSizeToCover } from '../utils.js';
import { getHorizontalPiece } from './getHorizontalPiece.js';

export const piece_width    = 20;
export const piece_sizes    = [1, 2, 3, 5, 8, 13];
export const piece_border   = 1;


export const pieces = [];
//let lastDeletedPiece = null;
let lastCandidateId = null;
let candidates = [];
let last_wx = null;
let last_wy = null;
let countAddPieces = 0;


let initialState = null;


export function initPieces() {
  let wx1 = screenToWorldX(width*0.40);
  let wx2 = screenToWorldX(width*0.60);
  let wy  = screenToWorldY(height*0.7);
  doPiece(wx1, wy);
  doPiece(wx2, wy);
  initialState = true;
}

export function doPiece(wx, wy) {

  // si fem clic al mateix lloc es que volem provar un altre candidat
  if (initialState = true && (last_wx == wx && last_wy== wy ) ) {  
    _removeLastPiece();
    if (++lastCandidateId < candidates.length) { 
      // prova un altre candidat
      pieces.push(candidates[lastCandidateId]);
      lastCandidateId++;
    }
    else {
      // hem arribat ja a l'ultim candidat, no afegim res per si vol borrar, i despres donarem la volta
      lastCandidateId = 0;
      last_wx = null;
      last_wx = null;
    }
  }
  else
  {
    // hem fet clic en un altre lloc (o es el primer clic)

    // Si hay una pieza bajo el cursor, la borra
    const deletedPiece = deletePiece(wx, wy);

    if (!deletedPiece) {
        // vamos a buscar candidatos y a añadir el primero
        posthog.capture('input_add');   
        countAddPieces++;
        if (countAddPieces == 1) { posthog.capture('input_add_1');} 
        if (countAddPieces == 10) { posthog.capture('input_add_10');} 
        if (countAddPieces == 50) { posthog.capture('input_add_50');} 
        if (countAddPieces == 100) { posthog.capture('input_add_100');} 
        if (countAddPieces == 500) { posthog.capture('input_add_500');} 
        if (countAddPieces == 1000) { posthog.capture('input_add_1000');} 

        candidates = getCandidates(wx, wy);
        last_wx = wx;
        last_wy = wy;
        lastCandidateId = 0;
        pieces.push(candidates[lastCandidateId]);
        if (!initialState==null) initialState = false;        
      }
  }

  //lastDeletedPiece = null;
}

export function undoPiece() {
  posthog.capture('input_undo');
  //if (lastDeletedPiece != null) {
  //   _restoreLastDeletedPiece();
  //}
  //else {
    _removeLastPiece(); 
  //}
  redraw();
}

export function piecesIsEmpty() {
  return initialState || pieces.length == 0;
}

export function lastPiece() {
  return pieces[pieces.length - 1];
}

export function clearPieces() {
  pieces.splice(0, pieces.length);  
}

export function loadPieces(piecesToLoad) {
  pieces.splice(0, pieces.length, ...piecesToLoad);  
}

function _removeLastPiece() {
  //lastDeletedPiece = null;
  if (pieces.length > 0) pieces.pop();
  redraw();
}

export function deletePiece(wx, wy) {
  const index = _getPieceIdUnderWorld(wx, wy);
  if (index != null) { 
    posthog.capture('input_delete');
    //lastDeletedPiece = pieces[index];
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

/*
function _restoreLastDeletedPiece() {
  if (!lastDeletedPiece) return false;
  pieces.push(lastDeletedPiece);
  lastDeletedPiece = null;
  return;
}
  */

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


// horizontals before verticals
export function getCandidates(wx, wy) {
  const phori = getHorizontalPiece(wx, wy);
  const pvert = _getPotentialVerticalPiece(wx, wy);
  const cand = [];
  if (phori) cand.push(phori);
  if (pvert) cand.push(pvert);
  return cand;
}

// Separar piezas verticales en las que estan a derecha i a izquierda 
// devuelve arrays con {piece, top}
export function divideVerticalPieces(x, hMax=Infinity, distMax=Infinity) {
  const leftPieces = [];
  const rightPieces = [];
  for (const p of pieces) {
    if (p.horizontal) continue;
  
    // no son soportes si estan por encima del mouse o muy lejos
    const top = p.y + p.height / 2;
    const dx  = Math.abs(p.x - x);
    if (top > hMax || dx > distMax) continue;

    // separamos entre left y right candidates
    if (p.x < x) leftPieces.push({ piece: p, top: top });
    else if (p.x > x) rightPieces.push({ piece: p, top: top });
  }
  return {left: leftPieces, right: rightPieces}
}

// detectar si existeix una horitzontal entre on volem posar-la i el mouse
export function existHorizontal(x, y, ymax=y) {

    for (const hp of pieces) {
      if (!hp.horizontal) continue;
      const top = hp.y + hp.height / 2;
      const bottom = hp.y - hp.height / 2;
      const l      = hp.x - hp.width  / 2;
      const r      = hp.x + hp.width  / 2;
      if (
        bottom < ymax
        && top > y
        && l < x
        && r > x) {
          return true;
        }        
    }
    return false;
}
