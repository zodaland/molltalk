const router = require('express').Router()
const userController = require('./userController')
const authMiddleware = require('../../middlewares/auth')

router.post('/register', userController.register)
//router.get('/user/:id', userController.user)
router.post('/login', userController.login)
router.use('/logout', userController.logout)

router.use('/check', authMiddleware)
router.use('/check', userController.check)

module.exports = router
