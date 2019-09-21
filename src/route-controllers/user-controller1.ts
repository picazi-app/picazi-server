import * as express from 'express';
import { NextFunction } from 'connect';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import ThisUserNameExistsException from '../exceptions/ThisUserNameExistsException';
const dbOperations = require('../database/db-operations');
const bcrypt = require('bcrypt');

class UserController {
  public path = '/users'
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/email/check`, this.doesEmailExist);
    this.router.post(`${this.path}/email/register`, this.registerUser);
    this.router.post(`${this.path}/username/check`, this.doesUserNameExist);
  }

  private doesEmailExist = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
      const email = req.body.email;
      const user = await dbOperations.fetchUserByEmail(email);
      if(user === null) {
        res.status(200).json({message: 'false'})
        // next(new UserWithThatEmailAlreadyExistsException(email))
      }
      else {
        // res.status(200).json({emailExists: true})
        next(new UserWithThatEmailAlreadyExistsException('true'))
      } 
    } catch(e) {
        res.status(500).send('Server Error.')
    };
  }

  private doesUserNameExist = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
      const username = req.body.username;
      const user = await dbOperations.fetchUserByUserName(username);
      if(user === null) {
        res.status(200).json({message: 'false'})
      }
      else {
        next(new ThisUserNameExistsException('true'))
      } 
    } catch(e) {
        res.status(500).send('Server Error.')
    };
  }

  private registerUser = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
      const email = req.body.email;
      const username = req.body.username;
      const firstName = req.body.firstName;
      let password = req.body.password;
      let hash = bcrypt.hashSync(password, 10)

      const user = await dbOperations.regSaveUser(email, username, firstName, hash);
      if(!user) { 
        res.status(500).json({msg: "Couldn't save user data"})
      }
      else {
        res.status(200).json({msg: "Success"})
      } 
      }catch(e) {
          res.status(500).send('Server Error.')
      }
  }
}

export default UserController;