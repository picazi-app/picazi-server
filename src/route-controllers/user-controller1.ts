import * as express from 'express';
import { NextFunction } from 'connect';
const dbOperations = require('../database/db-operations');
const bcrypt = require('bcrypt');

class UserController {
  public path = '/users'
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/email/check', this.doesEmailExist);
    this.router.post('/email/register', this.registerUser);
  }

  private doesEmailExist = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
      const email = req.body.email;
      const user = await dbOperations.fetchUserByEmail(email);
      if(user === null) {
        res.status(200).json({emailExists: false})
      }
      else {
        res.status(200).json({emailExists: true})
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