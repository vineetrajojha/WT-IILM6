import { useAuth } from '../contexts/AuthContext';
import { dummyData } from '../lib/mockData';
import { useEffect, useRef } from 'react';

export default function Dashboard() {
  const { profile } = useAuth();
  const userName = profile?.full_name?.split(' ')[0] || dummyData.profile.name.split(' ')[0];
  const avatarUrl = profile?.avatar_url || dummyData.profile.avatar;

  const chartRef = useRef(null);

  useEffect(() => {
    // If we wanted to draw the chart using Chart.js here we would,
    // but typically we'd use recharts which is in package.json
  }, []);

  return (
    <section id="dashboard" className="view-section active">
      <header className="view-header">
        <div>
          <h2 className="view-title greeting-text">Good morning, {userName} 👋</h2>
          <p className="view-subtitle current-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card glass-card">
            <div className="stat-icon-wrapper" style={{ background: 'rgba(108, 99, 255, 0.1)', color: 'var(--primary)' }}>
              <i className="ph ph-clock"></i>
            </div>
            <div className="stat-info">
              <span className="stat-value">{dummyData.stats.hoursStudied}h</span>
              <span className="stat-label">Study this week</span>
            </div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon-wrapper" style={{ background: 'rgba(0, 212, 170, 0.1)', color: 'var(--secondary)' }}>
              <i className="ph ph-check-circle"></i>
            </div>
            <div className="stat-info">
              <span className="stat-value">{dummyData.stats.topicsCompleted} / {dummyData.stats.topicsTotal}</span>
              <span className="stat-label">Topics completed</span>
            </div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon-wrapper" style={{ background: 'rgba(255, 179, 71, 0.1)', color: 'var(--warning)' }}>
              <i className="ph ph-fire"></i>
            </div>
            <div className="stat-info">
              <span className="stat-value">{dummyData.stats.streakDays} days</span>
              <span className="stat-label">Study streak</span>
            </div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon-wrapper" style={{ background: 'rgba(255, 107, 107, 0.1)', color: 'var(--danger)' }}>
              <i className="ph ph-hourglass-high"></i>
            </div>
            <div className="stat-info">
              <span className="stat-value" style={{ fontFamily: 'var(--font-mono)' }}>{dummyData.stats.nextExamDays}d {dummyData.stats.nextExamHours}h</span>
              <span className="stat-label">Next exam in</span>
            </div>
          </div>
        </div>

        {/* Main Grid Area */}
        <div className="dashboard-main-columns">
          {/* Left Column */}
          <div className="main-column-left">
            <div className="panel glass-card">
              <div className="panel-header">
                <h3>Today's Schedule</h3>
                <button className="btn-text">View All</button>
              </div>
              <div className="schedule-list">
                {dummyData.todaySessions.map((session, idx) => (
                  <div className="item-card" key={idx}>
                    <div className="item-time">{session.time}</div>
                    <div className="stat-icon-wrapper" style={{ width: '36px', height: '36px', fontSize: '1rem', background: `${session.color}20`, color: session.color }}>
                        <i className={`ph ph-${session.icon}`}></i>
                    </div>
                    <div className="item-main">
                        <div className="item-title">{session.subjectName}</div>
                        <div className="item-subtitle">{session.topic} • {session.duration}</div>
                    </div>
                    <div className="badge badge-outline" style={{ color: session.color }}>{session.type}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel glass-card mt-4">
              <div className="panel-header">
                <h3>Weekly Progress</h3>
              </div>
              <div className="chart-container text-muted text-sm flex items-center justify-center" style={{ minHeight: '200px' }}>
                 (Chart Area)
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="main-column-right">
            <div className="ai-banner glass-card g-glow-secondary">
              <div className="ai-banner-header">
                <i className="ph-fill ph-sparkle" style={{ color: 'var(--secondary)' }}></i>
                <span>AI Insight</span>
              </div>
              <p>Based on your pace, you need 3 more hours on Organic Chemistry this week.</p>
              <button className="btn-secondary w-full mt-3">Adjust Plan</button>
            </div>

            <div className="panel glass-card mt-4">
              <div className="panel-header">
                <h3>Upcoming Exams</h3>
              </div>
              <div className="exam-list">
                {dummyData.subjects.filter(s => s.exam_date).slice(0, 3).map((exam, idx) => {
                  const daysParts = exam.priority === 'critical' ? '18d' : (exam.priority === 'high' ? '23d' : '28d');
                  const color = exam.priority === 'critical' ? 'var(--danger)' : (exam.priority === 'high' ? 'var(--warning)' : 'var(--success)');
                  return (
                    <div className="item-card" key={idx}>
                      <div className="stat-icon-wrapper" style={{ width: '40px', height: '40px', fontSize: '1.25rem', background: 'rgba(0,0,0,0.05)', color: 'var(--text-main)' }}>
                          <i className={`ph ph-${exam.icon}`}></i>
                      </div>
                      <div className="item-main">
                          <div className="item-title">{exam.name}</div>
                          <div className="item-subtitle">{new Date(exam.exam_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      </div>
                      <div className="badge" style={{ background: `${color}20`, color: color }}>
                          {daysParts}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
