const dbOperations = require('../database/db-operations');
const bcrypt = require('bcrypt');

sessionizeUser = user => {
  return { firstName: user.firstName, username: user.username, email: user.email};
}

exports.loginUser = async function(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  
  const user = await dbOperations.fetchUserByEmail(email);
  try {
    if(user) {
      console.log("login user", user) 
      const match = await bcrypt.compare(password, user.password);
      console.log("match is", match)
      if(match) {
        req.session.user = {
          email: email,
          username: user.username,
          firstName: user.firstName
        };
        const sessionUser = sessionizeUser(user)

        res.status(200).json({
          _type: "UserResource",
          user: sessionUser
        });
      }
      else {
        res.status(401).send({
          error: {
            code: "INVALID_CREDENTIALS",
            msg: "Password is incorrect"
          }
        });
      }
    } 
    else {
      res.status(401).send({
        error: {
          code: "INVALID_CREDENTIALS",
          msg: "Email/password is incorrect"
        }
      });
    }
  }catch(e) {
    res.status(500).send({
      error: {
        code: "INVALID_CREDENTIALS",
        msg: "Server error."
      }
    });
  }
}
  