const lista = document.getElementById('lista');
const estado = document.getElementById('estado');

if (!getToken()) {
  location.href = 'login.html?volver=favoritos.html';
}

function crearTarjeta(r) {
  const contenedor = document.createElement('div');
  contenedor.className = 'tarjeta';

  const enlace = document.createElement('a');
  enlace.className = 'enlace-tarjeta';
  enlace.href = 'receta.html?id=' + r.RECid;

  let foto;
  if (r.RECimagen) {
    foto = document.createElement('img');
    foto.src = r.RECimagen;
    foto.alt = r.RECtitulo;
  } else {
    foto = document.createElement('div');
    foto.textContent = '🍽️';
  }
  foto.classList.add('foto');

  const cuerpo = document.createElement('div');
  cuerpo.className = 'cuerpo';
  const titulo = document.createElement('h2');
  titulo.textContent = r.RECtitulo;
  const etiquetas = document.createElement('div');
  etiquetas.className = 'etiquetas';
  const tiempo = document.createElement('span');
  tiempo.textContent = r.RECtiempo ? '⏱ ' + r.RECtiempo + ' min' : '';
  const dif = document.createElement('span');
  dif.textContent = r.RECdificultad || '';
  etiquetas.append(tiempo, dif);
  cuerpo.append(titulo, etiquetas);
  enlace.append(foto, cuerpo);

  const quitar = document.createElement('button');
  quitar.className = 'btn-quitar';
  quitar.textContent = 'Quitar de favoritos';
  quitar.addEventListener('click', async () => {
    quitar.disabled = true;
    try {
      await api('/favoritos/' + r.RECid, { method: 'DELETE' });
      contenedor.remove();
      if (!lista.children.length) estado.textContent = 'Aún no tienes recetas favoritas.';
    } catch (err) {
      quitar.disabled = false;
      estado.textContent = err.message;
    }
  });

  contenedor.append(enlace, quitar);
  return contenedor;
}

async function cargar() {
  estado.textContent = 'Cargando...';
  try {
    const favoritos = await api('/favoritos');
    lista.replaceChildren(...favoritos.map(crearTarjeta));
    estado.textContent = favoritos.length ? '' : 'Aún no tienes recetas favoritas.';
  } catch (err) {
    estado.textContent = 'No se pudieron cargar los favoritos: ' + err.message;
  }
}

if (getToken()) cargar();