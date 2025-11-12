import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProviderWelcome() {
  const { user } = useAuth();
  return (
    <main className="container py-5">
      <div className="card">
        <div className="card-body p-4">
          <h1 className="mb-2">Welcome{user?.name ? `, ${user.name}` : ''}!</h1>
          <p className="text-muted mb-4">Set up your services and start receiving bookings. You can manage your listings and track requests from your dashboard.</p>
         
        </div>
      </div>
    </main>
  );
}


