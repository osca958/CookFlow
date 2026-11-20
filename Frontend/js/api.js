const API_URL = 'http://localhost:3000';

function getToken() {
  return localStorage.getItem('token');
}

function getUsuario() {
  try { return JSON.parse(localStorage.getItem('usuario')); }
  catch { return null; }
}

function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
}

async function api(ruta, opciones = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opciones.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = 'Bearer ' + token;

  const res = await fetch(API_URL + ruta, { ...opciones, headers });
  const datos = await res.json().catch(() => null);

  if (res.status === 401 && token && !ruta.startsWith('/usuarios/login')) {
    cerrarSesion();
    location.href = 'login.html?volver=' + encodeURIComponent(location.pathname.split('/').pop() + location.search);
    throw new Error('Sesión caducada');
  }

  if (!res.ok) throw new Error((datos && datos.error) || 'Error ' + res.status);
  return datos;
}