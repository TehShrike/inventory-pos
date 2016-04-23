const saver = require('./saver')
const everythingOptionalExcept = require('./joi-everything-optional-except')
const dropKeys = require('./drop-keys')
const db = require('./db-helpers')

const Joi = require('joi')
const q = require('sql-concat')

const TABLE = 'plant'
const COLUMNS = ['plant_id', 'account_id', 'tag_scope', 'tag_number', 'strain_id', 'room_id', 'growth_phase', 'version']
const QUALIFIED_COLUMNS = COLUMNS.map(column => TABLE + '.' + column)

const joiObject = {
	plant_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	account_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	tag_scope: Joi.string().max(20),
	tag_number: Joi.string().max(50).allow(null),
	strain_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	room_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	growth_phase: Joi.any().valid('immature','vegetative','flowering','harvested','packaged').invalid(null),
	version: Joi.number().integer().max(4294967295).min(0).invalid(null)
}

const insertSchema = Joi.object(joiObject)
const updateSchema = Joi.object(
	dropKeys(
		everythingOptionalExcept(joiObject, ['plant_id', 'version']),
	['account_id', 'tag_scope', 'tag_number']))

module.exports = function plantDb(connection) {

	function loadPlant(plantId, cb) {
		const query = q.select(COLUMNS)
			.from(TABLE)
			.where('plant_id', plantId)
			.build()

		db.queryFirst(connection, query, cb)
	}

	function saveAddPlantDocument(doc, cb) {
		const newPlantsToSave = doc.plantTags.map(tag => {
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

	const saverOptions = {
		insertSchema: insertSchema,
		updateSchema: updateSchema,
		load: loadPlant,
		db: connection
	}

	function loadPlantWithDetailsByTag({ tagNumber, accountId, tagScope }, cb) {
		const STRAIN_COLUMNS = ['strain_id', 'name', 'version'].map(column => `strain.${column} AS strain_${column}`)
		const ROOM_COLUMNS = ['room_id', 'identifier', 'name', 'version'].map(column => `room.${column} AS room_${column}`)
		const PLANT_COLUMNS = COLUMNS.map(column => `plant.${column} AS plant_${column}`)

		const query = q.select(PLANT_COLUMNS)
			.select(STRAIN_COLUMNS)
			.select(ROOM_COLUMNS)
			.from(TABLE)
			.join('strain', 'strain.strain_id = plant.strain_id')
			.join('room', 'room.room_id = plant.room_id')
			.where('plant.account_id', accountId)
			.where('plant.tag_number', tagNumber)
			.where('plant.tag_scope', tagScope)
			.build()

		db.query(connection, query, (err, plants) => {
			if (err) return cb(err)
			cb(null, plants.map(row => db.splitIntoObjects(row, ['plant', 'room', 'strain'])))
		})
	}

	function loadByTag({ tagNumber, accountId, tagScope }, cb) {
		const query = q.select(COLUMNS)
			.from(TABLE)
			.where('account_id', accountId)
			.where('tag_number', tagNumber)
			.where('tag_scope', tagScope)
			.build()

		db.query(connection, query, cb)
	}

	return {
		saveAddPlantDocument: saveAddPlantDocument,
		save: function savePlant(plant, cb) {
			saver('plant', saverOptions, plant, cb)
		},
		load: loadPlant,
		loadPlantWithDetailsByTag,
		loadByTag
	}
}

