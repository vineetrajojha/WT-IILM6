const USERS_KEY = 'combineWebsitesUsers';
const CURRENT_USER_KEY = 'combineWebsitesCurrentUser';

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  } catch {
    return null;
  }
}

function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

function setMessage(text, type = 'info') {
  const message = document.getElementById('authMessage');
  if (!message) {
    return;
  }

  message.textContent = text;
  message.dataset.type = type;
}

function switchMode(mode) {
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');
  const dashboardCard = document.getElementById('dashboardCard');

  if (!signupForm || !loginForm || !dashboardCard) {
    return;
  }

  signupForm.classList.toggle('hidden', mode !== 'signup');
  loginForm.classList.toggle('hidden', mode !== 'login');
  dashboardCard.classList.toggle('hidden', mode !== 'dashboard');

  document.querySelectorAll('.auth-tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.mode === mode);
  });
}

function updateDashboard(user) {
  const welcomeText = document.getElementById('welcomeText');
  const welcomeEmail = document.getElementById('welcomeEmail');

  if (welcomeText) {
    welcomeText.textContent = `Welcome, ${user.name}`;
  }

  if (welcomeEmail) {
    welcomeEmail.textContent = user.email;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) {
        return;
      }

      event.preventDefault();
      const targetSection = document.querySelector(href);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 60,
          behavior: 'smooth'
        });
      }
    });
  });

  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');
  const logoutBtn = document.getElementById('logoutBtn');

  if (!signupForm || !loginForm) {
    return;
  }

  const currentUser = readCurrentUser();
  if (currentUser) {
    updateDashboard(currentUser);
    switchMode('dashboard');
    setMessage(`You are logged in as ${currentUser.name}.`, 'success');
  } else {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode') === 'login' ? 'login' : 'signup';
    switchMode(mode);
    setMessage(mode === 'login' ? 'Log in with your stored credentials.' : 'Create a new account below.');
  }

  document.querySelectorAll('.auth-tab').forEach((button) => {
    button.addEventListener('click', () => {
      if (!button.dataset.mode) {
        return;
      }

      switchMode(button.dataset.mode);
      setMessage(button.dataset.mode === 'login' ? 'Log in with your stored credentials.' : 'Create a new account below.');
    });
  });

  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const password = document.getElementById('signupPassword').value;

    if (!name || !email || !password) {
      setMessage('Please fill in every field.', 'error');
      return;
    }

    const users = readUsers();
    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      setMessage('An account with this email already exists. Please log in.', 'error');
      switchMode('login');
      document.getElementById('loginEmail').value = email;
      return;
    }

    users.push({ name, email, password });
    writeUsers(users);
    setCurrentUser({ name, email });
    updateDashboard({ name, email });
    signupForm.reset();
    loginForm.reset();
    switchMode('dashboard');
    setMessage('Account created successfully.', 'success');
  });

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const users = readUsers();
    const matchedUser = users.find((user) => user.email === email && user.password === password);

    if (!matchedUser) {
      setMessage('Invalid email or password.', 'error');
      return;
    }

    setCurrentUser({ name: matchedUser.name, email: matchedUser.email });
    updateDashboard(matchedUser);
    loginForm.reset();
    signupForm.reset();
    switchMode('dashboard');
    setMessage(`Welcome back, ${matchedUser.name}.`, 'success');
  });

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearCurrentUser();
      signupForm.reset();
      loginForm.reset();
      switchMode('login');
      setMessage('You have been logged out.', 'info');
    });
  }
});