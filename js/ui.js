// ui.js
import { fetchSketchList, loadSketchById, deleteSketch, saveSketch } from "./firebase.js";
import { handleSave, handleLoad, loadSketchFromGallery, loadAssetJSON } from "./io.js";
import { login, logout, currentUserId, currentUser } from "./auth.js";
import { isMobileDevice } from './utils.js';
import { clearCanvas, toogleAutoDraw } from "./rendering.js";
import { piecesIsEmpty } from './pieces.js';

const buttonLogin = document.getElementById("button-login");
const buttonLogout = document.getElementById("button-logout");
const buttonAnimate = document.getElementById("button-animate");
const buttonPublish = document.getElementById("button-publish");
const buttonGallery = document.getElementById("button-gallery");
const buttonCanvas = document.getElementById("button-canvas");
const buttonSave = document.getElementById("button-save-file");
const buttonLoad = document.getElementById("button-load-file");
const buttonClear = document.getElementById("button-clear");
const textLoginToGallery = document.getElementById("msg-log-for-gallery");
const gallery = document.getElementById("gallery");
const userInfo = document.getElementById("logged-user");
const textWarningMobile = document.getElementById("warning-mobile");
const exampleImg1 = document.getElementById('example1');
const exampleImg2 = document.getElementById('example2');
const exampleImg3 = document.getElementById('example3');

export function initUI() {

    // two UI modes: Gallery and Canvas
    setUIModeCanvas();
    

    // Eventos de botones

    buttonLogin.addEventListener("click", async (e) => {
      posthog.capture('button_login_ok');
      try {
        await login();
        console.log("Usuario autenticado:", currentUser.displayName);
        posthog.capture('button_login_ok');
        setLoginStateButtons();
      } catch (error) {
        console.error("Error al autenticar: ", error);
        posthog.capture('button_login_ko');
      }
    });
    
    buttonAnimate.addEventListener("click", (e) => {
      //e.preventDefault();  // -->???
      posthog.capture('button_animate');
      if (piecesIsEmpty()) {
        alert ("Nothing to animate yet!. Draw something first");
      } else {
        toogleAutoDraw();
        redraw();
      }
    });    
    
    buttonGallery.addEventListener("click", (e) => {
      //e.preventDefault();  // -->???
      posthog.capture('button_gallery');
      setUIModeGallery();
      renderGallery();
    });

    buttonCanvas.addEventListener("click", (e) => {
      posthog.capture('button_canvas');
      setUIModeCanvas();  
    });

    buttonLogout.addEventListener("click", (e) => {
      posthog.capture('button_logout');
      logout();
      localStorage.removeItem("user");
      setLoginStateButtons() ;
      console.log("Usuario desconectado");
    });
    

    buttonPublish.addEventListener("click", (e) => {    
    posthog.capture('button_publish');
     saveSketch();
    });
    buttonSave.addEventListener("click", (e) => {    
    posthog.capture('button_save');
     handleSave();
    });
    buttonLoad.addEventListener("click", (e) => {    
    posthog.capture('button_load');
     handleLoad();
    });
    buttonClear.addEventListener("click", (e) => {    
    posthog.capture('button_clear');
     clearCanvas();
    });

    exampleImg1.addEventListener('click', () => { loadAssetJSON ("example1.json"); posthog.capture('button_example1');});
    exampleImg2.addEventListener('click', () => { loadAssetJSON ("example2.json"); posthog.capture('button_example2');});
    exampleImg3.addEventListener('click', () => { loadAssetJSON ("example3.json"); posthog.capture('button_example3');});

  if (isMobileDevice()) {
    textWarningMobile.textContent = "⚠️ Jengax is designed for desktop. Some features may not work well on mobile devices.";
    textWarningMobile.style.cssText = `
      background: #fdd;
      color: #900;
      padding: 12px;
      text-align: center;
      font-family: sans-serif;
      font-size: 14px;
      z-index: 1000;
    `;
    /*
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
    */
    //document.body.appendChild(warning);
    
    textWarningMobile.classList.remove("hidden");
  }

}     

// ---- Menu states --------------
export function setUIModeGallery() {
    gallery.classList.remove("hidden");
    buttonAnimate.classList.add("hidden");
    buttonCanvas.classList.remove("hidden");
    buttonSave.classList.add("hidden");
    buttonLoad.classList.add("hidden");
    buttonGallery.classList.add("hidden");
    buttonPublish.classList.add("hidden");
    buttonClear.classList.add("hidden");
        
}
export function setUIModeCanvas() {
    setLoginStateButtons();
    gallery.style.display = "none";
    //gallery.classList.add("hidden");
    buttonAnimate.classList.remove("hidden");
    buttonCanvas.classList.add("hidden");
    buttonSave.classList.remove("hidden");
    buttonLoad.classList.remove("hidden");
    buttonClear.classList.remove("hidden");

}

function setLoginStateButtons() {
    if (currentUser) {
        buttonGallery.classList.remove("hidden");
        buttonLogin.classList.add("hidden");
        buttonLogout.classList.remove("hidden");
        buttonPublish.classList.remove("hidden");
        textLoginToGallery.classList.add("hidden");
        userInfo.innerHTML = `
           <span>${currentUser.displayName}</span>
          `;
    } else {
        buttonGallery.classList.add("hidden");
        buttonLogin.classList.remove("hidden");
        buttonLogout.classList.add("hidden");
        buttonPublish.classList.add("hidden");
        textLoginToGallery.classList.remove("hidden");
        userInfo.innerHTML = "";
    }
}

/**
 * Pinta la lista de sketches en el div#gallery.
 */
export async function renderGallery() {
  
  //setUIModeGallery();

  gallery.innerHTML = ""; // limpia antes de pintar
  gallery.style.display = "grid";

  const list = await fetchSketchList();

  if (list.length === 0) {
    gallery.textContent = "No sketches stored.";
    return;
  }


   list.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "gallery-item";

    // Tooltip nativo con todos los detalles

    const fecha = item.createdAt
      ? item.createdAt.toLocaleDateString() 
      : "Fecha desconocida";
    const hora = item.createdAt
      ? item.createdAt.toLocaleTimeString() 
      : "";
    itemDiv.title = 
      `Name: ${item.sketchName}\n` +
      `Author: ${item.userDisplayName}\n` +
      `Upload: ${fecha}  ${hora}`;


    // Nombre 

    const nameDiv = document.createElement("div");
    nameDiv.textContent = item.sketchName;
    nameDiv.style.fontSize = "14px";
    nameDiv.style.marginTop = "2px";
    nameDiv.style.fontWeight = "bold";
    itemDiv.appendChild(nameDiv);

    const authorDiv = document.createElement("div");
    authorDiv.style.fontSize = "12px";
    authorDiv.textContent = item.userDisplayName ;
    authorDiv.style.marginTop = "2px";
    //nameDiv.style.fontWeight = "bold";
    itemDiv.appendChild(authorDiv);

    // Imagen

    const img = document.createElement("img");
    img.src = item.sketchImage;
    img.alt = item.sketchName;
    // Al clicar imagen también carga el sketch
    img.addEventListener("click", async () => {
      const data = await loadSketchById(item.id);
      setSketchData(data);
      gallery.style.display = "none";
    });
    itemDiv.appendChild(img);



    // Botones Load / Delete

    const btnWrap = document.createElement("div");
    btnWrap.className = "buttons";

    const loadBtn = document.createElement("button");
    loadBtn.textContent = "Load";
    loadBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const data = await loadSketchById(item.id);
      loadSketchFromGallery(data);
      gallery.style.display = "none";
      setUIModeCanvas();
    });
    btnWrap.appendChild(loadBtn);

    if (currentUserId && currentUserId === item.user) {
      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const msg = `Are you sure you want to delete the sketch:\n"${item.sketchName}"?\n\n` +
            `This action is irreversible.`
        if (confirm(msg)) {
          await deleteSketch(item.id);
          // refresca la galería
          renderGallery();
        }
      });
      btnWrap.appendChild(delBtn);
    }

    itemDiv.appendChild(btnWrap);
    gallery.appendChild(itemDiv);
  });
}

