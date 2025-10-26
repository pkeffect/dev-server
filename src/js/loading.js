/**
 * Enhanced Loading Screen Manager
 * A streamlined, performance-optimized loading screen system with improved error handling
 */

// DOM elements
let loadingScreen;
let progressBar;
let loadingText;
let resourcesLoaded = 0;
let totalResources = 0;
let loadingStartTime;
let loadingTimeout;

// Resources to track
const RESOURCE_TYPES = [
    'img', 'script', 'link[rel="stylesheet"]', 'audio', 'video', 'iframe'
];

// Configuration
const CONFIG = {
    minLoadingTime: 800,     // Minimum time to show loading screen (ms)
    maxLoadingTime: 5000,    // Maximum time before force-hiding (ms)
    resourceTimeout: 10000   // Timeout for individual resources (ms)
};

// Initialize loading screen
document.addEventListener('DOMContentLoaded', function() {
    // Record start time for performance metrics
    loadingStartTime = performance.now();
    
    // Set body as loading
    document.body.classList.add('loading');
    
    // Get references to elements
    loadingScreen = document.querySelector('.loading-screen');
    progressBar = document.querySelector('.loading-progress-bar');
    loadingText = document.querySelector('.loading-text');
    
    if (!loadingScreen || !progressBar) {
        // Critical error - loading elements not found, hide everything immediately
        console.error('Loading screen elements not found');
        document.body.classList.remove('loading');
        return;
    }
    
    // Count resources that need to be loaded
    countResources();
    
    // Set up event listeners for resource loading
    trackResourceLoading();
    
    // If there are no resources to track or very few, set a minimum loading time
    if (totalResources < 5) {
        setTimeout(hideLoadingScreen, CONFIG.minLoadingTime);
    }
    
    // Fallback in case some resources fail to load
    loadingTimeout = setTimeout(() => {
        console.warn('Loading timeout reached, forcing completion');
        hideLoadingScreen();
    }, CONFIG.maxLoadingTime);
    
    // Listen for window load event as a backup
    window.addEventListener('load', function() {
        // Force complete loading after window load
        setTimeout(hideLoadingScreen, 300);
    });
});

/**
 * Count total resources that need to be loaded
 */
function countResources() {
    try {
        RESOURCE_TYPES.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            totalResources += elements.length;
        });
        
        // Update initial progress to 0%
        updateProgress(0);
        
        // Log resource count for debugging
        console.log(`Loading ${totalResources} resources`);
    } catch (error) {
        console.error('Error counting resources:', error);
        hideLoadingScreen(); // Ensure we don't get stuck
    }
}

/**
 * Track loading of resources
 */
function trackResourceLoading() {
    try {
        // Track images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            attachResourceListeners(img, 'load', 'error');
            
            // Check if already complete
            if (img.complete) {
                resourceLoaded();
            }
            
            // Set timeout for this resource
            setResourceTimeout(img);
        });
        
        // Track scripts
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            if (script.getAttribute('src')) {
                attachResourceListeners(script, 'load', 'error');
                setResourceTimeout(script);
            } else {
                resourceLoaded(); // Inline scripts are already loaded
            }
        });
        
        // Track stylesheets
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        links.forEach(link => {
            attachResourceListeners(link, 'load', 'error');
            
            // Check if already loaded
            if (link.sheet) {
                resourceLoaded();
            }
            
            setResourceTimeout(link);
        });
        
        // Track other embedded content
        const other = document.querySelectorAll('audio, video, iframe');
        other.forEach(el => {
            attachResourceListeners(el, 'load', 'loadeddata', 'error');
            setResourceTimeout(el);
        });
    } catch (error) {
        console.error('Error tracking resources:', error);
        hideLoadingScreen(); // Ensure we don't get stuck
    }
}

/**
 * Attach event listeners to a resource element
 * @param {Element} element - DOM element to attach listeners to
 * @param {...string} events - Event names to listen for
 */
function attachResourceListeners(element, ...events) {
    events.forEach(event => {
        element.addEventListener(event, resourceLoaded, { once: true });
    });
}

/**
 * Set timeout for individual resource
 * @param {Element} element - DOM element to set timeout for
 */
function setResourceTimeout(element) {
    setTimeout(() => {
        // If the element still needs to load, consider it loaded anyway
        if (!element.dataset.loaded) {
            element.dataset.loaded = true;
            resourceLoaded();
            console.warn('Resource timeout reached:', element);
        }
    }, CONFIG.resourceTimeout);
}

/**
 * Handle when a resource is loaded
 */
function resourceLoaded() {
    try {
        resourcesLoaded++;
        
        // Mark the resource as loaded to prevent duplicate counting
        if (this && this.dataset) {
            this.dataset.loaded = true;
        }
        
        // Update progress bar
        updateProgress();
        
        // Check if all resources are loaded
        if (resourcesLoaded >= totalResources) {
            const loadingTime = performance.now() - loadingStartTime;
            
            // Only hide if minimum time has passed
            if (loadingTime > CONFIG.minLoadingTime) {
                hideLoadingScreen();
            } else {
                setTimeout(hideLoadingScreen, CONFIG.minLoadingTime - loadingTime);
            }
        }
    } catch (error) {
        console.error('Error in resourceLoaded handler:', error);
    }
}

/**
 * Update progress visualization
 */
function updateProgress() {
    if (!progressBar) return;
    
    try {
        const progress = totalResources > 0 ? (resourcesLoaded / totalResources) * 100 : 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
        
        // Update loading text if present
        if (loadingText) {
            loadingText.textContent = `Loading... ${Math.round(progress)}%`;
        }
    } catch (error) {
        console.error('Error updating progress:', error);
    }
}

/**
 * Hide the loading screen
 */
function hideLoadingScreen() {
    // Only execute once
    if (document.body.classList.contains('loading-complete')) {
        return;
    }
    
    document.body.classList.add('loading-complete');
    
    try {
        // Clear the loading timeout
        if (loadingTimeout) {
            clearTimeout(loadingTimeout);
            loadingTimeout = null;
        }
        
        // Remove class from body
        document.body.classList.remove('loading');
        
        // Add fade out class to loading screen
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            
            // Remove loading screen after animation completes
            setTimeout(() => {
                if (loadingScreen && loadingScreen.parentNode) {
                    loadingScreen.parentNode.removeChild(loadingScreen);
                }
                
                // Log loading performance
                const loadingTime = performance.now() - loadingStartTime;
                console.log(`Page loaded in ${Math.round(loadingTime)}ms`);
                
                // Dispatch custom event for other scripts that need to know loading is complete
                window.dispatchEvent(new CustomEvent('loading-complete', {
                    detail: { loadingTime, resourcesLoaded, totalResources }
                }));
            }, 300);
        }
    } catch (error) {
        console.error('Error hiding loading screen:', error);
        
        // Fallback - force remove loading state
        document.body.classList.remove('loading');
        if (loadingScreen && loadingScreen.parentNode) {
            loadingScreen.parentNode.removeChild(loadingScreen);
        }
    }
}