// Authentication Configuration
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

// Check Authentication Status
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.includes('admin') || currentPath.includes('index.html');
    
    // If not logged in and not on login page, redirect to login
    if (!isLoggedIn && !isLoginPage) {
        window.location.href = '../admin/index.html';
        return false;
    }
    
    // If logged in and on login page, redirect to home
    if (isLoggedIn && isLoginPage) {
        window.location.href = '../home/index.html';
        return false;
    }
    
    return true;
}

// Login Function
function login(username, password) {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('loginTime', new Date().toISOString());
        return true;
    }
    return false;
}

// Logout Function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('loginTime');
    window.location.href = '../admin/index.html';
}

// Initialize Login Page
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const errorDiv = document.getElementById('loginError');
            
            if (login(username, password)) {
                window.location.href = '../home/index.html';
            } else {
                errorDiv.textContent = '❌ Invalid username or password! Please try again.';
                errorDiv.style.color = '#fc8181';
                // Clear password field
                document.getElementById('password').value = '';
                document.getElementById('password').focus();
            }
        });
    }
    
    // Handle logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                logout();
            }
        });
    }
    
    // Check authentication
    checkAuth();
});

// Auto-logout after inactivity (30 minutes)
let inactivityTimer;
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        if (localStorage.getItem('isLoggedIn')) {
            alert('Session expired due to inactivity. Please login again.');
            logout();
        }
    }, INACTIVITY_TIMEOUT);
}

// Reset timer on user activity
document.addEventListener('click', resetInactivityTimer);
document.addEventListener('keypress', resetInactivityTimer);
document.addEventListener('mousemove', resetInactivityTimer);

// Start timer on page load
if (localStorage.getItem('isLoggedIn')) {
    resetInactivityTimer();
}