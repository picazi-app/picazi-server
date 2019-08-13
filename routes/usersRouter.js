var express = require('express');
var router = express.Router();
var userController = require('../route-controllers/user-controller')

router.post('/email/check', userController.doesEmailExist);

router.post('/email/register', userController.registerUser);

// router.post('/email/login', userController.loginUser);

// router.get("", ( { session: {user}}, res ) => {
//   console.log("inside session get")
//   res.send({user})
// })

module.exports = router;
