var snakeize = require('snakeize')

module.exports = function saver(table, options, row, cb) {
	var db = options.db
	var load = options.load
	var primaryKeyName = table + '_id'
	var snakedObject = snakeize(row)
	var oldPrimaryKey = snakedObject[primaryKeyName]

	var insert = !oldPrimaryKey

	var schema = insert ? options.insertSchema : options.updateSchema

	var validated = schema.validate(snakedObject)

	if (validated.error) {
		process.nextTick(function() {
			cb(validated.error)
		})
	} else {
		var toSave = validated.value

		var query, queryParams
		var oldVersion = toSave.version || 0
		toSave.version = oldVersion + 1
		delete toSave[primaryKeyName]

		if (insert) {
			query = 'INSERT INTO ?? SET ?'
			queryParams = [ table, toSave ]
		} else {
			query = 'UPDATE ?? SET ? WHERE ?? = ? AND version = ?'
			queryParams = [ table, toSave, primaryKeyName, oldPrimaryKey, oldVersion ]
		}

		db.query(query, queryParams, function(err, results) {
			if (err) {
				cb(err)
			} else if (results.affectedRows === 0) {
				var versionError = new Error('Somebody saved a newer version')
				versionError.outOfDate = true
				load(oldPrimaryKey, function(selectError, newVersion) {
					if (selectError) {
						cb(selectError)
					} else {
						versionError.newVersion = newVersion
						cb(versionError)
					}
				})
			} else {
				var primaryKey = results.insertId || oldPrimaryKey

				load(primaryKey, cb)
			}
		})
	}
}
