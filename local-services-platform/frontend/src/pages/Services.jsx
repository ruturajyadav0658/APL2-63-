import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getServices } from '../api/serviceService.js';
import ServiceCard from '../components/ServiceCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, initializing } = useAuth();

  useEffect(() => {
    if (!initializing && user?.role === 'provider') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, initializing, navigate]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (e) {
        setError('Failed to load services');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (!initializing && user?.role === 'provider') {
    return null;
  }

  return (
    <main className="container py-4">
      <h1 className="mb-3">Services</h1>
      {loading && <div className="alert alert-info">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-3">
        {services.map(s => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={s._id}>
            <ServiceCard
              title={s.title}
              description={s.description}
              price={s.price}
              averageRating={s.averageRating}
              reviewCount={s.reviewCount}
              onView={() => navigate(`/services/${s._id}`)}
            />
          </div>
        ))}
      </div>
    </main>
  );
}


