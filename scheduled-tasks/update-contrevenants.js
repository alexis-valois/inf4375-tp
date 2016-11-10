var logger = require('../logger');
var CronJob = require('cron').CronJob;
var contrevenantsService = require('../services/contrevenants-service');

//var job = new CronJob('* * * * * *', function(){
var job = new CronJob('00 00 0 * * 1-7', function(){
	logger.info('update-contrevenants Job executed.');
	contrevenantsService.updateContrevenantsDump(function(err,res){
		if (err){
			logger.error(err);
		}
	})
}, null, true, 'America/Montreal');

module.exports = job;