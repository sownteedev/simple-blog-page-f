import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import { useAuth } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  // Check if user is admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  return (
    <div className="admin-panel">
      <AdminDashboard />
    </div>
  );
};

export default AdminPanel; 