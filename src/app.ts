import express from 'express';
import { NextFunction, Request, Response } from 'express';
import * as bodyParser from 'body-parser';
// import * as mongoose from 'mongoose';
const mongoose = require('mongoose');
const path = require('path');
import cookieParser from 'cookie-parser';
import Controller from './interfaces/controller.interface';
import HttpException from './exceptions/HttpException';
const cors = require('cors');
const logger = require('morgan');
const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const url = require('url');


let sessionStore;

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
    // this.acceptAllRoutes();
  }

  private initializeMiddlewares() {
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());

    const options= {
      allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
      credentials: true,
      methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
      origin: "https://reduxtagram-client.herokuapp.com",
      preflightContinue: false
    };

    if(process.env.NODE_ENV === "production") {
      this.app.use(cors(options))
    }
    else {
      this.app.use(cors({
        credentials: true,
        origin: "http://localhost:3000"
      }));
    }
    
    this.app.use(express.json());
    // view engine setup
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'jade');

    this.app.use(logger('dev'));
    this.app.use(cookieParser());
    
    if(process.env.NODE_ENV === 'production') {
      this.app.set('trust proxy', 1) 

      // const rtg   = url.parse(process.env.REDISTOGO_URL);

      // const redisClient = redis.createClient(rtg.port, rtg.hostname);
      var client = require('redis').createClient(process.env.REDIS_URL);

      // redisClient.on('error', console.error)

      // redisClient.auth(rtg.auth.split(":")[1]);
      // store: new RedisStore({
      //   redisClient
      // }),
      this.app.use(session({
        name: 'purnima',
        store: client,
        secret: 'meow',
        resave: true,
        saveUninitialized: false,
        cookie: {
          secure: false,
          sameSite: false,
          maxAge: 36000000,
          httpOnly: false,
          domain: "https://desolate-stream-98688.herokuapp.com"
        }
      }));
    }
    else { 
      const redisClient = redis.createClient();
      sessionStore = new RedisStore({ 
        redisClient
       })
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
           httpOnly: false,
         }
       }));
    }
    

  }
 
  public listen() {
    const PORT = process.env.PORT || 5000;
    this.app.listen(PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    })
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach(controller => {
      this.app.use('/', controller.router)
    })
  }

  private initializeErrorHandling() {
    this.app.use(function(error:HttpException, req: Request, res: Response, next: NextFunction) {

      const status = error.status || 500;
      const message = error.message || 'Something went wrong';
      res
        .status(status)
        .send({
          status,
          message,
        })
    });
    
  }

  //Connect to database
  private connectToTheDatabase() {
    const mongodb_url = process.env.MONGODB_URL || 'mongodb://localhost:27017/reduxtagram-server'
    mongoose.connect(mongodb_url, { useNewUrlParser: true}, function(err: any){
      if(err) {
        console.log(`Error connecting to database: ${err}`)
      }
      else {
        console.log(`Connected to mongodb: ${mongodb_url}`)
      }
    })
  }


}

export default App;