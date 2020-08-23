const express = require('express')
const app = express()
const { config } = require('./config')
const cors = require("cors")
const users = require('./routes/users.js');
const articles = require('./routes/articles.js');
const matches = require('./routes/matches');
const images = require('./routes/images');
const authApiRouter = require('./routes/auth');

app.use(express.json())
app.use(cors())

users(app);
articles(app);
matches(app);
images(app);

app.use("/api/auth", authApiRouter);

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening http://localhost:${config.port}`)
})