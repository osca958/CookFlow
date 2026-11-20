const id = new URLSearchParams(location.search).get('id');
const estado = document.getElementById('estado');
const ul = document.getElementById('items');

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
    document.getElementById('titulo').textContent =
      'Lista para ' + (lista.LCpax || 1) + ' persona' + (lista.LCpax > 1 ? 's' : '');
    ul.replaceChildren(...lista.items.map(crearItem));
    estado.textContent = lista.items.length ? '' : 'La lista está vacía. Añade recetas desde su página.';
  } catch (err) {
    estado.textContent = 'No se pudo cargar la lista: ' + err.message;
  }
}

if (getToken()) cargar();