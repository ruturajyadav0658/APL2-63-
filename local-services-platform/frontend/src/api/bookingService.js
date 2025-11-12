const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function getMyBookings(token) {
  const res = await fetch(`${API_BASE}/bookings/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to load bookings');
  return res.json();
}

export async function createBooking(token, payload) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create booking');
  return res.json();
}

export async function cancelBooking(token, id) {
  const res = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to cancel booking');
  return res.json();
}

export async function getProviderBookings(token) {
  const res = await fetch(`${API_BASE}/bookings/provider`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to load provider bookings');
  return res.json();
}

export async function setBookingStatus(token, id, status) {
  const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update booking');
  return res.json();
}


