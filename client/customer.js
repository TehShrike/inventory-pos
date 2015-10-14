var fs = require('fs')
var Bacon = require('baconjs')
var observe = require('./observe')
var makeSavingStream = require('bacon-form-saving')

module.exports = function(appContext) {
	var socket = appContext.socket
	appContext.stateRouter.addState({
		name: 'app.customer',
		route: 'customer',
		querystringParameters: ['customerId'],
		data: {
			saving: {}
		},
		resolve: function(data, parameters, cb) {
			var customerId = parameters.customerId
			socket.emit('load customer', customerId, function(err, customer) {
				cb(err, {
					customer: customer
				})
			})
		},
		template: fs.readFileSync('client/customer.html', { encoding: 'utf8' }),
		activate: function(context) {
			var ractive = context.domApi

			var fields = [ 'name', 'driversLicense', 'socialSecurity', 'phoneNumber', 'customerType' ]

			var allFieldChangesStream = Bacon.mergeAll(fields.map(function(field) {
				return observe(ractive, 'customer.' + field).map(function(value) {
					var o = {}
					o[field] = value
					return o
				})
			}))

			function saveCustomer(customer, cb) {
				socket.emit('save customer', customer, cb)
			}

			allFieldChangesStream.onValue(function(changes) {
				var o = prependKeysWith('saving.customer.', changes)

				ractive.set(o)
			})

			var saved = makeSavingStream(allFieldChangesStream, context.content.customer, 'customerId', saveCustomer)

			saved.onError(function(err) {
				console.error(err)
			})

			saved.onValue(function(changeReportedByServer) {
				ractive.set(prependKeysWith('customer.', changeReportedByServer))

				var savingKeys = prependKeysWith('saving.customer.', changeReportedByServer)

				Object.keys(savingKeys).forEach(function(key) {
					savingKeys[key] = false
				})

				ractive.set(savingKeys)
			})

		}
	})
}

function prependKeysWith(str, o) {
	return Object.keys(o).reduce(function(memo, key) {
		memo[str + key] = o[key]
		return memo
	}, {})
}
