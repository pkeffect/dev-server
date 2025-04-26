// app_node.js
const express = require('express');
const cors = require('cors');
const app = express();

// Enable JSON body parsing
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Use the PORT environment variable or default to 8080
const port = process.env.PORT || 8080;
const env = process.env.NODE_ENV || 'development';

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from Node.js Express!',
    service: 'Node.js Express API',
    environment: env,
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Node.js Express API'
  });
});

app.post('/echo', (req, res) => {
  res.json({
    echo: req.body,
    service: 'Node.js Express API'
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Node.js Express server listening on port ${port}`);
});