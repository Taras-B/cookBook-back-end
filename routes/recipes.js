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

    await recipe.save()
    res.json({ msg: 'Рецепт був доданий' })
  } catch (e) {
    console.log(e)
    res.json({ msg: 'Щось пішло не так' })
  }
})

router.delete('/delete/:id', async (req, res) => {
  try {
    Recipe.findByIdAndRemove(req.params.id, (err) => {
      if (err) return res.status(500).send('There was a problem deleting the user.')
      res.json({ success: true, message: 'Recipe deleted.' })
    })
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
