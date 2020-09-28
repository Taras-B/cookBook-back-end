const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const router = require('express').Router()
require('dotenv').config()

const { check, validationResult } = require('express-validator')

/** @route    POST ~api/auth/register
 *  @desc     Register user
 *  @access   Public
 */

router.post(
  '/register',
  [
    check('username', 'Username is required.').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }
    const { username, email, password } = req.body

    try {
      let user = await User.findOne({ email })
      if (user) {
        return res.status(400).json({ success: false, message: 'User already exists!' })
      }

      const salt = await bcrypt.genSalt(10)

      const hashPassword = await bcrypt.hash(password, salt)
      const newUser = new User({
        username,
        email,
        password: hashPassword,
      })

      const savedUser = await newUser.save()
      if (!savedUser) throw Error('Something went wrong saving the user')

      res.json({ success: true, message: 'User exist in application' })
    } catch (e) {
      console.log(e)
    }
  }
)

/**
 * @Route POST ~api/auth/login
 * @Desc Login in application
 * @access   Public
 */

router.post(
  '/login',
  [
    check('email', 'Email is required.').isEmail(),
    check('password', 'Password is required.').isLength({ min: 6 }),
  ],

  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    try {
      const { email, password } = req.body
      const user = await User.findOne({ email }).select('+password')

      if (!user) {
        return res.status(404).json({
          message: 'Username is not found. Invalid login credentials.',
          success: false,
        })
      }

      let isMatch = await bcrypt.compare(password, user.password)

      if (isMatch) {
        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            username: user.username,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '2d',
          }
        )
        return res.status(200).json({
          data: {
            username: user.username,
            email: user.email,
            token: `Bearer ${token}`,
          },
          message: 'You are now logged in.',
          success: true,
        })
      } else {
        return res.status(403).json({
          message: 'Incorrect password.',
          success: false,
        })
      }
    } catch (err) {
      console.log('ERROR', err)
      return res
        .status(500)
        .json({ message: 'Server error please try again.', success: false })
    }
  }
)

module.exports = router
