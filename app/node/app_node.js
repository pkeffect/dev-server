// app_node.js
const express = require('express');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();

// Enable JSON body parsing
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Use the PORT environment variable or default to 8080
const port = process.env.PORT || 8080;
const env = process.env.NODE_ENV || 'development';

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js Express API',
      version: '1.0.0',
      description: 'Node.js Express API Documentation',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Development server'
      }
    ]
  },
  apis: ['./app_node.js'] // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Root endpoint
 *     description: Returns basic information about the service
 *     responses:
 *       200:
 *         description: Basic service information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello from Node.js Express!
 *                 service:
 *                   type: string
 *                   example: Node.js Express API
 *                 environment:
 *                   type: string
 *                   example: development
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Hello from Node.js Express!',
    service: 'Node.js Express API',
    environment: env,
    version: '1.0.0'
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the service
 *     responses:
 *       200:
 *         description: Service health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 service:
 *                   type: string
 *                   example: Node.js Express API
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Node.js Express API'
  });
});

/**
 * @swagger
 * /echo:
 *   post:
 *     summary: Echo endpoint
 *     description: Returns the JSON sent in the request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: 
 *               message: Hello world
 *               data: 
 *                 key: value
 *     responses:
 *       200:
 *         description: Echoed response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 echo:
 *                   type: object
 *                   example: 
 *                     message: Hello world
 *                     data: 
 *                       key: value
 *                 service:
 *                   type: string
 *                   example: Node.js Express API
 */
app.post('/echo', (req, res) => {
  res.json({
    echo: req.body,
    service: 'Node.js Express API'
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Node.js Express server listening on port ${port}`);
});