/*Source : https://github.com/winstonjs/winston#installation*/
var winston = require('winston');

winston.configure({
	level: 'debug',
    transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({
      name: 'info-file',
      filename: './logs/filelog-info.log',
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: './logs/filelog-error.log',
      level: 'error'
    })
  ]
});