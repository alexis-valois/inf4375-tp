var logger = require('../logger');
var express = require('express');
var ErrToJSON = require( 'utils-error-to-json' );
var router = express.Router();
var contrevenantsService = require('../services/contrevenants-service');
var moment = require('moment');
var mongoService = require("../services/mongo-service");
var config = require('../config');
var csv = require("fast-csv");
var validate = require('jsonschema').validate;
var contrevenantSchema = require('../validations/contrevenant');

var collName = 'contrevenants';

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
		var sort = req.query.tri;
		if (sort){
			sortedEtablissements(sort, req.headers['content-type'], res);
		}else{
			handleDateFiltering(res, from, to);
		}		
	}
}

var handleReprentationSpecificResponse = function(res, contentType, value){
	res.status(200);
	res.header('Charset', 'UTF-8');
	if (contentType == 'text/xml'){
		res.header('Content-Type', 'application/xml');
		res.render('grouped-etablissements-xml', {etablissements: value});
	}else if (contentType == 'text/csv'){
		res.header('Content-Type', 'text/csv');
		var csvString;
		csv.writeToString(value, {headers: true}, function(err, data){
		        if (err){
		        	logger.error(err);
		        	res.status(500).json({error: ErrToJSON(err).message});
		        }else{
		        	csvString = data;
		        	res.send(data);
		        }
		    }
		);
	}else{
		res.json(value);
	}
}

var sortedEtablissements = function(sortOrder, contentType, res){
	var order;
	if (sortOrder == 'asc'){
		order = 1;
	}else if (sortOrder == 'desc'){
		order = -1;
	} else{
		var err = new Error('Le paramètre de trie doit être "asc" ou "desc".');
		logger.error(err);
		res.status(400).json({error: ErrToJSON(err).message});
		return;
	}

	mongoService.getSortedInfractionsCount(order, function(err, result){
		if (err){
			logger.error(err);
			res.status(500).json({error: ErrToJSON(err).message});
		}else{
			handleReprentationSpecificResponse(res, contentType, result);
			//res.status(200).json(result);
		}
	});
}

router.get('/', dispatchFromParams);

router.put('/:id', function(req, res){

	


});

module.exports = router;