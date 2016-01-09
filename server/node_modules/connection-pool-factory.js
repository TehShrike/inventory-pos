var mysql = require('mysql')
var extend = require('xtend')

module.exports = function(connectionOptions) {
	return mysql.createPool(extend({
		host: '127.0.0.1',
		user: 'root',
		password: '',
		database: 'pos',
		typeCast: function(field, next) {
			if (field.type === 'BIT' && field.length === 1) {
				return !!field.buffer()[0]
			}
			return next()
		}
	}, connectionOptions))
}
