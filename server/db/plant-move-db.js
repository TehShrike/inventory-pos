var saver = require('./saver')
var everythingOptionalExcept = require('./joi-everything-optional-except')
var dropKeys = require('./drop-keys')
var db = require('./db-helpers')

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

module.exports = function plantMoveDb(connection) {

	function loadPlantMove(plantMoveId, cb) {
		var query = q.select(COLUMNS)
			.from(TABLE)
			.where('plant_move_id', plantMoveId)
			.build()

		db.queryFirst(connection, query, cb)
	}

	function insertRows(newPlantMoveRows, cb) {
		if (newPlantMoveRows.length === 0) {
			throw new Error(`Tried to insert 0 rows`)
		}
		const orderedColumns = newPlantMoveRows.map(row => {
			return [
				row.plantId,
				row.date,
				row.fromRoomId,
				row.toRoomId
			]
		})

		connection.query('INSERT INTO plant_move (plant_id, date, from_room_id, to_room_id) VALUES ?', [orderedColumns], cb)
	}

	var saverOptions = {
		insertSchema: insertSchema,
		updateSchema: updateSchema,
		load: loadPlantMove,
		db: connection,
		immutable: true
	}

	return {
		save: function savePlantMove(plantMove, cb) {
			saver('plant_move', saverOptions, plantMove, cb)
		},
		load: loadPlantMove,
		insertRows
	}
}
