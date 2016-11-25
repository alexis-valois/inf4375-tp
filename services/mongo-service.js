var logger = require('../logger');
var mongo = require('mongodb');
var moment = require('moment');
var async = require('async');
var config = require('../config');
var db;

var MongoClient = mongo.MongoClient;

if (!db){
	MongoClient.connect(config.mongo.url, function(err, database) {
	    if(err) {
	    	logger.error(err);
	    	process.exit(1);
	    }else{
	    	db = database;
	    }	    
	});
}

moment.locale('fr');

var findByFilter = function(collName, filter, callback){
	db.collection(collName, function (err, collection) {
		if (err){
			logger.error(err);
			callback(err);
		}else{
			/*Provenance : https://github.com/jacquesberger/exemplesINF4375/blob/master/MongoDB/2-find-year.js*/
			collection.find(filter).toArray(function (err, elems) {
				if (err){
					logger.error(err);
					callback(err);
				}else{
					var values = [];
					elems.forEach(function(elem){
						values.push(elem);
					});
		     		callback(null, values);
				}				     	
		    });					
		}
	});
}

var upsertSingleContrevenant = function(value, callback){
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
	db.collection('contrevenants', function (err, collection) {
		if (err){
			logger.error(err);
			callback(err);
			return;
		}else{
			var updateStatus = collection.update(filter, update, options);
			callback(null, updateStatus);
		}
	});
	
}

exports.updateContrevenant = function(id, value, callback){
	var filter =  {_id: mongo.ObjectId(id)};
	db.collection('contrevenants', function (err, collection) {
		if (err){
			logger.error(err);
			callback(err);
			return;
		}else{
			var updateStatus = collection.update(filter, value);
			callback(null, updateStatus);
		}
	});

}

exports.findByDateRange = function(collName, fieldName, from, to, callback){
	var filter = {};
	filter[fieldName] =	{
			$gte: from.toDate(),
        	$lte: to.toDate()
    }		
	findByFilter(collName, filter, callback);
}

exports.getSortedInfractionsCount = function(sortOrder, callback){
	db.collection('contrevenants', function(err, collection){
		if (err){
			logger.error(err);
			callback(err);
			return;
		}else{
			collection.aggregate([
				{
					$group : {_id : "$etablissement", nbInfractions : { $sum : 1 }}
				},
			    {
					$sort : {nbInfractions : sortOrder}
			    }
			]
			).toArray(function (err, elems) {
				if (err){
					logger.error(err);
					callback(err);
				}else{
					var values = [];
					elems.forEach(function(elem){
						values.push(elem);
					});
			    	callback(null, values);
				}				     	
		    });
		}
	})	
}

exports.findById = function(collName, id, callback){
	findByFilter(collName, {_id: mongo.ObjectId(id)}, callback);
}

exports.findAll = function(collName, callback){
	findByFilter(collName, {}, callback);
}

exports.delete = function(collName, id, callback){
	db.collection(collName, function(err, collection){
		if (err){
			logger.error(err);
			callback(err);
		}else{
			var status = collection.remove({_id: mongo.ObjectId(id)})
			callback(null, status);
		}
	});
}

exports.upsertContrevenants = function(value, callback){
	if (Array.isArray(value)){
		async.eachSeries(value, upsertSingleContrevenant, function(err){
			if (err){
				logger.error(err);
				callback(err);
				return;
			}else{
				callback();
			}
		});
	}else{
		var err = new Error("La valeur passée doit être une liste.");
		logger.error(err);
		callback(err);
	}
}


