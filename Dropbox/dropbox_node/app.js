var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('client-sessions');
var user_signUp = require('./routes/users_SignUp');
var user_signIn = require('./routes/users_SignIn');
var user_docs = require('./routes/user_docs');
var user_IsSignedIn = require('./routes/user_IsSignedIn');
var user_signOut = require('./routes/user_SignOut');
var user_Activity = require('./routes/user_Activity');
var cors = require('cors');

var app = express();

var corsOptions = {
    origin: 'http://localhost:3003',
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

//Enable CORS
app.use(cors(corsOptions));

//Session Management
app.use(session({
    cookieName: 'session',
    secret: 'cmpe273_test_string',
    duration: 30 * 60 * 1000,    //setting the time for active session
    activeDuration: 5 * 60 * 1000,
})); // setting time for the session to be active when the window is open // 5 minutes set currently

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/', user_signUp);
app.use('/SignIn', user_signIn);
app.use('/IsSignedIn', user_IsSignedIn);
app.use('/docs', user_docs);
app.use('/SignOut', user_signOut);
app.use('/Activity', user_Activity);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
