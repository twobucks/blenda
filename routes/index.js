var express = require('express'),
     router = express.Router()

/* GET home page. */
router.get('/', function(req, res) {
  var authenticated = req.user
  if (authenticated){
    res.redirect('/stream')
  } else {
    res.render('index', { authenticated: authenticated });
  }
})

module.exports = router;
