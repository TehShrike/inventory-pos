var fs = require('fs')
var Bacon = require('baconjs')
var makeCustomerAutocomplete = require('./components/customer-autocomplete')

module.exports = function(appContext) {
	var socket = appContext.socket
	appContext.stateRouter.addState({
		name: 'app.customer-search',
		route: 'customer-search',
		template: {
			template: fs.readFileSync('client/customer-search.html', { encoding: 'utf8' }),
			components: {
				customerAutocomplete: makeCustomerAutocomplete(appContext)
			}
		},
		activate: function(context) {
			var ractive = context.domApi

			function saveCustomer(customer, cb) {
				socket.emit('save customer', customer, cb)
			}

			handleNewCustomerEvent(Bacon.fromEvent(ractive, 'new-medical'), 'medical')
			handleNewCustomerEvent(Bacon.fromEvent(ractive, 'new-recreational'), 'recreational')

			function handleNewCustomerEvent(stream, type) {
				var saving = stream.map(function(event) {
					return {
						name: ractive.get('autocomplete'),
						customerType: type
					}
				}).flatMap(function(newCustomer) {
					return Bacon.fromNodeCallback(saveCustomer, newCustomer)
				})

				saving.onValue(function(customer) {
					appContext.stateRouter.go('app.customer', { customerId: customer.customerId })
				})
				saving.onError(function(err) {
					console.error(err)
				})
			}
		}
	})
}

