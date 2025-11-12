const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function getServices() {
  const res = await fetch(`${API_BASE}/services`);
  if (!res.ok) throw new Error('Failed to load services');
  return res.json();
}

export async function getService(id) {
  const res = await fetch(`${API_BASE}/services/${id}`);
  if (!res.ok) throw new Error('Failed to load service');
  return res.json();
}

export async function createService(token, payload) {
  const res = await fetch(`${API_BASE}/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create service');
  return res.json();
}

export async function getMyServices(token) {
  const res = await fetch(`${API_BASE}/services/me/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to load my services');
  return res.json();
}

export async function updateService(token, id, payload) {
  const res = await fetch(`${API_BASE}/services/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update service');
  return res.json();
}

export async function deleteService(token, id) {
  const res = await fetch(`${API_BASE}/services/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete service');
  return res.json();
}


