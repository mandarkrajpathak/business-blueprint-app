import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import businessLogo from './business-logo.png';

function App() {
  return (
    <div className="App">
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
        borderBottom: '1px solid #ddd',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={businessLogo} alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#007bff' }}>Business Blueprint Generator</h1>
        </div>
      </header>

      {/* Main Content */}
      <Router>
        <Routes>
          <Route path="/" element={<UploadPage />} />
        </Routes>
      </Router>

      {/* Footer */}
      <footer style={{
        marginTop: '40px',
        padding: '20px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#666',
        borderTop: '1px solid #ddd'
      }}>
        <p>Developed by <strong>Mandark Nandkishor Rajpathak</strong></p>
        <p>Email: <a href="mailto:mandark.rajpathak@gmail.com">mandark.rajpathak@gmail.com</a></p>
        <p>&copy; 2025 Business Blueprint Generator</p>
      </footer>
    </div>
  );
}

export default App;
