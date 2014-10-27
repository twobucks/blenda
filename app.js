var express         = require('express');
    path            = require('path'),
    favicon         = require('static-favicon'),
    logger          = require('morgan'),
    cookieParser    = require('cookie-parser'),
    session         = require('express-session'),
    bodyParser      = require('body-parser'),
    fs              = require('fs'),
    routes          = require('./routes/index'),
    app             = express(),
    db              = require('./db'),
    passport        = require('passport'),
    secrets         = require('./config/secret-keys'),
    DropboxStrategy = require('passport-dropbox-oauth2').Strategy,
    config          = require('./config/config'),
    RedisStore      = require('connect-redis')(session),
    async           = require('async'),
    paginate        = require('express-paginate'),
    slow            = require('connect-slow')

app.use(slow({
  url: /\.jpg$/i,
  delay: 1000
}))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon())
app.use(logger('dev'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

app.use(session({ secret: secrets.sessionSecret, store: new RedisStore()}))

app.use(passport.initialize())
app.use(passport.session())
app.use(require('stylus').middleware(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'dist')))

app.use(paginate.middleware(10, 50))
app.use('/', routes)

// Auth setup

var User = require('./models/user')

passport.use(new DropboxStrategy({
    clientID: secrets.dropboxKey,
    clientSecret: secrets.dropboxSecret,
    callbackURL: "http://localhost:3000/connect/back"
  },
  function(accessToken, refreshToken, profile, done) {
    var email = profile.emails[0].value,
        name  = profile.displayName
    User.findOrCreate({ "dropbox.id": profile.id }, {name: name, email: email, "dropbox.token": accessToken }, function (err, user) {
      return done(err, user);
    });
  }
));

app.get('/connect', function(req, res, next){
  if (req.isAuthenticated()) res.redirect('/')
  else  next()
}, passport.authenticate('dropbox-oauth2'));

app.get('/connect/back', passport.authenticate('dropbox-oauth2', { failureRedirect: '/', successRedirect: '/' }))

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

passport.deserializeUser(function(id, done) {
  User.find(id, function(err, user){
    done(err, user);
  })
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.post('sync', function(req, res){
  res.render('index')
})


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
