var express = require('express');
var router = express.Router();
var XmlService = require("../services/xml-service");
var MongoService = require("../services/mongo-service");
var config = require('../config');

var mongo = new MongoService(config.mongo.host, config.mongo.port, config.mongo.dbname);
var xmlService = new XmlService();

router.get('/', function(req, res, next) {
  xmlService.fetchXmlString('latin1', config.contrevenants.host, config.contrevenants.ressource, function(err, xmlString) {
    if (err) {
      res.header('Content-Type', 'application/json')
         .status(500)
         .json(err);
    } else {
    	xmlService.getJsObjFromXml(xmlString, 'contrevenants', function(err, parsedList){
        if (err){
             res.status(500)
                .json(err);
        } else{
          mongo.insert("contrevenants",parsedList.contrevenant, function(err, result){
            if (err){
              res.status(500)
                 .json(err);
            }else{
              res.status(201)
                 .header('Content-Type', 'application/xml')
                 .render('contrevenants-xml', {contrevenants: result.ops});             
            }
          });          
        }
      });    	   
    }
  });
});

module.exports = router;