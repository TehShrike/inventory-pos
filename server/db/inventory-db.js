var saver = require('./saver')
var everythingOptionalExcept = require('./joi-everything-optional-except')
var dropKeys = require('./drop-keys')
var db = require('./db-helpers')

var Joi = require('joi')
var q = require('sql-concat')

var TABLE = 'inventory'
var COLUMNS = ['inventory_id', 'inventory_type_id', 'quantity', 'package_id', 'room_id', 'version']

var joiObject = {
	inventory_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	inventory_type_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	quantity: Joi.number().precision(5).less(10000000).invalid(null),
	package_id: Joi.number().integer().max(4294967295).min(0).allow(null),
	room_id: Joi.number().integer().max(4294967295).min(0).allow(null),
	version: Joi.number().integer().max(4294967295).min(0).invalid(null)
}

var insertSchema = Joi.object(joiObject)
var updateSchema = Joi.object(
	dropKeys(
		everythingOptionalExcept(joiObject, ['inventory_id', 'version']),
	['inventory_type_id']))

module.exports = function roomDb(connection) {

	function loadInventory(inventoryId, cb) {
		var query = q.select(COLUMNS)
			.from(TABLE)
			.where('inventory_id', inventoryId)
			.build()

		db.queryFirst(connection, query, cb)
	}

	var saverOptions = {
		insertSchema: insertSchema,
		updateSchema: updateSchema,
		load: loadInventory,
		db: connection
	}

	return {
		save: function saveInventory(inventory, cb) {
			saver('inventory', saverOptions, inventory, cb)
		},
		load: loadInventory
	}
}
