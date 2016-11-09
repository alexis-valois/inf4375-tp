var logger = require('../logger');
var config = require('../config');
var XmlWrapper = require("../wrappers/xml-wrapper");
var MongoService = require("../services/mongo-service");

var xmlWrapper = new XmlWrapper();
var mongoService = new MongoService(config.mongo.host, config.mongo.port, config.mongo.dbname);
var collName = 'contrevenants';

var getContrevenantsXml = function(callback){
	xmlWrapper.fetchXmlString('latin1', config.contrevenants.host, config.contrevenants.ressource, function(err, xmlString) {
	    if (err) {
	      logger.error(err);
	      callback(err);
	    } else {
	      callback(null, xmlString);
	    }
	});
}

var getContrevenantListFromXmlString = function(xmlString, callback){
	xmlWrapper.getJsObjFromXml(xmlString, 'contrevenants', function(err, parsedList){
        if (err){
          logger.error(err);
          callback(err);
        } else{
          callback(null, parsedList.contrevenant);
        }
    });
}

var saveContrevenants = function(contrevenantList, callback){
	mongoService.upsert(collName,contrevenantList, function(err, result){
    	if (err){
    		logger.error(err);
        	callback(err);
        }else{
            callback(null, result);            
        }
    });  
}

module.exports = ContrevenantsService;

function ContrevenantsService(){}

ContrevenantsService.prototype.filterByDateRange = function(from, to, callback){
	mongoService.findByDateRange(collName, 'date_infraction', from, to, callback);
}

ContrevenantsService.prototype.updateContrevenantsDump = function(callback){
	getContrevenantsXml.call(this,function(err, xmlString) {
		if (err){
			logger.error(err);
			callback(err);
		}else{
			getContrevenantListFromXmlString.call(this,xmlString, function(err, contrenvantsList){
				if (err){
					logger.error(err);
					callback(err);
				}else{
					saveContrevenants.call(this,contrenvantsList, function(err, result){
						if (err){
							logger.error(err);
							callback(err);
						}else{
							mongoService.findAll(collName, function(err, currentContrenvants){
								if (err){
									logger.error(err);
									callback(err);
								}else{
									callback(null, currentContrenvants);
								}
							})
							
						}
					});
				}
			});
		}
	});
}