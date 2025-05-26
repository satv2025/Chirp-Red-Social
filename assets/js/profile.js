import {
  db,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDoc,
  doc,
  auth,
  onAuthStateChanged,
} from "./app.js";

const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get("uid");

const profilePhoto = document.getElementById("profilePhoto");
const displayNameElem = document.getElementById("displayName");
const nicknameElem = document.getElementById("nickname");
const bioElem = document.getElementById("bio");
const followersElem = document.querySelector("#followers span");
const followingElem = document.querySelector("#following span");

const tabs = document.querySelectorAll(".profile-nav button");
const tabContents = document.querySelectorAll(".tab-content");

if (!uid) {
  document.body.innerHTML = "<p>Perfil inválido o no especificado.</p>";
  throw new Error("No UID in URL");
}

// Cargar datos básicos de usuario (Firestore "users")
async function loadProfile() {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) {
    displayNameElem.textContent = "Usuario no encontrado";
    nicknameElem.textContent = "";
    bioElem.textContent = "";
    return;
  }
  const data = userDoc.data();
  displayNameElem.textContent = data.displayName || "Sin nombre";
  nicknameElem.textContent = data.nickname ? `@${data.nickname}` : "";
  bioElem.textContent = data.bio || "";
  followersElem.textContent = data.followersCount || "0";
  followingElem.textContent = data.followingCount || "0";

  if (data.photoURL) profilePhoto.src = data.photoURL;
}

// Cambiar pestañas
tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    tabs.forEach(b => b.classList.remove("active"));
    tabContents.forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(`tab${btn.dataset.tab.charAt(0).toUpperCase() + btn.dataset.tab.slice(1)}`).classList.add("active");
  });
});

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Cargar tweets, rechirps y media
function loadTweets() {
  const q = query(
    collection(db, "tweets"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc")
  );
  onSnapshot(q, snapshot => {
    const container = document.getElementById("tabTweets");
    container.innerHTML = "";
    if (snapshot.empty) {
      container.innerHTML = "<p>Este usuario no ha chirpeado aún.</p>";
      return;
    }
    snapshot.forEach(doc => {
      const data = doc.data();
      const tweet = document.createElement("div");
      tweet.className = "tweet";

      const time = new Date(data.createdAt).toLocaleString();

      tweet.innerHTML = `
        <div class="tweet-header">
          <strong>${escapeHtml(displayNameElem.textContent)}</strong>
          <span class="tweet-time">${time}</span>
        </div>
        <div class="tweet-text">${escapeHtml(data.text)}</div>
      `;
      container.appendChild(tweet);
    });
  });
}

// Para rechirps y media puedes hacer consultas similares y mostrar contenido distinto
function loadRechirps() {
  // Aquí iría la consulta a los rechirps, ejemplo ficticio:
  const container = document.getElementById("tabRechirps");
  container.innerHTML = "<p>Funcionalidad de rechirps aún no implementada.</p>";
}

function loadMedia() {
  // Aquí iría la consulta a tweets con media (imágenes, videos)
  const container = document.getElementById("tabMedia");
  container.innerHTML = "<p>Funcionalidad de media aún no implementada.</p>";
}

loadProfile();
loadTweets();
loadRechirps();
loadMedia();