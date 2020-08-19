const router = require('express').Router()

const Recipe = require('../models/recipe')

router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().lean()
    res.json({ recipes: recipes })
  } catch (e) {
    console.log(e)
  }
})

router.post('/add', async (req, res) => {
  try {
    const { title, description } = req.body
    // console.log('-----------', req.body.title)
    const recipe = new Recipe({ title, description })

    recipe.save()
    res.json({ msg: 'Рецепт був доданий' })
  } catch (e) {
    console.log(e)
    res.json({ msg: 'Щось пішло не так' })
  }
})

module.exports = router
