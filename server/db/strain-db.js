var saver = require('./saver')
var everythingOptionalExcept = require('./joi-everything-optional-except')
var dropKeys = require('./drop-keys')
var db = require('./db-helpers')

var Joi = require('joi')
var q = require('sql-concat')

var TABLE = 'strain'
var COLUMNS = ['strain_id', 'name', 'version']

var joiObject = {
	strain_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	name: Joi.string().max(50).invalid(null),
	version: Joi.number().integer().max(4294967295).min(0).invalid(null)
}

var insertSchema = Joi.object(joiObject)
var updateSchema = Joi.object(
	dropKeys(
		everythingOptionalExcept(joiObject, ['strain_id', 'version']),
	['strain_type_id']))

module.exports = function roomDb(connection) {

	function loadStrain(strainId, cb) {
		var query = q.select(COLUMNS)
			.from(TABLE)
			.where('strain_id', strainId)
			.build()

		db.queryFirst(connection, query, cb)
	}

	var saverOptions = {
		insertSchema: insertSchema,
		updateSchema: updateSchema,
		load: loadStrain,
		db: connection
	}

	return {
		save: function saveInventory(strain, cb) {
			saver('strain', saverOptions, strain, cb)
		},
		load: loadStrain,
		loadAll: function loadAll(cb) {
			var query = q.select(COLUMNS)
				.from(TABLE)
				.build()

			db.query(connection, query, cb)
		}
	}
}
