document.addEventListener('DOMContentLoaded', () => {
    // Service endpoints
    const services = {
        'live-server': 'http://localhost:8081/api.html',  // Now pointing to the API HTML file
        flask: 'http://localhost:8082',
        fastapi: 'http://localhost:8083',
        nodejs: 'http://localhost:8084'
    };

    // Check all services on load
    checkAllServices();
    
    // Set up event listeners
    document.querySelectorAll('.test-btn').forEach(button => {
        button.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            testService(service);
        });
    });
    
    document.getElementById('test-all').addEventListener('click', testAllServices);
    document.getElementById('clear-results').addEventListener('click', clearResults);

    // Initialize resizable elements
    initResizable();

    // Function to check if a service is online
    async function checkService(service, url) {
        const card = document.getElementById(service);
        const statusElement = card.querySelector('.status');
        
        try {
            console.log(`Checking service ${service} at URL: ${url}`);
            const startTime = performance.now();
            const response = await fetch(url, { 
                method: 'GET',
                mode: 'cors' 
            });
            const endTime = performance.now();
            
            if (response.ok) {
                statusElement.innerHTML = `<span class="dot"></span> Online (${Math.round(endTime - startTime)}ms)`;
                statusElement.classList.add('online');
                statusElement.classList.remove('offline');
            } else {
                statusElement.innerHTML = `<span class="dot"></span> Error: ${response.status}`;
                statusElement.classList.add('offline');
                statusElement.classList.remove('online');
            }
        } catch (error) {
            console.error(`Error checking service ${service}:`, error);
            statusElement.innerHTML = `<span class="dot"></span> Offline`;
            statusElement.classList.add('offline');
            statusElement.classList.remove('online');
        }
    }

    // Check all services
    function checkAllServices() {
        // Using the correct keys from services object
        checkService('live-server', services['live-server']);
        checkService('flask', services.flask);
        checkService('fastapi', services.fastapi);
        checkService('nodejs', services.nodejs);
    }

    // Test a specific service and show response
    async function testService(service) {
        const card = document.getElementById(service);
        const responseElement = card.querySelector('.response-data');
        const serviceUrl = services[service];
        
        if (!serviceUrl) {
            console.error(`No URL found for service: ${service}`);
            responseElement.innerHTML = `
                <div class="failure-message">Configuration Error ✗</div>
                <div class="timestamp">No URL configured for service: ${service}</div>
            `;
            responseElement.classList.add('failure');
            responseElement.classList.remove('success');
            return;
        }
        
        try {
            console.log(`Testing service ${service} at URL: ${serviceUrl}`);
            const startTime = performance.now();
            const response = await fetch(serviceUrl, { 
                method: 'GET',
                mode: 'cors' 
            });
            const endTime = performance.now();
            
            let responseText = await response.text();
            let responseData = null;
            
            // Try to parse the response as JSON
            try {
                // For the live-server, we need to extract the JSON from the pre tag
                if (service === 'live-server' && responseText.includes('<pre>')) {
                    const preRegex = /<pre>([\s\S]*?)<\/pre>/;
                    const match = preRegex.exec(responseText);
                    if (match && match[1]) {
                        try {
                            responseData = JSON.parse(match[1].trim());
                        } catch (e) {
                            console.error('Error parsing extracted JSON:', e);
                        }
                    }
                } else {
                    responseData = JSON.parse(responseText);
                }
            } catch (e) {
                console.error('Error parsing JSON:', e);
                // If not JSON, leave as text
            }
            
            // Simplified response - just show success/failure
            if (response.ok) {
                responseElement.innerHTML = `
                    <div class="success-message">Success ✓</div>
                    <div class="timestamp">Response time: ${Math.round(endTime - startTime)}ms</div>
                `;
                responseElement.classList.add('success');
                responseElement.classList.remove('failure');
                
                // Show the response data if we have it
                if (responseData) {
                    responseElement.innerHTML += `
                        <div class="response-content">
                            <pre>${JSON.stringify(responseData, null, 2)}</pre>
                        </div>
                    `;
                } else if (responseText) {
                    // Only show a snippet of the text if it's very long
                    const displayText = responseText.length > 500 
                        ? responseText.substring(0, 500) + '...' 
                        : responseText;
                    responseElement.innerHTML += `
                        <div class="response-content">
                            <pre>${displayText}</pre>
                        </div>
                    `;
                }
            } else {
                responseElement.innerHTML = `
                    <div class="failure-message">Failure ✗ (Status: ${response.status})</div>
                    <div class="timestamp">Response time: ${Math.round(endTime - startTime)}ms</div>
                `;
                responseElement.classList.add('failure');
                responseElement.classList.remove('success');
                
                // Show error details if we have them
                if (responseData) {
                    responseElement.innerHTML += `
                        <div class="error-details">
                            <pre>${JSON.stringify(responseData, null, 2)}</pre>
                        </div>
                    `;
                } else if (responseText) {
                    // Only show a snippet of the text if it's very long
                    const displayText = responseText.length > 500 
                        ? responseText.substring(0, 500) + '...' 
                        : responseText;
                    responseElement.innerHTML += `
                        <div class="error-details">
                            <pre>${displayText}</pre>
                        </div>
                    `;
                }
            }
        } catch (error) {
            console.error(`Error testing service ${service}:`, error);
            responseElement.innerHTML = `
                <div class="failure-message">Connection Failed ✗</div>
                <div class="timestamp">${error.message}</div>
            `;
            responseElement.classList.add('failure');
            responseElement.classList.remove('success');
        }
    }

    // Test all services
    async function testAllServices() {
        const resultsElement = document.getElementById('test-results');
        resultsElement.innerHTML = '<p>Testing all services...</p>';
        
        for (const [service, url] of Object.entries(services)) {
            try {
                console.log(`Testing all services - service: ${service}, URL: ${url}`);
                const startTime = performance.now();
                const response = await fetch(url, { 
                    method: 'GET', 
                    mode: 'cors'
                });
                const endTime = performance.now();
                
                // For the live-server, we want to extract and display the JSON if possible
                if (service === 'live-server' && response.ok) {
                    const responseText = await response.text();
                    const preRegex = /<pre>([\s\S]*?)<\/pre>/;
                    const match = preRegex.exec(responseText);
                    
                    if (match && match[1]) {
                        try {
                            const responseData = JSON.parse(match[1].trim());
                            console.log('Live server JSON data:', responseData);
                        } catch (e) {
                            console.error('Error parsing live server JSON:', e);
                        }
                    }
                }
                
                // Simplified output - just success/failure
                if (response.ok) {
                    resultsElement.innerHTML += `
                        <div class="service-result success">
                            <span class="service-name">${service}:</span> 
                            <span class="result-status">Success ✓</span>
                            <span class="timestamp">(${Math.round(endTime - startTime)}ms)</span>
                        </div>
                    `;
                } else {
                    resultsElement.innerHTML += `
                        <div class="service-result failure">
                            <span class="service-name">${service}:</span> 
                            <span class="result-status">Failure ✗ (${response.status})</span>
                            <span class="timestamp">(${Math.round(endTime - startTime)}ms)</span>
                        </div>
                    `;
                }
            } catch (error) {
                console.error(`Error in testAllServices for ${service}:`, error);
                resultsElement.innerHTML += `
                    <div class="service-result failure">
                        <span class="service-name">${service}:</span> 
                        <span class="result-status">Connection Failed ✗</span>
                        <span class="timestamp">(${error.message})</span>
                    </div>
                `;
            }
        }
    }

    // Clear results
    function clearResults() {
        document.getElementById('test-results').innerHTML = '<p>Results will appear here...</p>';
        document.querySelectorAll('.response-data').forEach(el => {
            el.innerHTML = '';
            el.classList.remove('success', 'failure');
        });
    }

    // Make test results panel resizable
    function initResizable() {
        const resizableElements = document.querySelectorAll('.resizable');
        
        resizableElements.forEach(element => {
            // Create and append resize handle
            const resizeHandle = document.createElement('div');
            resizeHandle.className = 'resize-handle';
            element.appendChild(resizeHandle);
            
            let startY, startHeight;
            
            resizeHandle.addEventListener('mousedown', function(e) {
                startY = e.clientY;
                startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);
                document.addEventListener('mousemove', resizePanel);
                document.addEventListener('mouseup', stopResize);
                e.preventDefault();
            });
            
            function resizePanel(e) {
                const newHeight = startHeight + e.clientY - startY;
                if (newHeight > 100) { // minimum height
                    element.style.height = `${newHeight}px`;
                }
            }
            
            function stopResize() {
                document.removeEventListener('mousemove', resizePanel);
                document.removeEventListener('mouseup', stopResize);
            }
        });
    }

    // Periodically check services
    setInterval(checkAllServices, 30000); // Check every 30 seconds
});