const router = require('express').Router();
const roomController = require('./roomController');
const user = require('./user');

router.post('/', roomController.create);
router.get('/', roomController.findsByNo);
router.use('/', user);

module.exports = router;
