const lista = document.getElementById('lista');
const estado = document.getElementById('estado');
const buscador = document.getElementById('buscador');
const selCategoria = document.getElementById('categoria');

let recetas = [];

async function cargarCategorias() {
  const categorias = await api('/categorias');
  categorias.forEach(c => {
    const op = document.createElement('option');
    op.value = c.CAid;
    op.textContent = c.CAnombre;
    selCategoria.appendChild(op);
  });
}

async function cargarRecetas() {
  estado.textContent = 'Cargando...';
  try {
    const cat = selCategoria.value;
    recetas = await api(cat ? `/recetas/categoria/${cat}` : '/recetas');
    pintar();
  } catch (err) {
    estado.textContent = 'No se pudieron cargar las recetas: ' + err.message;
  }
}

function crearTarjeta(r) {
  const a = document.createElement('a');
  a.className = 'tarjeta';
  a.href = 'receta.html?id=' + r.RECid;

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
  const dificultad = document.createElement('span');
  dificultad.textContent = r.RECdificultad || '';
  etiquetas.append(tiempo, dificultad);

  cuerpo.append(titulo, etiquetas);
  a.append(foto, cuerpo);
  return a;
}

function pintar() {
  const q = buscador.value.trim().toLowerCase();
  const filtradas = recetas.filter(r => r.RECtitulo.toLowerCase().includes(q));

  lista.replaceChildren(...filtradas.map(crearTarjeta));
  estado.textContent = filtradas.length ? '' : 'No hay recetas que coincidan.';
}

buscador.addEventListener('input', pintar);
selCategoria.addEventListener('change', cargarRecetas);

cargarCategorias().catch(() => {});
cargarRecetas();