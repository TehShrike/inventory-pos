var saver = require('./saver')
var everythingOptionalExcept = require('./joi-everything-optional-except')
var db = require('./db-helpers')

var Joi = require('joi')
var q = require('sql-concat')

var TABLE = 'inventory_type'
var COLUMNS = ['inventory_type_id', 'name', 'parent_id', 'sellable']

var joiObject = {
	inventory_type_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	name: Joi.string().max(300).invalid(null),
	parent_id: Joi.number().integer().max(4294967295).min(0).allow(null),
	sellable: Joi.boolean().invalid(null),
	version: Joi.number().integer().max(4294967295).min(0).invalid(null)
}

var insertSchema = Joi.object(joiObject)
var updateSchema = Joi.object(everythingOptionalExcept(joiObject, ['inventory_type_id', 'version']))

module.exports = function customerDb(connection) {
	function loadInventoryType(inventoryTypeId, cb) {
		var query = q.select(COLUMNS)
			.from(TABLE)
			.where('inventory_type_id', inventoryTypeId)
			.build()

		db.queryFirst(connection, query, cb)
	}


	return {
		save: function saveInventoryType(inventoryType, cb) {
			saver('inventory_type', { insertSchema: insertSchema, updateSchema: updateSchema, load: loadInventoryType, db: connection }, inventoryType, cb)
		},
		load: function(cb) {
			db.query(connection, q.select(COLUMNS).from(TABLE).orderBy('parent_id ASC, name ASC').build(), function(err, rows) {
				if (err) {
					cb(err)
				} else {
					var map = {}
					var topLevelTypes = []
					rows.forEach(function(inventoryType) {
						map[inventoryType.inventoryTypeId] = inventoryType
						inventoryType.children = []
						if (inventoryType.parentId === null) {
							topLevelTypes.push(inventoryType)
						}
					})

					rows.filter(function(inventoryType) {
						return inventoryType.parentId !== null
					}).forEach(function(inventoryType) {
						map[inventoryType.parentId].children.push(inventoryType)
					})

					cb(null, topLevelTypes)
				}
			})
		}
	}
}

