var logger = require('../logger');
var express = require('express');
var ErrToJSON = require( 'utils-error-to-json' );
var router = express.Router();
var contrevenantsService = require('../services/contrevenants-service');
var moment = require('moment');
var mongoService = require("../services/mongo-service");
var config = require('../config');
var validate = require('jsonschema').validate;
var contrevenantSchema = require('../validations/contrevenant');

var collName = 'contrevenants';
var error500message = "Une erreur est survenue côté serveur. Veuillez réessayer plustard.";

/*Fonction qui retourne l'ensemble des contrevenants contenus dans la bd et renvoit le résultat dans la réponse http.*/
var findAllContrevenants = function(res) {
	mongoService.findAll(collName, function(err, result){
	    if (err){
			logger.error(err);
		    res.status(500).json({error : error500message});
		}else{
			if (result.length == 0){
				res.status(404).json({error : "Aucun contrevenant."});
			}else{
				res.header('Content-Type', 'application/xml');
		    	res.render('contrevenants-xml', {contrevenants: result});
			}		    
		}
	});
}

/*Retourne la list des contrevenants dont leur date d'infraction se situe dans une plage donnée dans l'url.*/
var handleDateFiltering = function(req, res){
	var from = moment(req.query.du);
	var to = moment(req.query.au);
	contrevenantsService.filterByDateRange(from, to, function(err,result){
		if (err){
			logger.error(err);
			res.status(500).json({error : error500message});
		}else{
			if (result.length == 0){
				res.status(404).json({error : "Aucun contrevenant trouvé."});
			}else{
				res.status(200).json(result);
			}
		}
	});
}

/*Effectue la validation des dates reçues dans l'url.*/
var validateDates = function(req, res, next){
	if (!req.query.du){
		var err = new Error("La date de début doit être présente.");
 		logger.error(err);
 		res.status(400).json({error: ErrToJSON(err).message});
	} else if (!req.query.au){
		var err = new Error("La date de fin doit être présente.");
 		logger.error(err);
 		res.status(400).json({error: ErrToJSON(err).message});
	} else{
		var from = moment(req.query.du);
		var to = moment(req.query.au);
		if ( !from.isValid() ) {
	 		var err = new Error("La date de début n'est pas correcte.");
	 		logger.error(err);
	 		res.status(400).json({error: ErrToJSON(err).message});
		} else if ( !to.isValid() ) {
			var err = new Error("La date de fin n'est pas correcte.");
	 		logger.error(err);
	 		res.status(400).json({error : ErrToJSON(err).message});
		}else{
			next();
		}
	}
	
}

/*Détermine quel comportement effectuer en fonction de la présence ou non des paramètres de filtrage par date dans l'url.*/
var dispatchFromParams = function(req, res, next){
	if (Object.keys(req.query).length === 0){
		findAllContrevenants(res);
	}else{
		next();
	}
}

router.get('/', [dispatchFromParams, validateDates, handleDateFiltering]);

/*Valide la format de l'id fournit dans l'url.*/
var validateContrevenantId = function(req, res, next){
	/*source : https://github.com/jacquesberger/exemplesINF4375/blob/master/Ateliers/json-schema/Solutions/routes/index.js*/
	var id = req.params.id;

	/*source : http://stackoverflow.com/questions/24607715/how-do-i-catch-error-when-creating-a-objectid*/
	if( !(/[a-f0-9]{24}/.test(req.params.id) ) ){
	    var invalidId = new Error("L'id spécifié n'est pas valide.");
		logger.error(invalidId);
		res.status(400).json({error: ErrToJSON(invalidId).message});
	}else{
		next();
	}
}

/*Détermine si le corps d'une requête http est présent.*/
var isBodyPresent = function(req, res, next){
	/*Source : http://stackoverflow.com/questions/4994201/is-object-empty*/
	if (! (Object.getOwnPropertyNames(req.body).length > 0)){
		var emptyBody = new Error("Le corps de la requête ne doit pas être vide.");
		logger.error(emptyBody);
		res.status(400).json({error: ErrToJSON(emptyBody).message});
	}else{
		next();
	}
}

/*Détermine si l'id (déjà validé) est présent ou nom dans la bd Mongo.*/
var validateIdExists = function(req, res, next){
	mongoService.findById(collName, req.params.id, function(err, result){
		if (err){
			logger.error(err);
			res.status(500).json({error : error500message});
		}else if (result.length == 0){
			var notFound = new Error("L'id spécifié ne correspond à aucun contrevenant enregistré.");
			logger.error(notFound);
			res.status(404).json({error: ErrToJSON(notFound).message});
		}else{
			next();
		}
	});
}

/*Effectue la validation par json-schema du coprs de la requêtes http.*/
var validateContrevenantBody = function(req, res, next){
	var validation = validate(req.body, contrevenantSchema.update);
	if (validation.errors.length > 0) {
		res.status(400).json(validation.errors);
	} else {
		next();
	}
}

var updateContrevenant = function(req, res){
	mongoService.updateContrevenant(req.params.id, req.body, function(err, result){
		if (err){
			logger.error(err);
			res.status(500).json({error : error500message});
		}else{
			res.json(req.body);							
		}
	});
}
/*source : http://expressjs.com/fr/guide/routing.html*/
router.put('/:id', [validateContrevenantId, validateIdExists, isBodyPresent, validateContrevenantBody, updateContrevenant]);

/*Supprimer un contrevenant selon son id*/
var deleteContrevenant = function(req, res){
	mongoService.delete(collName, req.params.id, function(err, result){
		if (err){
			logger.error(err);
			res.status(500).json({error : error500message});
		}else{
			res.json(
				{
					type : collName,
					id: req.params.id,
					status : "deleted",
				}
			);
		}
	});
}

router.delete('/:id', [validateContrevenantId, validateIdExists, deleteContrevenant]);

module.exports = router;