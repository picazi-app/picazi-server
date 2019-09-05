// export {}
// const createError = require('http-errors');
// const express = require('express');
// // import express from 'express';
// const path = require('path');
// const cookieParser = require('cookie-parser');
// const logger = require('morgan');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// // Import Router
// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/usersRouter');
// const postRouter = require('./routes/postRouter');
// const sessionRouter = require('./routes/sessionRouter');
// const cors = require('cors');

// const session = require('express-session');
// const RedisStore = require('connect-redis')(session);


// const app = express();
// // enable cors request
// app.use(cors({
//   credentials: true,
//   origin: "http://localhost:3000"
// }));
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// let dbURL = 'mongodb://localhost:27017/reduxtagram-server';

// //Connect to database

// mongoose.connect(dbURL, { useNewUrlParser: true}, function(err: any){
//   if(err) {
//     console.log('Error connecting to: ', dbURL)
//   }
//   else {
//     console.log('Connected to : ' + dbURL)
//   }
// })
// app.use(bodyParser.json({
//   limit: '5mb'
// }));


// let sessionStore = new RedisStore({
//   port: 6379,
//   db: 2,
//   ttl: 60 * 60 * 24 * 365
// });

// app.use(session({
//   name: 'purnima',
//   store: sessionStore,
//   secret: 'meow',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: false,
//     sameSite: false,
//     maxAge: 36000000,
//     httpOnly: false
//     // domain: "http://localhost:3000"
//   }
// }));

// // app.use(function(req, res, next) {
// //   if (req.session && req.session.user) {
// //     User.findOne({ email: req.session.user.email }, function(err, user) {
// //       if (user) {
// //         req.user = user;
// //         delete req.user.password; // delete the password from the session
// //         req.session.user = user;  //refresh the session value
// //         res.locals.user = user;

// //         console.log("req.session.user", req.session.user)
// //       }
// //       // finishing processing the middleware and run the route
// //       next();
// //     });
// //   } else {
// //     next();
// //   }
// // });

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/posts', postRouter);
// app.use('/api/session', sessionRouter);


// // catch 404 and forward to error handler
// app.use(function(req: Express.Request, res: Express.Response, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;