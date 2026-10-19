(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const enlace = (texto, href) => {
    const a = document.createElement('a');
    a.textContent = texto;
    a.href = href;
    return a;
  };

  nav.appendChild(enlace('Recetas', 'index.html'));

  if (getToken()) {
    const salir = document.createElement('button');
    salir.textContent = 'Salir';
    salir.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      location.href = 'index.html';
    });
    nav.appendChild(salir);
  } else {
    nav.appendChild(enlace('Iniciar sesión', 'login.html'));
  }
})();