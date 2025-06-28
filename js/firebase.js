
// data.js
import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { cnv } from "./main.js";
import { pieces } from "./pieces.js";
import { currentUser } from "./auth.js";
import { viewScale, viewOffsetX, viewOffsetY} from "./camera.js";
import { getScaledImagePNG } from './rendering.js';

/**
 * Guarda `sketchToSave` en Firestore en la colección "jengax-sketch".
 * - Añade un campo `createdAt` con la fecha/hora del servidor.
 * - Devuelve el ID del documento si todo va bien.
 */
export async function saveSketch() {
  try {
    // Referencia a la colección
    const collRef = collection(db, "jengax-sketch");

    if (!cnv || !cnv.elt) { 
        throw new Error("El canvas de p5 aún no está inicializado");
      }
    
    const sketchData  = {
      pieces : pieces, 
      user : currentUser ? currentUser.uid : null,
      userDisplayName : currentUser ? currentUser.displayName : null,
      sketchName : prompt("Nombre del sketch:"),
      //sketchImage : cnv.elt.toDataURL("image/png"), // Captura la imagen del canvas
      sketchImage : getScaledImagePNG(300),
      sketchDate : new Date().toLocaleDateString(),
      sketchTime : new Date().toLocaleTimeString(),
      renderStatus : {
        height : height,
        width : width,
        viewScale : viewScale,
        viewOffsetX : viewOffsetX,
        viewOffsetY : viewOffsetY,
      },
      stars : 0, // Inicialmente 0 estrellas
      createdAt: serverTimestamp()
      }
  

    // Guardamos el documento
    const docRef = await addDoc(collRef, sketchData);

    console.log("✅ Sketch guardado con ID:", docRef.id);
    alert("Sketch guardado correctamente");
    return docRef.id;
  } catch (error) {
      console.error("❌ Error al guardar el sketch:", error);
      alert("Error al guardar el sketch");
    throw error;
  }
}


/**
 * Recupera todos los sketches con sus metadatos.
 * @returns {Promise<Array<{ id: string, sketchName: string, user: string, createdAt: Date }>>}
 */
export async function fetchSketchList() {
  try {
    const col = collection(db, "jengax-sketch");
    const snap = await getDocs(col);
    return snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        sketchName: data.sketchName || ".",
        user: data.user,
        userDisplayName: data.userDisplayName || "Anonymous",
        sketchImage: data.sketchImage,
        createdAt: data.createdAt?.toDate() ?? null
      };
    });
  } catch (error) {
    console.error("❌ Error fetching sketches from Firestore:", error);
    return null;
    // Opción B: relanzar el error para que el llamador lo maneje
    // throw error;
  }
}

/**
 * Carga un sketch completo por ID.
 * @param {string} id — ID del documento Firestore.
 * @returns {Promise<Object>} — Datos completos del sketch.
 */
export async function loadSketchById(id) {
  const ref = doc(db, "jengax-sketch", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Sketch not found");
  return snap.data();
}

/**
 * Elimina un sketch por ID.
 */
export async function deleteSketch(id) {
  await deleteDoc(doc(db, "jengax-sketch", id));
}
