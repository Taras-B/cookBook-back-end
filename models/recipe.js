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
})

module.exports = model('Recipe', recipeSchema)
