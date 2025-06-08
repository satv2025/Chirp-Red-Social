setTimeout(() => {
  document.querySelectorAll('.dplayer-time').forEach(el => {
    el.childNodes.forEach((node) => {
      if (node.nodeType === 3 && node.textContent.includes('/')) {
        const span = document.createElement('span');
        span.classList.add('dplayer-timedivider');  // agrego la clase
        span.style.color = '#e91e63';
        span.textContent = ' / ';
        el.replaceChild(span, node);
      }
    });
  });
}, 1000); // Espera 1 segundo