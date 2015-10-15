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

			ractive.set('formFeedback', function(key) {
				if (ractive.get('saved.customer.' + key)) {
					return 'has-success'
				}
			})

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
				ractive.set(allProperties(true, prependKeysWith('saving.customer.', changes)))

				// TODO: should set the saved to false when onfocus happens, not on change
				ractive.set(allProperties(false, prependKeysWith('saved.customer.', changes)))
			})

			var streams = makeSavingStream(allFieldChangesStream, context.content.customer, 'customerId', saveCustomer)

			streams.newVersionsFromServer.onError(function(err) {
				console.error(err)
			})

			streams.newVersionsFromServer.onValue(function(newVersionFromServer) {
				ractive.set(prependKeysWith('customer.', newVersionFromServer))
			})

			streams.propertiesSavedAndGotBackFromServer.onValue(function(newlySavedProperties) {
				newlySavedProperties.map(function(property) {
					return 'saving.customer.' + property
				}).forEach(function(property) {
					ractive.set(property, false)
				})

				newlySavedProperties.map(function(property) {
					return 'saved.customer.' + property
				}).forEach(function(property) {
					ractive.set(property, true)
				})
			})

		}
	})
}

function differentKeys(o1, o2) {
	return set(Object.keys(o1), Object.keys(o2)).filter(function(memo, key) {
		o1[key] !== o2[key]
	})
}

function set(ary1, ary2) {
	var o = {}
	ary1.concat(ary2).forEach(function(key) {
		o[key] = true
	})
	return Object.keys(o)
}

function allProperties(value, o) {
	return Object.keys(o).reduce(function(memo, key) {
		memo[key] = value
		return memo
	}, {})
}

function prependKeysWith(str, o) {
	return Object.keys(o).reduce(function(memo, key) {
		memo[str + key] = o[key]
		return memo
	}, {})
}
