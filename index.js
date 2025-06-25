const cors = require("cors")
const express = require('express')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const app = express()
const { config } = require('./config')
const MongoLib = require('./lib/mongo')
const users = require('./routes/users.js');
const articles = require('./routes/articles.js');
const matches = require('./routes/matches');
const images = require('./routes/images');
const reactions = require('./routes/reactions');
const authApiRouter = require('./routes/auth');
const { errorHandler, notFoundHandler } = require('./utils/errorHandler');

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

// Error handling middleware (must be after all routes)
app.use(notFoundHandler);
app.use(errorHandler);

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

// Health check endpoint with database status
app.get('/health', async (req, res) => {
  try {
    const mongoDB = new MongoLib()
    const db = await mongoDB.connect()
    
    // Basic database ping
    await db.admin().ping()
    
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.dev ? 'development' : 'production',
      database: {
        status: 'connected',
        name: db.databaseName,
        host: config.dbHost || 'localhost',
        user: config.dbUser
      },
      version: '1.0.0'
    })
  } catch (error) {
    console.error('❌ Database health check failed:', error)
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.dev ? 'development' : 'production',
      database: {
        status: 'disconnected',
        error: error.message
      },
      version: '1.0.0'
    })
  }
})

// Database initialization function
async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database connection...')
    const mongoDB = new MongoLib()
    const db = await mongoDB.connect()
    
    console.log('✅ Successfully connected to MongoDB!')
    console.log(`📍 Database: ${db.databaseName}`)
    console.log(`🔗 Host: ${config.dbHost || 'localhost'}`)
    console.log(`👤 User: ${config.dbUser}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    return db
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message)
    console.error('🔧 Check your .env configuration and MongoDB server')
    process.exit(1)
  }
}

// Start server with database initialization
async function startServer() {
  // Initialize database first
  await initializeDatabase()
  
  // Start HTTP server
  app.listen(config.port, () => {
    console.log('🚀 TROUD API SERVER STARTED')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`🌐 Server: http://localhost:${config.port}`)
    console.log(`📚 Documentation: http://localhost:${config.port}/api-docs`)
    console.log(`🔗 API Base: http://localhost:${config.port}/api`)
    console.log(`💚 Health Check: http://localhost:${config.port}/health`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`🏃‍♂️ Environment: ${config.dev ? 'DEVELOPMENT' : 'PRODUCTION'}`)
    console.log(`🕐 Started at: ${new Date().toLocaleString()}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  })
}

// Start the application
startServer().catch(error => {
  console.error('💥 Failed to start server:', error)
  process.exit(1)
})