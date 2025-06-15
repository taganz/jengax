

// main.js
import { draw as p5draw }            from './rendering.js';
import { mousePressed }  from './input.js';
import { keyPressed, keyReleased, handleZoom }   from './input.js';
import { handleFile, setFileInput } from './io.js';
import { login, logout } from "./auth.js";
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';
import { auth } from "./firebase-config.js";
import { sketchToSave, saveSketch, fetchSketchList } from './firebase.js';
import { pieces } from './pieces.js';
import { buttonLogin, buttonLogout, buttonPublish, buttonGallery, gallery } from './ui.js';
import { renderGallery } from "./ui.js";
import { viewOffsetX, viewOffsetY, viewScale } from './camera.js';


export const snapToGrid = true;
let currentUser = null;



// ─── Firebase Auth ──────────────────────────────────────────────────────

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    currentUser = user;
    //init(); // función que arranca tu app con el usuario logueado
  } else {
    // Usuario ha cerrado sesión o no está autenticado
  }
});
buttonLogin.addEventListener("click", async (e) => {
  try {
    currentUser = await login();
    console.log("Usuario autenticado: ", currentUser);
    buttonLogin.classList.add("hidden");
    buttonLogout.classList.remove("hidden");
    buttonPublish.classList.remove("hidden");
    userInfo.innerHTML = `
    <img src="${currentUser.photoURL}" width="32" />
    <span>${currentUser.displayName}</span>
  `;
  } catch (error) {
    console.error("Error al autenticar: ", error);
  }
});

buttonLogout.addEventListener("click", (e) => {
  logout();
  localStorage.removeItem("user");
  buttonLogin.classList.remove("hidden");
  buttonLogout.classList.add("hidden");
  buttonPublish.classList.add("hidden");
  userInfo.innerHTML = "";
  console.log("Usuario desconectado");
  currentUser = null;
});

// --- INPUTS & UI ────────────────────────────────────────────────
const userInfo = document.getElementById("user-info");
buttonPublish.addEventListener("click", (e) => {
  sketchToSave.pieces = pieces; 
  sketchToSave.user = currentUser ? currentUser.uid : null;
  sketchToSave.sketchName = prompt("Nombre del sketch:");
  sketchToSave.sketchDescription = prompt("Descripción del sketch:");
  sketchToSave.sketchImage = ""; // Aquí deberías recoger la imagen del sketch
  sketchToSave.sketchDate = new Date().toLocaleDateString();
  sketchToSave.sketchTime = new Date().toLocaleTimeString();
  sketchToSave.renderStatus.width = width;
  sketchToSave.renderStatus.height = height;
  sketchToSave.renderStatus.viewScale = viewScale;
  sketchToSave.renderStatus.viewOffsetX = viewOffsetX;
  sketchToSave.renderStatus.viewOffsetY = viewOffsetY;

  sketchToSave.stars = 0; // Inicialmente 0 estrellas
    saveSketch()
      .then(() => {
        console.log("Sketch guardado correctamente");
        alert("Sketch guardado correctamente");
      })
      .catch((error) => {
        console.error("Error al guardar el sketch: ", error);
        alert("Error al guardar el sketch");
      });
});
buttonGallery.addEventListener("click", (e) => {
  gallery.classList.remove("hidden");
  renderGallery();
});


// ─── p5.js setup & draw ─────────────────────────────────────────────────
export function setup() {
  createCanvas(800, 600);
  noLoop();


  buttonLogin.classList.remove("hidden");
  buttonLogout.classList.add("hidden");
  buttonPublish.classList.add("hidden");
  gallery.classList.add("hidden");



  //let worldMinX = width /2 / viewScale;   // --> SERIA / O *?
  //let worldMinY = height /2 / viewScale;  // --> SERIA / O *?

  // Prevent right-click menu
  let cnv = document.querySelector('canvas');
  cnv.addEventListener('contextmenu', e => e.preventDefault());

  // Prevent page scroll on canvas wheel
  //cnv.addEventListener('wheel', e => e.preventDefault(), { passive: false });
  cnv.addEventListener('wheel', handleZoom, { passive: false });

  // Hidden file input for “Load” (L). 
  // It is created here because it is a p5.js specific function
  setFileInput(createFileInput(handleFile));
 
}

// Bind p5’s globals
// p5js espera trobar els callbacks en window i ho posem com modul no ho troba

window.setup        = setup;
window.draw         = p5draw;
window.mousePressed = mousePressed;
//window.mouseWheel   = mouseWheel;
window.keyPressed   = keyPressed;
window.keyReleased  = keyReleased;


// --> no se qui fa servir aixo
//window.worldMaxX = () => worldMinX + width / viewScale;
//window.worldMinX = () => worldMinX;


