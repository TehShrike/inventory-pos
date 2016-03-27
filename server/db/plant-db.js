var saver = require('./saver')
var everythingOptionalExcept = require('./joi-everything-optional-except')
var dropKeys = require('./drop-keys')
var db = require('./db-helpers')

var Joi = require('joi')
var q = require('sql-concat')

var TABLE = 'plant'
var COLUMNS = ['plant_id', 'account_id', 'tag_scope', 'tag_number', 'strain_id', 'room_id', 'growth_phase', 'version']

var joiObject = {
	plant_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	account_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	tag_scope: Joi.string().max(20),
	tag_number: Joi.string().max(50).allow(null),
	strain_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	room_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	growth_phase: Joi.any().valid('immature','vegetative','flowering','harvested','packaged').invalid(null),
	version: Joi.number().integer().max(4294967295).min(0).invalid(null)
}

var insertSchema = Joi.object(joiObject)
var updateSchema = Joi.object(
	dropKeys(
		everythingOptionalExcept(joiObject, ['plant_id', 'version']),
	['account_id', 'tag_scope', 'tag_number']))

module.exports = function plantDb(connection) {

	function loadPlant(plantId, cb) {
		var query = q.select(COLUMNS)
			.from(TABLE)
			.where('plant_id', plantId)
			.build()

		db.queryFirst(connection, query, cb)
	}

	function saveAddPlantDocument(doc, cb) {
		var newPlantsToSave = doc.plantTags.map(tag => {
			return [
				tag,
				doc.accountId,
				doc.tagScope,
				doc.strain.strainId,
				doc.room.roomId,
				doc.growthPhase,
				1
			]
		})

		connection.query('INSERT INTO plant (tag_number, account_id, tag_scope, strain_id, room_id, growth_phase, version) VALUES ?', [newPlantsToSave], cb)
	}

	var saverOptions = {
		insertSchema: insertSchema,
		updateSchema: updateSchema,
		load: loadPlant,
		db: connection
	}

	function loadByTag({ tagNumber, accountId }, cb) {
		const query = q.select(COLUMNS)
			.from(TABLE)
			.where('account_id', accountId)
			.where('tag_number', tagNumber)
			.build()

		db.queryFirst(connection, query, cb)
	}

	return {
		saveAddPlantDocument: saveAddPlantDocument,
		save: function savePlant(plant, cb) {
			saver('plant', saverOptions, plant, cb)
		},
		load: loadPlant,
		loadByTag
	}
}
