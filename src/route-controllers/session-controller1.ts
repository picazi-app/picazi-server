import * as express from 'express';
const dbOperations = require('../database/db-operations');
const bcrypt = require('bcrypt');

class SessionController {
  public path = '/api/session';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.loginUser);
    this.router.get(`${this.path}`, this.getUserSession);
    this.router.delete(`${this.path}/delete`, this.deleteUserSession);
  }

  private sessionizeUser = (user:any) => {
    return { firstName: user.firstName, username: user.username, email: user.email};
  }
  private loginUser = async (req: any, res: express.Response) => {
    console.log("loginUser.........", req.body.email)
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
        const sessionUser = this.sessionizeUser(user)

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
  } catch(e) {
      console.log("error inside login catch")
      res.status(500).send({
        error: {
          code: "INVALID_CREDENTIALS",
          msg: "Server error."
        }
      });
      throw e;
    }
    
  }

  private getUserSession = ({ session: {user}}:any, res: express.Response) => {
    console.log("inside session get")
    try{
      if(user) {
        res.status(200).send({
          user: {
            ...user
          },
          isLoggedIn: true
        })
      }
      else {
        res.send({
          isLoggedIn: false
        })
      }
    }
    catch(e) {
      console.log(e)
      throw e;
    }
    
  }

  private deleteUserSession = ({ session }: any, res: express.Response) => {
    try {
      const user = session.user;
      console.log("API/SESSION DELETE user", user)
      if(user) {
        session.destroy((err:any) => {
          if(err) throw err;
          res.clearCookie('purnima')
          res.send(user);
        })
      console.log("After DELETing user", user)
      }
      else {
        throw new Error('ERROR: You are logged out')
      }
    }
    catch (err) {
      res.status(422).send({
        error: "error while deleting user"
      })
    }
  }
}

export default SessionController;