const saver = require('./saver')
const everythingOptionalExcept = require('./joi-everything-optional-except')
const dropKeys = require('./drop-keys')
const db = require('./db-helpers')

const Joi = require('joi')
const q = require('sql-concat')

const TABLE = 'plant_growth_phase_change'
const COLUMNS = ['plant_growth_phase_change_id', 'plant_id', 'date', 'from_growth_phase', 'to_growth_phase']

const joiObject = {
	plant_growth_phase_change_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	plant_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	date: Joi.date().invalid(null),
	from_growth_phase: Joi.any().valid('immature','vegetative','flowering','harvested','packaged').invalid(null),
	to_growth_phase: Joi.any().valid('immature','vegetative','flowering','harvested','packaged').invalid(null)
}

const insertSchema = Joi.object(joiObject)
const updateSchema = Joi.object(
	dropKeys(
		everythingOptionalExcept(joiObject, ['plant_growth_phase_change_id']),
	['plant_id', 'date', 'from_growth_phase', 'to_growth_phase']))

module.exports = function plantGrowthPhaseChangeDb(connection) {

	function loadPlantGrowthPhase(plantGrowthPhaseChangeId, cb) {
		const query = q.select(COLUMNS)
			.from(TABLE)
			.where('plant_growth_phase_change_id', plantGrowthPhaseChangeId)
			.build()

		db.queryFirst(connection, query, cb)
	}

	function insertRows(newGrowthPhaseChanges, cb) {
		const orderedColumns = newGrowthPhaseChanges.map(row => {
			return [
				row.plantId,
				row.date,
				row.fromGrowthPhase,
				row.toGrowthPhase
			]
		})

		connection.query('INSERT INTO plant_growth_phase_change (plant_id, date, from_growth_phase, to_growth_phase) VALUES ?', [orderedColumns], cb)
	}

	const saverOptions = {
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
