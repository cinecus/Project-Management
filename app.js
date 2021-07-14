var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongodb = require('mongodb')
var db = require('monk')('localhost:27017/ProjectDB')
var session = require('express-session')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var flash = require("express-flash")

var multer = require('multer')
var upload = multer({dest:'./public/images'})




var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var userRouter = require('./routes/user');

var app = express();

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(passport.initialize())
app.use(passport.session())
app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('*',function(req,res,next){
  res.locals.user = req.user || null
  next()
})

//app.use(require('connect-flash')())
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.locals.descriptionText = function(text,length){
  return text.substring(0,length)
}
module.exports = app;
