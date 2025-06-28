
// test/factorial.spec.js
const expect  =  chai.expect

// importar funciones para testing
import { getMinSizeToCover } from '../js/utils.js';
import { screenToWorldX, screenToWorldY, worldToScreenX, worldToScreenY } from '../js/camera.js'; 

describe('tenga2 - funciones básicas', function () {
  beforeEach(function () {
  window.piece_sizes = [1, 2, 3, 5, 8, 13];
  window.piece_width = 20;
        /*
          let ground_color;
          let ground_border = 1;
          let piece_color;
          let piece_border = 1;

          let groundY;
          let pieces = [];
        */
      });

  it('getMinSizeToCover() devuelve el tamaño correcto', function () {
    chai.expect(getMinSizeToCover(10)).to.equal(1);
    chai.expect(getMinSizeToCover(41)).to.equal(3);
    chai.expect(getMinSizeToCover(260)).to.equal(13);
    chai.expect(getMinSizeToCover(1000)).to.equal(13);
  });

  it('getHighestPieceBelow() devuelve null si no hay piezas', function () {
    chai.expect(getHighestPieceBelow(100, 100)).to.equal(null);
  });

  it('getHighestPieceBelow() encuentra soporte correcto', function () {
    let y = 500;
    pieces.push({ x: 100, y: y, width: piece_width, height: 60, horizontal: false });
    pieces.push({ x: 100, y: y - 80, width: piece_width, height: 60, horizontal: false });

    let p = getHighestPieceBelow(100, y - 100);
    chai.expect(p).to.equal(pieces[1]);
  });

  it('getHorizontalSupport() devuelve null si no hay piezas', function () {
    chai.expect(getHorizontalSupport(300, 100)).to.equal(null);
  });

  it('getHorizontalSupport() detecta dos verticales a los lados', function () {
    let y = 500;
    let h = 60;
    let top = y + h / 2;

    pieces.length = 0; // Limpiar piezas antes de la prueba
    pieces.push({ x: 200, y: y, width: piece_width, height: h, horizontal: false });
    pieces.push({ x: 400, y: y, width: piece_width, height: h, horizontal: false });

    let result = getHorizontalSupport(300, top + 10);
    chai.expect(result).to.not.equal(null);
    chai.expect(result.left).to.equal(pieces[0]);
    chai.expect(result.right).to.equal(pieces[1]);
  });
  it('getHorizontalSupport() no detecta soporte si hay dos verticales a los lados pero con una horizontal encima', function () {
    let y = 500;
    let h = 60;
    let top = y - h / 2;

    pieces.length = 0; // Limpiar piezas antes de la prueba
    pieces.push({ x: 200, y: y, width: piece_width, height: h, horizontal: false });
    pieces.push({ x: 400, y: y, width: piece_width, height: h, horizontal: false });
    pieces.push({ x: 300, y: y- h, width: 200, height: h, horizontal: true });

    let result = getHorizontalSupport(300, top - 50);
    chai.expect(result).to.equal(null);
    ;
  });
});

