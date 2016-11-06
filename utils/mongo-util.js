var mongo = require("mongodb");

var server;
var db;

var upsertSingleDocument = function(value, options, collection, callback){
	var filter = { proprietaire: value.proprietaire };
	var update = {
				 	$set: {proprietaire: value.proprietaire},
					$set: {categorie: value.categorie},
					$set: {etablissement : value.etablissement},
					$set: {adresse: value.adresse},
					$set: {ville: value.ville},
					$set: {description: value.description},
					$set: {date_infraction: value.date_infraction},
					$set: {date_jugement: value.date_jugement},
					$set: {montant: value.montant}
				 }
	collection.update(filter, update, options, function (err, result) {
		if (err){
			callback(err);
		}else{
			db.close();
			callback(null, result);
		}
	});
}

module.exports = MongoUtil;

function MongoUtil(host, port, dbname){
	this.server = new mongo.Server(host, port);
	this.db = new mongo.Db(dbname, this.server, {safe:true});
}

MongoUtil.prototype.upsert = function(collName, value, callback){
	this.db.open(function(err, db) {
		if (err){
			callback(err);
		}else{
			db.collection(collName, function (err, collection) {
				if (err){
					callback(err);
				}else{
					if (Array.isArray(value)){
						value.forEach(function(element) {
						  upsertSingleDocument(
							element,
							{upsert:true}, 
							collection, 
							function(err, result){
								if (err){
									callback(err);
								}else{
									callback(null, result);
								}
							})
						});
					}else{
						upsertSingleDocument(
							value,
							{upsert:true}, 
							collection, 
							function(err, result){
							if (err){
								callback(err);
							}else{
								callback(null, result);
							}
						})
					}					
				}
			});
		}	  	
	});
}

