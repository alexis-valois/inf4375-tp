var logger = require('../logger');
var config = require('../config');
var xmlWrapper = require('../wrappers/xml-wrapper');
var mongoService = require('../services/mongo-service');
var async = require('async');

var collName = 'contrevenants';

function getContrevenantsXml (callback){
	xmlWrapper.fetchXmlString('latin1', config.contrevenants.host, config.contrevenants.ressource, function(err, xmlString) {
	    if (err) {
	      logger.error(err);
	      callback(err);
	    } else {
	      callback(null, xmlString);
	    }
	});
}

var saveContrevenants = function(contrevenantList, callback){
	mongoService.upsertContrevenants(contrevenantList, function(err, result){
    	if (err){
    		logger.error(err);
        	callback(err);
        }else{
            callback(null);            
        }
    });  
}

exports.filterByDateRange = function(from, to, callback){
	mongoService.findByDateRange(collName, 'date_infraction', from, to, callback);
}

exports.updateContrevenantsDump = function(callback){
	async.waterfall([
	    getContrevenantsXml,
	    persistContrevenantXml,
	    mongoService.findAll
	], function (err, result) {
	    callback(err, result);
	});
}

function persistContrevenantXml(xmlString, callback) {
	var contrenvantsList = xmlWrapper.getJsObjFromXml(xmlString, 'contrevenants').contrevenant;
	saveContrevenants(contrenvantsList, function(err, result){
		if (err){
			logger.error(err);
			callback(err);
			return;
		}else{
			callback(null, collName);							
		}
	});
}