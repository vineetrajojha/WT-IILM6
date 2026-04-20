export default function Analytics() {
  return (
    <section id="analytics" className="view-section active">
      <header className="view-header">
        <div>
          <h2 className="view-title">Progress Analytics</h2>
          <p className="view-subtitle">Track your study habits and performance over time.</p>
        </div>
      </header>
      <div className="analytics-grid">
        <div className="panel glass-card col-span-2">
          <div className="panel-header">
            <h3>Weekly Study Hours</h3>
          </div>
          <div className="chart-container flex items-center justify-center text-muted" style={{ height: '300px' }}>
            Interactive chart will render here.
          </div>
        </div>
        <div className="panel glass-card">
          <div className="panel-header">
            <h3>Subject Distribution</h3>
          </div>
          <div className="chart-container flex items-center justify-center text-muted" style={{ height: '300px' }}>
            Interactive pie chart will render here.
          </div>
        </div>
      </div>
    </section>
  );
}
