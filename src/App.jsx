import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import './App.css'; // Styling uchun alohida fayl yaratamiz

// Protected Route komponenti
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Dashboard komponenti
function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('https://node-2-g32w.onrender.com/aloqa', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Server xatoligi: ${response.status}`);
      }

      const data = await response.json();
      setMessages(data);
      setError(null);
    } catch (err) {
      console.error("Ma'lumotlarni yuklashda xatolik:", err);
      setError("Ma'lumotlarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Ma'lumotlar yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="navbar">
        <div className="logo">Admin Panel</div>
        <button onClick={handleLogout} className="btn btn-danger">
          Chiqish
        </button>
      </div>

      <h1>Xabarlar</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ism</th>
            <th>Email</th>
            <th>Xabar</th>
            <th>Vaqt</th>
          </tr>
        </thead>
        <tbody>
          {messages.length > 0 ? (
            messages.map((msg) => (
              <tr key={msg.id}>
                <td>{msg.id}</td>
                <td>{msg.ism}</td>
                <td>{msg.email}</td>
                {/* Xabar matnidagi yangi qatorlarni <br> bilan almashtirish */}
                <td dangerouslySetInnerHTML={{ __html: msg.xabar.replace(/\n/g, '<br />') }}></td>
                <td>{new Date(msg.yuborilgan_vaqt).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            !error && <tr><td colSpan="5">Xabarlar mavjud emas</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
