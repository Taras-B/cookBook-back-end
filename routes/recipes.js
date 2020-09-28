const router = require('express').Router()

// const passport = require('passport')
const { userAuth } = require('../libs/auth')
const Recipe = require('../models/recipe')

/**
 * @Route GET ~api/recipes/
 * @Desc     Get all recipes
 * @Access   Public
 */

router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('user_id').exec()
    res.json({ success: true, recipes: recipes })
  } catch (e) {
    console.log(e)
    res.json({ success: false, message: 'Something is wrong' })
  }
})

/**
 * @Route GET ~api/recipes/my
 * @Desc     Get recipes user
 * @Access   Private
 */

router.get('/my', userAuth, async (req, res) => {
  try {
    const recipes = await Recipe.find({ user_id: req.user._id })
      .populate('user_id')
      .exec()
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
    const newRecipe = new Recipe({ title, description, user_id: req.user._id })

    const findRecipe = await newRecipe.save()

    res.json({
      recipe: await Recipe.findById(findRecipe._id).populate('user_id').exec(),
      success: true,
      message: 'The recipe has been added',
    })
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
    await Recipe.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      req.body,
      { new: true },
      (err, doc) => {
        if (err || !doc) {
          return res
            .status(400)
            .json({ success: false, message: 'There was a problem updating the recipe.' })
        }
        console.log(doc)
        res.json({ success: true, message: 'Recipe updated.' })
      }
    )
  } catch (e) {
    console.log(e)
    res
      .status(500)
      .json({ success: false, message: 'There was a problem updating the recipe.' })
  }
})

/**
 * @Route DELETE ~api/recipes/delete/:id
 * @Desc     Delete recipe by id
 * @Access   Private
 */

router.delete('/delete/:id', userAuth, async (req, res) => {
  try {
    await Recipe.findOneAndRemove(
      { _id: req.params.id, user_id: req.user._id },
      (err, doc) => {
        if (err || !doc)
          return res
            .status(400)
            .json({ success: false, message: 'There was a problem deleting the recipe.' })
        res.json({ success: true, message: 'Recipe deleted.' })
      }
    )
  } catch (e) {
    console.log(e)
    res
      .status(500)
      .json({ success: false, message: 'There was a problem deleting the recipe.' })
  }
})

module.exports = router
