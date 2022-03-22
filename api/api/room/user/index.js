const router = require('express').Router()
const controller = require('./controller')

router.get('/user', controller.findRooms)
router.post('/user', controller.create)
router.delete('/:no/user', controller.delete)


module.exports = router
