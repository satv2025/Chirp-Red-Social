import {
  auth, signInAnonymously,
  db, doc, getDoc, setDoc,
  onAuthStateChanged
} from './app.js';

const submitBtn = document.getElementById('submitBtn');
const nicknameInput = document.getElementById('nickname');
const captchaContainer = document.getElementById('captchaContainer');
const anonModal = document.getElementById('anonModal');
const modalAcceptBtn = document.getElementById('modalAcceptBtn');

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    if (anonModal.style.display === 'none') {
      nicknameInput.disabled = false;
      submitBtn.disabled = false;
    }
  } else {
    signInAnonymously(auth).catch((error) => {
      alert("Error autenticando anónimamente: " + error.message);
    });
  }
});

modalAcceptBtn.onclick = () => {
  anonModal.style.display = 'none';
  if (currentUser) {
    nicknameInput.disabled = false;
    submitBtn.disabled = false;
  }
};

submitBtn.onclick = async () => {
  const nick = nicknameInput.value.trim();
  if (!nick) {
    alert('Por favor ingresa un nickname.');
    return;
  }

  if (!currentUser) {
    alert('Autenticando, espera un momento e intenta de nuevo.');
    return;
  }

  try {
    const userDocRef = doc(db, "users", nick);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Si ya existe y el uid coincide, entra sin captcha
      if (userDoc.data().uid === currentUser.uid) {
        entrarConNickname(nick);
      } else {
        alert("Ese nickname ya está en uso por otro usuario.");
      }
    } else {
      // Mostrar captcha si es un nuevo usuario
      window.pendingNickname = nick;
      captchaContainer.style.display = 'block';
      nicknameInput.disabled = true;
      submitBtn.disabled = true;
    }
  } catch (error) {
    alert('Error consultando nickname: ' + error.message);
  }
};

// Función invocada al pasar el captcha
window.checkCaptcha = async function (token) {
  if (!window.pendingNickname) {
    alert('Error inesperado, refresca la página.');
    return;
  }

  const nick = window.pendingNickname;

  if (!currentUser) {
    alert('Autenticando, espera un momento e intenta de nuevo.');
    return;
  }

  try {
    const userDocRef = doc(db, "users", nick);
    await setDoc(userDocRef, {
      createdAt: new Date(),
      captchaPassed: true,
      uid: currentUser.uid
    });

    captchaContainer.style.display = 'none';
    nicknameInput.disabled = false;
    submitBtn.disabled = false;
    entrarConNickname(nick);
  } catch (err) {
    alert('Error al crear usuario: ' + err.message);
    captchaContainer.style.display = 'none';
    nicknameInput.disabled = false;
    submitBtn.disabled = false;
  }
};

function entrarConNickname(nick) {
  window.location.href = `home.html?nick=${encodeURIComponent(nick)}`;
}