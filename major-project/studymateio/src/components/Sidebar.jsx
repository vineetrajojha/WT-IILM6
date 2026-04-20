import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const { signOut } = useAuth();

  // Pomodoro state
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      toast.success('Pomodoro session completed! Time for a break.');
      setTimeLeft(25 * 60); // Reset for the next session
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const navClass = ({ isActive }) => 
    `nav-item ${isActive ? 'active' : ''}`;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <i className="ph-fill ph-graduation-cap logo-icon"></i>
        <h1 className="logo-text">StudymateAI</h1>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={navClass}>
          <i className="ph ph-squares-four"></i>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/planner" className={navClass}>
          <i className="ph ph-calendar-blank"></i>
          <span>Planner</span>
        </NavLink>
        <NavLink to="/subjects" className={navClass}>
          <i className="ph ph-books"></i>
          <span>Subjects</span>
        </NavLink>
        <NavLink to="/analytics" className={navClass}>
          <i className="ph ph-chart-bar"></i>
          <span>Analytics</span>
        </NavLink>
        <NavLink to="/reminders" className={navClass}>
          <i className="ph ph-bell"></i>
          <span>Reminders</span>
        </NavLink>
        <NavLink to="/settings" className={navClass}>
          <i className="ph ph-gear"></i>
          <span>Settings</span>
        </NavLink>
        
        <div style={{ flexGrow: 1 }}></div>
        <a href="#" onClick={handleSignOut} className="nav-item" style={{ color: 'var(--danger)', marginTop: 'auto', marginBottom: '1rem' }}>
          <i className="ph ph-sign-out"></i>
          <span>Log Out</span>
        </a>
      </nav>

      <div className="sidebar-footer">
        <div className="pomodoro-widget glass-card">
          <div className="pomodoro-header">
            <i className="ph ph-tomato"></i>
            <span>Pomodoro Timer</span>
          </div>
          <div className="pomodoro-controls">
            <span className="pomodoro-time" style={{ cursor: 'pointer', minWidth: '4ch', display: 'inline-block' }}>{formatTime(timeLeft)}</span>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button className="btn-icon pomodoro-play" onClick={toggleTimer}>
                <i className={`ph-fill ${isActive ? 'ph-pause' : 'ph-play'}`}></i>
              </button>
              <button className="btn-icon" onClick={resetTimer} style={{ background: 'transparent', padding: '0.25rem' }} title="Reset Timer">
                <i className="ph ph-arrow-counter-clockwise"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="upcoming-exam-widget">
          <div className="exam-widget-info">
            <span className="exam-icon" style={{ color: 'var(--primary)' }}>
              <i className="ph ph-ruler"></i>
            </span>
            <div>
              <span className="exam-name">Maths Exam</span>
              <span className="exam-days">18 days left</span>
            </div>
          </div>
          <div className="progress-bar-container mt-2">
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '62%', background: 'var(--success)' }}></div>
            </div>
            <span className="progress-text">Progress: 62%</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
