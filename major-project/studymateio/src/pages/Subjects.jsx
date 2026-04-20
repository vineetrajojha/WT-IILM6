import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Subjects() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('book'); // Default ph-book
  const [color, setColor] = useState('var(--primary)');
  const [examDate, setExamDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSubjects();
    }
  }, [user]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user.id)
        .order('exam_date', { ascending: true });

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      toast.error('Failed to load subjects');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!name || !examDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert([{
          user_id: user.id,
          name,
          icon,
          color,
          exam_date: new Date(examDate).toISOString(),
          progress: 0
        }])
        .select()
        .single();

      if (error) throw error;

      setSubjects(prev => [...prev, data]);
      toast.success('Subject added successfully!');
      setShowModal(false);
      setName('');
      setExamDate('');
    } catch (error) {
      toast.error(error.message || 'Failed to add subject');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="subjects" className="view-section active">
      <header className="view-header">
        <div>
          <h2 className="view-title">Subjects</h2>
          <p className="view-subtitle">Manage your syllabus and track topic progress.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <i className="ph ph-plus"></i> Add Subject
        </button>
      </header>

      {loading ? (
        <div className="flex justify-center p-8"><span className="text-muted">Loading subjects...</span></div>
      ) : subjects.length === 0 ? (
        <div className="flex justify-center p-8"><span className="text-muted">No subjects added yet. Click "Add Subject" to begin.</span></div>
      ) : (
        <div className="subjects-grid">
          {subjects.map(subject => (
            <div key={subject.id} className="subject-card glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '2rem', color: subject.color }}><i className={`ph ph-${subject.icon}`}></i></span>
                  <div>
                    <h3 style={{ fontSize: '1.125rem' }}>{subject.name}</h3>
                    <span className="text-gray" style={{ fontSize: '0.875rem' }}>
                      Exam: {new Date(subject.exam_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="progress-bar-container mt-2">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span className="progress-text" style={{ margin: 0 }}>Progress</span>
                  <span className="progress-text" style={{ margin: 0 }}>{subject.progress || 0}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${subject.progress || 0}%`, background: subject.color }}></div>
                </div>
              </div>

              <button className="btn-secondary w-full" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <span>View Topics</span>
                <i className="ph ph-caret-right"></i>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Subject Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal glass-card" style={{ borderRadius: '16px' }}>
            <div className="modal-header">
              <h3>Add New Subject</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}><i className="ph ph-x"></i></button>
            </div>
            <form onSubmit={handleAddSubject}>
              <div className="input-group">
                <label>Subject Name</label>
                <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Organic Chemistry" required />
              </div>
              <div className="input-group">
                <label>Theme Color</label>
                <select className="form-input" value={color} onChange={e => setColor(e.target.value)}>
                  <option value="var(--primary)">Purple (Primary)</option>
                  <option value="var(--danger)">Red (Danger)</option>
                  <option value="var(--success)">Green (Success)</option>
                  <option value="var(--warning)">Orange (Warning)</option>
                  <option value="#3B82F6">Blue</option>
                  <option value="#EC4899">Pink</option>
                </select>
              </div>
              <div className="input-group">
                <label>Icon Identifier (Phosphor Icon)</label>
                <select className="form-input" value={icon} onChange={e => setIcon(e.target.value)}>
                  <option value="book">Book</option>
                  <option value="math-operations">Math</option>
                  <option value="flask">Chemistry / Science</option>
                  <option value="code">Computer Science</option>
                  <option value="globe-hemisphere-west">Geography</option>
                  <option value="paint-brush">Art</option>
                </select>
              </div>
              <div className="input-group">
                <label>Exam Date</label>
                <input type="date" className="form-input" value={examDate} onChange={e => setExamDate(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary w-full mt-4" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Subject'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
