const router = require('express').Router()
const roomUserController = require('./roomUserController')

router.get('/user', roomUserController.findRoomUsers)
router.post('/user', roomUserController.create)
router.delete('/:no/user', roomUserController.delete)


module.exports = router
