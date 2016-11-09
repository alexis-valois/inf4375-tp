var logger = require('../logger');
var mongo = require("mongodb");
var moment = require('moment');

var server;
var db;

moment.locale('fr');

var findByFilter = function(collName, filter, callback){
	this.db.open(function(err,db){
		if(err){
			logger.error(err);
			callback(err);
		}else{
			db.collection(collName, function (err, collection) {
				if (err){
					logger.error(err);
					db.close();
					callback(err);
				}else{
					/*Provenance : https://github.com/jacquesberger/exemplesINF4375/blob/master/MongoDB/2-find-year.js*/
					var cursor = collection.find(filter);
					cursor.toArray(function (err, elems) {
						if (err){
							logger.error(err);
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

var upsertSingleDocument = function(value, collection){
	var options = {upsert:true};
	var filter = { 
		proprietaire: value.proprietaire,
		categorie: value.categorie,
		etablissement: value.etablissement,
		adresse: value.adresse,
		ville: value.ville,
		description: value.description,
		date_infraction: moment(value.date_infraction, "DD MMMM YYYY").toDate(),
		date_jugement: moment(value.date_jugement, "DD MMMM YYYY").toDate(),
		montant: value.montant
	};
	var update = {
		$set: {proprietaire: value.proprietaire},
		$set: {categorie: value.categorie},
		$set: {etablissement : value.etablissement},
		$set: {adresse: value.adresse},
		$set: {ville: value.ville},
		$set: {description: value.description},
		$set: {date_infraction: moment(value.date_infraction, "DD MMMM YYYY").toDate()},
		$set: {date_jugement: moment(value.date_jugement, "DD MMMM YYYY").toDate()},
		$set: {montant: value.montant}
	};
	collection.update(filter, update, options);
}

module.exports = MongoService;

function MongoService(host, port, dbname){
	this.server = new mongo.Server(host, port);
	this.db = new mongo.Db(dbname, this.server, {safe:true});
}

MongoService.prototype.findByDateRange = function(collName, fieldName, from, to, callback){
	var filter = {};
	filter[fieldName] =	{
			$gte: from.toDate(),
        	$lte: to.toDate()
    }		
	findByFilter.call(this,collName, filter, callback);
}

MongoService.prototype.findAll = function(collName, callback){
	findByFilter.call(this,collName, {}, callback);
}

MongoService.prototype.upsert = function(collName, value, callback){
	this.db.open(function(err, db) {
		if (err){
			logger.error(err);
			callback(err);
		}else{
			db.collection(collName, function (err, collection) {
				if (err){
					logger.error(err);
					db.close();
					callback(err);
				}else{
					if (Array.isArray(value)){
						value.forEach(function(element) {
							upsertSingleDocument(
								element,
								collection
							)
						});

					}else{
						upsertSingleDocument(
							value,
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

