
import { piece_width } from "./pieces.js";
import { doPiece } from "./pieces.js";
let lastPosition = null;
let autoPlaceDist = 6*piece_width; // distancia mínima entre piezas

export function resetRandomPiece() {
    lastPosition = null;
}
export function doRandomPiece(wx, wy){
    // Si es la primera vez o se ha movido suficiente distancia
    if (
    !lastPosition ||
    dist(wx, wy, lastPosition.x, lastPosition.y) >= autoPlaceDist
    ) {
    // Guardamos punto para el siguiente trigger
    lastPosition = { x: wx, y: wy };

    // Lógica de colocación (puede ser tu placeVerticalPiece o la general)
    doPiece(wx, wy);
    redraw();

    autoPlaceDist = piece_width * Math.floor(4, 10);
    }
}