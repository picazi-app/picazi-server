var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
// Import Router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usersRouter');
var postRouter = require('./routes/postRouter');
var cors = require('cors');

var app = express();
// enable cors request
app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let dbURL = 'mongodb://localhost:27017/reduxtagram-server';

//Connect to database

mongoose.connect(dbURL, { useNewUrlParser: true}, function(err){
  if(err) {
    console.log('Error connecting to: ', dbURL)
  }
  else {
    console.log('Connected to : ' + dbURL)
  }
})
app.use(bodyParser.json({
  limit: '5mb'
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
