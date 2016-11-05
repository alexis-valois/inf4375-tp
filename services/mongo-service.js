var mongo = require('mongodb');
var server;
var db;

module.exports = MongoService;

function MongoService(host, port, dbname){
	this.server = new mongo.Server(host, port);
	this.db = new mongo.Db(dbname, this.server, {safe:true});
}

MongoService.prototype.insert = function(collName, value, callback){
	this.db.open(function (err, db) {
		if (err){
			callback(err);
		}else{
			db.collection(collName, function (err, collection) {
				if(err){
					callback(err);
				}else{
					collection.insert(value, function (err, result) {
						if (err){
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

