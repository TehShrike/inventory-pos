var fs = require('fs')
var makeSavingStream = require('bacon-form-saving')
var socketStream = require('socket.io-stream')
var all = require('async-all')
import { observe, allProperties, prependKeysWith, handleSavingStreams } from '../../observe.js'

module.exports = function(appContext) {
	var socket = appContext.socket
	var mediator = appContext.mediator

	function getCustomerData(socketEvent, customerId) {
		return function(cb) {
			mediator.publish('emitToServer', socketEvent, customerId, cb)
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
		template: fs.readFileSync('client/states/customer/customer.html', { encoding: 'utf8' }),
		activate: function(context) {
			var ractive = context.domApi

			ractive.on('customer-focus', function(key) {
				ractive.set('saved.customer.' + key, false)
			})

			ractive.set('formFeedback', function(key) {
				if (ractive.get('saved.customer.' + key)) {
					return 'has-success'
				}
			})

			var allFieldChangesStream = observe(ractive, 'customer', 'customer-change')

			function saveCustomer(customer, cb) {
				mediator.publish('emitToServer', 'save customer', customer, cb)
			}

			allFieldChangesStream.onValue(function(changes) {
				ractive.set(allProperties(true, prependKeysWith('saving.customer.', changes)))
			})

			var streams = makeSavingStream(allFieldChangesStream, context.content.customer, 'customerId', saveCustomer)

			handleSavingStreams(streams, ractive, 'customer')

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

