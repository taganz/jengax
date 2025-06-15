
import { auth } from "./firebase-config.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js'


const provider = new GoogleAuthProvider();

//auth.languageCode = "es";   
 
export async function login() {
  try {
    const response = await signInWithPopup(auth, provider);
    return response.user;
  } catch (error) {
    throw new Error(error);
  }
}

export function logout() {
  signOut(auth);
}