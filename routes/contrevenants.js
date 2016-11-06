var express = require('express');
var router = express.Router();
var ContrevenantsService = require('../services/contrevenants-service');

var contrevenantsService = new ContrevenantsService();

router.get('/', function(req, res, next) {
  contrevenantsService.updateContrevenantsDump(function(err, result){
    if (err){
      res.status(500).json(err);
    }else{
      res.header('Content-Type', 'application/xml');
      res.render('contrevenants-xml', {contrevenants: result.ops});
    }
  });
});

module.exports = router;