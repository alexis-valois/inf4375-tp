var mongo = require('mongodb');
var server;

function MongoService(host, port){
	this.server = new mongo.Server(host, port);
}

MongoService.prototype = {};

module.exports = MongoService;