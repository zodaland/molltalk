const router = require('express').Router()
const controller = require('./userController')

router.get('/:id', controller.findById)

module.exports = router