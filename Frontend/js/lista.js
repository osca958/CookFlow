const id = new URLSearchParams(location.search).get('id');
const estado = document.getElementById('estado');
const ul = document.getElementById('items');
let nombreActual = '';

if (!getToken()) location.href = 'login.html?volver=' + encodeURIComponent('lista.html?id=' + id);

function crearItem(i) {
  const li = document.createElement('li');
  li.className = 'lista-item';

  const texto = document.createElement('span');
  const cant = [i.LCcantidad != null ? Number(i.LCcantidad) : '', i.LCunidad].filter(x => x !== '' && x != null).join(' ');
  texto.textContent = (cant ? cant + ' de ' : '') + i.INnombre;

  const quitar = document.createElement('button');
  quitar.className = 'btn-quitar btn-inline';
  quitar.textContent = 'Quitar';
  quitar.addEventListener('click', async () => {
    try {
      await api('/listas/' + id + '/items/' + i.INid, { method: 'DELETE' });
      li.remove();
      if (!ul.children.length) estado.textContent = 'La lista está vacía. Añade recetas desde su página.';
    } catch (err) { estado.textContent = err.message; }
  });

  li.append(texto, quitar);
  return li;
}

async function cargar() {
  if (!id) { estado.textContent = 'Lista no indicada.'; return; }
  try {
    const lista = await api('/listas/' + id);
    document.getElementById('titulo').textContent = lista.LCnombre;
    document.getElementById('subtitulo').textContent =
    'Para ' + (lista.LCpax || 1) + ' persona' + (lista.LCpax > 1 ? 's' : '');
    nombreActual = lista.LCnombre;
    ul.replaceChildren(...lista.items.map(crearItem));
    estado.textContent = lista.items.length ? '' : 'La lista está vacía. Añade recetas desde su página.';
  } catch (err) {
    estado.textContent = 'No se pudo cargar la lista: ' + err.message;
  }
}
document.getElementById('renombrar').addEventListener('click', async () => {
  const nuevo = prompt('Nuevo nombre (vacío = nombre por fecha):', nombreActual);
  if (nuevo === null) return;               // canceló
  try {
    await api('/listas/' + id, { method: 'PUT', body: JSON.stringify({ nombre: nuevo.trim() }) });
    cargar();
  } catch (err) { estado.textContent = err.message; }
});

if (getToken()) cargar();