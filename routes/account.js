const express = require('express');
const accountController = require('../controllers/account');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

router.get('/admin/account',isAuth, accountController.getaccount);
router.post('/account', isAuth, accountController.postaccount);

module.exports = router;