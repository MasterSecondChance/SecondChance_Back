const express = require('express')
const app = express()
const { config } = require('./config')
const cors = require("cors")
const users = require('./routes/users.js');
const authApiRouter = require('./routes/auth');

app.use(express.json())
app.use(cors())

users(app);

app.use("/api/auth", authApiRouter);

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening http://localhost:${config.port}`)
})