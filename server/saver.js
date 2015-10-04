var snakeize = require('snakeize')
var camelize = require('camelize')

module.exports = function saver(table, schema, db, row, cb) {
	var snakedObject = snakeize(row)
	var validated = schema.validate(snakedObject)
	if (validated.error) {
		process.nextTick(function() {
			cb(validated.error)
		})
	} else {
		var toSave = validated.value
		var primaryKeyName = table + '_id'

		var oldPrimaryKey = toSave[primaryKeyName]
		var query, queryParams
		var oldVersion = toSave.version || 0

		if (oldPrimaryKey) {
			query = 'UPDATE ' + table + ' SET ? WHERE ' + primaryKeyName + ' = ? AND version = ?'
			queryParams = [ toSave, oldPrimaryKey, oldVersion]
		} else {
			query = 'INSERT INTO ' + table + ' SET ?'
			queryParams = [ toSave ]
		}

		delete toSave[primaryKeyName]
		toSave.version = oldVersion + 1

		db.query(query, queryParams, function(err, results) {
			if (err) {
				cb(err)
			} else if (results.affectedRows === 0) {
				var e = new Error('Somebody saved a newer version')
				e.outOfDate = true
				cb(e)
			} else {
				cb(null, camelize(toSave))
			}
		})
	}
}
