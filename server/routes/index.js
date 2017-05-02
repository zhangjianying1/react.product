var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
  res.json({status: 200, msg: "上传的图片成功..."});
});

module.exports = router;
