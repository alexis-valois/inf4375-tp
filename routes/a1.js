var express = require('express');
var router = express.Router();
var xmlService = require("../services/xml-service.js");
var mongoService = require("../services/mongo-service.js");
var config = require('../config.js');

router.get('/', function(req, res, next) {
  xmlService.fetchXmlString('latin1', config.contrevenants.host, config.contrevenants.ressource, function(err, xmlString) {
    if (err) {
      res.header('Content-Type', 'application/json')
         .status(500)
         .json(err);
    } else {
    	xmlService.getJsObjFromXml(xmlString, 'contrevenants', function(err, parsedList){
        if (err){
          res.header('Content-Type', 'application/json')
             .status(500)
             .json(err);
        } else{
          res.header('Content-Type', 'application/xml')
             .render('a1', {contrevenants: parsedList.contrevenant}); 
        }
      });    	   
    }
  });
});

module.exports = router;