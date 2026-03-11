import React, { useState, useEffect } from 'react';
import StatsCard from '../components/common/StatsCard'
import analyticsService from '../services/analyticsService';
import { formatNumber } from '../utils/helpers';
import './styles/Dashboard.css';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {

  const [stats, setStats] = useState({
    totalFilms: 0,
    totalViews: 0,
    activeUsers: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentFilms, setRecentFilms] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // This is mock data - replace with actual API call
      // const data = await analyticsService.getDashboardStats();

      // Mock data
      setTimeout(() => {
        setStats({
          totalFilms: 156,
          totalViews: 2400000,
          activeUsers: 45200,
          revenue: 12500,
        });

        setRecentFilms([
          {
            id: 1,
            title: 'Midnight Dreams',
            genre: 'Drama',
            duration: '18 min',
            status: 'Published',
            views: '12.5K',
            thumbnail: 'https://via.placeholder.com/60x90/e50914/ffffff?text=MD',
          },
          {
            id: 2,
            title: 'Urban Legends',
            genre: 'Horror',
            duration: '25 min',
            status: 'Published',
            views: '8.3K',
            thumbnail: 'https://via.placeholder.com/60x90/0066ff/ffffff?text=UL',
          },
          {
            id: 3,
            title: 'The Last Stand',
            genre: 'Action',
            duration: '22 min',
            status: 'Draft',
            views: '0',
            thumbnail: 'https://via.placeholder.com/60x90/9966ff/ffffff?text=TLS',
          },
          {
            id: 4,
            title: 'Sunset Boulevard',
            genre: 'Romance',
            duration: '20 min',
            status: 'Published',
            views: '15.2K',
            thumbnail: 'https://via.placeholder.com/60x90/00cc66/ffffff?text=SB',
          },
          {
            id: 5,
            title: 'Digital Age',
            genre: 'Sci-Fi',
            duration: '30 min',
            status: 'Processing',
            views: '0',
            thumbnail: 'https://via.placeholder.com/60x90/ff9900/ffffff?text=DA',
          },
        ]);

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Published') return 'badge-success';
    if (status === 'Processing') return 'badge-warning';
    return 'badge-danger';
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          title="Total Films"
          value={stats.totalFilms}
          change="+12% from last month"
          isPositive={true}
          icon="🎬"
          iconColor="red"
        />
        <StatsCard
          title="Total Views"
          value={formatNumber(stats.totalViews)}
          change="+28% from last month"
          isPositive={true}
          icon="👁️"
          iconColor="blue"
        />
        <StatsCard
          title="Active Users"
          value={formatNumber(stats.activeUsers)}
          change="+18% from last month"
          isPositive={true}
          icon="👥"
          iconColor="green"
        />
        <StatsCard
          title="Revenue"
          value={`$${formatNumber(stats.revenue)}`}
          change="-5% from last month"
          isPositive={false}
          icon="💰"
          iconColor="purple"
        />
      </div>

      {/* Recent Films Table */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Recent Short Films</h2>
          <button className="btn-primary-custom" onClick={() => window.location.href = '/films/add'}>
            + Add New Film
          </button>
        </div>
        <div className="table-responsive">
          <table className="table-custom">
            <thead>
              <tr>
                <th>Film</th>
                <th>Genre</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentFilms.map((film) => (
                <tr key={film.id}>
                  <td>
                    <div className="film-info">
                      <img
                        src={film.thumbnail}
                        alt={film.title}
                        className="film-thumbnail"
                      />
                      <div className="film-details">
                        <h6>{film.title}</h6>
                        <div className="film-meta">Added 2 days ago</div>
                      </div>
                    </div>
                  </td>
                  <td>{film.genre}</td>
                  <td>{film.duration}</td>
                  <td>
                    <span className={`badge-custom ${getStatusBadge(film.status)}`}>
                      {film.status}
                    </span>
                  </td>
                  <td>{film.views}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-action btn-edit" title="Edit">
                        ✏️
                      </button>
                      <button className="btn-action btn-delete" title="Delete">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
