var mongo = require("mongodb");

var server;
var db;

var upsertSingleDocument = function(value, options, collection){
	var filter = { 
		proprietaire: value.proprietaire,
		categorie: value.categorie,
		etablissement: value.etablissement,
		adresse: value.adresse,
		ville: value.ville,
		description: value.description,
		date_infraction: value.date_infraction,
		date_jugement: value.date_jugement,
		montant: value.montant
	};
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
	};
	collection.update(filter, update, options);
}

module.exports = MongoService;

function MongoService(host, port, dbname){
	this.server = new mongo.Server(host, port);
	this.db = new mongo.Db(dbname, this.server, {safe:true});
}

MongoService.prototype.findAll = function(collName, callback){
	this.db.open(function(err,db){
		if(err){
			callback(err);
		}else{
			db.collection(collName, function (err, collection) {
				if (err){
					db.close();
					callback(err);
				}else{
					/*Provenance : https://github.com/jacquesberger/exemplesINF4375/blob/master/MongoDB/2-find-year.js*/
					var cursor = collection.find({});
					cursor.toArray(function (err, elems) {
						if (err){
							db.close();
							callback(err);
						}else{
							var values = [];
							elems.forEach(function(elem){
								values.push(elem);
							});
				     		db.close()
				     		callback(null, values);
						}				     	
				    });					
				}
			});
			
		}
	})
}

MongoService.prototype.upsert = function(collName, value, callback){
	this.db.open(function(err, db) {
		if (err){
			callback(err);
		}else{
			db.collection(collName, function (err, collection) {
				if (err){
					db.close();
					callback(err);
				}else{
					if (Array.isArray(value)){
						value.forEach(function(element) {
							upsertSingleDocument(
								element,
								{upsert:true}, 
								collection
							)
						});

					}else{
						upsertSingleDocument(
							value,
							{upsert:true}, 
							collection
						)
					}
					db.close();
					callback(null, value);					
				}
			});
		}	  	
	});
}

