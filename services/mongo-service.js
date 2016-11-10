var logger = require('../logger');
//var mongo = require("mongodb");
var MongoClient = require('mongodb').MongoClient;
//var Server = require('mongodb').Server;
var moment = require('moment');
var db;

//var server;
//var db;

moment.locale('fr');

var findByFilter = function(collName, filter, callback){
	logger.info('findByFilter...');
	db.collection(collName, function (err, collection) {
	//mongoClient.db(this.dbname)
		if (err){
			logger.error(err);
			//db.close();
			callback(err);
		}else{
			/*Provenance : https://github.com/jacquesberger/exemplesINF4375/blob/master/MongoDB/2-find-year.js*/
			var cursor = collection.find(filter);
			cursor.toArray(function (err, elems) {
				if (err){
					logger.error(err);
					//db.close();
					callback(err);
				}else{
					var values = [];
					elems.forEach(function(elem){
						values.push(elem);
					});
		     		//db.close()
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
	logger.info('before db.collection');
	db.collection('contrevenants', function (err, collection) {
	//mongoClient.db(this.dbname)
		if (err){
			logger.error(err);
			//db.close();
			callback(err);
		}else{
			var updateStatus = collection.update(filter, update, options);
			callback(null, updateStatus);
		}
	});
	
}

//module.exports = MongoService;

/*source : http://wesleytsai.io/2015/08/02/mongodb-connection-pooling-in-nodejs/*/
exports.connect = function(mongoUrl, callback){
	if (db) callback(null, db);
	MongoClient.connect(mongoUrl, function(err, database) {
	    if(err) {
	    	logger.error(err);
	    	callback(err);
	    }else{
	    	db = database;
	    	callback(null, database);
	    }	    
  	});
	//mongoClient = new MongoClient(new Server(host, port));
	//this.server = new mongo.Server(host, port);
	//this.db = new mongo.Db(dbname, this.server, {safe:true});
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
	db.contrevenants.aggregate(
	   [
	      {
	        $group : {
	           _id : { etablissement: { $month: "$date" } },
	           totalPrice: { $sum: { $multiply: [ "$price", "$quantity" ] } },
	           averageQuantity: { $avg: "$quantity" },
	           count: { $sum: 1 }
	        }
	      }
	   ]
	)
}

exports.findAll = function(collName, callback){
	logger.info('findAll...');
	findByFilter(collName, {}, callback);
}

exports.upsertContrevenant = function(value, callback){
	if (Array.isArray(value)){
		value.forEach(function(contrevenant) {
			upsertSingleContrevenant(
				contrevenant,
				callback
			)
	});
	}else{
		upsertSingleContrevenant(
			value,
			callback
		)
	}
	//db.close();
	//callback(null, value);					
}


