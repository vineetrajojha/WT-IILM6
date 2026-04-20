import { dummyData } from '../lib/mockData';

export default function Reminders() {
  return (
    <section id="reminders" className="view-section active">
      <header className="view-header">
        <div>
            <h2 className="view-title">Smart Reminders</h2>
            <p className="view-subtitle">Manage your study alerts and AI nudges.</p>
        </div>
        <button className="btn-primary" id="add-reminder-btn"><i className="ph ph-plus"></i> Add Reminder</button>
      </header>
      <div className="reminders-list-container glass-card">
        <div className="reminders-list">
          {dummyData.reminders.map((reminder) => (
            <div key={reminder.id} className="item-card" style={{ padding: '1rem', borderBottom: '1px solid var(--border-glass)', borderRadius: 0 }}>
                <div className="stat-icon-wrapper" style={{ width: '48px', height: '48px', fontSize: '1.5rem', background: `${reminder.color}20`, color: reminder.color }}>
                    <i className={`ph ph-${reminder.icon}`}></i>
                </div>
                <div className="item-main">
                    <div className="item-title" style={{ fontSize: '1.125rem' }}>{reminder.title}</div>
                    <div className="item-subtitle" style={{ marginTop: '0.25rem' }}>{reminder.description}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{reminder.time}</span>
                    <div style={{ width: '40px', height: '24px', background: reminder.is_active ? 'var(--primary)' : 'var(--border-glass)', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
                        <div style={{ position: 'absolute', width: '20px', height: '20px', background: 'white', borderRadius: '50%', top: '2px', left: reminder.is_active ? '18px' : '2px', transition: 'left 0.2s' }}></div>
                    </div>
                    <button className="btn-icon"><i className="ph ph-dots-three-vertical"></i></button>
                </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
