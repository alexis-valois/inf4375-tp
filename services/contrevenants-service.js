var config = require('../config');
var XmlWrapper = require("../wrappers/xml-wrapper");
var MongoService = require("../services/mongo-service");

var xmlWrapper = new XmlWrapper();
var mongoService = new MongoService(config.mongo.host, config.mongo.port, config.mongo.dbname);

var getContrevenantsXml = function(callback){
	xmlWrapper.fetchXmlString('latin1', config.contrevenants.host, config.contrevenants.ressource, function(err, xmlString) {
	    if (err) {
	      callback(err);
	    } else {
	      callback(null, xmlString);
	    }
	});
}

var getContrevenantListFromXmlString = function(xmlString, callback){
	xmlWrapper.getJsObjFromXml(xmlString, 'contrevenants', function(err, parsedList){
        if (err){
          callback(err);
        } else{
          callback(null, parsedList.contrevenant);
        }
    });
}

var saveContrevenants = function(contrevenantList, callback){
	mongoService.upsert("contrevenants",contrevenantList, function(err, result){
    	if (err){
        	callback(err);
        }else{
            callback(null, result);            
        }
    });  
}

module.exports = ContrevenantsService;

function ContrevenantsService(){}

ContrevenantsService.prototype.updateContrevenantsDump = function(callback){
	getContrevenantsXml(function(err, xmlString) {
		if (err){
			callback(err);
		}else{
			getContrevenantListFromXmlString(xmlString, function(err, contrenvantsList){
				if (err){
					callback(err);
				}else{
					saveContrevenants(contrenvantsList, function(err, result){
						if (err){
							callback(err);
						}else{
							mongoService.findAll("contrevenants", function(err, currentContrenvants){
								if (err){
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