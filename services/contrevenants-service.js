var config = require('../config');
var XmlUtil = require("../utils/xml-util");
var MongoUtil = require("../utils/mongo-util");

var xmlUtil = new XmlUtil();
var mongoUtil = new MongoUtil(config.mongo.host, config.mongo.port, config.mongo.dbname);

var getContrevenantsXml = function(callback){
	xmlUtil.fetchXmlString('latin1', config.contrevenants.host, config.contrevenants.ressource, function(err, xmlString) {
	    if (err) {
	      callback(err);
	    } else {
	      callback(null, xmlString);
	    }
	});
}

var getContrevenantListFromXmlString = function(xmlString, callback){
	xmlUtil.getJsObjFromXml(xmlString, 'contrevenants', function(err, parsedList){
        if (err){
          callback(err);
        } else{
          callback(null, parsedList.contrevenant);
        }
    });
}

var saveContrevenants = function(contrevenantList, callback){
	mongoUtil.upsert("contrevenants",contrevenantList, function(err, result){
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
			console.log("getContrevenantsXml error" + err);
			callback(err);
		}else{
			getContrevenantListFromXmlString(xmlString, function(err, contrenvantsList){
				if (err){
					console.log("getContrevenantListFromXmlString error" + err);
					callback(err);
				}else{
					saveContrevenants(contrenvantsList, function(err, result){
						if (err){
							console.log("saveContrevenants error" + err);
							callback(err);
						}else{
							callback(null, result);
						}
					});
				}
			});
		}
	});
}