/*source : http://stackoverflow.com/questions/5869216/how-to-store-node-js-deployment-settings-configuration-files*/
var util = require('util');
var config = {};
config.contrevenants = {};
config.mongo = {};

config.contrevenants.host = 'donnees.ville.montreal.qc.ca';
config.contrevenants.ressource = '/dataset/a5c1f0b9-261f-4247-99d8-f28da5000688/resource/92719d9b-8bf2-4dfd-b8e0-1021ffcaee2f/download/inspection-aliments-contrevenants.xml';

config.mongo.dbname = 'inf4375';
config.mongo.host = '127.0.0.1';
config.mongo.port = 27017;
config.mongo.url = util.format('mongodb://%s:%d/%s', config.mongo.host, config.mongo.port, config.mongo.dbname);

module.exports = config;