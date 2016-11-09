var logger = require('../logger');
var express = require('express');
var ErrToJSON = require( 'utils-error-to-json' );
var router = express.Router();
var ContrevenantsService = require('../services/contrevenants-service');
var moment = require('moment');

var contrevenantsService = new ContrevenantsService();

var updateContrevenants = function(res) {
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
	if (Object.keys(req.query).length === 0){
		updateContrevenants(res);
	}else{
		var from = moment(req.query.du);
		var to = moment(req.query.au);
		handleDateFiltering(res, from, to);
	}
}

router.get('/', dispatchFromParams);

module.exports = router;