var fs = require('fs')
var Bacon = require('baconjs')
var observeRactive = require('./observe')

module.exports = function(appContext) {
	var socket = appContext.socket
	appContext.stateRouter.addState({
		name: 'app.customer-search',
		route: 'customer-search',
		template: fs.readFileSync('client/customer-search.html', { encoding: 'utf8' }),
		activate: function(context) {
			var ractive = context.domApi

			var autocompleteText = observeRactive(ractive, 'autocomplete')

			var matchingCustomers = autocompleteText.filter(function(value) {
					return value.length > 1
				})
				.debounce(200)
				.flatMapLatest(function(value) {
					return Bacon.fromNodeCallback(socket.emit.bind(socket), 'customer search', value)
				})
				.toProperty([])

			ractive.on('navigate-to-customer', function(event, customerId) {
				appContext.stateRouter.go('app.customer', { customerId: customerId })
			})

			matchingCustomers.assign(ractive, 'set', 'matching')

			function saveCustomer(customer, cb) {
				socket.emit('save customer', customer, cb)
			}

			var savingMedical = Bacon.fromEvent(ractive, 'new-medical').map(function(event) {
				return {
					name: ractive.get('autocomplete'),
					customerType: 'medical'
				}
			}).flatMap(function(newCustomer) {
				return Bacon.fromNodeCallback(saveCustomer, newCustomer)
			})

			savingMedical.onValue(function(customer) {
				appContext.stateRouter.go('app.customer', { customerId: customer.customerId })
			})
			savingMedical.onError(function(err) {
				console.error(err)
			})

			var savingRecreational = Bacon.fromEvent(ractive, 'new-recreational').map(function(event) {
				return {
					name: ractive.get('autocomplete'),
					customerType: 'recreational'
				}
			}).flatMap(function(newCustomer) {
				return Bacon.fromNodeCallback(saveCustomer, newCustomer)
			})

			savingRecreational.onValue(function(customer) {
				appContext.stateRouter.go('app.customer', { customerId: customer.customerId })
			})
			savingRecreational.onError(function(err) {
				console.error(err)
			})
		}
	})
}

