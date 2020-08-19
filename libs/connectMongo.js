const mongoose = require('mongoose')

async function connectMongoDb() {
  try {
    await mongoose.connect(
      'mongodb+srv://tarasb:1z2x3c4v5b@cluster0-mn0y2.mongodb.net/todos',
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }
    )
  } catch (error) {
    console.log(error)
  }
}

module.exports = connectMongoDb
