import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getMyServices } from '../api/serviceService.js';
import { getMyBookings, getProviderBookings, cancelBooking } from '../api/bookingService.js';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    setError('');
    setLoading(true);
    if (!user) {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        if (user.role === 'provider') {
          const [s, b] = await Promise.all([
            getMyServices(token),
            getProviderBookings(token),
          ]);
          setServices(s);
          setBookings(b);
        } else {
          const b = await getMyBookings(token);
          setBookings(b);
        }
      } catch (e) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setProcessing(bookingId);
    try {
      const token = localStorage.getItem('token');
      await cancelBooking(token, bookingId);
      setBookings(bookings.filter(b => b._id !== bookingId));
    } catch (e) {
      alert('Failed to cancel booking');
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days === -1) return 'Yesterday';
    if (days > 0 && days < 7) return `In ${days} days`;
    if (days < 0 && days > -7) return `${Math.abs(days)} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const providerStats = useMemo(() => {
    if (user?.role !== 'provider') return null;
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const earnings = bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + (b?.service?.price || 0), 0);
    return { total, pending, confirmed, completed, earnings };
  }, [bookings, user]);

  const userStats = useMemo(() => {
    if (user?.role === 'provider') return null;
    const total = bookings.length;
    const upcoming = bookings.filter(b => {
      const now = Date.now();
      return new Date(b.date).getTime() >= now && b.status !== 'cancelled';
    }).length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    return { total, upcoming, completed, cancelled };
  }, [bookings, user]);

  const upcomingCustomer = useMemo(() => {
    if (user?.role === 'provider') return [];
    const now = Date.now();
    return bookings
      .filter(b => new Date(b.date).getTime() >= now && b.status !== 'cancelled')
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [bookings, user]);

  const pastCustomer = useMemo(() => {
    if (user?.role === 'provider') return [];
    const now = Date.now();
    return bookings
      .filter(b => new Date(b.date).getTime() < now || b.status === 'cancelled')
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [bookings, user]);

  const filteredBookings = useMemo(() => {
    if (user?.role === 'provider') return bookings;
    return activeTab === 'upcoming' ? upcomingCustomer : pastCustomer;
  }, [activeTab, upcomingCustomer, pastCustomer, bookings, user]);

  if (loading) {
    return (
      <main className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Dashboard</h1>
          <p className="text-muted mb-0">Welcome back{user?.name ? `, ${user.name}` : ''}!</p>
        </div>
        {user?.role === 'user' && (
          <a href="/services" className="btn btn-primary">
            <span className="me-2">🔍</span>Browse Services
          </a>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {user?.role === 'provider' ? (
        <>
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <div className="text-muted small mb-1">Services</div>
                      <div className="h3 m-0 fw-bold">{services.length}</div>
                    </div>
                    <div className="fs-1 opacity-25">📋</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <div className="text-muted small mb-1">Pending</div>
                      <div className="h3 m-0 fw-bold text-warning">{providerStats?.pending ?? 0}</div>
                    </div>
                    <div className="fs-1 opacity-25">⏳</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <div className="text-muted small mb-1">Confirmed</div>
                      <div className="h3 m-0 fw-bold text-info">{providerStats?.confirmed ?? 0}</div>
                    </div>
                    <div className="fs-1 opacity-25">✅</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <div className="text-muted small mb-1">Earnings</div>
                      <div className="h3 m-0 fw-bold text-success">₹{providerStats?.earnings ?? 0}</div>
                    </div>
                    <div className="fs-1 opacity-25">💰</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h5 className="mb-3">My Services</h5>
          <div className="row g-3">
            {services.slice(0, 6).map(s => (
              <div key={s._id} className="col-12 col-md-6">
                <div className="card h-100" style={{ cursor: 'pointer' }} onClick={() => navigate(`/services/${s._id}`)}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{s.title}</h6>
                        <small className="text-muted">{s.category}</small>
                      </div>
                      <div className="h5 m-0 text-primary">₹{s.price}/hr</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {services.length === 0 && (
              <div className="col-12">
                <div className="card text-center py-5">
                  <div className="card-body">
                    <div className="fs-1 mb-3">🛠️</div>
                    <p className="text-muted">No services yet.</p>
                    <a href="/provider/services" className="btn btn-primary">Add Your First Service</a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* User Stats Cards */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <div className="text-muted small mb-1">Total Bookings</div>
                      <div className="h3 m-0 fw-bold">{userStats?.total ?? 0}</div>
                    </div>
                    <div className="fs-1 opacity-25">📅</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <div className="text-muted small mb-1">Upcoming</div>
                      <div className="h3 m-0 fw-bold text-info">{userStats?.upcoming ?? 0}</div>
                    </div>
                    <div className="fs-1 opacity-25">⏰</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <div className="text-muted small mb-1">Completed</div>
                      <div className="h3 m-0 fw-bold text-success">{userStats?.completed ?? 0}</div>
                    </div>
                    <div className="fs-1 opacity-25">✅</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <div className="text-muted small mb-1">Cancelled</div>
                      <div className="h3 m-0 fw-bold text-danger">{userStats?.cancelled ?? 0}</div>
                    </div>
                    <div className="fs-1 opacity-25">❌</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <ul className="nav nav-tabs mb-4" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => setActiveTab('upcoming')}
              >
                ⏰ Upcoming ({upcomingCustomer.length})
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'past' ? 'active' : ''}`}
                onClick={() => setActiveTab('past')}
              >
                📜 Past ({pastCustomer.length})
              </button>
            </li>
          </ul>

          {/* Bookings List */}
          <div className="row g-3">
            {filteredBookings.length > 0 ? (
              filteredBookings.map(b => (
                <div key={b._id} className="col-12 col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="flex-grow-1">
                          <h6 className="mb-2 fw-bold">{b?.service?.title || 'Service'}</h6>
                          <div className="text-muted small mb-1">
                            <span className="me-2">📅</span>
                            {formatDate(b.date)}
                          </div>
                          <div className="text-muted small mb-2">
                            <span className="me-2">🕐</span>
                            {formatTime(b.date)}
                          </div>
                          {b?.service?.provider?.name && (
                            <div className="text-muted small">
                              <span className="me-2">👤</span>
                              {b.service.provider.name}
                            </div>
                          )}
                        </div>
                        <span className={`badge text-uppercase ${
                          b.status === 'pending' ? 'badge-status-pending' :
                          b.status === 'confirmed' ? 'badge-status-confirmed' :
                          b.status === 'completed' ? 'badge-status-completed' :
                          b.status === 'cancelled' ? 'badge-status-cancelled' :
                          'text-bg-secondary'
                        }`}>{b.status}</span>
                      </div>
                      {b?.service?.price && (
                        <div className="mb-3">
                          <span className="h5 text-primary m-0">₹{b.service.price}</span>
                          <span className="text-muted small">/hr</span>
                        </div>
                      )}
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary flex-fill"
                          onClick={() => navigate(`/services/${b.service?._id}`)}
                        >
                          View Details
                        </button>
                        {activeTab === 'upcoming' && b.status !== 'cancelled' && b.status !== 'completed' && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleCancelBooking(b._id)}
                            disabled={processing === b._id}
                          >
                            {processing === b._id ? '...' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="card text-center py-5">
                  <div className="card-body">
                    <div className="fs-1 mb-3">
                      {activeTab === 'upcoming' ? '📅' : '📜'}
                    </div>
                    <h5 className="mb-2">
                      {activeTab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}
                    </h5>
                    <p className="text-muted mb-3">
                      {activeTab === 'upcoming' 
                        ? "You don't have any upcoming bookings. Start exploring services!"
                        : "You haven't completed any bookings yet."}
                    </p>
                    {activeTab === 'upcoming' && (
                      <a href="/services" className="btn btn-primary">
                        Browse Services
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}
