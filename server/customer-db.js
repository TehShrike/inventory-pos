var Joi = require('joi')
var saver = require('./saver')
var q = require('sql-concat')
var camelize = require('camelize')

var TABLE = 'customer'
var COLUMNS = ['customer_id', 'name', 'drivers_license', 'social_security', 'phone_number', 'customer_type', 'version']
// var COLUMNS_WITH_TABLENAME = COLUMNS.map(function(col) { return TABLE + '.' + col })

var insertSchema = Joi.object({
	customer_id: Joi.number().integer().max(4294967295).min(0),
	name: Joi.string().max(500),
	drivers_license: Joi.string().empty('').default('').max(20),
	social_security: Joi.string().empty('').default('').max(20),
	phone_number: Joi.string().empty('').default('').max(30),
	customer_type: Joi.any().valid('recreational','medical','wholesale'),
	version: Joi.number().integer().max(4294967295).min(0)
})
var updateSchema = Joi.object({
	customer_id: Joi.number().integer().max(4294967295).min(0),
	name: Joi.string().optional().max(500),
	drivers_license: Joi.string().optional().max(20),
	social_security: Joi.string().optional().max(20),
	phone_number: Joi.string().optional().max(30),
	customer_type: Joi.any().optional().valid('recreational','medical','wholesale'),
	version: Joi.number().integer().max(4294967295).min(0)
})

module.exports = function customerDb(db) {
	function loadCustomer(customerId, cb) {
		var query = q.select(COLUMNS)
			.from(TABLE)
			.where('customer_id', customerId)
			.build()

		db.query(query.str, query.params, firstElement(camelizeCallback(cb)))
	}

	return {
		save: function saveCustomer(customer, cb) {
			saver('customer', { insertSchema: insertSchema, updateSchema: updateSchema, load: loadCustomer, db: db }, customer, cb)
		},
		search: function searchCustomers(searchString, cb) {
			var lookIn = [ 'name', 'drivers_license', 'social_security', 'phone_number' ]

			var query = lookIn.reduce(function(query, column) {
				return query.orWhereLike(column, '%' + searchString + '%')
			}, q.select(COLUMNS).from(TABLE)).build()

			db.query(query.str, query.params, camelizeCallback(cb))
		},
		load: loadCustomer
	}
}

function firstElement(cb) {
	return function(err, results) {
		cb(err, results && results[0])
	}
}

function camelizeCallback(cb) {
	return function(err, customer) {
		if (err) {
			cb(err)
		} else {
			cb(null, camelize(customer))
		}
	}
}
