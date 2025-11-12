import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { register } from '../api/authService.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await register({ name, email, password, role });
      localStorage.setItem('token', data.token);
      setUser({ _id: data._id, name: data.name, email: data.email, role: data.role });
      navigate(data.role === 'provider' ? '/welcome/provider' : '/welcome/user', { replace: true });
    } catch (e) {
      setError(e.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  if (user) {
    return <Navigate to={user.role === 'provider' ? '/welcome/provider' : '/welcome/user'} replace />;
  }

  return (
    <main className="container py-5" style={{ maxWidth: 520 }}>
      <div className="card">
        <div className="card-body p-4">
          <h1 className="mb-3">Create your account</h1>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={onSubmit} className="vstack gap-3">
            <input className="form-control" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required />
            <input className="form-control" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input className="form-control" type="password" placeholder="Password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="provider">Provider</option>
            </select>
            <button disabled={loading} className="btn btn-primary" type="submit">{loading ? 'Creating account...' : 'Create account'}</button>
          </form>
        </div>
      </div>
    </main>
  );
}


