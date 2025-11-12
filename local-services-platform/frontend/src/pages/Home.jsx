import React from 'react';
import Footer from '../components/Footer.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { user, initializing } = useAuth();
  return (
    <div>
      <main className="container py-5">
        {/* HERO */}
        <section className="hero rounded-4 p-5 mb-5">
          <div className="text-center">
            <h1 className="display-5 fw-bold mb-3">
              {(!initializing && user?.name) ? (
                <>Welcome{user.name ? `, ${user.name}` : ''}</>
              ) : (
                <>Hire top-rated local professionals, instantly</>
              )}
            </h1>
            <p className="fs-5 mb-4 text-muted">
              {user ? (
                user.role === 'provider'
                  ? 'Showcase your expertise, manage bookings, and grow your business.'
                  : 'Browse services, compare prices, and book with confidence—anytime.'
              ) : (
                'From cleaning to repairs—book trusted pros near you in minutes.'
              )}
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              {!user && (
                <a className="btn btn-light btn-lg px-4" href="/services">Explore Services</a>
              )}
              {user && user.role === 'user' && (
                <>
                  <a className="btn btn-light btn-lg px-4" href="/services">Explore Services</a>
                  <a className="btn btn-outline-light btn-lg px-4" href="/bookings">My Bookings</a>
                </>
              )}
              {user && user.role === 'provider' && (
                <>
                  <a className="btn btn-light btn-lg px-4" href="/provider/services">Manage Services</a>
                  <a className="btn btn-outline-light btn-lg px-4" href="/provider/bookings">View Bookings</a>
                </>
              )}
            </div>
          </div>
        </section>

        {/* POPULAR CATEGORIES */}
        <section className="mb-5">
          <div className="text-center mb-4">
            <h2 className="h4 mb-2">Popular categories</h2>
            <a className="text-decoration-none" href="/services">Explore all →</a>
          </div>
          <div className="row g-3 justify-content-center">
            {[
              { title: 'Home Cleaning', emoji: '🧽', href: '/services' },
              { title: 'Plumbing', emoji: '🔧', href: '/services' },
              { title: 'Electrical', emoji: '💡', href: '/services' },
              { title: 'Salon at Home', emoji: '💅', href: '/services' },
            ].map(cat => (
              <div key={cat.title} className="col-12 col-sm-6 col-md-3">
                <a className="card h-100 text-decoration-none" href={cat.href}>
                  <div className="card-body d-flex align-items-center gap-2">
                    <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                    <div className="h6 m-0">{cat.title}</div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}


