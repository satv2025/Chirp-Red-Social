import {
  auth, signInAnonymously, onAuthStateChanged,
  db, doc, getDoc, collection, addDoc, query, orderBy, onSnapshot
} from './app.js';

const tweetSection = document.getElementById('tweetSection');
const tweetInput = document.getElementById('tweetInput');
const btnTweet = document.getElementById('btnTweet');
const timeline = document.getElementById('timeline');

let currentUser = null;
let currentNick = null;

// Función para obtener parámetro nick de URL
function getNicknameFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('nick');
}

async function verifyUser(nick, uid) {
  try {
    const userDocRef = doc(db, "users", nick);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists() && userDoc.data().uid === uid) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error verificando usuario:', error);
    return false;
  }
}

// Iniciar sesión anónimo y verificar usuario
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    currentNick = getNicknameFromURL();

    if (!currentNick) {
      alert('No se encontró nickname, vuelve a iniciar sesión.');
      window.location.href = 'index';
      return;
    }

    const validUser = await verifyUser(currentNick, currentUser.uid);

    if (validUser) {
      tweetSection.classList.remove('hidden');
      timeline.innerHTML = '<p>Cargando chirps...</p>';
      cargarChirps();
    } else {
      alert('Acceso no autorizado. Por favor inicia sesión nuevamente.');
      window.location.href = 'index';
    }
  } else {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      alert('Error autenticando anónimamente: ' + error.message);
    }
  }
});

// Enviar chirp
btnTweet.onclick = async () => {
  const text = tweetInput.value.trim();
  if (!text) {
    alert('Escribe algo para chirpear.');
    return;
  }

  try {
    await addDoc(collection(db, 'chirps'), {
      nick: currentNick,
      uid: currentUser.uid,
      text,
      createdAt: new Date()
    });
    tweetInput.value = '';
  } catch (error) {
    alert('Error enviando chirp: ' + error.message);
  }
};

// Cargar y mostrar chirps en tiempo real
function cargarChirps() {
  const chirpsQuery = query(collection(db, 'chirps'), orderBy('createdAt', 'desc'));

  onSnapshot(chirpsQuery, (snapshot) => {
    if (snapshot.empty) {
      timeline.innerHTML = '<p>No hay chirps aún.</p>';
      return;
    }

    timeline.innerHTML = '';
    snapshot.forEach(doc => {
      const chirp = doc.data();
      const chirpEl = document.createElement('article');
      chirpEl.classList.add('chirp');
      chirpEl.innerHTML = `
        <p><strong>@${chirp.nick}</strong> <span style="font-size: 0.8em; color: #666;">${chirp.createdAt.toDate ? chirp.createdAt.toDate().toLocaleString() : ''}</span></p>
        <p>${chirp.text}</p>
      `;
      timeline.appendChild(chirpEl);
    });
  });
}