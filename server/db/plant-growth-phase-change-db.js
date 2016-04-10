var saver = require('./saver')
var everythingOptionalExcept = require('./joi-everything-optional-except')
var dropKeys = require('./drop-keys')
var db = require('./db-helpers')

var Joi = require('joi')
var q = require('sql-concat')

var TABLE = 'plant_growth_phase_change'
var COLUMNS = ['plant_growth_phase_change_id', 'plant_id', 'date', 'from_growth_phase', 'to_growth_phase']

var joiObject = {
	plant_growth_phase_change_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	plant_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	date: Joi.date().invalid(null),
	from_growth_phase: Joi.any().valid('immature','vegetative','flowering','harvested','packaged').invalid(null),
	to_growth_phase: Joi.any().valid('immature','vegetative','flowering','harvested','packaged').invalid(null)
}

var insertSchema = Joi.object(joiObject)
var updateSchema = Joi.object(
	dropKeys(
		everythingOptionalExcept(joiObject, ['plant_growth_phase_change_id']),
	['plant_id', 'date', 'from_growth_phase', 'to_growth_phase']))

module.exports = function plantGrowthPhaseChangeDb(connection) {

	function loadPlantGrowthPhase(plantGrowthPhaseChangeId, cb) {
		var query = q.select(COLUMNS)
			.from(TABLE)
			.where('plant_growth_phase_change_id', plantGrowthPhaseChangeId)
			.build()

		db.queryFirst(connection, query, cb)
	}

	function insertRows(newGrowthPhaseChanges, cb) {
		connection.query('INSERT INTO plant_growth_phase_change (plant_id, date, from_growth_phase, to_growth_phase) VALUES ?', [newGrowthPhaseChanges], cb)
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
			saver('plant_growth_phase_change', saverOptions, plantGrowthPhaseChange, cb)
		},
		load: loadPlantGrowthPhase,
		insertRows
	}
}
