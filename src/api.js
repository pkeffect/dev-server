// api.js
// Simple script to fetch the API data when requested

document.addEventListener('DOMContentLoaded', () => {
  // Check if we're being requested as an API endpoint
  if (window.location.pathname === '/api') {
    // Load the API response data
    fetch('api.json')
      .then(response => response.json())
      .then(data => {
        // Return the data as a JSON response
        document.body.innerHTML = ''; // Clear any HTML
        
        // Display as JSON with proper content-type
        document.querySelector('head').innerHTML += '<meta http-equiv="Content-Type" content="application/json; charset=utf-8">';
        
        // Pretty print the JSON for easy viewing
        const pre = document.createElement('pre');
        pre.textContent = JSON.stringify(data, null, 2);
        document.body.appendChild(pre);
      })
      .catch(error => {
        console.error('Error fetching API data:', error);
        document.body.innerHTML = JSON.stringify({
          error: 'Failed to load API data',
          message: error.message
        });
      });
  }
});