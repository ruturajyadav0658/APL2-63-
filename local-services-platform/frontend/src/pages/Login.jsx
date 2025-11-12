import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { login } from '../api/authService.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login({ email, password });
      localStorage.setItem('token', data.token);
      setUser({ _id: data._id, name: data.name, email: data.email, role: data.role });
      navigate(data.role === 'provider' ? '/welcome/provider' : '/welcome/user', { replace: true });
    } catch (e) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  if (user) {
    return <Navigate to={user.role === 'provider' ? '/welcome/provider' : '/welcome/user'} replace />;
  }

  return (
    <main className="container py-5" style={{ maxWidth: 480 }}>
      <div className="card">
        <div className="card-body p-4">
          <h1 className="mb-3">Welcome back</h1>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={onSubmit} className="vstack gap-3">
            <input className="form-control" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input className="form-control" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button disabled={loading} className="btn btn-primary" type="submit">{loading ? 'Signing in...' : 'Sign in'}</button>
          </form>
        </div>
      </div>
    </main>
  );
}


