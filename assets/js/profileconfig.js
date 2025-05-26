import {
  auth, db, doc, setDoc, getDoc, updateProfile,
  onAuthStateChanged
} from "./app.js";

import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js";

const profileForm = document.getElementById("profileForm");
const photoInput = document.getElementById("photoInput");
const profilePhoto = document.getElementById("profilePhoto");
const msgStatus = document.getElementById("msgStatus");

const storage = getStorage();

let currentUser;

// 👉 Esperar a que el usuario esté logueado
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;

    // Cargar datos actuales
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      profileForm.displayName.value = user.displayName || "";
      profileForm.nickname.value = data.nickname || "";
      profileForm.bio.value = data.bio || "";
      profileForm.email.value = data.email || "";
      profileForm.phone.value = data.phone || "";
      profilePhoto.src = data.profilePic || "assets/img/default-avatar.png";
    }
  } else {
    // Redirigir si no hay usuario
    window.location.href = "login.html";
  }
});

// 👉 Manejo de subida de imagen
photoInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file || !currentUser) return;

  const fileRef = ref(storage, `profilePics/${currentUser.uid}`);
  await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(fileRef);

  // Mostrar en pantalla
  profilePhoto.src = downloadURL;

  // Guardar en Firestore y en el perfil de Firebase Auth
  await updateProfile(currentUser, { photoURL: downloadURL });
  await setDoc(doc(db, "users", currentUser.uid), {
    profilePic: downloadURL
  }, { merge: true });

  msgStatus.textContent = "✅ Foto actualizada correctamente.";
});

// 👉 Guardar los datos del formulario
profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentUser) return;

  const displayName = profileForm.displayName.value.trim();
  const nickname = profileForm.nickname.value.trim();
  const bio = profileForm.bio.value.trim();
  const email = profileForm.email.value.trim();
  const phone = profileForm.phone.value.trim();
  const password = profileForm.password.value;
  const passwordConfirm = profileForm.passwordConfirm.value;

  if (password && password !== passwordConfirm) {
    msgStatus.textContent = "❌ Las contraseñas no coinciden.";
    return;
  }

  try {
    if (displayName) {
      await updateProfile(currentUser, { displayName });
    }

    await setDoc(doc(db, "users", currentUser.uid), {
      nickname, bio, email, phone
    }, { merge: true });

    if (password) {
      await currentUser.updatePassword(password);
    }

    msgStatus.textContent = "✅ Cambios guardados correctamente.";
  } catch (err) {
    msgStatus.textContent = "❌ Error actualizando perfil: " + err.message;
  }
});