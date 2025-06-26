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

export function zoomAt(mouseX, mouseY, zoomFactor) {
  // veure demo https://openprocessing.org/sketch/create
  // Actualizar offsets antes de cambiar la escala
  viewOffsetX = mouseX + (viewOffsetX - mouseX) * zoomFactor;
  //viewOffsetY = 0; //mouseY + (viewOffsetY - mouseY) * zoomFactor;
  //viewOffsetY = - mouseY - height + (height + viewOffsetY - mouseY) * zoomFactor;
  // Actualizar escala
  viewScale *= zoomFactor;
  
}

export function pan(dx, dy) {
  viewOffsetX += dx;
  viewOffsetY += dy;
}