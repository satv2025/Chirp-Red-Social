function formatearTiempo(tiempo) {
  // Recibe un string tipo "m:ss" o "mm:ss" y devuelve "mm:ss" con ceros delante
  const partes = tiempo.split(':');
  if (partes.length !== 2) return tiempo; // si no tiene formato esperado, devuelve igual
  const min = partes[0].padStart(2, '0');
  const seg = partes[1].padStart(2, '0');
  return `${min}:${seg}`;
}

function formatearTiemposPlayer() {
  const ptime = document.querySelector('.dplayer-ptime');
  const dtime = document.querySelector('.dplayer-dtime');

  if (ptime && ptime.textContent) {
    ptime.textContent = formatearTiempo(ptime.textContent.trim());
  }

  if (dtime && dtime.textContent) {
    dtime.textContent = formatearTiempo(dtime.textContent.trim());
  }
}

// Llamar esta función justo después de que DPlayer haya cargado los tiempos
formatearTiemposPlayer();