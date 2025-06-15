// ui.js
import { fetchSketchList, loadSketchById } from "./firebase.js";
import { loadSketchFromGallery } from "./io.js";


export const buttonLogin = document.getElementById("button-login");
export const buttonLogout = document.getElementById("button-logout");
export const buttonPublish = document.getElementById("button-publish");
export const buttonGallery = document.getElementById("button-gallery");
export const gallery = document.getElementById("gallery");


/**
 * Pinta la lista de sketches en el div#gallery.
 */
export async function renderGallery() {
  const list = await fetchSketchList();
  const container = document.getElementById("gallery");
  container.innerHTML = ""; // limpia antes de pintar
  
  if (list.length === 0) {
    container.textContent = "No hay sketches guardados.";
    return;
  }

  // crea un <ul> con un <li> por sketch
  const ul = document.createElement("ul");
  list.forEach(item => {
    const li = document.createElement("li");
    // formatea fecha
    const fecha = item.createdAt
      ? item.createdAt.toLocaleString()
      : "Fecha desconocida";
    li.innerHTML = `
      <strong>${item.sketchName}</strong>
      <span>(${fecha})</span>
      <em>por ${item.user}</em>
    `;
    li.style.cursor = "pointer";
    // al hacer clic, carga y aplica el sketch
    li.addEventListener("click", async () => {
      try {
        const data = await loadSketchById(item.id);
        loadSketchFromGallery(data);
        gallery.classList.add("hidden");  
      } catch (e) {
        console.error(e);
        alert("Error al cargar el sketch.");
        gallery.classList.add("hidden"); 
      }
    });
    ul.appendChild(li);
  });
  container.appendChild(ul);
}
