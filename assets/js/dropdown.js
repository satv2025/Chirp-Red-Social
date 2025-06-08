document.addEventListener('DOMContentLoaded', function () {
  const dropdown = document.getElementById('videoDropdown');
  const toggleBtn = dropdown.querySelector('.dropdown-toggle');
  const menu = dropdown.querySelector('.dropdown-menu');

  // URLs absolutas de los videos y miniaturas
  const videos = {
    'Telefe': {
      url: 'https://chirp.solargentinotv.com.ar/assets/media/videos/chiargtelefe.mp4',
      poster: 'https://chirp.solargentinotv.com.ar/assets/media/images/thumbs/conmebol/eliminatoriassudamericanas2026/chiargthumb.jpg'
    },
    'TyC Sports': {
      url: 'https://chirp.solargentinotv.com.ar/assets/media/videos/chiargtycsports.mp4',
      poster: 'https://chirp.solargentinotv.com.ar/assets/media/images/thumbs/conmebol/eliminatoriassudamericanas2026/chiargthumb.jpg' // Cambiá este enlace por la miniatura correcta de TyC Sports si la tenés
    },
    'Conmebol': {
      url: 'https://chirp.solargentinotv.com.ar/assets/media/videos/chiargconmebol.mp4',
      poster: 'https://chirp.solargentinotv.com.ar/assets/media/images/thumbs/conmebol/eliminatoriassudamericanas2026/chiargthumb.jpg' // Cambiá este enlace también si querés otro póster
    }
  };

  // Mostrar/ocultar menú
  toggleBtn.addEventListener('click', () => {
    dropdown.classList.toggle('show');
  });

  // Cerrar si se hace clic fuera
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });

  // Cambiar video y miniatura con DPlayer
  menu.querySelectorAll('div').forEach(option => {
    option.addEventListener('click', () => {
      const key = option.textContent.trim();
      const videoData = videos[key];

      if (!videoData) {
        console.warn('Datos no encontrados para la opción:', key);
        return;
      }

      toggleBtn.textContent = 'Señal: ' + key;

      if (window.dp) {
        window.dp.switchVideo({
          url: videoData.url,
          type: 'auto',
          poster: videoData.poster
        });
        window.dp.play();
      }

      dropdown.classList.remove('show');
    });
  });
});