import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (username === 'umid' && password === 'u1121') {
        localStorage.setItem('token', 'dummy-token');
        navigate('/dashboard');
      } else {
        setError('Login yoki parol noto\'g\'ri');
      }
    } catch (err) {
      setError('Server bilan bog\'lanishda xatolik yuz berdi');
    }
  };

  return (
    <div className="container">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white text-center">
          <h3>Admin Panel</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Login</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Parol</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <button type="submit" className="btn btn-success w-100">
              Kirish
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
