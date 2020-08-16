const express = require('express')
const app = express()
const { config } = require('./config')
const cors = require("cors")

app.use(express.json())
app.use(cors())

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening http://localhost:${config.port}`)
})