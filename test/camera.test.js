
// test/factorial.spec.js
const expect  =  chai.expect

// importar funciones para testing
import { viewOffsetX
        , viewOffsetY
        , viewScale
        , screenToWorldX
        , screenToWorldY
        , worldToScreenX
        , worldToScreenY
        , resetCamera
        , setCamera
        , zoomAt
       } from '../js/camera.js'; 


let height;

describe('camera.js', () => {
  // reset camera before each test
  beforeEach(() => {
    resetCamera()
  });

  it('resetCamera sets to 1, 0, 0', () => {
      resetCamera();
      expect(viewOffsetX).to.equal(0);
      expect(viewOffsetY).to.equal(0);
      expect(viewScale).to.equal(1);
    });
  it('setCamera sets parameters correctly', () => {
      setCamera(3, 4, 5);
      expect(viewScale).to.equal(3);
      expect(viewOffsetX).to.equal(4);
      expect(viewOffsetY).to.equal(5);
    });

  describe('screenToWorldX()', () => {

    it('should be identity when no pan/zoom', () => {
      expect(screenToWorldX(0)).to.equal(0);
      expect(screenToWorldX(123)).to.equal(123);
    });

    it('should account for pan', () => {
      setCamera(1, 10, 0);
      expect(screenToWorldX(10)).to.equal(0);
      expect(screenToWorldX(15)).to.equal(5);
    });

    it('should account for zoom (scale only)', () => {
      setCamera(2, 0, 0);// no pan
      expect(screenToWorldX(0)).to.equal(0);
      expect(screenToWorldX(20)).to.equal(10);
    });

    it('should handle pan + zoom together', () => {
      setCamera(0.5, 40, 0);// no pan
      // (screenX - 40) / 0.5
      expect(screenToWorldX(40)).to.equal(0);
      expect(screenToWorldX(50)).to.equal(20);
    });
  });

  describe('screenToWorldY()', () => {
    it('should invert Y around the bottom with no pan/zoom', () => {
      resetCamera();
      window.height = 600;
      // worldY = (height + 0 - screenY) / 1
      expect(screenToWorldY(600)).to.equal(0);   // bottom of canvas → world 0
      expect(screenToWorldY(300)).to.equal(300); // middle → 100
      expect(screenToWorldY(0)).to.equal(600);   // top → world at height
    });

    it('should account for vertical pan', () => {
      setCamera(1, 0, 20);
      window.height = 200;
      // worldY = (200 + 20 - screenY)
      expect(screenToWorldY(200)).to.equal(20);
      expect(screenToWorldY(180)).to.equal(40);
    });

    it('should account for vertical scale', () => {
      setCamera(2, 0, 0);
      window.height = 200;
      // worldY = (200 + 0 - screenY) / 2
      expect(screenToWorldY(200)).to.equal(0);
      expect(screenToWorldY(180)).to.equal(10);
    });

    it('should account for pan + zoom together', () => {
      setCamera(0.5, 0, 40);
      window.height = 200;
      // worldY = (200 + 40 - screenY) / 0.5
      expect(screenToWorldY(240)).to.equal(0);
      expect(screenToWorldY(200)).to.equal(80);
    });
  });


  describe('worldToScreenX & worldToScreenY (inverse of screenToWorld)', () => {
    // reset camera & canvas height before each test
    beforeEach(() => {
      setCamera(1, 0, 0);
      window.height      = 200;
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
        setCamera(2, 0, 0);
        for (let wx of testPoints) {
          const sx = worldToScreenX(wx);
          expect(screenToWorldX(sx)).to.be.closeTo(wx, 1e-6);
        }

        // try with pan only
        setCamera(1, 3, 0);
        for (let wx of testPoints) {
          const sx = worldToScreenX(wx);
          expect(screenToWorldX(sx)).to.be.closeTo(wx, 1e-6);
        }

        // try with pan+zoom
        setCamera(0.5, -20, 0);
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
        setCamera(3, 0, 0);
        for (let wy of testPoints) {
          const sy = worldToScreenY(wy);
          expect(screenToWorldY(sy)).to.be.closeTo(wy, 1e-6);
        }

        // with vertical pan
        setCamera(1, 40, 0);
        for (let wy of testPoints) {
          const sy = worldToScreenY(wy);
          expect(screenToWorldY(sy)).to.be.closeTo(wy, 1e-6);
        }

        // with pan+zoom
        setCamera(0.5, -10, 0);
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
      setCamera(2, 5, 10);
      window.height      = 100;
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
      expect(screenToWorldY( window.height + viewOffsetY )).to.equal(0);
      expect(screenToWorldY( 80 )).to.equal((100 + 10 - 80) / 2); // (30)/2 = 15
    });

    it('worldToScreenY should invert screenToWorldY', () => {
      const wy = 12;
      const sy = worldToScreenY(wy);
      // then screenToWorldY(sy) recovers wy
      expect(screenToWorldY(sy)).to.be.closeTo(wy, 1e-6);
    });
  });

  describe('zoomAt', () =>  {
    it ('zoom at 0, 0 doesn t change offset', () => {
      resetCamera();
      const zoomFactor = 1.093; 
      zoomAt(0, 0, zoomFactor);
      expect(viewScale).to.equal(1.093);
      expect(viewOffsetX).to.equal(0);
      expect(viewOffsetY).to.equal(0);
    });

    it ('zoom x 4 at 10, 0 change offset to -30 ', () => {
      resetCamera();
      const zoomFactor = 4; 
      zoomAt(10, 0, zoomFactor);
      expect(viewScale).to.equal(4);
      expect(viewOffsetX).to.equal(-30);
      expect(viewOffsetY).to.equal(0);
    });

    it ('zoom x 4 in two steps at 10, 0 change offset to -30 ', () => {
      resetCamera();
      const zoomFactor = 2; 
      zoomAt(10, 0, zoomFactor);
      expect(viewScale).to.equal(2);
      expect(viewOffsetX).to.equal(-10);
      zoomAt(10, 0, zoomFactor);
      expect(viewScale).to.equal(4);
      expect(viewOffsetX).to.equal(-30);
      expect(viewOffsetY).to.equal(0);
      });


  });


});
