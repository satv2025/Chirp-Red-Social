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

// Observar el estado de autenticación
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    console.log('Autenticado como:', user.uid);
    if (anonModal.style.display === 'none') {
      nicknameInput.disabled = false;
      submitBtn.disabled = false;
    }
  } else {
    console.log('Autenticando anónimamente...');
    signInAnonymously(auth).catch((error) => {
      alert("Error autenticando anónimamente: " + error.message);
    });
  }
});

// Cerrar el modal y habilitar inputs
modalAcceptBtn.onclick = () => {
  anonModal.style.display = 'none';
  if (currentUser) {
    nicknameInput.disabled = false;
    submitBtn.disabled = false;
  }
};

// Al hacer clic en Enviar
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

    if (!userDoc.exists()) {
      console.log('Usuario nuevo, mostrando captcha');
      captchaContainer.style.display = 'block';
      window.pendingNickname = nick;
      nicknameInput.disabled = true;
      submitBtn.disabled = true;
    } else {
      console.log('Usuario ya existe');
      console.log('UID actual:', currentUser.uid);
      console.log('UID en doc:', userDoc.data().uid);

      if (userDoc.data().uid === currentUser.uid) {
        console.log('UID coincide, redirigiendo');
        entrarConNickname(nick);
      } else {
        alert("Ese nickname ya está en uso por otro usuario.");
      }
    }
  } catch (error) {
    alert('Error consultando nickname: ' + error.message);
  }
};

// Se llama desde el captcha (por ejemplo, reCAPTCHA callback)
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

    console.log('Nuevo usuario registrado:', nick);

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

// Función para redirigir al home
function entrarConNickname(nick) {
  console.log('Redirigiendo a home con nick:', nick);
  window.location.href = `home.html?nick=${encodeURIComponent(nick)}`;
}