import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './styles/Auth.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      setError('Please fill all required fields.'); return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.'); return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    setLoading(true); setError('');
    try {
      await register(form.username, form.email, form.password);
      navigate('/');
    } catch (err) {
      const data = err?.response?.data;
      const msg = typeof data === 'object'
        ? Object.values(data).flat().join(' ')
        : 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const strength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 8 ? 2
    : (form.password.match(/[A-Z]/) && form.password.match(/[0-9]/)) ? 4
    : 3;

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-content">
          <Link to="/" className="auth-logo">
            <span className="logo-mark">F</span>
            <span className="logo-text">ILMHUB</span>
          </Link>
          <h2 className="auth-visual-headline">Your story starts now.</h2>
          <p className="auth-visual-sub">Join thousands of film lovers discovering the next generation of storytellers. Free to start.</p>
          <ul className="auth-perks">
            {['Watch free films instantly', 'Build your personal watchlist', 'Rate and review films', 'Get personalized recommendations'].map((p, i) => (
              <li key={i}><span className="perk-check">✓</span>{p}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <h1 className="auth-form-title">Create account</h1>
            <p className="auth-form-subtitle">Join FilmHub for free</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-text">{error}</div>}

            <div className="form-group">
              <label className="form-label">Username *</label>
              <input name="username" className="form-input" placeholder="Choose a username"
                value={form.username} onChange={handleChange} autoComplete="username" required />
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input name="email" type="email" className="form-input" placeholder="your@email.com"
                value={form.email} onChange={handleChange} autoComplete="email" required />
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <input name="password" type="password" className="form-input" placeholder="Min. 6 characters"
                value={form.password} onChange={handleChange} autoComplete="new-password" required />
              {form.password && (
                <div className="password-strength">
                  <div className="strength-bars">
                    {[1,2,3,4].map(n => (
                      <div key={n} className={`strength-bar ${n <= strength ? `s${strength}` : ''}`} />
                    ))}
                  </div>
                  <span className="strength-label">
                    {['', 'Too short', 'Weak', 'Good', 'Strong'][strength]}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input name="confirm" type="password" className="form-input" placeholder="Repeat password"
                value={form.confirm} onChange={handleChange} autoComplete="new-password" required />
              {form.confirm && form.password !== form.confirm && (
                <p style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>Passwords don't match</p>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
              {loading ? <><div className="spinner" style={{width:18,height:18,borderWidth:2}} /> Creating account…</> : 'Create Free Account'}
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login">Sign in →</Link>
          </p>

          <p className="auth-back">
            <Link to="/">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
