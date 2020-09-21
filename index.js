const express = require('express')
// const mongoose = require('mongoose')
const passport = require('passport')

const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

const connectMongoDb = require('./libs/connectMongo')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(passport.initialize())

require('./middleware/passport')(passport)

app.get('/', (req, res) => {
  res.send('hello world')
})

app.use('/api/recipes', require('./routes/recipes'))
app.use('/api/auth', require('./routes/auth'))

app.use((req, res) => {
  res.status(404)
  res.json({ errorMsg: 'Not Found' })
})

// start()
connectMongoDb()

app.listen(process.env.PORT || 3000, () => {
  console.log('Server has been started on port: ' + process.env.PORT)
})
