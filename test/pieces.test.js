import { pieces, clearPieces, getWorldXBounds, getCandidates,
  _getHorizontalSupport,
  piece_border, piece_sizes, piece_width
} from '../js/pieces.js';


describe('pieces', function () {
  beforeEach(function () {
    clearPieces(); 
  });

  it ('constants used in test not changed', function() {

    chai.expect(piece_width).to.equal(20);
    chai.expect(piece_sizes).to.have.ordered.members([1, 2, 3, 5, 8, 13]);
    chai.expect(piece_border).to.deep.equal(1);
    
  });

  it('getWorldXBounds() devuelve valores correctos', function () {
    pieces.push({ x: 100, y: 300, width: 20, height: 60, horizontal: false });
    pieces.push({ x: 100, y: 200, width: 20, height: 60, horizontal: false });

    chai.expect(getWorldXBounds()).to.deep.equal({ worldMinX: 90, worldMaxX: 110 });
  });


  it('_getHorizontalSupport() no vertical pieces under clic return null', function () {
    let vert1 = { x: 100, y: 30, width: 20, height: 60, horizontal: false};
    let vert2 = { x: 100, y: 30, width: 20, height: 60, horizontal: false };
    pieces.push(vert1);
    pieces.push(vert2);
    chai.expect(_getHorizontalSupport(150, 90)).to.equal(null);
  });

  it('_getHorizontalSupport() horizontal sobre 2 verticales iguales', function () {
    let vert1 = { x: 100, y: 30, width: 20, height: 60, horizontal: false};
    let vert2 = { x: 300, y: 30, width: 20, height: 60, horizontal: false };
    pieces.push(vert1);
    pieces.push(vert2);
    chai.expect(_getHorizontalSupport(150, 90)).to.deep.equal({left: vert1, right: vert2});
  });

  it('getCandidates() over 2 equal verticals returns an horizontal and a vertical', function () {
    pieces.push({ x: 100, y: 30, width: 20, height: 60, horizontal: false });
    pieces.push({ x: 300, y: 30, width: 20, height: 60, horizontal: false });
    let phori = {x: 200, y: 70, width: 240, height: 20, horizontal: true};
    let pvert = {x: 200, y: 45, width: 20, height: 90, horizontal: false};
    let candidates = getCandidates(200, 90);
    //console.log(candidates);
    chai.expect(candidates).to.deep.equal([phori, pvert]);
  });

  it('getCandidates() when empty and low returns one vertical', function () {
    let pvert = {x: 200, y: 15, width: 20, height: 30, horizontal: false};  // talla a 30
    let candidates = getCandidates(200, 30);
    console.log(candidates);
    chai.expect(candidates).to.deep.equal([pvert]);
  });
  
    it('getCandidates() when empty and very high returns all verticals', function () {
      let pvert1 =  {x: 200, y: 10,  width: 20, height: 20,  horizontal: false};  
      let pvert2 =  {x: 200, y: 20,  width: 20, height: 40,  horizontal: false};  
      let pvert3 =  {x: 200, y: 30,  width: 20, height: 60,  horizontal: false};  
      let pvert5 =  {x: 200, y: 50,  width: 20, height: 100, horizontal: false};  
      let pvert8 =  {x: 200, y: 80,  width: 20, height: 160, horizontal: false};  
      let pvert13 = {x: 200, y: 130, width: 20, height: 260, horizontal: false};  
      let candidates = getCandidates(200, 170);
      console.log(candidates);
      chai.expect(candidates).to.deep.equal([pvert1, pvert2, pvert3, pvert5, pvert8, pvert13]);
  });

    it('getCandidates() horizontals before verticals', function () {
      pieces.push({ x: 100, y: 30, width: 20, height: 60, horizontal: false });
      pieces.push({ x: 300, y: 30, width: 20, height: 60, horizontal: false });
      let candidates = getCandidates(200, 90);
      //console.log(candidates);
      let foundHorizontal = false;
      let foundHorizontalAfterVertical = false;
      for (let i = 0;i++;i< candidates.length) {
        foundVertical = foundHfoundVerticalrizontal || !candidates[i].horizontal;
        foundHorizontalAfterVertical = foundHorizontalAfterVertical || (foundVertical && candidates[i].horizontal);
      }
      chai.expect(foundHorizontalAfterVertical).to.equal(false);
  });
});