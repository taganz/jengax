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
  let viewOffsetX0 = viewOffsetX, viewScale0=viewScale;
  // veure demo https://openprocessing.org/sketch/create
  // Actualizar offsets antes de cambiar la escala
  viewOffsetX = mouseX + (viewOffsetX - mouseX) * zoomFactor;
  //viewOffsetY = 0; //mouseY + (viewOffsetY - mouseY) * zoomFactor;
  //viewOffsetY = - mouseY - height + (height + viewOffsetY - mouseY) * zoomFactor;
  // Actualizar escala
  viewScale *= zoomFactor;
  console.log(`viewOffsetX: ${viewOffsetX0.toFixed(1)}->${viewOffsetX.toFixed(1)}`)
  console.log(`viewScale:   ${viewScale0.toFixed(1)}->${viewScale.toFixed(1)}  zoomFactor: ${zoomFactor.toFixed(4)}`)
  console.log(`mouseX:      ${mouseX.toFixed(1)}`)
  console.log(`wx:      ${screenToWorldX(mouseX).toFixed(1)}`)
  
}

export function pan(dx, dy) {
  viewOffsetX += dx;
  viewOffsetY += dy;
}