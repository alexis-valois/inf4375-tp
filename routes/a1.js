var express = require('express');
var mongo = require("mongodb");
var router = express.Router();

router.get('/', function(req, res, next) {


  res.render('a1', { title: 'A1' });
});

module.exports = router;