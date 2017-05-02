var express = require('express');
var router = express.Router();
var request = require('request');
var superagent = require('superagent');

/* GET users listing. */

router.post('/', function(req, res, next) {

  superagent.post('http://newapp.icaimi.com/h5/interface').set('Content-Type', 'application/x-www-form-urlencoded').send(req.body)
      .on('error', (e) => {
        console.log(e)
      })
      .then((result) => {

        if (result.ok) {
            res.json(result.body);
        }
      })

});

module.exports = router;
