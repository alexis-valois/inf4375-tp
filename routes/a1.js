var express = require('express');
var mongo = require('mongodb');
var xml = require('xmldom');
var request = require('request');
var router = express.Router();

function getContrevenantsXml(callback) {
  var options = {
    url: 'http://donnees.ville.montreal.qc.ca/dataset/a5c1f0b9-261f-4247-99d8-f28da5000688/resource/92719d9b-8bf2-4dfd-b8e0-1021ffcaee2f/download/inspection-aliments-contrevenants.xml',
    headers: {
      'Content-Type': 'application/xml'
    }
  };

  var domRoot = new xml.DOMParser();

  request.get(options, function (err, response) {
    if (err) {
      callback(err);
    } else {
      var rawXml = response.body;
      var data = domRoot.parseFromString(rawXml);
      callback(null, data);
    }
  });
}

router.get('/', function(req, res, next) {
  getContrevenantsXml(function(err, data) {
    if (err) {
      res.sendStatus(500);
    } else {
    	res.json(data);
    	//res.header('Content-Type', 'application/xml');
    	//res.render('a1', {contrev: data});
      // xml.parseString(data, function (err, result){
      // 	if (err){
      // 		res.sendStatus(500);
      // 	}else{
      // 		//res.header('Content-Type', 'application/xml');
      // 		//res.render('a1', {contrev: result.contrevenants});
      // 		//res.header('Content-Type', 'application/json');
      // 		res.json(result.contrevenants);
      // 	}
      // })      
    }
  });
});

module.exports = router;