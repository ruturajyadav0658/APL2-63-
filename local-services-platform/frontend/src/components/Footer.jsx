import React from 'react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="container d-flex flex-wrap justify-content-between align-items-center gap-2">
        <span className="text-muted">© {new Date().getFullYear()} Local Services</span>
        <div className="d-flex gap-3 small">
          <a className="text-decoration-none text-muted" href="/services">Services</a>
          <a className="text-decoration-none text-muted" href="/dashboard">Dashboard</a>
          <a className="text-decoration-none text-muted" href="#">Privacy</a>
          <a className="text-decoration-none text-muted" href="#">Terms</a>
        </div>
      </div>
    </footer>
  );
}


