var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var cors = require('cors');
var kafka = require('./routes/kafka/client');
require('./routes/passport')(passport);

var user_signUp = require('./routes/user_signUp');
var user_signIn = require('./routes/user_signIn');
var user_signOut = require('./routes/user_signOut');
var user_isSignedIn = require('./routes/user_isSignedIn');
var user_getDocs = require('./routes/user_getDocs');
var user_fileActions = require('./routes/user_fileActions');
var user_folderActions = require('./routes/user_folderActions');
var user_starUnstarDoc = require('./routes/user_starUnstarDoc');
var user_shareDocs = require('./routes/user_shareDocs');
var user_groupActions = require('./routes/user_groupActions');
var user_profile = require('./routes/user_profile');
var user_activity = require('./routes/user_activity');

var routes = require('./routes/index');
var users = require('./routes/users');
var mongoSessionURL = "mongodb://localhost:27017/sessions";
var expressSessions = require("express-session");
var mongoStore = require("connect-mongo/es5")(expressSessions);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

var corsOptions = {
    origin: 'http://localhost:3003',
    credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSessions({
    secret: "Express_Passport_Secret",
    resave: false,
    //Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, //force to save uninitialized session to db.
    //A session is uninitialized when it is new but not modified.
    //duration: 30 * 60 * 1000,
    //activeDuration: 5 * 6 * 1000,
    cookie: {
        maxAge  : new Date(Date.now() + 1200000), //2 Minutes
        expires : new Date(Date.now() + 1200000)  //2 Minutes
    },
    store: new mongoStore({
        url: mongoSessionURL
    })
}));
app.use(passport.initialize());

app.use('/SignUp', user_signUp);
app.use('/SignIn', user_signIn);
app.use('/SignOut', user_signOut);
app.use('/IsSignedIn', user_isSignedIn);
app.use('/getDocs', user_getDocs);
app.use('/fileActions', user_fileActions);
app.use('/starUnstarDoc', user_starUnstarDoc);
app.use('/folderActions', user_folderActions);
app.use('/shareDocs', user_shareDocs);
app.use('/groupActions', user_groupActions);
app.use('/activity', user_activity);
app.use('/profile', user_profile);

module.exports = app;
