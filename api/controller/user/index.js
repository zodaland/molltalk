const router = require('express').Router()
const userController = require('./userController')

router.use('/check', userController.check)
router.get('/:id', userController.findById)

module.exports = router