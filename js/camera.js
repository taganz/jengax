// camera.js
export let viewScale = 1;
export let viewOffsetX = 0;
export let viewOffsetY = 0;


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

export function zoomAt(mouseX, mouseY, factor) {
  const wx = screenToWorldX(mouseX);
  const wy = screenToWorldY(mouseY);
  viewScale *= factor;
  viewOffsetX = mouseX - wx * viewScale;
  // Invert the Y axis correction:
  viewOffsetY = mouseY - (height - wy * viewScale);
}

export function pan(dx, dy) {
  viewOffsetX += dx;
  viewOffsetY += dy;
}