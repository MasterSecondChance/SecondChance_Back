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

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customSiteTitle: 'Troud API Documentation',
  customfavIcon: '/favicon.ico',
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    filter: true,
    displayRequestDuration: true
  }
}))

// API routes
users(app);
articles(app);
matches(app);
reactions(app);
images(app);

app.use("/api/auth", authApiRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Troud API',
    version: '1.0.0',
    documentation: '/api-docs',
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

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Troud API Server running on http://localhost:${config.port}`)
  console.log(`📚 API Documentation available at http://localhost:${config.port}/api-docs`)
})