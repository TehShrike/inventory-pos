var camelize = require('camelize')

function query(dbConnection, queryObject, cb) {
	return dbConnection.query(queryObject.str, queryObject.params, camelizeCallback(cb))
}

function queryFirst(dbConnection, queryObject, cb) {
	return query(dbConnection, queryObject, firstRow(cb))
}

module.exports = {
	query: query,
	queryFirst: queryFirst
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
