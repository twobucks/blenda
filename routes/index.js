var express = require('express'),
     router = express.Router()

/* GET home page. */
router.get('/', function(req, res) {
  var authenticated = req.user
  if (authenticated){
    var user = req.user[0]
    res.render('index', { authenticated: authenticated, user: user });
  } else {
    res.render('index', { authenticated: authenticated });
  }
})

module.exports = router;
