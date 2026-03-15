import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';
import './styles/Subscriptions.css';

const Subscriptions = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('subscriptions/plans/')
      .then(r => setPlans(r.data?.results || r.data || []))
      .catch(() => setPlans([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = (plan) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    Swal.fire({
      icon: 'info',
      title: `${plan.name}`,
      html: `<p style="color:#a09e98;font-size:15px">Payment integration required.<br>
        This plan costs <strong style="color:#c9a84c">₹${plan.price}</strong> for ${plan.duration_days} days.</p>`,
      confirmButtonColor: '#c9a84c',
      confirmButtonText: 'Got it',
      background: '#111',
      color: '#f2f0ea',
    });
  };

  const fallbackPlans = [
    { id: 'free',   name: 'Free',    price: '0',  duration_days: null, description: 'Access to all free short films', features: ['Unlimited free films', 'HD quality', 'Community reviews', 'Personal watchlist'] },
    { id: 'basic',  name: 'Basic',   price: '99', duration_days: 30,   description: 'Perfect for casual viewers', features: ['Everything in Free', 'Premium films', 'No ads', 'Download for offline'] },
    { id: 'annual', name: 'Premium', price: '799', duration_days: 365, description: 'Best value for film enthusiasts', features: ['Everything in Basic', 'Early access', 'Behind-the-scenes', 'Creator Q&A access'], popular: true },
  ];

  const displayPlans = plans.length > 0 ? plans : fallbackPlans;

  return (
    <div className="subs-page">
      {/* Header */}
      <div className="subs-header">
        <p className="subs-eyebrow">FilmHub Plans</p>
        <h1 className="subs-title">Unlock the Full Cinema</h1>
        <p className="subs-subtitle">
          From free independent films to exclusive premium content — find the plan that fits your world.
        </p>
      </div>

      {/* Plans */}
      {loading ? (
        <div className="subs-plans-grid container">
          {[1,2,3].map(i => (
            <div key={i} className="plan-card-skel">
              <div className="skeleton" style={{ height: 28, width: '60%', marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 48, width: '40%', marginBottom: 20 }} />
              <div className="skeleton" style={{ height: 14, marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 14, marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 14, marginBottom: 28, width: '80%' }} />
              <div className="skeleton" style={{ height: 44, borderRadius: 8 }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="subs-plans-grid container">
          {displayPlans.map((plan, i) => {
            const isPopular = plan.popular || i === displayPlans.length - 1 && displayPlans.length > 1;
            const isFree    = plan.price === '0' || plan.price === 0;
            const features  = plan.features || [plan.description];

            return (
              <div key={plan.id} className={`plan-card ${isPopular ? 'popular' : ''} ${isFree ? 'free-plan' : ''}`}>
                {isPopular && <div className="plan-popular-badge">Most Popular</div>}

                <div className="plan-header">
                  <h2 className="plan-name">{plan.name}</h2>
                  <div className="plan-price">
                    {isFree ? (
                      <span className="price-free">Free</span>
                    ) : (
                      <>
                        <span className="price-currency">₹</span>
                        <span className="price-amount">{plan.price}</span>
                        <span className="price-period">
                          /{plan.duration_days === 365 ? 'year' : plan.duration_days === 30 ? 'month' : `${plan.duration_days} days`}
                        </span>
                      </>
                    )}
                  </div>
                  {plan.description && <p className="plan-desc">{plan.description}</p>}
                </div>

                <ul className="plan-features">
                  {features.map((feat, fi) => (
                    <li key={fi}>
                      <span className="feat-check">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <button
                  className={`btn plan-btn ${isPopular ? 'btn-gold' : isFree ? 'btn-outline' : 'btn-primary'}`}
                  onClick={() => isFree ? navigate('/register') : handleSubscribe(plan)}
                >
                  {isFree ? 'Get Started Free' : user?.is_subscribed ? 'Current Plan' : `Subscribe — ₹${plan.price}`}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* FAQs */}
      <section className="subs-faq container">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <div className="faq-grid">
          {[
            { q: 'Can I cancel anytime?', a: 'Yes. You can cancel your subscription at any time from your profile settings.' },
            { q: 'What is a premium film?', a: 'Premium films are exclusive works curated by our editorial team — longer, higher production quality, or award-winning.' },
            { q: 'Is there a free trial?', a: 'The Free plan gives you unlimited access to all free films with no trial limits.' },
            { q: 'What devices are supported?', a: 'FilmHub works on any device with a modern browser — phone, tablet, laptop, or desktop.' },
          ].map((f, i) => (
            <div key={i} className="faq-item">
              <h4 className="faq-q">{f.q}</h4>
              <p className="faq-a">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Subscriptions;
