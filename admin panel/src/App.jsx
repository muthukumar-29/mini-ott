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
import Settings from './pages/Settings';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes with Layout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="films" element={<Films />} />
            <Route path="films/add" element={<AddFilm />} />
            <Route path="films/edit/:id" element={<EditFilm />} />
            <Route path="categories" element={<Categories />} />
            <Route path="users" element={<Users />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="comments" element={<Comments />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
