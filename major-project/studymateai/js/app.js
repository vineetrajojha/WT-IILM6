/**
 * Main Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize DOM Elements
    const elements = {
        navItems: document.querySelectorAll('.nav-item'),
        viewSections: document.querySelectorAll('.view-section'),
        currentDateDisplay: document.getElementById('current-date-display'),
        userAvatar: document.getElementById('user-avatar'),

        // Data Containers
        todayScheduleContainer: document.getElementById('today-schedule'),
        upcomingExamsContainer: document.getElementById('upcoming-exams'),
        subjectsContainer: document.getElementById('subjects-container'),
        remindersContainer: document.getElementById('reminders-container'),

        // Stats
        statHours: document.getElementById('stat-hours'),
        statTopics: document.getElementById('stat-topics'),
        statStreak: document.getElementById('stat-streak'),
        statExamTimer: document.getElementById('stat-exam-timer'),

        // Planner Inputs
        planHoursInput: document.getElementById('plan-hours'),
        planHoursDisplay: document.getElementById('plan-hours-display'),

        // Mobile Toggle
        mobileMenuToggle: document.querySelector('.mobile-menu-toggle'),
        sidebar: document.querySelector('.sidebar')
    };

    // 2. Data Hydration from window.appData (data.js)
    const data = window.appData;
    const comps = window.Components;

    const initData = () => {
        // Header Date
        const today = new Date();
        const options = { weekday: 'long', month: 'short', day: 'numeric' };
        elements.currentDateDisplay.textContent = today.toLocaleDateString('en-US', options);

        // Sidebar/Profile
        elements.userAvatar.src = data.profile.avatar;

        // Stats
        elements.statHours.textContent = `${data.stats.hoursStudied}h`;
        elements.statTopics.textContent = `${data.stats.topicsCompleted} / ${data.stats.topicsTotal}`;
        elements.statStreak.textContent = `${data.stats.streakDays} days`;
        elements.statExamTimer.textContent = `${data.stats.nextExamDays}d ${data.stats.nextExamHours}h`;

        // Dashboard Lists
        elements.todayScheduleContainer.innerHTML = data.todaySessions.map(session => comps.createScheduleItem(session)).join('');

        const sortedExams = [...data.subjects].sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date)).slice(0, 3);
        elements.upcomingExamsContainer.innerHTML = sortedExams.map(exam => comps.createExamItem(exam)).join('');

        // Subjects List
        elements.subjectsContainer.innerHTML = data.subjects.map(subject => comps.createSubjectCard(subject)).join('');

        // Reminders List
        elements.remindersContainer.innerHTML = data.reminders.map(rem => comps.createReminderItem(rem)).join('');
    };

    // 3. Navigation / Router (SPA Logic)
    const initNavigation = () => {
        const switchView = (targetViewId) => {
            // Update Active Nav Link
            elements.navItems.forEach(item => {
                item.classList.toggle('active', item.dataset.view === targetViewId);
            });

            // Update Visible Section
            elements.viewSections.forEach(section => {
                if (section.id === targetViewId) {
                    section.classList.remove('hidden');
                    // Retrigger animation
                    section.style.animation = 'none';
                    section.offsetHeight; // trigger reflow
                    section.style.animation = null;
                } else {
                    section.classList.add('hidden');
                }
            });

            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                elements.sidebar.classList.remove('open');
            }

            // Re-render charts based on view
            if (targetViewId === 'analytics') {
                renderCharts();
            }
        };

        // Event Listeners for Nav
        elements.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetViewId = item.dataset.view;
                window.location.hash = targetViewId;
                switchView(targetViewId);
            });
        });

        // Handle initial hash
        const initialHash = window.location.hash.replace('#', '') || 'dashboard';
        switchView(initialHash);

        // Mobile menu toggle
        if (elements.mobileMenuToggle) {
            elements.mobileMenuToggle.addEventListener('click', () => {
                elements.sidebar.classList.toggle('open');
            });
        }
    };

    // 4. Interactive Elements
    const initInteractions = () => {
        // Range slider text update
        if (elements.planHoursInput) {
            elements.planHoursInput.addEventListener('input', (e) => {
                elements.planHoursDisplay.textContent = `${e.target.value} hour${e.target.value > 1 ? 's' : ''}`;
            });
        }
    };

    // 5. Charts Configuration (Chart.js via CDN)
    let chartsInit = false;
    const renderCharts = () => {
        if (chartsInit || typeof Chart === 'undefined') return;

        // Global Chart Defaults for dark theme
        Chart.defaults.color = 'rgba(255, 255, 255, 0.6)';
        Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
        Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";

        const ctxWeekly = document.getElementById('weeklyProgressChart');
        if (ctxWeekly) {
            new Chart(ctxWeekly, {
                type: 'line',
                data: {
                    labels: data.weeklyHours.map(d => d.day),
                    datasets: [{
                        label: 'Study Hours',
                        data: data.weeklyHours.map(d => d.hours),
                        borderColor: '#6C63FF',
                        backgroundColor: 'rgba(108, 99, 255, 0.2)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#6C63FF',
                        pointBorderColor: '#0A0F1E',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        const ctxAnalyticsWeekly = document.getElementById('analyticsWeeklyChart');
        if (ctxAnalyticsWeekly) {
            // Re-use logic for analytics page chart
            new Chart(ctxAnalyticsWeekly, {
                type: 'line',
                data: {
                    labels: data.weeklyHours.map(d => d.day),
                    datasets: [{
                        label: 'Study Hours',
                        data: data.weeklyHours.map(d => d.hours),
                        borderColor: '#00D4AA',
                        backgroundColor: 'rgba(0, 212, 170, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#00D4AA',
                        pointBorderWidth: 0,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                }
            });
        }

        const ctxSubjectDist = document.getElementById('subjectDistributionChart');
        if (ctxSubjectDist) {
            new Chart(ctxSubjectDist, {
                type: 'doughnut',
                data: {
                    labels: data.subjects.slice(0, 4).map(s => s.name),
                    datasets: [{
                        data: [40, 25, 20, 15],
                        backgroundColor: [
                            '#6C63FF', '#00D4AA', '#FF6B6B', '#FFB347'
                        ],
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: {
                        legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true, boxWidth: 8 } }
                    }
                }
            });
        }

        chartsInit = true;
    };

    // Boot Up
    initData();
    initNavigation();
    initInteractions();

    // Initial chart render if on dashboard
    if (window.location.hash === '#dashboard' || !window.location.hash) {
        // Small delay to ensure canvas is painted
        setTimeout(renderCharts, 100);
    }
});
