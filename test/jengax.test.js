
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
          let click_points = [];
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


describe('screenToWorldX & screenToWorldY', () => {
  // reset camera before each test
  beforeEach(() => {
    viewScale   = 1;
    viewOffsetX = 0;
    viewOffsetY = 0;
    // ensure a known canvas height for Y tests:
    height = 200;
  });

  describe('screenToWorldX()', () => {
    it('should be identity when no pan/zoom', () => {
      expect(screenToWorldX(0)).to.equal(0);
      expect(screenToWorldX(123)).to.equal(123);
    });

    it('should account for pan', () => {
      viewOffsetX = 10;
      expect(screenToWorldX(10)).to.equal(0);
      expect(screenToWorldX(15)).to.equal(5);
    });

    it('should account for zoom (scale only)', () => {
      viewScale = 2;
      // no pan
      expect(screenToWorldX(0)).to.equal(0);
      expect(screenToWorldX(20)).to.equal(10);
    });

    it('should handle pan + zoom together', () => {
      viewScale   = 0.5;
      viewOffsetX = 40;
      // (screenX - 40) / 0.5
      expect(screenToWorldX(40)).to.equal(0);
      expect(screenToWorldX(50)).to.equal(20);
    });
  });

  describe('screenToWorldY()', () => {
    it('should invert Y around the bottom with no pan/zoom', () => {
      // worldY = (height + 0 - screenY) / 1
      expect(screenToWorldY(200)).to.equal(0);   // bottom of canvas → world 0
      expect(screenToWorldY(100)).to.equal(100); // middle → 100
      expect(screenToWorldY(0)).to.equal(200);   // top → world at height
    });

    it('should account for vertical pan', () => {
      viewOffsetY = 20;
      // worldY = (200 + 20 - screenY)
      expect(screenToWorldY(200)).to.equal(20);
      expect(screenToWorldY(180)).to.equal(40);
    });

    it('should account for vertical scale', () => {
      viewScale = 2;
      // worldY = (200 + 0 - screenY) / 2
      expect(screenToWorldY(200)).to.equal(0);
      expect(screenToWorldY(180)).to.equal(10);
    });

    it('should account for pan + zoom together', () => {
      viewScale   = 0.5;
      viewOffsetY = 40;
      // worldY = (200 + 40 - screenY) / 0.5
      expect(screenToWorldY(240)).to.equal(0);
      expect(screenToWorldY(200)).to.equal(80);
    });
  });
});


describe('worldToScreenX & worldToScreenY (inverse of screenToWorld)', () => {
  // reset camera & canvas height before each test
  beforeEach(() => {
    viewScale   = 1;
    viewOffsetX = 0;
    viewOffsetY = 0;
    height      = 200;
  });

  // helper: pick a variety of test points
  const testPoints = [0, 10, 50, 123, 199];

  describe('worldToScreenX()', () => {
    it('is the inverse of screenToWorldX for various Xs', () => {
      // try with default pan/zoom
      for (let wx of testPoints) {
        const sx = worldToScreenX(wx);
        const roundTrip = screenToWorldX(sx);
        expect(roundTrip).to.be.closeTo(wx, 1e-6);
      }

      // try with zoom only
      viewScale = 2;
      for (let wx of testPoints) {
        const sx = worldToScreenX(wx);
        expect(screenToWorldX(sx)).to.be.closeTo(wx, 1e-6);
      }

      // try with pan only
      viewScale   = 1;
      viewOffsetX = 30;
      for (let wx of testPoints) {
        const sx = worldToScreenX(wx);
        expect(screenToWorldX(sx)).to.be.closeTo(wx, 1e-6);
      }

      // try with pan+zoom
      viewScale   = 0.5;
      viewOffsetX = -20;
      for (let wx of testPoints) {
        const sx = worldToScreenX(wx);
        expect(screenToWorldX(sx)).to.be.closeTo(wx, 1e-6);
      }
    });
  });

  describe('worldToScreenY()', () => {
    it('is the inverse of screenToWorldY for various Ys', () => {
      // default camera
      for (let wy of testPoints) {
        const sy = worldToScreenY(wy);
        const roundTrip = screenToWorldY(sy);
        expect(roundTrip).to.be.closeTo(wy, 1e-6);
      }

      // with vertical zoom
      viewScale = 3;
      for (let wy of testPoints) {
        const sy = worldToScreenY(wy);
        expect(screenToWorldY(sy)).to.be.closeTo(wy, 1e-6);
      }

      // with vertical pan
      viewScale   = 1;
      viewOffsetY = 40;
      for (let wy of testPoints) {
        const sy = worldToScreenY(wy);
        expect(screenToWorldY(sy)).to.be.closeTo(wy, 1e-6);
      }

      // with pan+zoom
      viewScale   = 0.5;
      viewOffsetY = -10;
      for (let wy of testPoints) {
        const sy = worldToScreenY(wy);
        expect(screenToWorldY(sy)).to.be.closeTo(wy, 1e-6);
      }
    });
  });
});

describe('Screen ↔ World conversions with viewScale = 2', () => {
  beforeEach(() => {
    // set up the camera state
    viewScale   = 2;
    viewOffsetX = 5;
    viewOffsetY = 10;
    height      = 100;
  });

  it('screenToWorldX should divide by 2 after subtracting offset', () => {
    // (screenX - viewOffsetX) / viewScale
    expect(screenToWorldX(5)).to.equal((5 - 5) / 2);    // 0
    expect(screenToWorldX(9)).to.equal((9 - 5) / 2);    // 2
    expect(screenToWorldX(21)).to.equal((21 - 5) / 2);  // 8
  });

  it('worldToScreenX should invert screenToWorldX', () => {
    const wx = 7.5;
    const sx = worldToScreenX(wx);
    // worldToScreenX(wx) = wx*2 + 5
    // then screenToWorldX(sx) should recover wx
    expect(screenToWorldX(sx)).to.be.closeTo(wx, 1e-6);
  });

  it('screenToWorldY should invert (height+offsetY−screenY)/2', () => {
    // worldY = (height + viewOffsetY - screenY) / viewScale
    expect(screenToWorldY( height + viewOffsetY )).to.equal(0);
    expect(screenToWorldY( 80 )).to.equal((100 + 10 - 80) / 2); // (30)/2 = 15
  });

  it('worldToScreenY should invert screenToWorldY', () => {
    const wy = 12;
    const sy = worldToScreenY(wy);
    // then screenToWorldY(sy) recovers wy
    expect(screenToWorldY(sy)).to.be.closeTo(wy, 1e-6);
  });
});


