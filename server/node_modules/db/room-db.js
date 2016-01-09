var saver = require('db/saver')
var everythingOptionalExcept = require('db/joi-everything-optional-except')
var dropKeys = require('db/drop-keys')
var db = require('db/db-helpers')

var Joi = require('joi')
var q = require('sql-concat')

var TABLE = 'room'
var COLUMNS = ['room_id', 'identifier', 'name', 'version']

var joiObject = {
	room_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	identifier: Joi.string().max(50).invalid(null),
	name: Joi.string().max(50).invalid(null),
	version: Joi.number().integer().max(4294967295).min(0).invalid(null)
}

var insertSchema = Joi.object(joiObject)
var updateSchema = Joi.object(
	dropKeys(
		everythingOptionalExcept(joiObject, ['room_id', 'version']),
	['identifier']))

module.exports = function roomDb(connection) {

	function loadRoom(roomId, cb) {
		var query = q.select(COLUMNS)
			.from(TABLE)
			.where('room_id', roomId)
			.build()

		db.queryFirst(connection, query, cb)
	}

	var saverOptions = { insertSchema: insertSchema, updateSchema: updateSchema, load: loadRoom, db: connection }

	return {
		save: function saveRoom(room, cb) {
			saver('room', saverOptions, room, cb)
		},
		load: loadRoom,
		loadAll: function loadAllRooms(cb) {
			var query = q.select(COLUMNS)
				.from(TABLE)
				.build()

			db.query(connection, query, cb)
		}
	}
}
