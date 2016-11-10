var logger = require('../logger');
var express = require('express');
var ErrToJSON = require( 'utils-error-to-json' );
var router = express.Router();
var ContrevenantsService = require('../services/contrevenants-service');
var moment = require('moment');
var mongoService = require("../services/mongo-service");
var config = require('../config');

var contrevenantsService = new ContrevenantsService();
//var mongoService = new MongoService(config.mongo.host, config.mongo.port, config.mongo.dbname);
var collName = 'contrevenants';

var updateContrevenants = function(res) {
	logger.info('updateContrevenants...');
	contrevenantsService.updateContrevenantsDump(function(err, result){
	    if (err){
			logger.error(err);
		    res.status(500).json({error : ErrToJSON(err).message});
		}else{
		    res.header('Content-Type', 'application/xml');
		    res.render('contrevenants-xml', {contrevenants: result});
		}
	});
}

var handleDateFiltering = function(res, from, to){
	if ( !from.isValid() ) {
 		var err = new Error("La date de début n'est pas correcte.");
 		logger.error(err);
 		res.status(400).json({error: ErrToJSON(err).message});
	} else if ( !to.isValid() ) {
		var err = new Error("La date de fin n'est pas correcte.");
 		logger.error(err);
 		res.status(400).json({error : ErrToJSON(err).message});
	} else {
		contrevenantsService.filterByDateRange(from, to, function(err,result){
			if (err){
				logger.error(err);
				res.status(500).json({error: ErrToJSON(err).message});
			}else{
				res.status(200).json(result);
			}
		});		
	}
}

var dispatchFromParams = function(req, res){
	logger.info('dispatchFromParams...');
	if (Object.keys(req.query).length === 0){
		updateContrevenants(res);
	}else{
		var from = moment(req.query.du);
		var to = moment(req.query.au);
		handleDateFiltering(res, from, to);
	}
}

var sortedEtablissements = function(req, res){
	mongoService.getSortedInfractionsCount.call(this, collName, -1, function(err, result){
		if (err){
			logger.error(err);
			res.status(500).json({error: ErrToJSON(err).message});
		}else{
			res.status(200).json(result);
		}
	});
}

router.get('/', dispatchFromParams);
router.get('/sorted', sortedEtablissements);

module.exports = router;