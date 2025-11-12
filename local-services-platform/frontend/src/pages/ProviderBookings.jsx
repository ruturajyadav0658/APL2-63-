import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getProviderBookings, setBookingStatus } from '../api/bookingService.js';

export default function ProviderBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'provider') return;
    const token = localStorage.getItem('token');
    if (!token) return;
    (async () => {
      try {
        const data = await getProviderBookings(token);
        setBookings(data);
      } catch (e) { setError('Failed to load bookings'); }
    })();
  }, [user]);

  async function updateStatus(id, status) {
    try {
      const token = localStorage.getItem('token');
      const updated = await setBookingStatus(token, id, status);
      setBookings(b => b.map(x => x._id === updated._id ? updated : x));
    } catch (e) { setError(e.message || 'Failed to update'); }
  }

  return (
    <main className="container py-4">
      <h1 className="mb-3">Manage Bookings</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-3">
        {bookings.map(b => (
          <div key={b._id} className="col-12">
            <div className="card">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-semibold">{b?.user?.name} • {b?.service?.title}</div>
                  <div className="text-muted small">{new Date(b.date).toLocaleString()}</div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className={`badge text-uppercase ${
                    b.status === 'pending' ? 'badge-status-pending' :
                    b.status === 'confirmed' ? 'badge-status-confirmed' :
                    b.status === 'completed' ? 'badge-status-completed' :
                    b.status === 'cancelled' ? 'badge-status-cancelled' :
                    'text-bg-secondary'
                  }`}>{b.status}</span>
                  <div className="btn-group">
                    <button disabled={b.status !== 'pending'} className="btn btn-sm btn-outline-success" onClick={() => updateStatus(b._id, 'confirmed')}>Accept</button>
                    <button disabled={b.status !== 'pending'} className="btn btn-sm btn-outline-danger" onClick={() => updateStatus(b._id, 'cancelled')}>Reject</button>
                    <button disabled={b.status !== 'confirmed'} className="btn btn-sm btn-outline-primary" onClick={() => updateStatus(b._id, 'completed')}>Complete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {bookings.length === 0 && <div className="col-12"><div className="card"><div className="card-body">No bookings.</div></div></div>}
      </div>
    </main>
  );
}


