var camelize = require('camelize')

function query(dbConnection, queryObject, cb) {
	return dbConnection.query(queryObject.str, queryObject.params, camelizeCallback(cb))
}

function queryFirst(dbConnection, queryObject, cb) {
	return query(dbConnection, queryObject, firstRow(cb))
}

function splitIntoObjects(row, objectIdentifiers) {
	const output = {}

	objectIdentifiers.forEach(identifier => {
		output[identifier] = {}
		const matchingColumns = Object.keys(row).filter(key => key.indexOf(identifier) === 0)
		matchingColumns.forEach(column => {
			const value = row[column]
			const realName = column.substring(identifier.length)
			const correctCaseName = realName[0].toLowerCase() + realName.substring(1)
			output[identifier][correctCaseName] = value
		})
	})

	return output
}

module.exports = {
	query,
	queryFirst,
	splitIntoObjects
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
