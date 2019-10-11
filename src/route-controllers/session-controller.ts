import * as express from 'express';
import InvalidCredentialsException from '../exceptions/InvalidCredentialsException';
import {Session, SessionUser} from '../interfaces/session-interface'
import { Request } from 'aws-sdk';
const dbOperations = require('../database/db-operations');
const bcrypt = require('bcrypt');

class SessionController {
  public path = '/api/session';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, this.loginUser);
    this.router.get(`${this.path}/saveSession`, this.getUserSession);
    this.router.delete(`${this.path}/delete`, this.deleteUserSession);
  }

  private sessionizeUser = (user:SessionUser) => {
    return { firstName: user.firstName, username: user.username, email: user.email};
  }
  private loginUser = async (req: any, res: express.Response, next: express.NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;
  
  const user = await dbOperations.fetchUserByEmail(email);
  try {
    if(user) {
      const match = await bcrypt.compare(password, user.password);
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
          next(new InvalidCredentialsException())
      }
    } 
    else {
        next(new InvalidCredentialsException())
    }
  } catch(e) {
      console.log("error inside login catch")
      next(e)
      
    }
    
  }

  private getUserSession = ({ session }:any, res: express.Response) => {
    console.log("req.session is.....", session)
    // const user = req!.session!.user
    // if(req!.session! && user)
    console.log("user is", session.user);
    try{
      if(session && session.user) {
        res.status(200).send({
          user: {
            ...session.user
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

  private deleteUserSession = ({ session }:any, res: express.Response) => {
    try {
      const user = session && session.user;
      if(user) {
        session.destroy((err:any) => {
          if(err) throw err;
          res.clearCookie('purnima')
          res.send(user);
        })
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