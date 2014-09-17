process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    routes = require('./routes/index'),
    app = express(),
    db = require('./db'),
    models_path = __dirname + '/models',
    passport = require('passport'),
    secrets = require('./config/secret-keys'),
    DropboxStrategy = require('passport-dropbox-oauth2').Strategy


// Bootstrap models
var walkModels = function (path) {
  fs.readdirSync(path).forEach(function(file) {
    var newPath  = path + '/' + file;
    var stat = fs.statSync(newPath);
    if (stat.isFile()) {
      if (/(.*)\.js$/.test(file)) {
        require(newPath);
      }
    } else if(stat.isDirectory()) {
      walkModels(newPath);
    }
  });
};
walkModels(models_path);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({ secret: secrets.sessionSecret }))
app.use(passport.initialize())
app.use(passport.session())
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', routes);

// Auth setup

var mongoose = require('mongoose'),
    User = mongoose.model('User')

passport.use(new DropboxStrategy({
    clientID: secrets.dropboxKey,
    clientSecret: secrets.dropboxSecret,
    callbackURL: "http://localhost:3000/connect/back"
  },
  function(accessToken, refreshToken, profile, done) {
    var email = profile.emails[0].value,
        name  = profile.displayName

    User.findOrCreate({ dropboxID: profile.id }, {name: name, email: email}, function (err, user) {
      return done(err, user);
    });
  }
));

app.get('/connect', passport.authenticate('dropbox-oauth2'));

app.get('/connect/back',
  passport.authenticate('dropbox-oauth2', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers
//

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
