const passport = require('passport')

module.exports.userAuth = passport.authenticate('jwt', { session: false })
