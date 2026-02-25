/**
 * Component Generators - Translates data to HTML elements
 */

const Components = {
    // Generate Today's Schedule List Item
    createScheduleItem: (session) => {
        return `
            <div class="item-card">
                <div class="item-time">${session.time}</div>
                <div class="stat-icon-wrapper" style="width: 36px; height: 36px; font-size: 1rem; background: ${session.color}20; color: ${session.color};">
                    ${session.emoji}
                </div>
                <div class="item-main">
                    <div class="item-title">${session.subjectName}</div>
                    <div class="item-subtitle">${session.topic} • ${session.duration}</div>
                </div>
                <div class="badge badge-outline" style="color: ${session.color};">${session.type}</div>
            </div>
        `;
    },

    // Generate Upcoming Exam List Item
    createExamItem: (exam) => {
        // Calculate urgency styling
        const daysParts = exam.priority === 'critical' ? '18d' : (exam.priority === 'high' ? '23d' : '28d');
        const color = exam.priority === 'critical' ? 'var(--danger)' : (exam.priority === 'high' ? 'var(--warning)' : 'var(--success)');

        return `
             <div class="item-card">
                <div class="stat-icon-wrapper" style="width: 40px; height: 40px; font-size: 1.25rem; background: rgba(0,0,0,0.2);">
                    ${exam.emoji}
                </div>
                <div class="item-main">
                    <div class="item-title">${exam.name}</div>
                    <div class="item-subtitle">${new Date(exam.exam_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                </div>
                <div class="badge" style="background: ${color}20; color: ${color};">
                    ${daysParts}
                </div>
            </div>
        `;
    },

    // Generate Subject Card
    createSubjectCard: (subject) => {
        return `
            <div class="subject-card glass-card g-glow-primary">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <span style="font-size: 2rem;">${subject.emoji}</span>
                        <div>
                            <h3 style="font-size: 1.125rem;">${subject.name}</h3>
                            <span class="text-gray" style="font-size: 0.875rem;">Exam: ${new Date(subject.exam_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                    </div>
                </div>
                
                <div class="progress-bar-container mt-2">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                        <span class="progress-text" style="margin: 0;">Progress</span>
                        <span class="progress-text" style="margin: 0;">${subject.progress}%</span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${subject.progress}%; background: ${subject.color};"></div>
                    </div>
                </div>

                <button class="btn-secondary w-full" style="display: flex; justify-content: space-between; align-items: center;">
                    <span>View Topics</span>
                    <i class="ph ph-caret-right"></i>
                </button>
            </div>
        `;
    },

    // Generate Reminder Item
    createReminderItem: (reminder) => {
        return `
            <div class="item-card" style="padding: 1rem; border-bottom: 1px solid var(--border-glass); border-radius: 0;">
                <div class="stat-icon-wrapper" style="width: 48px; height: 48px; font-size: 1.5rem; background: ${reminder.color}20; color: ${reminder.color};">
                    <i class="ph ph-${reminder.icon}"></i>
                </div>
                <div class="item-main">
                    <div class="item-title" style="font-size: 1.125rem;">${reminder.title}</div>
                    <div class="item-subtitle" style="margin-top: 0.25rem;">${reminder.description}</div>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="font-family: var(--font-mono); font-size: 0.875rem; color: var(--text-muted);">${reminder.time}</span>
                    <div style="width: 40px; height: 24px; background: ${reminder.is_active ? 'var(--primary)' : 'var(--border-glass)'}; border-radius: 12px; position: relative; cursor: pointer;">
                        <div style="position: absolute; width: 20px; height: 20px; background: white; border-radius: 50%; top: 2px; left: ${reminder.is_active ? '18px' : '2px'}; transition: left 0.2s;"></div>
                    </div>
                    <button class="btn-icon"><i class="ph ph-dots-three-vertical"></i></button>
                </div>
            </div>
        `;
    }
};

window.Components = Components;
