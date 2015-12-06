var Joi = require('joi')
var saver = require('./saver')
var q = require('sql-concat')
var everythingOptionalExcept = require('./joi-everything-optional-except')
var db = require('./db-helpers')
var extend = require('xtend')

var TABLE = 'customer'
var COLUMNS = ['customer_id', 'name', 'drivers_license', 'social_security', 'phone_number', 'customer_type', 'version']
// var COLUMNS_WITH_TABLENAME = COLUMNS.map(function(col) { return TABLE + '.' + col })

var joiUpdate = {
	customer_id: Joi.number().integer().max(4294967295).min(0),
	name: Joi.string().max(500),
	drivers_license: Joi.string().empty('').max(20),
	social_security: Joi.string().empty('').max(20),
	phone_number: Joi.string().empty('').max(30),
	customer_type: Joi.any().valid('recreational','medical','wholesale'),
	version: Joi.number().integer().max(4294967295).min(0)
}

var joiInsert = extend(joiUpdate, {
	drivers_license: joiUpdate.drivers_license.default(''),
	social_security: joiUpdate.social_security.default(''),
	phone_number: joiUpdate.phone_number.default('')
})

var insertSchema = Joi.object(joiInsert)
var updateSchema = Joi.object(everythingOptionalExcept(joiUpdate, ['customer_id', 'version']))

module.exports = function customerDb(connection) {
	function loadCustomer(customerId, cb) {
		var query = q.select(COLUMNS)
			.from(TABLE)
			.where('customer_id', customerId)
			.build()

		db.queryFirst(connection, query, cb)
	}

	return {
		save: function saveCustomer(customer, cb) {
			saver('customer', { insertSchema: insertSchema, updateSchema: updateSchema, load: loadCustomer, db: connection }, customer, cb)
		},
		search: function searchCustomers(searchString, cb) {
			var lookIn = [ 'name', 'drivers_license', 'social_security', 'phone_number' ]

			var query = lookIn.reduce(function(query, column) {
				return query.orWhereLike(column, '%' + searchString + '%')
			}, q.select(COLUMNS).from(TABLE)).build()

			db.query(connection, query, cb)
		},
		load: loadCustomer
	}
}

