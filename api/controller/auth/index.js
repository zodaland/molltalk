const router = require('express').Router()
const authController = require('./authController')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.use('/logout', authController.logout)

module.exports = router
