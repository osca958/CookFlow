const ul = document.getElementById('listas');
const estado = document.getElementById('estado');
const form = document.getElementById('form-nueva');

if (!getToken()) location.href = 'login.html?volver=listas.html';

function formatearFecha(f) {
  return f ? new Date(f).toLocaleDateString('es-ES') : '';
}

function crearItem(l) {
  const li = document.createElement('li');
  li.className = 'lista-item';

  const enlace = document.createElement('a');
  enlace.href = 'lista.html?id=' + l.LCid;
  enlace.textContent = 'Lista del ' + formatearFecha(l.LCfecha) + ' · ' + (l.LCpax || 1) + ' pax';

  const borrar = document.createElement('button');
  borrar.className = 'btn-quitar btn-inline';
  borrar.textContent = 'Eliminar';
  borrar.addEventListener('click', async () => {
    if (!confirm('¿Eliminar esta lista?')) return;
    try {
      await api('/listas/' + l.LCid, { method: 'DELETE' });
      li.remove();
      if (!ul.children.length) estado.textContent = 'Aún no tienes listas.';
    } catch (err) { estado.textContent = err.message; }
  });

  li.append(enlace, borrar);
  return li;
}

async function cargar() {
  estado.textContent = 'Cargando...';
  try {
    const listas = await api('/listas');
    ul.replaceChildren(...listas.map(crearItem));
    estado.textContent = listas.length ? '' : 'Aún no tienes listas.';
  } catch (err) {
    estado.textContent = 'No se pudieron cargar las listas: ' + err.message;
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const r = await api('/listas', {
      method: 'POST',
      body: JSON.stringify({ pax: Number(document.getElementById('pax').value) })
    });
    location.href = 'lista.html?id=' + r.id;
  } catch (err) { estado.textContent = err.message; }
});

if (getToken()) cargar();