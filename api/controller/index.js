const router = require('express').Router();
const authController = require('./auth');
const roomController = require('./room');
const invitationController = require('./invitation');
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('./user');

router.use('/auth', authController);

router.use('/', authMiddleware);
router.use('/room', roomController);
router.use('/invitation', invitationController);
router.use('/user', userController);

module.exports = router;