// assets/js/login.js
import { auth, signInWithEmailAndPassword } from "./app.js";

const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = loginForm.loginEmail.value.trim();
  const password = loginForm.loginPass.value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "index.html";
  } catch (error) {
    loginError.textContent = "Email o contraseña incorrectos";
  }
});