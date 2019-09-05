import express from 'express';
import { NextFunction, Request, Response } from 'express';
import * as bodyParser from 'body-parser';
// import * as mongoose from 'mongoose';
const mongoose = require('mongoose');
const path = require('path');
import cookieParser from 'cookie-parser';
import Controller from './interfaces/controller.interface';
const cors = require('cors');
const logger = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const createError = require('http-errors');

// import errorMiddleware from './middleware/error.middleware';

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    // this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    })
  }

  private initializeMiddlewares() {

    this.app.use(cors({
      credentials: true,
      origin: "http://localhost:3000"
    }));

    // view engine setup
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'jade');

    this.app.use(logger('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());

    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.use(bodyParser.json());
    
   
    
    

    let sessionStore = new RedisStore({
      port: 6379,
      db: 2,
      ttl: 60 * 60 * 24 * 365
    });
    
    this.app.use(session({
      name: 'purnima',
      store: sessionStore,
      secret: 'meow',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        sameSite: false,
        maxAge: 36000000,
        httpOnly: false
        // domain: "http://localhost:3000"
      }
    }));

    // // catch 404 and forward to error handler
    // this.app.use(function(req: Request, res: Response, next: NextFunction) {
    //   next(createError(404));
    // });

    // error handler
    this.app.use(function(err:any, req: Request, res: Response, next: NextFunction) {
      // res.header("Access-Control-Allow-Origin", "http://localhost:3000");
      // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
    
      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });
  }
  
  private initializeControllers(controllers: Controller[]) {
    controllers.forEach(controller => {
      this.app.use('/', controller.router)
    })
  }

//Connect to database
  private connectToTheDatabase() {
    let dbURL = 'mongodb://localhost:27017/reduxtagram-server';
    const { MONGODB_URL } = process.env
    mongoose.connect(dbURL, { useNewUrlParser: true}, function(err: any){
      if(err) {
        console.log('Error connecting to: ', dbURL)
      }
      else {
        console.log('Connected to : ' + dbURL)
      }
    })
  }
}

export default App;