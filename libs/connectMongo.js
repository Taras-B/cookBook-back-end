const mongoose = require('mongoose')
require('dotenv').config()

async function connectMongoDb() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = connectMongoDb
