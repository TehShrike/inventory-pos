var Joi = require('joi')
var saver = require('./saver')
var q = require('sql-concat')

var TABLE = 'customer'
var COLUMNS = ['customer_id', 'name', 'drivers_license', 'social_security', 'phone_number', 'customer_type', 'version']
// var COLUMNS_WITH_TABLENAME = COLUMNS.map(function(col) { return TABLE + '.' + col })

var schema = Joi.object({
	customer_id: Joi.number().integer().max(4294967295).min(0),
	name: Joi.string().max(500),
	drivers_license: Joi.string().max(20),
	social_security: Joi.string().max(20),
	phone_number: Joi.string().max(30),
	customer_type: Joi.any().valid('recreational','medical','wholesale'),
	version: Joi.number().integer().max(4294967295).min(0)
})

module.exports = function customerDb(db) {
	return {
		save: function saveCustomer(customer, cb) {
			saver('customer', schema, db, customer, cb)
		},
		search: function searchCustomers(searchString, cb) {
			var lookIn = [ 'name', 'drivers_license', 'social_security', 'phone_number' ]

			var query = lookIn.reduce(function(query, column) {
				return query.orWhereLike(column, '%' + searchString + '%')
			}, q.select(COLUMNS).from(TABLE)).build()

			db.query(query.str, query.params, cb)
		},
		load: function loadCustomer(customerId, cb) {
			var query = q.select(COLUMNS)
				.from(TABLE)
				.where('customer_id', customerId)
				.build()

			db.query(query.str, query.params, cb)
		}
	}
}
