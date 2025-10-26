document.addEventListener('DOMContentLoaded', () => {
    const services = {
        'live-server': 'http://localhost:8081/api.html',
        'flask': 'http://localhost:8082',
        'fastapi': 'http://localhost:8083',
        'nodejs': 'http://localhost:8084'
    };

    function safeAddEventListener(id, event, handler) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener(event, handler);
        }
        // Warning removed: we know some elements might be missing now intentionally
    }

    function initDashboard() {
        // Individual service test buttons
        document.querySelectorAll('.test-btn').forEach(button => {
            button.addEventListener('click', function() {
                const service = this.getAttribute('data-service');
                if (service) testService(service);
            });
        });

        // API Tester functionality
        safeAddEventListener('api-method', 'change', function() {
            const bodyContainer = document.getElementById('api-body-container');
            if (bodyContainer) bodyContainer.style.display = this.value === 'POST' ? 'block' : 'none';
        });
        safeAddEventListener('send-api-request', 'click', sendApiRequest);
    }

    async function checkService(service, url) {
        const card = document.getElementById(service);
        if (!card) return;
        const statusElement = card.querySelector('.status');
        if (!statusElement) return;
        try {
            const startTime = performance.now();
            const response = await fetch(url, { method: 'GET', mode: 'cors' });
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
            statusElement.innerHTML = `<span class="dot"></span> Offline`;
            statusElement.classList.add('offline');
            statusElement.classList.remove('online');
        }
    }

    function checkAllServices() {
        Object.entries(services).forEach(([service, url]) => checkService(service, url));
    }

    async function testService(service) {
        const card = document.getElementById(service);
        if (!card) return;
        const responseElement = card.querySelector('.response-data');
        if (!responseElement) return;
        
        const serviceUrl = services[service];
        if (!serviceUrl) {
            responseElement.innerHTML = `<div class="failure-message">Configuration Error</div>`;
            return;
        }

        try {
            const response = await fetch(serviceUrl, { method: 'GET', mode: 'cors' });
            const responseText = await response.text();
            let responseData = null;
            
            try {
                if (service === 'live-server' && responseText.includes('<pre>')) {
                    const match = /<pre>([\s\S]*?)<\/pre>/.exec(responseText);
                    if (match && match[1]) responseData = JSON.parse(match[1].trim());
                } else {
                    responseData = JSON.parse(responseText);
                }
            } catch (e) { /* Not JSON, that's fine */ }
            
            if (response.ok) {
                responseElement.innerHTML = `<div class="success-message">Success ✓</div>`;
                if (responseData) {
                    responseElement.innerHTML += `<pre>${JSON.stringify(responseData, null, 2)}</pre>`;
                }
            } else {
                responseElement.innerHTML = `<div class="failure-message">Failure ✗ (Status: ${response.status})</div>`;
                responseElement.innerHTML += `<pre>${responseText}</pre>`;
            }
        } catch (error) {
            responseElement.innerHTML = `<div class="failure-message">Connection Failed ✗</div>`;
        }
    }
    
    async function sendApiRequest() {
        const service = document.getElementById('api-service').value;
        const method = document.getElementById('api-method').value;
        const endpoint = document.getElementById('api-endpoint').value;
        const responseEl = document.getElementById('api-response');
        if (!responseEl) return;
        const baseUrl = services[service];
        if (!baseUrl) {
            responseEl.textContent = '# Error: Service not found';
            return;
        }
        const options = { method, mode: 'cors', headers: { 'Content-Type': 'application/json' } };
        if (method === 'POST') {
            options.body = document.getElementById('api-body').value;
        }
        try {
            responseEl.textContent = '# Sending request...';
            const response = await fetch(`${baseUrl}${endpoint}`, options);
            const responseText = await response.text();
            try {
                const json = JSON.parse(responseText);
                responseEl.textContent = `# Status: ${response.status}\n\n${JSON.stringify(json, null, 2)}`;
            } catch {
                responseEl.textContent = `# Status: ${response.status}\n\n${responseText}`;
            }
        } catch (error) {
            responseEl.textContent = `# Error: ${error.message}`;
        }
    }

    initDashboard();
    checkAllServices();
    setInterval(checkAllServices, 60000);
});