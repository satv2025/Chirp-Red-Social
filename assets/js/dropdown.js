document.addEventListener('DOMContentLoaded', function () {
  const dropdown = document.getElementById('videoDropdown');
  const toggleBtn = dropdown.querySelector('.dropdown-toggle');
  const menu = dropdown.querySelector('.dropdown-menu');

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

  // Cambiar video con DPlayer
  menu.querySelectorAll('div').forEach(option => {
    option.addEventListener('click', () => {
      const filename = option.getAttribute('data-src');
      toggleBtn.textContent = 'Señal: ' + option.textContent;

      // Usar dp globalmente
      if (window.dp) {
        window.dp.switchVideo({
          url: 'assets/media/videos/' + filename,
          type: 'auto' // Usa auto para detectar hls si es necesario
        });
        window.dp.play();
      }

      dropdown.classList.remove('show');
    });
  });
});