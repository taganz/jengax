
import { auth } from "./firebase-config.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut, 
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js'

export let currentUser = null;
export let currentUserId = null; // ID del usuario autenticado

const provider = new GoogleAuthProvider();

//auth.languageCode = "es";   
 
export async function login() {
  try {
    let response = await signInWithPopup(auth, provider);
    currentUser = response.user;
    currentUserId = currentUser.uid; // Guardamos el ID del usuario autenticado
    localStorage.setItem("user", JSON.stringify(currentUser));
    //console.log("Usuario autenticado:", currentUser);
  } 
  catch (error) 
  {
    throw new Error(error);
  }
}

export function logout() {
  signOut(auth);
  currentUser = null;
  currentUserId = null; // Limpiamos el ID del usuario autenticado
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    currentUser = user;
    currentUserId = user.uid;
    //init(); // función que arranca tu app con el usuario logueado
  } else {
    // Usuario ha cerrado sesión o no está autenticado
  }
});
