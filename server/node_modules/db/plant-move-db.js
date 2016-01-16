var saver = require('db/saver')
var everythingOptionalExcept = require('db/joi-everything-optional-except')
var dropKeys = require('db/drop-keys')
var db = require('db/db-helpers')

var Joi = require('joi')
var q = require('sql-concat')

var TABLE = 'plant_move'
var COLUMNS = ['plant_move_id', 'plant_id', 'date', 'from_room_id', 'to_room_id']

var joiObject = {
	plant_move_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	plant_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	date: Joi.date().invalid(null),
	from_room_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	to_room_id: Joi.number().integer().max(4294967295).min(0).invalid(null)
}

var insertSchema = Joi.object(joiObject)
var updateSchema = Joi.object(
	dropKeys(
		everythingOptionalExcept(joiObject, ['plant_move_id']),
	['plant_id', 'date', 'from_room_id', 'to_room_id']))

module.exports = function plantGrowthPhaseChangeDb(connection) {

	function loadPlantGrowthPhase(plantGrowthPhaseChangeId, cb) {
		var query = q.select(COLUMNS)
			.from(TABLE)
			.where('plant_move_id', plantGrowthPhaseChangeId)
			.build()

		db.queryFirst(connection, query, cb)
	}

	var saverOptions = {
		insertSchema: insertSchema,
		updateSchema: updateSchema,
		load: loadPlantGrowthPhase,
		db: connection,
		immutable: true
	}

	return {
		save: function savePlantGrowthPhaseChange(plantGrowthPhaseChange, cb) {
			saver('plant_move', saverOptions, plantGrowthPhaseChange, cb)
		},
		load: loadPlantGrowthPhase
	}
}
