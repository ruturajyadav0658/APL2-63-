const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function getReviews(serviceId) {
  const res = await fetch(`${API_BASE}/reviews/${serviceId}`);
  if (!res.ok) throw new Error('Failed to load reviews');
  return res.json();
}

export async function addReview(token, serviceId, { rating, comment }) {
  const res = await fetch(`${API_BASE}/reviews/${serviceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ rating, comment }),
  });
  if (!res.ok) {
    const msg = await res.json().catch(() => ({}));
    throw new Error(msg.message || 'Failed to submit review');
  }
  return res.json();
}


