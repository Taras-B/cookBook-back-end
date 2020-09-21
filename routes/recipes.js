const router = require('express').Router()

// const passport = require('passport')
const { userAuth } = require('../libs/auth')
const Recipe = require('../models/recipe')

/**
 * @Route GET ~api/recipes/
 * @Desc     Get recipes
 * @Access   Public
 */

router.get('/', userAuth, async (req, res) => {
  try {
    const recipes = await Recipe.find().lean()
    res.json({ success: true, recipes: recipes })
  } catch (e) {
    console.log(e)
    res.json({ success: false, message: 'Something is wrong' })
  }
})

/**
 * @Route POST ~api/recipes/add
 * @Desc     Add recipe
 * @Access   Private
 */

router.post('/add', userAuth, async (req, res) => {
  try {
    const { title, description } = req.body
    // console.log('-----------', req.body.title)
    const newRecipe = new Recipe({ title, description })

    const recipe = await newRecipe.save()
    res.json({ recipe, success: true, message: 'The recipe has been added' })
  } catch (e) {
    console.log(e)
    res.json({ success: false, message: 'Something is wrong' })
  }
})

/**
 * @Route POST ~api/recipes/edit/:id
 * @Desc     Edit recipe by ID
 * @Access   Private
 */

router.post('/edit/:id', userAuth, async (req, res) => {
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

/**
 * @Route POST ~api/recipes/delete/:id
 * @Desc     Delete recipe by id
 * @Access   Private
 */

router.delete('/delete/:id', userAuth, async (req, res) => {
  try {
    console.log(req.params.id)
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
