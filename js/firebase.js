
// data.js
import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

export const sketchToSave = {
    pieces: [],
    user: null,
    sketchName: "",
    sketchDescription: "",
    sketchImage: "",
    sketchDate: "",
    sketchTime: "",
    renderStatus: {
      width : 800,
      height : 600,
      viewScale: 1,
      viewOffsetX: 0,
      viewOffsetY: 0
    },
    stars: 0
}


/**
 * Guarda `sketchToSave` en Firestore en la colección "jengax-sketch".
 * - Añade un campo `createdAt` con la fecha/hora del servidor.
 * - Devuelve el ID del documento si todo va bien.
 */
export async function saveSketch() {
  try {
    // Referencia a la colección
    const collRef = collection(db, "jengax-sketch");

    // Añadimos createdAt por si quieres ordenarlos por fecha real de guardado
    const sketchData = {
      ...sketchToSave,
      createdAt: serverTimestamp()
    };

    // Guardamos el documento
    const docRef = await addDoc(collRef, sketchData);

    console.log("✅ Sketch guardado con ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error al guardar el sketch:", error);
    throw error;
  }
}


/**
 * Recupera todos los sketches con sus metadatos.
 * @returns {Promise<Array<{ id: string, sketchName: string, user: string, createdAt: Date }>>}
 */
export async function fetchSketchList() {
  const col = collection(db, "jengax-sketch");
  const snap = await getDocs(col);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      sketchName: data.sketchName,
      user: data.user,
      createdAt: data.createdAt?.toDate() ?? null
    };
  });
}

/**
 * Carga un sketch completo por ID.
 * @param {string} id — ID del documento Firestore.
 * @returns {Promise<Object>} — Datos completos del sketch.
 */
export async function loadSketchById(id) {
  const ref = doc(db, "jengax-sketch", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Sketch no encontrado");
  return snap.data();
}
