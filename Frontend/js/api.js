const API_URL = 'http://localhost:3000';

function getToken() {
  return localStorage.getItem('token');
}

async function api(ruta, opciones = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opciones.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = 'Bearer ' + token;

  const res = await fetch(API_URL + ruta, { ...opciones, headers });
  const datos = await res.json().catch(() => null);

  if (!res.ok) throw new Error((datos && datos.error) || 'Error ' + res.status);
  return datos;
}