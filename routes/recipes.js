const router = require('express').Router()

const Recipe = require('../models/recipe')

router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().lean()
    res.json({ recipes: recipes })
  } catch (e) {
    console.log(e)
    res.json({ message: 'Щось пішло не так' })
  }
})

router.post('/add', async (req, res) => {
  try {
    const { title, description } = req.body
    // console.log('-----------', req.body.title)
    const recipe = new Recipe({ title, description })

    await recipe.save()
    res.json({ message: 'Рецепт був доданий' })
  } catch (e) {
    console.log(e)
    res.json({ message: 'Щось пішло не так' })
  }
})

router.post('/edit/:id', async (req, res) => {
  try {
    await Recipe.findByIdAndUpdate(req.params.id, req.body, (err) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: 'There was a problem updating the recipe.' })
      res.json({ success: true, message: 'Recipe updated.' })
    })
  } catch (e) {
    console.log(e)
  }
})

router.delete('/delete/:id', async (req, res) => {
  try {
    await Recipe.findByIdAndRemove(req.params.id, (err) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: 'There was a problem deleting the recipe.' })
      res.json({ success: true, message: 'Recipe deleted.' })
    })
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
