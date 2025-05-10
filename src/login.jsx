import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Bu yerda sizning serveringizda login endpointi bo'lishi kerak
      // Hozircha oddiy tekshiruv qilamiz
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('token', 'dummy-token');
        navigate('/dashboard');
      } else {
        setError('Login yoki parol noto\'g\'ri');
      }
    } catch (err) {
      setError('Server bilan bog\'lanishda xatolik yuz berdi');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadStatus('');
      setUploadProgress(0);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setUploadStatus('');
      setUploadProgress(0);
    }
    
    document.getElementById('dropArea').classList.remove('highlight');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('dropArea').classList.add('highlight');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('dropArea').classList.remove('highlight');
  };

  const uploadFile = async () => {
    if (!file) {
      setUploadStatus('Fayl tanlanmagan');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus('Fayl yuklanmoqda...');

    // FormData obyektini yaratish
    const formData = new FormData();
    formData.append('file', file);

    try {
      // XMLHttpRequest orqali yuklash jarayonini kuzatish
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setUploadStatus('Fayl muvaffaqiyatli yuklandi');
        } else {
          setUploadStatus('Fayl yuklashda xatolik yuz berdi');
        }
        setUploading(false);
      });

      xhr.addEventListener('error', () => {
        setUploadStatus('Fayl yuklashda xatolik yuz berdi');
        setUploading(false);
      });

      // Bu yerda sizning serveringizda fayl yuklash endpointi bo'lishi kerak
      xhr.open('POST', 'https://node-2-g32w.onrender.com/upload');
      xhr.send(formData);
    } catch (error) {
      setUploadStatus('Fayl yuklashda xatolik yuz berdi');
      setUploading(false);
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
          
          <div className="mt-4">
            <h4>Fayl yuklash</h4>
            <div 
              id="dropArea" 
              className="drop-area"
              onDrop={handleFileDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <p>Faylni bu yerga tashlang yoki</p>
              <input 
                type="file" 
                id="fileInput" 
                onChange={handleFileChange} 
                className="file-input"
              />
              <label htmlFor="fileInput" className="file-label">Fayl tanlang</label>
            </div>
            
            {file && (
              <div className="file-info mt-3">
                <p><strong>Fayl nomi:</strong> {file.name}</p>
                <p><strong>Fayl hajmi:</strong> {(file.size / 1024).toFixed(2)} KB</p>
                <p><strong>Fayl turi:</strong> {file.type}</p>
                
                <button 
                  onClick={uploadFile} 
                  className="btn btn-primary mt-2" 
                  disabled={uploading}
                >
                  {uploading ? 'Yuklanmoqda...' : 'Yuklash'}
                </button>
              </div>
            )}
            
            {uploadProgress > 0 && (
              <div className="progress mt-3">
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{ width: `${uploadProgress}%` }}
                  aria-valuenow={uploadProgress} 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                >
                  {uploadProgress}%
                </div>
              </div>
            )}
            
            {uploadStatus && (
              <div className={`alert ${uploadStatus.includes('muvaffaqiyatli') ? 'alert-success' : 'alert-info'} mt-3`}>
                {uploadStatus}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
