// export {};
// const express = require('express');
// const router = express.Router();
// const sessionController = require('../route-controllers/session-controller')

// router.post('', sessionController.loginUser);

// router.get("", ( { session: {user}}, res ) => {
//   console.log("inside session get")
//   if(user) {
//     res.send({
//       user: {
//         ...user
//       },
//       isLoggedIn: true
//     })
//   }
//   else {
//     res.send({
//       isLoggedIn: false
//     })
//   }
// })

// router.delete("", ({ session }, res) => {
//   try {
//     const user = session.user;
//     console.log("API/SESSION DELETE user", user)
//     if(user) {
//       session.destroy(err => {
//         if(err) throw err;
//         res.clearCookie('purnima')
//         res.send(user);
//       })
//     console.log("After DELETing user", user)
//     }
//     else {
//       throw new Error('ERROR: You are logged out')
//     }
//   }
//   catch (err) {
//     res.status(422).send({
//       error: "error while deleting user"
//     })
//   }
// })

// module.exports = router;