const { Schema, model } = require('mongoose')

const recipeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

module.exports = model('Recipe', recipeSchema)
