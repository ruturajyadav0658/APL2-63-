import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getMyServices, createService, updateService, deleteService } from '../api/serviceService.js';

export default function ProviderServices() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || user?.role !== 'provider') return;
    (async () => {
      try {
        const data = await getMyServices(token);
        setServices(data);
      } catch (e) { setError('Failed to load services'); }
    })();
  }, [user]);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    try {
      if (editingId) {
        const updated = await updateService(token, editingId, { title, description, price: Number(price) });
        setServices(s => s.map(x => x._id === updated._id ? updated : x));
      } else {
        const created = await createService(token, { title, description, price: Number(price) });
        setServices(s => [created, ...s]);
      }
      setTitle(''); setDescription(''); setPrice(''); setEditingId(null);
    } catch (e) {
      setError(e.message || 'Save failed');
    } finally { setLoading(false); }
  }

  function startEdit(s) {
    setEditingId(s._id);
    setTitle(s.title);
    setDescription(s.description || '');
    setPrice(String(s.price ?? ''));
  }

  async function onDelete(id) {
    const token = localStorage.getItem('token');
    if (!confirm('Delete this service?')) return;
    try {
      await deleteService(token, id);
      setServices(s => s.filter(x => x._id !== id));
    } catch (e) { setError(e.message || 'Delete failed'); }
  }

  return (
    <main className="container py-4">
      <h1 className="mb-3">Manage Services</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={onSubmit} className="row g-2 mb-4">
        <div className="col-12 col-md-3"><input className="form-control" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required /></div>
        <div className="col-12 col-md-5"><input className="form-control" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} /></div>
        <div className="col-12 col-md-2"><input className="form-control" type="number" min="0" step="1" placeholder="Price (₹/hr)" value={price} onChange={e => setPrice(e.target.value)} required /></div>
        <div className="col-12 col-md-2 d-grid"><button disabled={loading} className="btn btn-primary" type="submit">{editingId ? 'Update' : 'Add'} Service</button></div>
      </form>

      <div className="row g-3">
        {services.map(s => (
          <div key={s._id} className="col-12 col-md-6">
            <div className="card h-100">
              <div className="card-body d-flex justify-content-between align-items-start">
                <div>
                  <div className="fw-semibold">{s.title} <span className="text-muted">— ₹{s.price}/hr</span></div>
                  {s.description && <div className="text-muted small">{s.description}</div>}
                </div>
                <div className="btn-group">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(s)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(s._id)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {services.length === 0 && <div className="col-12"><div className="card"><div className="card-body">No services yet.</div></div></div>}
      </div>
    </main>
  );
}


