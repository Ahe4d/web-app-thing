const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const loggerFormat = printf(info => {
	return `[${info.label} - ${info.level} (${info.timestamp})] ${info.message}`;
});

exports.appLogger = createLogger({
    format: combine(
        label({ label: 'Express' }),
        timestamp(),
        loggerFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({ 
            filename: 'logs/app/express-error.log', 
            level: 'error'
        }),
        new transports.File({ 
            filename: 'logs/app/express-combined.log' 
        })
    ]
});

exports.authLogger = createLogger({
	format: combine(
		label({ label: 'Authentication' }),
		timestamp(),
		loggerFormat
	),
	transports: [
    	new transports.Console(),
    	new transports.File({ 
    		filename: 'logs/auth/auth-error.log', 
    		level: 'error'
    	}),
    	new transports.File({ 
    		filename: 'logs/auth/auth-combined.log' 
    	})
  	]
});

exports.dbLogger = createLogger({
	format: combine(
		label({ label: 'Database' }),
		timestamp(),
		loggerFormat
	),
	transports: [
    	new transports.Console(),
    	new transports.File({ 
    		filename: 'logs/db/db-error.log', 
    		level: 'error'
    	}),
    	new transports.File({ 
    		filename: 'logs/db/db-combined.log' 
    	})
  	]
});

exports.apiLogger = createLogger({
	format: combine(
		label({ label: 'Main API' }),
		timestamp(),
		loggerFormat
	),
	transports: [
    	new transports.Console(),
    	new transports.File({ 
    		filename: 'logs/api/router-error.log', 
    		level: 'error'
    	}),
    	new transports.File({ 
    		filename: 'logs/api/router-combined.log' 
    	})
  	]
});