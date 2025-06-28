import { pieces, clearPieces, getWorldXBounds, getCandidates,
  piece_border, piece_sizes, piece_width
} from '../../js/pieces/pieces.js';
import { 
  getHorizontalPiece,
  _getHorizontalSupport,
 // _existHorizontal
} from '../../js/pieces/getHorizontalPiece.js';

describe('getHorizontalPiece', function () {
  beforeEach(function () {
    clearPieces(); 
  });



  it('_getHorizontalSupport() 1 vertical piece - return null', function () {
    let vert1 = { x: 100, y: 30, width: 20, height: 60, horizontal: false};
    pieces.push(vert1);
    chai.expect(_getHorizontalSupport(150, 90)).to.equal(null);
  });

  it('_getHorizontalSupport() 2 different height vertical pieces - return null', function () {
    let vert1 = { x: 100, y: 30, width: 20, height: 60, horizontal: false};
    let vert2 = { x: 200, y: 60, width: 20, height: 60, horizontal: false };
    let horiz1 = { x: 150, y: 70, width: 120, height: 20, horizontal: false };
    pieces.push(vert1);
    pieces.push(vert2);
    chai.expect(_getHorizontalSupport(150, 90)).to.equal(null);
  });


  it('_getHorizontalSupport() en medio de 2 verticales iguales - devuelve estos dos', function () {
    let vert1 = { x: 100, y: 30, width: 20, height: 60, horizontal: false};
    let vert2 = { x: 200, y: 30, width: 20, height: 60, horizontal: false };
    pieces.push(vert1);
    pieces.push(vert2);
    const e1 = _getHorizontalSupport(150, 90);
    const e2 = {left: vert1, right: vert2};
    //console.log("e1: ", e1);
    //console.log("e2: ", e2);
    chai.expect(e1).to.deep.equal(e2);
  });


  it('_getHorizontalSupport() en medio de 2x2 verticales iguales - return soportes mas altos', function () {
    let vert1 = { x: 100, y: 30, width: 20, height: 60, horizontal: false};
    let vert2 = { x: 300, y: 30, width: 20, height: 60, horizontal: false };
    let vert1b = { x: 100, y: 90, width: 20, height: 60, horizontal: false};
    let vert2b = { x: 300, y: 90, width: 20, height: 60, horizontal: false };
    pieces.push(vert1);
    pieces.push(vert2);
    pieces.push(vert1b);
    pieces.push(vert2b);
    const e1 = _getHorizontalSupport(150, 130);
    const e2 = {left: vert1b, right: vert2b}
    //console.log("e1: ", e1);
    //console.log("e2: ", e2);
    chai.expect(e1).to.deep.equal(e2);
  });

  it('_getHorizontalSupport() en medio de 4 verticales iguales - return soportes mas cercanos', function () {
    let vert1 = { x: 100, y: 30, width: 20, height: 60, horizontal: false};
    let vert2 = { x: 300, y: 30, width: 20, height: 60, horizontal: false };
    let vert3 = { x: 125, y: 30, width: 20, height: 60, horizontal: false};
    let vert4 = { x: 175, y: 30, width: 20, height: 60, horizontal: false };
    pieces.push(vert1);
    pieces.push(vert2);
    pieces.push(vert3);
    pieces.push(vert4);
    chai.expect(_getHorizontalSupport(150, 90)).to.deep.equal({left: vert3, right: vert4});
  });

  it('getHorizontalPiece() 4 verticales iguales - return horizontal sobre soportes mas cercanos', function () {
    let vert1 = { x: 100, y: 30, width: 20, height: 60, horizontal: false};
    let vert2 = { x: 300, y: 30, width: 20, height: 60, horizontal: false };
    let vert3 = { x: 125, y: 30, width: 20, height: 60, horizontal: false};
    let vert4 = { x: 175, y: 30, width: 20, height: 60, horizontal: false };
    let horiz = { x: 150, y: 70, width: 90, height: 20, horizontal: true };
    pieces.push(vert1);
    pieces.push(vert2);
    pieces.push(vert3);
    pieces.push(vert4);
    chai.expect(getHorizontalPiece(150, 90)).to.deep.equal(horiz);
  });

 it('getHorizontalPiece() 2 verticales + horizontal encima - return null', function () {
    let vert1 = { x: 100, y: 30, width: 20, height: 60, horizontal: false };
    let vert2 = { x: 200, y: 30, width: 20, height: 60, horizontal: false };
    let horiz = { x: 150, y: 70, width: 140, height: 20, horizontal: true};
    pieces.push(vert1);
    pieces.push(vert2);
    pieces.push(horiz);
    chai.expect(getHorizontalPiece(150, 130)).to.equal(null);
  });

});