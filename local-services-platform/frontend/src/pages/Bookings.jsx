import React, { useEffect, useState } from 'react';
import { getMyBookings } from '../api/bookingService.js';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not logged in');
        const data = await getMyBookings(token);
        setBookings(data);
      } catch (e) {
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="container py-4">
      <h1 className="mb-3">My Bookings</h1>
      {loading && <div className="alert alert-info">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-3">
        {bookings.map(b => (
          <div className="col-12 col-md-6" key={b._id}>
            <div className="card h-100">
              <div className="card-body d-flex justify-content-between align-items-start">
                <div>
                  <div className="fw-semibold">{b?.service?.title || 'Service'}</div>
                  <div className="text-muted small">{new Date(b.date).toLocaleString()}</div>
                </div>
                <span className={`badge text-uppercase ${
                  b.status === 'pending' ? 'badge-status-pending' :
                  b.status === 'confirmed' ? 'badge-status-confirmed' :
                  b.status === 'completed' ? 'badge-status-completed' :
                  b.status === 'cancelled' ? 'badge-status-cancelled' :
                  'text-bg-secondary'
                }`}>{b.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}


