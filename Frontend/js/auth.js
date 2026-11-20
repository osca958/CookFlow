const form = document.getElementById('form');
const mensaje = document.getElementById('mensaje');
const esRegistro = !!document.getElementById('nombre');

async function iniciarSesion(email, password) {
  const datos = await api('/usuarios/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  localStorage.setItem('token', datos.token);
  localStorage.setItem('usuario', JSON.stringify(datos.usuario));
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  mensaje.textContent = '';
  const boton = form.querySelector('button');
  boton.disabled = true;

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    if (esRegistro){
      
      const password2 = document.getElementById('password2').value;
      if (password !== password2) {
        mensaje.textContent = 'Las contraseñas no coinciden';
        boton.disabled = false;
        return;
      }
      
        const nombre = document.getElementById('nombre').value.trim();
      await api('/usuarios/registro', {
        method: 'POST',
        body: JSON.stringify({ nombre, email, password })
      });
    }
    await iniciarSesion(email, password);

    const destino = new URLSearchParams(location.search).get('volver');
    location.href = destino || 'index.html';
  } catch (err) {
    mensaje.textContent = err.message;
    boton.disabled = false;
  }
});