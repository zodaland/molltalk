const router = require('express').Router()
const auth = require('./auth')
const room = require('./room')
const invitation = require('./invitation')
const authCheck = require('../middlewares/auth')
const user = require('./user')

router.use('/test', user);

router.use('/auth', auth)

router.use('/', authCheck)
router.use('/room', room)
router.use('/invitation', invitation)
router.use('/user', user)

module.exports = router