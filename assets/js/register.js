// assets/js/register.js
import {
  auth, db, createUserWithEmailAndPassword,
  updateProfile, doc, setDoc
} from "./app.js";

const registerForm = document.getElementById("registerForm");
const registerError = document.getElementById("registerError");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = registerForm.registerEmail.value.trim();
  const password = registerForm.registerPass.value.trim();
  const nickname = registerForm.registerNickname.value.trim();

  if (nickname.length < 3) {
    registerError.textContent = "El nickname debe tener al menos 3 caracteres";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: nickname });

    await setDoc(doc(db, "users", user.uid), {
      nickname,
      email,
      phone: "",
      profilePic: "",
      createdAt: Date.now()
    });

    window.location.href = "index.html";
  } catch (error) {
    registerError.textContent = "Error registrando usuario: " + error.message;
  }
});