import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Swal from 'sweetalert2';
import './styles/FilmApproval.css';

const FilmApproval = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchPendingFilms();
  }, []);

  const fetchPendingFilms = async () => {
    try {
      setLoading(true);
      const res = await api.get('shortfilms/');
      const all = res.data;
      // Show all films for approval management
      setFilms(all);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (filmId, action) => {
    const label = action === 'approve' ? 'Approve' : 'Reject';
    const result = await Swal.fire({
      title: `${label} Film?`,
      icon: action === 'approve' ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonColor: action === 'approve' ? '#00cc66' : '#e50914',
      confirmButtonText: label,
    });
    if (!result.isConfirmed) return;

    setProcessing(filmId);
    try {
      await api.patch(`shortfilms/${filmId}/approval/`, { action });
      setFilms(prev => prev.map(f =>
        f.id === filmId
          ? { ...f, status: action === 'approve' ? 'APPROVED' : 'REJECTED' }
          : f
      ));
      Swal.fire({
        icon: 'success',
        title: action === 'approve' ? 'Film Approved!' : 'Film Rejected',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire('Error', err?.response?.data?.error || 'Failed to update status', 'error');
    } finally {
      setProcessing(null);
    }
  };

  const pending = films.filter(f => f.status === 'PENDING');
  const approved = films.filter(f => f.status === 'APPROVED');
  const rejected = films.filter(f => f.status === 'REJECTED');

  const FilmRow = ({ film }) => (
    <div className={`film-approval-card status-${film.status.toLowerCase()}`}>
      <div className="film-card-left">
        <img
          src={film.thumbnail_url || 'https://via.placeholder.com/80x110/1a1a1a/666?text=No+Thumb'}
          alt={film.title}
          className="film-thumb"
        />
        <div className="film-card-info">
          <h4>{film.title}</h4>
          <p className="film-meta">
            <span>⏱ {film.duration_minutes} min</span>
            <span>🌐 {film.language || 'N/A'}</span>
            <span>{film.is_premium ? '👑 Premium' : '🆓 Free'}</span>
          </p>
          <p className="film-description">{(film.description || '').slice(0, 120)}...</p>
          <p className="film-uploader">By: <strong>{film.uploader_name || `User #${film.uploaded_by}`}</strong></p>
        </div>
      </div>
      <div className="film-card-right">
        <span className={`status-badge ${film.status.toLowerCase()}`}>{film.status}</span>
        <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
          {new Date(film.created_at).toLocaleDateString()}
        </div>
        {film.status === 'PENDING' && (
          <div className="approval-actions">
            <button
              className="btn-approve-film"
              onClick={() => handleApproval(film.id, 'approve')}
              disabled={processing === film.id}
            >
              {processing === film.id ? '...' : '✓ Approve'}
            </button>
            <button
              className="btn-reject-film"
              onClick={() => handleApproval(film.id, 'reject')}
              disabled={processing === film.id}
            >
              ✗ Reject
            </button>
          </div>
        )}
        {film.status !== 'PENDING' && (
          <button
            className="btn-reset-film"
            onClick={() => handleApproval(film.id, film.status === 'APPROVED' ? 'reject' : 'approve')}
          >
            {film.status === 'APPROVED' ? '✗ Revoke' : '↩ Re-approve'}
          </button>
        )}
      </div>
    </div>
  );

  if (loading) return <div className="loading-spinner"><div className="spinner-border"></div></div>;

  return (
    <div className="film-approval-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Film Approval</h1>
          <p className="page-subtitle">Review and approve submitted short films</p>
        </div>
        <div className="approval-stats">
          <div className="stat-box pending-box">
            <span className="stat-num">{pending.length}</span>
            <span className="stat-lbl">Pending</span>
          </div>
          <div className="stat-box approved-box">
            <span className="stat-num">{approved.length}</span>
            <span className="stat-lbl">Approved</span>
          </div>
          <div className="stat-box rejected-box">
            <span className="stat-num">{rejected.length}</span>
            <span className="stat-lbl">Rejected</span>
          </div>
        </div>
      </div>

      {pending.length > 0 && (
        <section>
          <h2 className="section-label">⏳ Pending Review ({pending.length})</h2>
          {pending.map(f => <FilmRow key={f.id} film={f} />)}
        </section>
      )}

      {approved.length > 0 && (
        <section>
          <h2 className="section-label">✅ Approved ({approved.length})</h2>
          {approved.map(f => <FilmRow key={f.id} film={f} />)}
        </section>
      )}

      {rejected.length > 0 && (
        <section>
          <h2 className="section-label">❌ Rejected ({rejected.length})</h2>
          {rejected.map(f => <FilmRow key={f.id} film={f} />)}
        </section>
      )}

      {films.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🎬</div>
          <h3 className="empty-state-title">No Films Yet</h3>
          <p className="empty-state-description">Films submitted by creators will appear here for review.</p>
        </div>
      )}
    </div>
  );
};

export default FilmApproval;