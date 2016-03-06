var saver = require('db/saver')
var everythingOptionalExcept = require('db/joi-everything-optional-except')
var dropKeys = require('db/drop-keys')
var db = require('db/db-helpers')

var Joi = require('joi')
var q = require('sql-concat')

var TABLE = 'plant'
var COLUMNS = ['plant_id', 'tag_scope', 'tag_number', 'strain_id', 'room_id', 'growth_phase', 'version']

var joiObject = {
	plant_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	tag_scope: Joi.string().max(20).allow(null),
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
	['tag_scope', 'tag_number']))

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
				doc.strain.strainId,
				doc.room.roomId,
				doc.growthPhase,
				1
			]
		})

		connection.query('INSERT INTO plant (tag_number, strain_id, room_id, growth_phase, version) VALUES ?', [newPlantsToSave], cb)
	}

	var saverOptions = {
		insertSchema: insertSchema,
		updateSchema: updateSchema,
		load: loadPlant,
		db: connection
	}

	return {
		saveAddPlantDocument: saveAddPlantDocument,
		save: function savePlant(plant, cb) {
			saver('plant', saverOptions, plant, cb)
		},
		load: loadPlant
	}
}
