/**
 * Enhanced Theme Management
 * Handles dark/light theme switching and persistence with improved performance and reliability
 */
document.addEventListener('DOMContentLoaded', function() {
    // Theme settings
    const THEME_STORAGE_KEY = 'web-template-theme-preference';
    const THEME_TRANSITION_CLASS = 'theme-transition';
    const DARK_THEME = 'dark';
    const LIGHT_THEME = 'light';
    
    // Get DOM elements
    const themeToggleButton = document.getElementById('theme-toggle');
    const lightIcon = document.getElementById('light-icon');
    const darkIcon = document.getElementById('dark-icon');
    const htmlElement = document.documentElement;
    
    // Initialize theme
    initializeTheme();
    
    /**
     * Initialize theme based on:
     * 1. User's stored preference
     * 2. System preference
     * 3. Default (dark theme)
     */
    function initializeTheme() {
        try {
            // First check if user has a stored preference
            const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
            
            if (storedTheme) {
                setTheme(storedTheme, false);
            } else {
                // Check if user prefers color scheme (browser/OS setting)
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setTheme(prefersDark ? DARK_THEME : LIGHT_THEME, false);
                
                // Add listener for system preference changes
                window.matchMedia('(prefers-color-scheme: dark)')
                    .addEventListener('change', e => {
                        if (!localStorage.getItem(THEME_STORAGE_KEY)) {
                            setTheme(e.matches ? DARK_THEME : LIGHT_THEME, true);
                        }
                    });
            }
            
            // Set up theme toggle button
            if (themeToggleButton) {
                themeToggleButton.addEventListener('click', toggleTheme);
                
                // Make sure button is visible after initialization
                themeToggleButton.style.visibility = 'visible';
            }
            
            // Initial icon update
            updateThemeIcons();
            
            console.log('Theme initialized:', getCurrentTheme());
        } catch (error) {
            console.error('Error initializing theme:', error);
            // Fallback to default theme
            setTheme(DARK_THEME, false);
        }
    }
    
    /**
     * Get the current theme
     * @returns {string} Current theme (dark/light)
     */
    function getCurrentTheme() {
        return htmlElement.getAttribute('data-theme') || DARK_THEME;
    }
    
    /**
     * Set the theme with transition effect
     * @param {string} theme - Theme to set (dark/light)
     * @param {boolean} animate - Whether to animate the transition
     */
    function setTheme(theme, animate = true) {
        try {
            // Validate theme
            if (theme !== DARK_THEME && theme !== LIGHT_THEME) {
                theme = DARK_THEME;
            }
            
            // Apply transition class if animating
            if (animate) {
                htmlElement.classList.add(THEME_TRANSITION_CLASS);
                
                // Remove transition class after animation completes
                setTimeout(() => {
                    htmlElement.classList.remove(THEME_TRANSITION_CLASS);
                }, 1000);
            }
            
            // Set theme
            htmlElement.setAttribute('data-theme', theme);
            
            // Save preference
            try {
                localStorage.setItem(THEME_STORAGE_KEY, theme);
            } catch (storageError) {
                console.warn('Could not save theme preference:', storageError);
            }
            
            // Update icons
            updateThemeIcons();
            
            // Update meta theme-color for browser UI
            updateMetaThemeColor(theme);
            
            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('theme-changed', { 
                detail: { theme } 
            }));
        } catch (error) {
            console.error('Error setting theme:', error);
        }
    }
    
    /**
     * Toggle between dark and light themes
     */
    function toggleTheme() {
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
        
        console.log('Switching theme:', currentTheme, '->', newTheme);
        setTheme(newTheme, true);
    }
    
    /**
     * Update theme icons visibility based on current theme
     */
    function updateThemeIcons() {
        if (!lightIcon || !darkIcon) return;
        
        try {
            const currentTheme = getCurrentTheme();
            
            // In dark theme, show light icon (sun)
            // In light theme, show dark icon (moon)
            if (currentTheme === DARK_THEME) {
                lightIcon.style.display = 'block';
                darkIcon.style.display = 'none';
            } else {
                lightIcon.style.display = 'none';
                darkIcon.style.display = 'block';
            }
        } catch (error) {
            console.error('Error updating theme icons:', error);
        }
    }
    
    /**
     * Update meta theme-color for browser UI
     * @param {string} theme - Current theme
     */
    function updateMetaThemeColor(theme) {
        try {
            // Get theme color based on current theme
            const themeColor = theme === DARK_THEME ? '#0d1117' : '#ffffff';
            
            // Find existing meta tag or create a new one
            let metaThemeColor = document.querySelector('meta[name="theme-color"]');
            
            if (!metaThemeColor) {
                metaThemeColor = document.createElement('meta');
                metaThemeColor.name = 'theme-color';
                document.head.appendChild(metaThemeColor);
            }
            
            metaThemeColor.content = themeColor;
        } catch (error) {
            console.error('Error updating meta theme-color:', error);
        }
    }
});