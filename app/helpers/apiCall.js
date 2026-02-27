export async function apiCall(endpoint, method = 'GET', data = null) {

  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (data) options.body = JSON.stringify(data);
  const res = await fetch('https://streamlab.com.ar/server/process_streamlab.php' + endpoint, options);

  return await res.json();
}

export async function getAllReservas(method = 'GET', data = null) {

  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (data) options.body = JSON.stringify(data);
  const res = await fetch('https://streamlab.com.ar/server/api.php/reservas');

  return await res.json();
}

export async function subirReserva(endpoint, method = 'POST', data = null) {

  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (data) options.body = JSON.stringify(data);
  const res = await fetch('https://streamlab.com.ar/server/process_streamlab.php' + endpoint, options);

  return await res.json();
}

export async function crearPago(endpoint = '', method = 'POST', data = null) {

  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (data) options.body = JSON.stringify(data);
  const res = await fetch('https://streamlab.com.ar/server/mercado-pago/pagos.php' + endpoint, options);

  return await res.json();
}

export async function verSalas(method = 'GET', data = null) {

  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (data) options.body = JSON.stringify(data);
  const res = await fetch('https://streamlab.com.ar/server/api.php/salas');

  return await res.json();
}
