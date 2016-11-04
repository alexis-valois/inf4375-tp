var express = require('express');
var mongo = require('mongodb');
var request = require('request');
var xml = require('xml2js');
var router = express.Router();

function getContrevenantsXml(callback) {
  var options = {
    url: 'http://donnees.ville.montreal.qc.ca/dataset/a5c1f0b9-261f-4247-99d8-f28da5000688/resource/92719d9b-8bf2-4dfd-b8e0-1021ffcaee2f/download/inspection-aliments-contrevenants.xml',
    headers: {
      'Content-Type': 'application/xml'
    }
  };

  request.get(options, function (err, xmlObject) {
    if (err) {
      callback(err);
    } else {
      callback(null, xmlObject.body);
    }
  });
}

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
  getContrevenantsXml(function(err, xmlString) {
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