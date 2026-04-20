import { Outlet, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const { profile } = useAuth();
  const avatarUrl = profile?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix';

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <header className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)' }}>
          <div className="mobile-logo hidden-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="ph-fill ph-graduation-cap logo-icon" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}></i>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>StudymateAI</h2>
          </div>
          
          <Link to="/settings" className="user-profile" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            <img src={avatarUrl} alt="Settings" className="avatar-img" style={{ width: '42px', height: '42px', cursor: 'pointer', transition: 'transform 0.2s' }} />
          </Link>
        </header>

        <div id="views-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
