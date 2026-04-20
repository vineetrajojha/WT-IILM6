import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Planner() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [studyHours, setStudyHours] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);

  // Define days of week for layout
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

  useEffect(() => {
    if (user) {
      fetchSubjects();
      fetchSessions();
    }
  }, [user]);

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      setSubjects(data || []);
      if (data && data.length > 0) {
        setSelectedSubjectId(data[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('planner_sessions')
        .select('*, subjects(name, color)')
        .eq('user_id', user.id);
      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      toast.error('Failed to load planner sessions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    if (!selectedSubjectId) {
      toast.error('Please add a subject first!');
      return;
    }

    setIsGenerating(true);
    try {
      const subject = subjects.find(s => s.id === selectedSubjectId);
      
      // Basic AI heuristic: split study hours into 2-hour blocks across different days
      const blocks = Math.ceil(studyHours / 2);
      const generatedSessions = [];
      
      for (let i = 0; i < blocks; i++) {
        // Randomly pick a day
        const day = daysOfWeek[Math.floor(Math.random() * daysOfWeek.length)];
        // Randomly pick a time slot
        const time = timeSlots[Math.floor(Math.random() * (timeSlots.length - 2))]; 
        
        generatedSessions.push({
          user_id: user.id,
          subject_id: subject.id,
          title: `Study: ${subject.name}`,
          day_of_week: day,
          start_time: `${time}:00`,
          duration_minutes: 120, // 2 hours
          color: subject.color
        });
      }

      const { data, error } = await supabase
        .from('planner_sessions')
        .insert(generatedSessions)
        .select('*, subjects(name, color)');

      if (error) throw error;
      
      setSessions(prev => [...prev, ...(data || [])]);
      toast.success('Successfully generated new timetable blocks!');
    } catch (error) {
      toast.error(error.message || 'Failed to generate timetable');
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper to render session blocks
  const getSessionsForSlot = (day, timePrefix) => {
    return sessions.filter(
      s => s.day_of_week === day && s.start_time.startsWith(timePrefix)
    );
  };

  return (
    <section id="planner" className="view-section active">
      <header className="view-header">
        <div>
          <h2 className="view-title">AI Timetable Generator</h2>
          <p className="view-subtitle">Generate optimized study plans automatically.</p>
        </div>
      </header>
      <div className="planner-layout">
        <div className="planner-sidebar glass-card">
          <h3>Plan Details</h3>
          <form id="planner-form" className="mt-4 form-group">
            <div className="input-group">
              <label>Subject</label>
              <select 
                className="form-input" 
                value={selectedSubjectId} 
                onChange={(e) => setSelectedSubjectId(e.target.value)}
              >
                {subjects.length === 0 ? (
                  <option disabled value="">No subjects found</option>
                ) : (
                  subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                )}
              </select>
            </div>
            <div className="input-group">
              <label>Priority</label>
              <select className="form-input" defaultValue="high">
                <option value="critical">Critical (Exam Soon)</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="input-group">
              <label>Weekly Study Hours</label>
              <input 
                type="range" 
                className="form-input-range" 
                min="2" 
                max="20" 
                step="2"
                value={studyHours} 
                onChange={(e) => setStudyHours(parseInt(e.target.value))} 
              />
              <span className="range-display mt-2 pt-2 text-sm font-bold block">{studyHours} hours</span>
            </div>
            <button 
              type="button" 
              className="btn-primary w-full mt-4" 
              onClick={handleGeneratePlan}
              disabled={isGenerating || subjects.length === 0}
            >
              {isGenerating ? 'Generating...' : <><i className="ph-fill ph-sparkle"></i> Generate My Timetable</>}
            </button>
          </form>
        </div>
        
        <div className="planner-main glass-card" style={{ overflowX: 'auto' }}>
          <div className="panel-header">
            <h3>Weekly Timetable</h3>
          </div>
          
          <div className="timetable-grid mt-4" style={{ minWidth: '800px' }}>
            {/* Header row for days */}
            <div className="time-column time-header border-b border-r">
               <div className="flex items-center justify-center h-full">Time</div>
            </div>
            {daysOfWeek.map(day => (
              <div key={day} className="day-column day-header">
                 <div className="flex items-center justify-center h-full">{day.substring(0, 3)}</div>
              </div>
            ))}
            
            {/* Time slots and grid cells */}
            <div style={{ display: 'contents' }}>
              {timeSlots.map(time => (
                <div key={time} style={{ display: 'contents' }}>
                  <div className="time-column border-r border-b">
                     <div className="time-label text-center py-2 h-full flex flex-col justify-center">{time}</div>
                  </div>
                  {daysOfWeek.map(day => {
                    const cellSessions = getSessionsForSlot(day, time.substring(0,2));
                    return (
                      <div key={`${day}-${time}`} className="grid-cell border-r border-b min-h-[60px] relative p-1">
                        {cellSessions.map(session => (
                           <div 
                             key={session.id} 
                             className="session-block absolute m-1 left-0 right-0 top-0 text-white rounded p-1 text-xs shadow overflow-hidden text-center flex flex-col justify-center"
                             style={{ background: session.color, bottom: 0, opacity: 0.9 }}
                           >
                             <span className="font-bold">{session.subjects?.name || session.title}</span>
                             <span>2h</span>
                           </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
            
          </div>
        </div>
        
      </div>
    </section>
  );
}
