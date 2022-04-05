const router = require('express').Router()
const invitationController = require('./invitationController')

router.post('/', invitationController.create)
router.get('/', invitationController.findsByInvitedUser)
router.delete('/:no', invitationController.delete)

module.exports = router
