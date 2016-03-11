const Joi = require('joi')
const saver = require('./saver')
const q = require('sql-concat')
const everythingOptionalExcept = require('./joi-everything-optional-except')
const db = require('./db-helpers')
const dropKeys = require('./drop-keys')

const TABLE = 'account'
const COLUMNS = ['account_id', 'name', 'default_tag_scope', 'version']

const joiObject = {
	account_id: Joi.number().integer().max(4294967295).min(0).invalid(null),
	name: Joi.string().max(150).invalid(null),
	default_tag_scope: Joi.string().max(20).allow(null),
	version: Joi.number().integer().max(4294967295).min(0).invalid(null)
}

const insertSchema = Joi.object(joiObject)
const updateSchema = Joi.object(everythingOptionalExcept(joiObject, ['account_id', 'version']))


module.exports = function accountDb(connection) {
	function loadAccount(accountId, cb) {
		const query = q.select(COLUMNS)
			.from(TABLE)
			.where('account_id', accountId)
			.build()

		db.queryFirst(connection, query, cb)
	}

	return {
		save: function saveAccount(account, cb) {
			saver('account', { insertSchema: insertSchema, updateSchema: updateSchema, load: loadAccount, db: connection }, account, cb)
		},
		load: loadAccount
	}
}

