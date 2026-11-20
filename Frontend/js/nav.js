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
    nav.appendChild(enlace('Favoritos', 'favoritos.html'));
    nav.appendChild(enlace('Mis listas', 'listas.html'));

    const usuario = getUsuario();
    if (usuario && usuario.USnombre) {
      const saludo = document.createElement('span');
      saludo.className = 'saludo';
      saludo.textContent = 'Hola, ' + usuario.USnombre;
      nav.appendChild(saludo);
    }

    const salir = document.createElement('button');
    salir.textContent = 'Salir';
    salir.addEventListener('click', () => {
      cerrarSesion();
      location.href = 'index.html';
    });
    nav.appendChild(salir);
  } else {
    nav.appendChild(enlace('Iniciar sesión', 'login.html'));
    nav.appendChild(enlace('Registrarse', 'registro.html'));
  }
})();