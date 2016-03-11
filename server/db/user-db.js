const Joi = require('joi')
const saver = require('./saver')
const q = require('sql-concat')
const everythingOptionalExcept = require('./joi-everything-optional-except')
const db = require('./db-helpers')
const dropKeys = require('./drop-keys')

const TABLE = 'user'
const COLUMNS = ['user_id', 'account_id', 'name', 'email_address', 'version']

const joiObject = {
	user_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	account_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	name: Joi.string().max(300).invalid(null),
	email_address: Joi.string().max(300).invalid(null),
	version: Joi.number().integer().max(4294967295).min(0).invalid(null)
}

const insertSchema = Joi.object(joiObject)
const updateSchema = Joi.object(
	dropKeys(
		everythingOptionalExcept(joiObject, ['user_id', 'version']),
	['account_id']))


module.exports = function userDb(connection) {
	function loadUser(userId, cb) {
		const query = q.select(COLUMNS)
			.from(TABLE)
			.where('user_id', userId)
			.build()

		db.queryFirst(connection, query, cb)
	}

	return {
		save: function saveUser(user, cb) {
			saver('user', { insertSchema: insertSchema, updateSchema: updateSchema, load: loadUser, db: connection }, user, cb)
		},
		load: loadUser
	}
}

