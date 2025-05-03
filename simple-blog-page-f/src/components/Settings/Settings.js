// src/components/Settings/Settings.js
import React, { useState, useEffect } from 'react';
import './Settings.css';
import '../Admin/Admin.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// import axios instance
import api from '../../services/api';

const Settings = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. GET /settings
  useEffect(() => {
    const loadVulns = async () => {
      try {
        const response = await api.get('/settings');
        // response.data chính là List<VulnerabilityOut>
        setVulnerabilities(
          response.data.map(v => ({
            id: v.id,
            name: v.name,
            enabled: v.status === 'Yes',
          }))
        );
      } catch (err) {
        console.error('Load settings error:', err);
        alert('Không tải được settings');
      } finally {
        setLoading(false);
      }
    };

    loadVulns();
  }, []);

  const handleToggle = id =>
    setVulnerabilities(prev =>
      prev.map(v => (v.id === id ? { ...v, enabled: !v.enabled } : v))
    );

  // 2. PUT /settings (bulk)
  const handleSave = async () => {
    const payload = vulnerabilities.map(v => ({
      id: v.id,
      status: v.enabled ? 'Yes' : 'No',
    }));

    try {
      const response = await api.put('/settings', payload);
      console.log('Bulk update response:', response.data);
      alert('Settings saved successfully!');
      // Optionally reload from server:
      // setVulnerabilities(response.data.map(...))
    } catch (err) {
      console.error('Save settings error:', err);
      alert('Error saving settings');
    }
  };

  if (loading) {
    return <div className="settings-container">Loading...</div>;
  }

  return (
    <div className="settings-container">
      <div className="admin-header">
        <h1 className="settings-title">Settings Vulnerability</h1>
        <button onClick={() => navigate(isAdmin ? '/admin' : '/')} className="admin-btn">
          {isAdmin ? 'Back to Dashboard' : 'Back to Home'}
        </button>
      </div>

      <div className="vulnerabilities-grid">
        {vulnerabilities.map(v => (
          <div key={v.id} className="vulnerability-item">
            <span className="vulnerability-name">{v.name}</span>
            <div className="toggle-wrapper">
              <select
                value={v.enabled ? 'Yes' : 'No'}
                onChange={() => handleToggle(v.id)}
                className="vulnerability-toggle"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      <div className="settings-actions">
        <button className="save-button" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default Settings;
