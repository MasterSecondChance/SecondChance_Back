const cors = require("cors")
const express = require('express')
const app = express()
const { config } = require('./config')
const users = require('./routes/users.js');
const articles = require('./routes/articles.js');
const matches = require('./routes/matches');
const images = require('./routes/images');
const reactions = require('./routes/reactions');
const authApiRouter = require('./routes/auth');

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

users(app);
articles(app);
matches(app);
reactions(app);
images(app);

app.use("/api/auth", authApiRouter);

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening http://localhost:${config.port}`)
})