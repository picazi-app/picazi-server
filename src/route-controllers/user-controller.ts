export {};
const User = require('../database/models/user-model')
const dbOperations = require('../database/db-operations');
const Validator = require('validator');
const isEmpty =  require('lodash/isEmpty');
const bcrypt = require('bcrypt');


// exports.doesEmailExist = async function(req, res, next) {
//   try {
//     const email = req.body.email;
//     const user = await dbOperations.fetchUserByEmail(email);
//     if(user === null) {
//       res.status(200).json({emailExists: false})
//     }
//     else {
//       res.status(200).json({emailExists: true})
//     } 
//   } catch(e) {
//       res.status(500).send('Server Error.')
//   };
  
// };


// exports.registerUser = async function(req, res, next) {
//   try {
//       const email = req.body.email;
//       const username = req.body.username;
//       const firstName = req.body.firstName;
//       let password = req.body.password;

//       let hash = bcrypt.hashSync(password, 10)

//       const user = await dbOperations.regSaveUser(email, username, firstName, hash);
//       if(!user) { 
//         res.status(500).json({msg: "Couldn't save user data"})
//       }
//       else {
//         res.status(200).json({msg: "Success"})
//       } 
//   }catch(e) {
//       res.status(500).send('Server Error.')
//   }
// }

// function validateInput(data) {
//   let errors = {};
//   if(Validator.isEmpty(data.email)) {
//     errors.email = 'This field is required';
//   }
//   if(Validator.isEmail(data.email)) {
//     errors.email = 'Email is invalid';
//   }
//   if(Validator.isEmpty(data.firstName)) {
//     errors.firstName= 'This field is required';
//   }
//   if(Validator.isEmpty(data.password)) {
//     errors.password = 'This field is required'; 
//   }
//   if(Validator.isEmpty(data.username)) {
//     errors.username = 'This field is required';
//   }
//   return {
//     errors,
//     isValid: isEmpty(errors)
//   }
// }
// // try {

  //   // const { errors, isValid } = validateInput(req.body);

  //     // if(isValid) {
  //       const email = req.body.email;
  //       const username = req.body.username;
  //       const firstName = req.body.firstName;
  //       const password = req.body.password;

  //       const user = await dbOperations.regSaveUser(email, username, firstName, password);
  //       console.log("user", user)
  //       if(!user) {
  //         res.status(500).json({msg: "Couldn't save user data"})
  //       }
  //       else {
  //         res.status(200).json({msg: "Success"})
  //       } 
  //     // }
  //     else {
  //       res.status(400).json(errors)
  //     }
  //   // }
  //   // catch(e) {
  //   //   console.log(e)
  //   //   res.status(500).send('Server Error.')
  //   // }