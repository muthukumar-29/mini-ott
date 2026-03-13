import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Films from './pages/Films';
import AddFilm from './pages/AddFilm';
import EditFilm from './pages/EditFilm';
import Categories from './pages/Categories';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import Comments from './pages/Comments';
import FilmApproval from './pages/FilmApproval';
import Settings from './pages/Settings';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="films" element={<Films />} />
            <Route path="films/add" element={<AddFilm />} />
            <Route path="films/edit/:id" element={<EditFilm />} />
            <Route path="films/approval" element={<FilmApproval />} />
            <Route path="categories" element={<Categories />} />
            <Route path="users" element={<Users />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="comments" element={<Comments />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;