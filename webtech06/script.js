// Smooth scrolling for navigation links
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    
    // Always show main sections when clicking nav links
    hideAuthSections();
    showMainSections();
    
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        window.scrollTo({
            top: targetSection.offsetTop - 60, // adjust for header height
            behavior: 'smooth'
        });
    }
  });
});

// Utility functions for section management
function hideAuthSections() {
    document.getElementById('signup-section').classList.add('hidden');
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('dashboard').classList.add('hidden');
}

function showMainSections() {
    document.getElementById('home').classList.remove('hidden');
    document.getElementById('about').classList.remove('hidden');
    document.getElementById('services').classList.remove('hidden');
}

function hideMainSections() {
    document.getElementById('home').classList.add('hidden');
    document.getElementById('about').classList.add('hidden');
    document.getElementById('services').classList.add('hidden');
}

// Navigation UI Toggling
document.getElementById('login-nav').addEventListener('click', () => {
    hideMainSections();
    hideAuthSections();
    document.getElementById('login-section').classList.remove('hidden');
});

document.getElementById('signup-nav').addEventListener('click', () => {
    hideMainSections();
    hideAuthSections();
    document.getElementById('signup-section').classList.remove('hidden');
});

// Switch between forms within the page
document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    hideAuthSections();
    document.getElementById('login-section').classList.remove('hidden');
});

document.getElementById('show-signup').addEventListener('click', (e) => {
    e.preventDefault();
    hideAuthSections();
    document.getElementById('signup-section').classList.remove('hidden');
});

// --- Local Storage Logic ---

// Signup Logic
document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    const user = { username, email, password };
    localStorage.setItem('user', JSON.stringify(user));
    alert('Signup successful! Please login.');
    
    hideAuthSections();
    document.getElementById('login-section').classList.remove('hidden');
});

// Login Logic
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.username === username && storedUser.password === password) {
        localStorage.setItem('isLoggedIn', 'true');
        updateUI();
        showDashboard();
    } else {
        alert('Invalid credentials!');
    }
});

// Logout Logic
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('isLoggedIn');
    updateUI();
    hideAuthSections();
    showMainSections();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// State Management
function showDashboard() {
    hideMainSections();
    hideAuthSections();
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('dashboard-welcome').textContent = `Hello, ${user.username}! Welcome to your student portal.`;
        document.getElementById('dashboard').classList.remove('hidden');
    }
}

function updateUI() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const authButtons = document.getElementById('auth-buttons');
    const userProfile = document.getElementById('user-profile');
    const userGreeting = document.getElementById('user-greeting');

    if (isLoggedIn === 'true') {
        const user = JSON.parse(localStorage.getItem('user'));
        authButtons.classList.add('hidden');
        userProfile.classList.remove('hidden');
        if (user) userGreeting.textContent = `Hi, ${user.username}!`;
    } else {
        authButtons.classList.remove('hidden');
        userProfile.classList.add('hidden');
    }
}

// Check session on page load
window.onload = () => {
    updateUI();
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        showDashboard();
    }
};