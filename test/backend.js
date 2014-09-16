var request = require('supertest'),
    app = require('../app')

request(app)
  .get('/')
  .expect(200)
  .end(function(err, res){
    if (err) throw err;
  });

