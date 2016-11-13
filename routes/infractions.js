var logger = require('../logger');
var express = require('express');
var ErrToJSON = require( 'utils-error-to-json' );
var router = express.Router();
var mongoService = require("../services/mongo-service");
var csv = require("fast-csv");

var handleReprentationSpecificResponse = function(res, contentType, value){
	res.status(200);
	res.header('Charset', 'UTF-8');
	if (contentType == 'application/xml'){
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

var sortedEtablissements = function(req, res, next){
	var order;
	if (req.query.tri == 'asc'){
		order = 1;
	}else {
		order = -1;
	}

	mongoService.getSortedInfractionsCount(order, function(err, result){
		if (err){
			logger.error(err);
			res.status(500).json({error: ErrToJSON(err).message});
		}else{
			handleReprentationSpecificResponse(res, req.headers['content-type'], result);
		}
	});
}

var validateSortParam = function(req, res, next){
	if (req.query.tri == 'asc' || req.query.tri == 'desc'){
		next();
	}else{
		var err = new Error("La paramètres d'url tri doit être présent et valoir asc ou desc.");
 		logger.error(err);
 		res.status(400).json({error : ErrToJSON(err).message});
	}
}

router.get('/', [validateSortParam ,sortedEtablissements, handleReprentationSpecificResponse]);

module.exports = router;