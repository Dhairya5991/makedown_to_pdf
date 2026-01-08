import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import EditorPage from './pages/EditorPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

function useMe() {
  const [me, setMe] = useState(null);
  useEffect(() => {
    fetch(`${window.__ENV.API_BASE_URL}/me`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setMe(d.user || null))
      .catch(() => setMe(null));
  }, []);
  return me;
}

export default function App() {
  const me = useMe();
  const navigate = useNavigate();
  const [uiStyle, setUiStyle] = useState(localStorage.getItem('uiStyle') || 'classic');

  const login = () => {
    const w = window.open(`${window.__ENV.API_BASE_URL}/auth/google`, '_blank', 'width=500,height=700');
    const timer = setInterval(() => {
      if (w.closed) {
        clearInterval(timer);
        fetch(`${window.__ENV.API_BASE_URL}/me`, { credentials: 'include' })
          .then(r => r.json())
          .then(() => navigate(0));
      }
    }, 500);
  };
  const logout = async () => {
    await fetch(`${window.__ENV.API_BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
    navigate(0);
  };
  const toggleTheme = () => {
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    const next = cur === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };
  const toggleUiStyle = () => {
    const next = uiStyle === 'classic' ? 'modern' : 'classic';
    setUiStyle(next);
    localStorage.setItem('uiStyle', next);
  };

  return (
    <div className={`app ${uiStyle}`}>
      <header className="header">
        <div className="brand">
          <span>📝 Markdown to PDF</span>
          <span className="btn" onClick={toggleTheme}>Dark mode</span>
          <span className="btn" onClick={toggleUiStyle}>{uiStyle === 'modern' ? 'Classic UI' : 'Modern UI'}</span>
        </div>
        <nav className="nav">
          <Link className="btn" to="/">Editor</Link>
          <Link className="btn" to="/dashboard">Dashboard</Link>
          {me ? (
            <button className="btn" onClick={logout}>Logout</button>
          ) : (
            <button className="btn primary" onClick={login}>Login with Google</button>
          )}
        </nav>
      </header>
      <div className="container">
        <Routes>
          <Route path="/" element={<EditorPage me={me} />} />
          <Route path="/dashboard" element={<DashboardPage me={me} />} />
        </Routes>
      </div>
    </div>
  );
}
