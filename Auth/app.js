import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

import { firebaseConfig } from "../config.js";

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const userEmail = document.querySelector("#userEmail");
const userPassword = document.querySelector("#userPassword");
const authForm = document.querySelector("#authForm");
const signUpButton = document.querySelector("#signUpButton");
const signInButton = document.querySelector("#signInButton");

const userSignUp = async () => {
  const signUpEmail = userEmail.value;
  const signUpPassword = userPassword.value;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      signUpEmail,
      signUpPassword
    );
    const user = userCredential.user;
    console.log(user);
  } catch (err) {
    const errorCode = err.code;
    const errorMessage = err.message;
    console.log(errorCode + errorMessage);
  }
};

const userSignIn = async () => {
  const signInEmail = userEmail.value;
  const signInPassword = userPassword.value;

  try {
    await signInWithEmailAndPassword(auth, signInEmail, signInPassword);
    // const user = userCredential.user;
  } catch (err) {
    const errorCode = err.code;
    const errorMessage = err.message;
    console.log(errorCode + errorMessage);
  }
};

const checkAuthState = async () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = "../Home/index.html";
    }
  });
};

checkAuthState();

signUpButton.addEventListener("click", userSignUp);
signInButton.addEventListener("click", userSignIn);
// signOutButton.addEventListener("click", userSignOut);
