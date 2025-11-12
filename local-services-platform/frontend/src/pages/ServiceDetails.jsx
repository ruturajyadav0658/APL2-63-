import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getService } from '../api/serviceService.js';
import { createBooking, getMyBookings } from '../api/bookingService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getReviews, addReview } from '../api/reviewService.js';

export default function ServiceDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [date, setDate] = useState('');
  const [bookingMsg, setBookingMsg] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewError, setReviewError] = useState('');
  const [myRating, setMyRating] = useState(5);
  const [myComment, setMyComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewMsg, setReviewMsg] = useState('');
  const [canReview, setCanReview] = useState(false);
  const [canReviewLoading, setCanReviewLoading] = useState(true);
  const { user, initializing } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!initializing && user?.role === 'provider') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, initializing, navigate]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getService(id);
        setService(data);
      } catch (e) {
        setError('Failed to load service');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      if (!user || user.role !== 'user') { setCanReview(false); setCanReviewLoading(false); return; }
      try {
        const token = localStorage.getItem('token');
        if (!token) { setCanReview(false); return; }
        const bookings = await getMyBookings(token);
        const eligible = bookings.some(b => b.service?._id === id && b.status === 'completed');
        setCanReview(eligible);
      } catch {
        setCanReview(false);
      } finally {
        setCanReviewLoading(false);
      }
    })();
  }, [user, id]);

  useEffect(() => {
    (async () => {
      try {
        const items = await getReviews(id);
        setReviews(items);
      } catch (e) {
        setReviewError('Failed to load reviews');
      } finally {
        setReviewsLoading(false);
      }
    })();
  }, [id]);

  if (!initializing && user?.role === 'provider') {
    return null;
  }

  return (
    <main className="container py-4">
      {loading && <div className="alert alert-info">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {service && (
        <div className="card">
          <div className="card-body">
            <div className="row g-3 align-items-start">
              <div className="col-12 col-md-8">
                <h1 className="card-title mb-2">{service.title}</h1>
                <p className="card-text text-muted">{service.description}</p>
                <div className="mb-3">
                  <span className="badge text-bg-warning me-2">
                    ★ {service.averageRating?.toFixed ? service.averageRating.toFixed(1) : Number(service.averageRating || 0).toFixed(1)}
                  </span>
                  <small className="text-muted">({service.reviewCount || 0} reviews)</small>
                </div>

                <h5 className="mt-4">Reviews</h5>
                {reviewsLoading && <div className="text-muted">Loading reviews…</div>}
                {reviewError && <div className="alert alert-danger">{reviewError}</div>}
                {!reviewsLoading && reviews.length === 0 && <div className="text-muted">No reviews yet.</div>}
                <div className="list-group mb-3">
                  {reviews.map(r => (
                    <div key={r._id} className="list-group-item">
                      <div className="d-flex justify-content-between">
                        <strong>{r.user?.name || 'Anonymous'}</strong>
                        <span className="text-warning">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                      </div>
                      {r.comment && <div className="text-muted mt-1">{r.comment}</div>}
                    </div>
                  ))}
                </div>

                {user?.role === 'user' && (
                  <div className="border rounded-3 p-3">
                    <h6 className="mb-2">Leave a review</h6>
                    {reviewMsg && <div className="alert alert-info py-1 mb-2">{reviewMsg}</div>}
                    {canReviewLoading && <div className="text-muted">Checking eligibility…</div>}
                    {!canReviewLoading && !canReview && (
                      <div className="alert alert-warning py-2 mb-2">
                        You can review this service after your booking is marked as completed.
                      </div>
                    )}
                    {canReview && (
                    <>
                    <div className="mb-2">
                      <label className="form-label me-2">Rating:</label>
                      <div className="d-inline-block">
                        {[1,2,3,4,5].map(v => (
                          <button
                            type="button"
                            key={v}
                            className={`btn btn-sm me-1 ${v <= (hoverRating || myRating) ? 'btn-warning' : 'btn-outline-warning'}`}
                            onMouseEnter={() => setHoverRating(v)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setMyRating(v)}
                            aria-label={`Rate ${v} star${v>1?'s':''}`}
                          >
                            {v <= (hoverRating || myRating) ? '★' : '☆'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Comment</label>
                      <textarea className="form-control" rows="3" value={myComment} onChange={e => setMyComment(e.target.value)} placeholder="Share your experience (optional)" />
                    </div>
                    <button
                      className="btn btn-outline-primary"
                      onClick={async () => {
                        try {
                          setReviewMsg('');
                          const token = localStorage.getItem('token');
                          if (!token) { setReviewMsg('Please login to review'); return; }
                          await addReview(token, id, { rating: myRating, comment: myComment });
                          setReviewMsg('Review submitted!');
                          // Refresh reviews and service meta
                          const [items, updated] = await Promise.all([getReviews(id), getService(id)]);
                          setReviews(items);
                          setService(updated);
                        } catch (e) {
                          setReviewMsg(e.message || 'Failed to submit review');
                        }
                      }}
                    >Submit Review</button>
                    </>
                    )}
                  </div>
                )}
              </div>
              <div className="col-12 col-md-4">
                <div className="p-3 border rounded-3 d-flex flex-column gap-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Rate</span>
                    <span className="h4 m-0">₹{service.price}/hr</span>
                  </div>
                  {user?.role === 'user' && (
                    <>
                      {bookingMsg && <div className="alert alert-info py-1 mb-0">{bookingMsg}</div>}
                      <label className="form-label mb-1">Select date/time</label>
                      <input type="datetime-local" className="form-control" value={date} onChange={e => setDate(e.target.value)} />
                      <button
                        className="btn btn-primary w-100"
                        onClick={async () => {
                          try {
                            setBookingMsg('');
                            const token = localStorage.getItem('token');
                            if (!token) { setBookingMsg('Please login to book'); return; }
                            if (!date) { setBookingMsg('Choose a date/time'); return; }
                            await createBooking(token, { service: id, date: new Date(date) });
                            setBookingMsg('Booking requested!');
                          } catch (e) { setBookingMsg(e.message || 'Booking failed'); }
                        }}
                      >Book Now</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


