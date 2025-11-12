import React from 'react';

export default function ServiceCard({ title, description, price, averageRating, reviewCount, onView }) {
  return (
    <div className="card h-100 service-card">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text text-muted">{description}</p>
        <div className="mb-2">
          <span className="badge text-bg-warning me-2">★ {Number(averageRating || 0).toFixed(1)}</span>
          <small className="text-muted">({reviewCount || 0})</small>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <span className="price">₹{price ?? '—'}/hr</span>
          {onView && <button className="btn btn-primary btn-sm" onClick={onView}>View</button>}
        </div>
      </div>
    </div>
  );
}


