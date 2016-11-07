var CronJob = require('cron').CronJob;
var ContrevenantsService = require('../services/contrevenants-service');

var contrevenantsService = new ContrevenantsService();

//var job = new CronJob('* * * * * *', function(){
var job = new CronJob('00 00 0 * * 1-7', function(){
	console.log('Job executed');
	contrevenantsService.updateContrevenantsDump(function(err,res){
		if (err){
			console.log(err);
		}
	})
}, null, true, 'America/Montreal');

module.exports = job;