const id = new URLSearchParams(location.search).get('id');
const estado = document.getElementById('estado');
const articulo = document.getElementById('receta');
const mensaje = document.getElementById('mensaje');

function aviso(texto, error = false) {
  mensaje.textContent = texto;
  mensaje.className = 'mensaje' + (error ? ' error' : '');
}

function boton(texto, onClick) {
  const b = document.createElement('button');
  b.className = 'btn';
  b.textContent = texto;
  b.addEventListener('click', onClick);
  return b;
}

async function cargar() {
  if (!id) { estado.textContent = 'Receta no indicada.'; return; }
  try {
    const [r, ingredientes] = await Promise.all([
      api('/recetas/' + id),
      api('/recetas/' + id + '/ingredientes')
    ]);

    document.title = r.RECtitulo + ' - CookFlow';
    document.getElementById('titulo').textContent = r.RECtitulo;
    document.getElementById('descripcion').textContent = r.RECdescripcion || '';

    const foto = document.getElementById('foto');
    if (r.RECimagen) {
      const img = document.createElement('img');
      img.src = r.RECimagen;
      img.alt = r.RECtitulo;
      foto.replaceChildren(img);
    } else {
      foto.textContent = '🍽️';
    }

    const datos = document.getElementById('datos');
    const t = document.createElement('span');
    t.textContent = r.RECtiempo ? '⏱ ' + r.RECtiempo + ' min' : '';
    const d = document.createElement('span');
    d.textContent = r.RECdificultad || '';
    datos.replaceChildren(t, d);

    const ul = document.getElementById('ingredientes');
    if (ingredientes.length === 0) {
      ul.innerHTML = '';
      const li = document.createElement('li');
      li.textContent = 'Esta receta aún no tiene ingredientes.';
      ul.appendChild(li);
    } else {
      ul.replaceChildren(...ingredientes.map(i => {
        const li = document.createElement('li');
        const cant = [i.RIcantidad, i.RIunidad].filter(Boolean).join(' ');
        li.textContent = (cant ? cant + ' de ' : '') + (i.INnombre || '');
        return li;
      }));
    }

    pintarAcciones();
    articulo.hidden = false;
    estado.textContent = '';
  } catch (err) {
    estado.textContent = 'No se pudo cargar la receta: ' + err.message;
  }
}

async function pintarAcciones() {
  const acciones = document.getElementById('acciones');
  if (!getToken()) {
    const a = document.createElement('a');
    a.href = 'login.html?volver=' + encodeURIComponent('receta.html?id=' + id);
    a.textContent = 'Inicia sesión para guardar favoritos y crear listas de la compra';
    acciones.replaceChildren(a);
    return;
  }

  const fav = boton('♥ Añadir a favoritos', async () => {
    try {
      await api('/favoritos/' + id, { method: 'POST' });
      aviso('Añadida a favoritos');
    } catch (err) {
      aviso(err.message.includes('Ya existe') ? 'Ya está en tus favoritos' : err.message, true);
    }
  });

  const caja = document.createElement('span');
  caja.className = 'caja-lista';
  const select = document.createElement('select');

  try {
    const listas = await api('/listas');
    listas.forEach(l => {
      const op = document.createElement('option');
      op.value = l.LCid;
      op.textContent = new Date(l.LCfecha).toLocaleDateString('es-ES') + ' · ' + (l.LCpax || 1) + ' pax';
      select.appendChild(op);
    });
    if (!listas.length) {
      const op = document.createElement('option');
      op.value = '';
      op.textContent = 'Sin listas (créala en Mis listas)';
      select.appendChild(op);
      select.disabled = true;
    }
  } catch (err) { /* si falla, el selector queda vacío */ }

  const anadir = boton('🛒 Añadir a la lista', async () => {
    if (!select.value) return aviso('Primero crea una lista en "Mis listas"', true);
    try {
      await api('/listas/' + select.value + '/receta/' + id, { method: 'POST' });
      aviso('Ingredientes añadidos a la lista');
    } catch (err) { aviso(err.message, true); }
  });

  caja.append(select, anadir);
  acciones.replaceChildren(fav, caja);
}

cargar();