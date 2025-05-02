import React, { useState } from 'react';
import './Settings.css';
import '../Admin/Admin.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [vulnerabilities, setVulnerabilities] = useState({
    xss: false,
    csrf: false,
    ssrf: false,
    sqli: false,
    ssti: false,
    xxe: false,
    brokenAuth: false,
    pathTraversal: false,
    jwt: false,
    fileUpload: false,
    osCommandInjection: false,
    httpSmuggling: false,
    deserialization: false,
    idor: false
  });

  // Chuyển hướng nếu không phải admin
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  const handleToggle = (vulnerability) => {
    setVulnerabilities(prev => ({
      ...prev,
      [vulnerability]: !prev[vulnerability]
    }));
  };

  const handleSave = () => {
    console.log('Saved vulnerability settings:', vulnerabilities);
    // Hiển thị thông báo đã lưu
    alert('Settings saved successfully!');
  };

  return (
    <div className="settings-container">
      <div className="admin-header">
        <h1 className="settings-title">Settings Vulnerability</h1>
        <button 
          onClick={() => navigate('/admin')}
          className="admin-btn"
        >
          Back to Dashboard
        </button>
      </div>
      
      <div className="vulnerabilities-grid">
        <div className="vulnerability-row">
          <div className="vulnerability-item">
            <span className="vulnerability-name">XSS</span>
            <div className="toggle-wrapper">
              <select 
                value={vulnerabilities.xss ? "Yes" : "No"}
                onChange={() => handleToggle('xss')}
                className="vulnerability-toggle"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
          
          <div className="vulnerability-item">
            <span className="vulnerability-name">CSRF</span>
            <div className="toggle-wrapper">
              <select 
                value={vulnerabilities.csrf ? "Yes" : "No"}
                onChange={() => handleToggle('csrf')}
                className="vulnerability-toggle"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
          
          <div className="vulnerability-item">
            <span className="vulnerability-name">SSRF</span>
            <div className="toggle-wrapper">
              <select 
                value={vulnerabilities.ssrf ? "Yes" : "No"}
                onChange={() => handleToggle('ssrf')}
                className="vulnerability-toggle"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="vulnerability-row">
          <div className="vulnerability-item">
            <span className="vulnerability-name">SQLI</span>
            <div className="toggle-wrapper">
              <select 
                value={vulnerabilities.sqli ? "Yes" : "No"}
                onChange={() => handleToggle('sqli')}
                className="vulnerability-toggle"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
          
          <div className="vulnerability-item">
            <span className="vulnerability-name">SSTI</span>
            <div className="toggle-wrapper">
              <select 
                value={vulnerabilities.ssti ? "Yes" : "No"}
                onChange={() => handleToggle('ssti')}
                className="vulnerability-toggle"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
          
          <div className="vulnerability-item">
            <span className="vulnerability-name">XXE</span>
            <div className="toggle-wrapper">
              <select 
                value={vulnerabilities.xxe ? "Yes" : "No"}
                onChange={() => handleToggle('xxe')}
                className="vulnerability-toggle"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="vulnerability-row">
          <div className="vulnerability-item">
            <span className="vulnerability-name">Broken Authentication</span>
            <div className="toggle-wrapper">
              <select 
                value={vulnerabilities.brokenAuth ? "Yes" : "No"}
                onChange={() => handleToggle('brokenAuth')}
                className="vulnerability-toggle"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
          
          <div className="vulnerability-item">
            <span className="vulnerability-name">Path Traversal</span>
            <div className="toggle-wrapper">
              <select 
                value={vulnerabilities.pathTraversal ? "Yes" : "No"}
                onChange={() => handleToggle('pathTraversal')}
                className="vulnerability-toggle"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
          
          <div className="vulnerability-item">
            <span className="vulnerability-name">JWT</span>
            <div className="toggle-wrapper">
              <select 
                value={vulnerabilities.jwt ? "Yes" : "No"}
                onChange={() => handleToggle('jwt')}
                className="vulnerability-toggle"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="vulnerability-row">
          <div className="vulnerability-item">
            <span className="vulnerability-name">File upload</span>
            <div className="toggle-wrapper">
              <select 
                value={vulnerabilities.fileUpload ? "Yes" : "No"}
                onChange={() => handleToggle('fileUpload')}
                className="vulnerability-toggle"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
          
          <div className="vulnerability-item">
            <span className="vulnerability-name">OS Command Injection</span>
            <div className="toggle-wrapper">
              <select 
                value={vulnerabilities.osCommandInjection ? "Yes" : "No"}
                onChange={() => handleToggle('osCommandInjection')}
                className="vulnerability-toggle"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
          
          <div className="vulnerability-item">
            <span className="vulnerability-name">HTTP Smuggling</span>
            <div className="toggle-wrapper">
              <select 
                value={vulnerabilities.httpSmuggling ? "Yes" : "No"}
                onChange={() => handleToggle('httpSmuggling')}
                className="vulnerability-toggle"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="vulnerability-row">
          <div className="vulnerability-item">
            <span className="vulnerability-name">Deserialization</span>
            <div className="toggle-wrapper">
              <select 
                value={vulnerabilities.deserialization ? "Yes" : "No"}
                onChange={() => handleToggle('deserialization')}
                className="vulnerability-toggle"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
          
          <div className="vulnerability-item">
            <span className="vulnerability-name">IDOR</span>
            <div className="toggle-wrapper">
              <select 
                value={vulnerabilities.idor ? "Yes" : "No"}
                onChange={() => handleToggle('idor')}
                className="vulnerability-toggle"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-actions">
        <button className="save-button" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default Settings; 