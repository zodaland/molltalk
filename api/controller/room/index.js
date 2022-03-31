const router = require('express').Router()
const room = require('./controller')
const user = require('./user')

router.post('/', room.create)
router.get('/', room.find)
router.use('/', user)
router.get('/:no', room.find)

module.exports = router
