import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { getCategories } from '../services/categoryService';
import Swal from 'sweetalert2';

const EditFilm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration_minutes: '',
    language: '',
    is_premium: false,
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [filmRes, catsRes] = await Promise.all([
        api.get(`shortfilms/${id}/`),
        getCategories(),
      ]);
      const film = filmRes.data;
      setFormData({
        title: film.title || '',
        description: film.description || '',
        category: film.category || '',
        duration_minutes: film.duration_minutes || '',
        language: film.language || '',
        is_premium: film.is_premium || false,
      });
      setCategories(catsRes.data);
    } catch (err) {
      Swal.fire('Error', 'Failed to load film data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`shortfilms/${id}/`, formData);
      Swal.fire({ icon: 'success', title: 'Film Updated!', timer: 1500, showConfirmButton: false });
      navigate('/films');
    } catch (err) {
      Swal.fire('Error', err?.response?.data?.detail || 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-spinner"><div className="spinner-border text-light"></div></div>;

  return (
    <div className="container mt-4 text-light">
      <div className="d-flex align-items-center gap-3 mb-4">
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/films')}>← Back</button>
        <h3 className="mb-0">Edit Film #{id}</h3>
      </div>

      <form onSubmit={handleSubmit} className="mt-2" style={{ maxWidth: 700 }}>
        <div className="mb-3">
          <label className="form-label">Title *</label>
          <input name="title" className="form-control bg-dark text-light border-secondary"
            value={formData.title} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Category *</label>
          <select name="category" className="form-control bg-dark text-light border-secondary"
            value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Description *</label>
          <textarea name="description" className="form-control bg-dark text-light border-secondary"
            rows="4" value={formData.description} onChange={handleChange} required />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Duration (minutes)</label>
            <input type="number" name="duration_minutes"
              className="form-control bg-dark text-light border-secondary"
              value={formData.duration_minutes} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Language</label>
            <input name="language" className="form-control bg-dark text-light border-secondary"
              value={formData.language} onChange={handleChange} />
          </div>
        </div>

        <div className="form-check mb-4">
          <input type="checkbox" className="form-check-input" name="is_premium"
            checked={formData.is_premium} onChange={handleChange} id="isPremium" />
          <label className="form-check-label" htmlFor="isPremium">Premium Content</label>
        </div>

        <div className="d-flex gap-3">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/films')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFilm;