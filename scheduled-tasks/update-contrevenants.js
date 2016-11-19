var logger = require('../logger');
var CronJob = require('cron').CronJob;
var contrevenantsService = require('../services/contrevenants-service');

if (process.argv[2] == 'now'){
	contrevenantsService.updateContrevenantsDump(function(err,res){
		if (err){
			logger.error(err);
		}else{
			logger.info('update-contrevenants Job executed.');
			process.exit(0);
		}
	});
}else{
	//var job = new CronJob('* * * * * *', function(){
	var job = new CronJob('00 00 0 * * 1-7', function(){
		contrevenantsService.updateContrevenantsDump(function(err,res){
			if (err){
				logger.error(err);
			}else{
				logger.info('update-contrevenants Job executed.');
			}
		})
	}, null, true, 'America/Montreal');

	module.exports = job;
}

