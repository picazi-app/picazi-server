var express = require('express');
var router = express.Router();
var userController = require('../route-controllers/user-controller')

router.post('/email/check', userController.doesEmailExist);

router.post('/email/register', userController.registerUser);

module.exports = router;
