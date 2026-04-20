import { supabase } from './supabaseClient.js';

// Toast Notification System
const showToast = (message, type = 'success') => {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let iconClass = 'ph-info';
    if (type === 'success') iconClass = 'ph-check-circle';
    if (type === 'error') iconClass = 'ph-warning-circle';
    toast.innerHTML = `
        <i class="ph-fill ${iconClass} toast-icon"></i>
        <span class="toast-message">${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
};

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

        // Modals
        modalBackdrop: document.getElementById('modal-backdrop'),
        subjectModal: document.getElementById('subject-modal'),
        reminderModal: document.getElementById('reminder-modal'),
        addSubjectBtn: document.getElementById('add-subject-btn'),
        addReminderBtn: document.getElementById('add-reminder-btn'),
        closeModalBtns: document.querySelectorAll('.close-modal'),
        addSubjectForm: document.getElementById('add-subject-form'),
        addReminderForm: document.getElementById('add-reminder-form'),

        // Pomodoro
        pomodoroTimeDisplay: document.querySelector('.pomodoro-time'),
        pomodoroPlayBtn: document.querySelector('.pomodoro-play'),

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

    // 4. Interactive Elements & Modals
    const initInteractions = () => {
        // Range slider text update
        if (elements.planHoursInput) {
            elements.planHoursInput.addEventListener('input', (e) => {
                elements.planHoursDisplay.textContent = `${e.target.value} hour${e.target.value > 1 ? 's' : ''}`;
            });
        }

        // Modal Logic
        const openModal = (modal) => {
            elements.modalBackdrop.classList.remove('hidden');
            modal.classList.remove('hidden');
        };

        const closeAllModals = () => {
            elements.modalBackdrop.classList.add('hidden');
            if (elements.subjectModal) elements.subjectModal.classList.add('hidden');
            if (elements.reminderModal) elements.reminderModal.classList.add('hidden');
        };

        if (elements.addSubjectBtn) {
            elements.addSubjectBtn.addEventListener('click', () => openModal(elements.subjectModal));
        }

        if (elements.addReminderBtn) {
            elements.addReminderBtn.addEventListener('click', () => openModal(elements.reminderModal));
        }

        if (elements.closeModalBtns) {
            elements.closeModalBtns.forEach(btn => {
                btn.addEventListener('click', closeAllModals);
            });
        }

        if (elements.modalBackdrop) {
            elements.modalBackdrop.addEventListener('click', closeAllModals);
        }

        // --- Planner Timetable Logic ---
        const generatePlanBtn = document.getElementById('generate-plan-btn');
        const timetableGrid = document.getElementById('timetable');

        if (generatePlanBtn && timetableGrid) {
            generatePlanBtn.addEventListener('click', () => {
                // Flash button to indicate generation
                const origText = generatePlanBtn.innerHTML;
                generatePlanBtn.innerHTML = '<i class="ph-fill ph-spinner-gap" style="animation: spin 1s linear infinite;"></i> Generating...';
                generatePlanBtn.style.opacity = '0.8';

                setTimeout(() => {
                    const selectedHoursLimit = parseInt(elements.planHoursInput.value) || 4;
                    const sessionSlots = timetableGrid.querySelectorAll('.session-slot');

                    // Clear existing sessions
                    sessionSlots.forEach(slot => slot.innerHTML = '');

                    // Dummy logic to populate slots pseudo-randomly based on hour limit
                    const subjectsPool = data.subjects;

                    let sessionsAdded = 0;
                    sessionSlots.forEach(slot => {
                        // Limit sessions per week arbitrarily based on the slider input (for dummy visual)
                        if (sessionsAdded < selectedHoursLimit * 5 && Math.random() > 0.6) {
                            const randSub = subjectsPool[Math.floor(Math.random() * subjectsPool.length)];
                            slot.innerHTML = `
                                <div class="session-block" style="background: ${randSub.color};" draggable="true">
                                    <i class="ph ph-${randSub.icon}" style="margin-right:4px;"></i> ${randSub.name.split(' ')[0]}
                                </div>
                            `;
                            sessionsAdded++;
                        }
                    });

                    // Re-bind drag events to new blocks
                    bindDragEvents();

                    // Restore button
                    generatePlanBtn.innerHTML = origText;
                    generatePlanBtn.style.opacity = '1';
                }, 800);
            });
        }

        // --- Drag and Drop Logic for Timetable ---
        let draggedElement = null;

        const bindDragEvents = () => {
            const blocks = document.querySelectorAll('.session-block');
            const slots = document.querySelectorAll('.session-slot');

            blocks.forEach(block => {
                block.addEventListener('dragstart', function (e) {
                    draggedElement = this;
                    setTimeout(() => this.classList.add('dragging'), 0);
                    e.dataTransfer.effectAllowed = 'move';
                });

                block.addEventListener('dragend', function () {
                    draggedElement = null;
                    this.classList.remove('dragging');
                    slots.forEach(s => s.classList.remove('drag-over'));
                });
            });

            slots.forEach(slot => {
                // Prevent duplicate listeners if called multiple times
                const newSlot = slot.cloneNode(true);
                slot.parentNode.replaceChild(newSlot, slot);

                newSlot.addEventListener('dragover', function (e) {
                    e.preventDefault(); // Necessary to allow dropping
                    this.classList.add('drag-over');
                });

                newSlot.addEventListener('dragleave', function () {
                    this.classList.remove('drag-over');
                });

                newSlot.addEventListener('drop', function (e) {
                    e.preventDefault();
                    this.classList.remove('drag-over');

                    if (draggedElement) {
                        // If slot already has a block, swap them
                        if (this.children.length > 0) {
                            const existingBlock = this.children[0];
                            draggedElement.parentNode.appendChild(existingBlock);
                        }
                        this.appendChild(draggedElement);
                    }
                });
            });
        };

        // Initial binding for whatever is already in HTML
        bindDragEvents();

        // --- Pomodoro Logic ---
        let pomodoroInterval;
        let pomodoroTimeLeft = 25 * 60; // 25 minutes in seconds
        let isPomodoroRunning = false;

        const updatePomodoroDisplay = () => {
            const minutes = Math.floor(pomodoroTimeLeft / 60);
            const seconds = pomodoroTimeLeft % 60;
            elements.pomodoroTimeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            if (pomodoroTimeLeft <= 0) {
                clearInterval(pomodoroInterval);
                isPomodoroRunning = false;
                elements.pomodoroPlayBtn.innerHTML = '<i class="ph-fill ph-play"></i>';
                elements.pomodoroTimeDisplay.style.color = 'var(--danger)'; // Alert it's done
                // Optional: Play a sound here
                alert("Pomodoro session completed! Time for a break.");
                pomodoroTimeLeft = 25 * 60; // Reset
            }
        };

        if (elements.pomodoroPlayBtn) {
            elements.pomodoroPlayBtn.addEventListener('click', () => {
                if (isPomodoroRunning) {
                    clearInterval(pomodoroInterval);
                    elements.pomodoroPlayBtn.innerHTML = '<i class="ph-fill ph-play"></i>';
                } else {
                    elements.pomodoroTimeDisplay.style.color = 'inherit';
                    pomodoroInterval = setInterval(() => {
                        pomodoroTimeLeft--;
                        updatePomodoroDisplay();
                    }, 1000);
                    elements.pomodoroPlayBtn.innerHTML = '<i class="ph-fill ph-pause"></i>';
                }
                isPomodoroRunning = !isPomodoroRunning;
            });
        }

        // Form Submissions
        if (elements.addSubjectForm) {
            elements.addSubjectForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('new-subject-name').value;
                const icon = document.getElementById('new-subject-icon').value;
                const color = document.getElementById('new-subject-color').value;
                const exam = document.getElementById('new-subject-exam').value;

                const newSubject = {
                    id: 'sub-' + Date.now(),
                    name: name,
                    icon: icon,
                    color: color,
                    exam_date: exam,
                    priority: "medium", // default
                    progress: 0
                };

                // Add to internal data
                data.subjects.push(newSubject);

                // Re-render subjects list
                elements.subjectsContainer.innerHTML = data.subjects.map(subject => comps.createSubjectCard(subject)).join('');

                // Re-render dashboard exams
                const sortedExams = [...data.subjects].sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date)).slice(0, 3);
                elements.upcomingExamsContainer.innerHTML = sortedExams.map(ex => comps.createExamItem(ex)).join('');

                closeAllModals();
                e.target.reset();
            });
        }

        if (elements.addReminderForm) {
            elements.addReminderForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = document.getElementById('new-reminder-title').value;
                const type = document.getElementById('new-reminder-type').value;
                const timeStr = document.getElementById('new-reminder-time').value;

                // Simple time formatter
                let [hours, minutes] = timeStr.split(':');
                let ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12;
                const formattedTime = `${hours}:${minutes} ${ampm}`;

                const iconMap = {
                    'daily': 'clock',
                    'revision': 'book-open',
                    'exam': 'calendar-blank'
                };

                const colorMap = {
                    'daily': '#6C63FF',
                    'revision': '#FFB347',
                    'exam': '#FF6B6B'
                };

                const newReminder = {
                    id: 'r-' + Date.now(),
                    title: title,
                    type: type,
                    icon: iconMap[type],
                    color: colorMap[type],
                    description: "Created just now",
                    time: formattedTime,
                    is_active: true
                };

                // Add to internal data
                data.reminders.push(newReminder);

                // Re-render reminders list
                elements.remindersContainer.innerHTML = data.reminders.map(rem => comps.createReminderItem(rem)).join('');

                closeAllModals();
                e.target.reset();
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
                        borderColor: '#00A884',
                        backgroundColor: 'rgba(0, 168, 132, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#00A884',
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
                            '#6C63FF', '#00A884', '#EF4444', '#F59E0B'
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

    // 6. Auth Logic
    const initAuth = () => {
        const authView = document.getElementById('auth-view');
        const appContainer = document.getElementById('app-container');
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        const loginEmail = document.getElementById('login-email');
        const loginPassword = document.getElementById('login-password');
        const signupName = document.getElementById('signup-name');
        const signupEmail = document.getElementById('signup-email');
        const signupPassword = document.getElementById('signup-password');
        const toggleAuthMode = document.getElementById('toggle-auth-mode');
        const authTitle = document.getElementById('auth-title');
        const authSubtitle = document.getElementById('auth-subtitle');
        const authToggleText = document.getElementById('auth-toggle-text');
        const logoutBtn = document.getElementById('logout-btn');

        // Profile Form
        const profileForm = document.getElementById('profile-form');
        const profileName = document.getElementById('profile-name');
        const profileAvatar = document.getElementById('profile-avatar');

        // Supabase Auth Listener
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                authView.classList.add('hidden');
                appContainer.classList.remove('hidden');
                
                // Fetch user profile
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                
                if (profile) {
                    if (profileName) profileName.value = profile.full_name || '';
                    if (profileAvatar) profileAvatar.value = profile.avatar_url || '';
                    if (profile.full_name) {
                        data.profile.name = profile.full_name;
                        const greeting = document.querySelector('.greeting-text');
                        if (greeting) greeting.textContent = `Good morning, ${profile.full_name.split(' ')[0]} 👋`;
                    }
                    if (profile.avatar_url) {
                        data.profile.avatar = profile.avatar_url;
                        elements.userAvatar.src = profile.avatar_url;
                    }
                } else if (error && error.code !== 'PGRST116') {
                    console.error('Error fetching profile:', error);
                }
            } else {
                appContainer.classList.add('hidden');
                authView.classList.remove('hidden');
            }
        });

        // Toggle Login / Signup View
        let isLogin = true;
        if (toggleAuthMode) {
            toggleAuthMode.addEventListener('click', (e) => {
                e.preventDefault();
                isLogin = !isLogin;
                if (isLogin) {
                    loginForm.classList.remove('hidden');
                    signupForm.classList.add('hidden');
                    authTitle.textContent = 'Welcome to StudymateAI';
                    authSubtitle.textContent = 'Log in to continue to your study planner.';
                    toggleAuthMode.textContent = 'Sign Up';
                    authToggleText.childNodes[0].textContent = "Don't have an account? ";
                } else {
                    loginForm.classList.add('hidden');
                    signupForm.classList.remove('hidden');
                    authTitle.textContent = 'Create an Account';
                    authSubtitle.textContent = 'Sign up to get started.';
                    toggleAuthMode.textContent = 'Log In';
                    authToggleText.childNodes[0].textContent = "Already have an account? ";
                }
            });
        }

        // Login Handler
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                const origText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="ph-fill ph-spinner-gap" style="animation: spin 1s linear infinite;"></i> Authenticating...';
                
                const { error } = await supabase.auth.signInWithPassword({
                    email: loginEmail.value.trim(),
                    password: loginPassword.value
                });

                submitBtn.innerHTML = origText;
                if (error) {
                    showToast(error.message, 'error');
                    loginForm.style.animation = 'shake 0.4s ease';
                    setTimeout(() => { loginForm.style.animation = 'none'; }, 400);
                } else {
                    showToast('Successfully logged in!', 'success');
                }
            });
        }

        // Signup Handler
        if (signupForm) {
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = signupForm.querySelector('button[type="submit"]');
                const origText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="ph-fill ph-spinner-gap" style="animation: spin 1s linear infinite;"></i> Creating Account...';
                
                const { error } = await supabase.auth.signUp({
                    email: signupEmail.value.trim(),
                    password: signupPassword.value,
                    options: {
                        data: {
                            full_name: signupName.value.trim()
                        }
                    }
                });

                submitBtn.innerHTML = origText;
                if (error) {
                    showToast(error.message, 'error');
                    signupForm.style.animation = 'shake 0.4s ease';
                    setTimeout(() => { signupForm.style.animation = 'none'; }, 400);
                } else {
                    showToast('Account created successfully!', 'success');
                }
            });
        }

        // Logout Handler
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await supabase.auth.signOut();
                showToast('Successfully logged out.', 'info');
            });
        }

        // Profile Update Handler
        if (profileForm) {
            profileForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = profileForm.querySelector('button[type="submit"]');
                const origText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="ph-fill ph-spinner-gap" style="animation: spin 1s linear infinite;"></i> Saving...';

                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    submitBtn.innerHTML = origText;
                    return;
                }

                const { error } = await supabase.from('profiles').upsert({
                    id: session.user.id,
                    full_name: profileName.value.trim(),
                    avatar_url: profileAvatar.value.trim(),
                    updated_at: new Date().toISOString()
                });

                submitBtn.innerHTML = origText;
                if (error) {
                    showToast(error.message, 'error');
                } else {
                    showToast('Profile updated successfully!', 'success');
                    
                    data.profile.name = profileName.value.trim();
                    const greeting = document.querySelector('.greeting-text');
                    if (greeting) greeting.textContent = `Good morning, ${profileName.value.trim().split(' ')[0]} 👋`;
                    
                    if(profileAvatar.value.trim()) {
                        data.profile.avatar = profileAvatar.value.trim();
                        elements.userAvatar.src = profileAvatar.value.trim();
                    }
                }
            });
        }
    };

    // Boot Up
    initAuth();
    initData();
    initNavigation();
    initInteractions();

    // Initial chart render if on dashboard
    if (window.location.hash === '#dashboard' || !window.location.hash) {
        // Small delay to ensure canvas is painted
        setTimeout(renderCharts, 100);
    }
});
