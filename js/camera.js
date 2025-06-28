// camera.js
export let viewScale;
export let viewOffsetX;
export let viewOffsetY;

export function resetCamera() {
  viewScale = 1;
  viewOffsetX = 0;
  viewOffsetY = 0;

}

export function setCamera(scale, offsetX, offsetY) {
  viewScale = scale;
  viewOffsetX = offsetX;
  viewOffsetY = offsetY;
} 
export function screenToWorldX(sx) {
  return (sx - viewOffsetX) / viewScale;
}
export function screenToWorldY(sy) {
  return (height + viewOffsetY - sy) / viewScale;
}

export function worldToScreenX(wx) {
  return wx * viewScale + viewOffsetX;
}
export function worldToScreenY(wy) {
  return height + viewOffsetY - wy * viewScale;
}

export function zoomAt(mouseX, mouseY, zoomFactor) {
  // veure demo https://openprocessing.org/sketch/2680897
  viewOffsetX = mouseX + (viewOffsetX - mouseX) * zoomFactor;
  viewScale *= zoomFactor;
  
}

export function pan(dx, dy) {
  viewOffsetX += dx;
  viewOffsetY += dy;
}