document.addEventListener('DOMContentLoaded', () => {

    // --- THEME SWITCHER LOGIC ---
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Determine and apply the initial theme
    const savedTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    function applyTheme(theme) {
        if (theme === 'dark') {
            html.classList.add('dark');
            themeToggle.textContent = '☀️';
        } else {
            html.classList.remove('dark');
            themeToggle.textContent = '🌙';
        }
    }

    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const isDark = !html.classList.contains('dark');
        const newTheme = isDark ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    
    // --- GLOBAL ALERT FUNCTION (for dashboard.js) ---
    window.showAlert = function(message, type = 'success') {
        const alert = document.getElementById('alert');
        const alertMessage = document.getElementById('alert-message');
        if (!alert || !alertMessage) return;

        alert.className = ''; // Reset classes
        alert.classList.add(type);
        alertMessage.textContent = message;
        alert.style.display = 'flex';

        // Auto-hide after 3 seconds
        setTimeout(() => {
            alert.style.display = 'none';
        }, 3000);

        // Close button functionality
        const closeButton = alert.querySelector('button');
        if (closeButton) {
            closeButton.onclick = () => { alert.style.display = 'none'; };
        }
    };
});