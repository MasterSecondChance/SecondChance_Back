const cors = require("cors")
const express = require('express')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const app = express()
const { config } = require('./config')
const users = require('./routes/users.js');
const articles = require('./routes/articles.js');
const matches = require('./routes/matches');
const images = require('./routes/images');
const reactions = require('./routes/reactions');
const authApiRouter = require('./routes/auth');

// Load Swagger document
const swaggerDocument = YAML.load('./swagger.yaml')

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE'
  ],

  allowedHeaders: [
    '*',
  ],
};

app.use(express.json())
app.use(cors(corsOpts))

// Create API router
const apiRouter = express.Router()

// Mount all API routes under /api
users(apiRouter);
articles(apiRouter);
matches(apiRouter);
reactions(apiRouter);
images(apiRouter);
apiRouter.use("/auth", authApiRouter);

// Mount the API router
app.use('/api', apiRouter)

// Swagger documentation - accessible from root
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customSiteTitle: 'Troud API Documentation',
  customfavIcon: '/favicon.ico',
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    filter: true,
    displayRequestDuration: true
  }
}))

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Troud API',
    version: '1.0.0',
    documentation: '/api-docs',
    apiBase: '/api',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      articles: '/api/articles',
      reactions: '/api/reactions',
      matches: '/api/matches',
      images: '/api/images'
    }
  })
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.dev ? 'development' : 'production'
  })
})

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Troud API Server running on http://localhost:${config.port}`)
  console.log(`📚 API Documentation available at http://localhost:${config.port}/api-docs`)
  console.log(`🔗 API Base URL: http://localhost:${config.port}/api`)
  console.log(`💚 Health Check: http://localhost:${config.port}/health`)
})