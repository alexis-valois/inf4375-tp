var express = require('express');
var mongo = require('mongodb');
var xml = require('xml2js');
var router = express.Router();
var xmlService = require("../services/xml-service.js");

function getContrevenantsFromXml(xmlString ,callback){
  xml.parseString(xmlString, function (err, xmlObject) {
    if (err){
      callback(err);
    } else{
      callback(null, xmlObject.contrevenants);
    }
  });
}

router.get('/', function(req, res, next) {
  xmlService.objectFromXmlService('latin1', function(err, xmlString) {
    if (err) {
      res.header('Content-Type', 'application/json')
         .status(500)
         .json(err);
    } else {
    	getContrevenantsFromXml(xmlString, function(err, contrevenants){
        if (err){
          res.header('Content-Type', 'application/json')
             .status(500)
             .json(err);
        } else{
          res.header('Content-Type', 'application/xml')
             .render('a1', {contrevenants: contrevenants.contrevenant}); 
        }
      });    	   
    }
  });
});

module.exports = router;