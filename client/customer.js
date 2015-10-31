var fs = require('fs')
var observe = require('./observe')
var makeSavingStream = require('bacon-form-saving')
var socketStream = require('socket.io-stream')
var all = require('async-all')

module.exports = function(appContext) {
	var socket = appContext.socket

	function getCustomerData(socketEvent, customerId) {
		return function(cb) {
			socket.emit(socketEvent, customerId, cb)
		}
	}

	appContext.stateRouter.addState({
		name: 'app.customer',
		route: 'customer',
		querystringParameters: ['customerId'],
		data: {
			saving: {}
		},
		resolve: function(data, parameters, cb) {
			var customerId = parameters.customerId

			all({
				customer: getCustomerData('load customer', customerId),
				driversLicenseExists: getCustomerData('drivers license exists', customerId),
				prescriptionExists: getCustomerData('prescription exists', customerId)
			}, cb)
		},
		template: fs.readFileSync('client/customer.html', { encoding: 'utf8' }),
		activate: function(context) {
			var ractive = context.domApi

			ractive.on('customer-focus', function(event, key) {
				ractive.set('saved.customer.' + key, false)
			})

			ractive.set('formFeedback', function(key) {
				if (ractive.get('saved.customer.' + key)) {
					return 'has-success'
				}
			})

			var allFieldChangesStream = observe(ractive, 'customer', 'customer-change')

			function saveCustomer(customer, cb) {
				socket.emit('save customer', customer, cb)
			}

			allFieldChangesStream.onValue(function(changes) {
				ractive.set(allProperties(true, prependKeysWith('saving.customer.', changes)))
			})

			var streams = makeSavingStream(allFieldChangesStream, context.content.customer, 'customerId', saveCustomer)

			streams.newVersionsFromServer.onError(function(err) {
				throw err
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

			handleImageDrop(ractive, socket, {
				customerId: context.parameters.customerId
			}, {
				domEvent: 'dropDriversLicense',
				socketEvent: 'save drivers license',
				savingProperty: 'savingDriversLicense',
				existsProperty: 'driversLicenseExists'
			})

			handleImageDrop(ractive, socket, {
				customerId: context.parameters.customerId
			}, {
				domEvent: 'dropPrescription',
				socketEvent: 'save prescription',
				savingProperty: 'savingPrescription',
				existsProperty: 'prescriptionExists'
			})

		}
	})
}

function handleImageDrop(ractive, socket, emittedObject, options) {
	ractive.on(options.domEvent, function(event) {
		var files = event.files
		if (files) {
			ractive.set(options.savingProperty, true)
			var file = files[0]
			var stream = socketStream.createStream()

			socketStream(socket).emit(options.socketEvent, stream, emittedObject, function() {
				var toSet = {}
				toSet[options.existsProperty] = true
				toSet[options.savingProperty] = false
				ractive.set(toSet)
			})

			socketStream.createBlobReadStream(file).pipe(stream)
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
