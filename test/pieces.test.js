import { pieces, getWorldXBounds,getHighestPieceBelow, getHorizontalSupport } from '../js/pieces.js';

describe('pieces', function () {
  beforeEach(function () {
    pieces.length = 0; // Limpiar piezas antes de cada prueba
  });

  it('getWorldXBounds() devuelve valores correctos', function () {
    pieces.push({ x: 100, y: 300, width: 20, height: 60, horizontal: false });
    pieces.push({ x: 100, y: 200, width: 20, height: 60, horizontal: false });

    chai.expect(getWorldXBounds()).to.deep.equal({ worldMinX: 90, worldMaxX: 110 });
  });

  
});