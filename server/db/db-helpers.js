var camelize = require('camelize')

var thisModule = module.exports = {
	query: function(dbConnection, query, cb) {
		return dbConnection.query(query.str, query.params, camelizeCallback(cb))
	},
	queryFirst: function(dbConnection, query, cb) {
		return thisModule.query(dbConnection, query, firstRow(cb))
	}
}

function firstRow(cb) {
	return function(err, results) {
		cb(err, results && results[0])
	}
}

function camelizeCallback(cb) {
	return function(err, dbObject) {
		if (err) {
			cb(err)
		} else {
			cb(null, camelize(dbObject))
		}
	}
}
