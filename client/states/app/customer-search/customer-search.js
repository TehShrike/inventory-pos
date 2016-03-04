var Bacon = require('baconjs')
var makeCustomerAutocomplete = require('components/customer-autocomplete')
var template = require('./customer-search.html')

module.exports = function(appContext) {
	var mediator = appContext.mediator

	appContext.stateRouter.addState({
		name: 'app.customer-search',
		route: 'customer-search',
		template: {
			template,
			components: {
				customerAutocomplete: makeCustomerAutocomplete(mediator)
			}
		},
		activate: function(context) {
			var ractive = context.domApi

			ractive.on('customerAutocomplete.customerSelected', function(customer) {
				mediator.request('goToState', 'app.customer', { customerId: customer.customerId })
			})

			function saveCustomer(customer, cb) {
				mediator.request('emitToServer', 'save customer', customer, cb)
			}

			handleNewCustomerEvent(Bacon.fromEvent(ractive, 'new-medical'), 'medical')
			handleNewCustomerEvent(Bacon.fromEvent(ractive, 'new-recreational'), 'recreational')

			function handleNewCustomerEvent(stream, type) {
				var saving = stream.map(function() {
					return {
						name: ractive.get('autocomplete'),
						customerType: type
					}
				}).flatMap(function(newCustomer) {
					return Bacon.fromNodeCallback(saveCustomer, newCustomer)
				})

				saving.onValue(function(customer) {
					mediator.request('goToState', 'app.customer', { customerId: customer.customerId })
				})
				saving.onError(function(err) {
					console.error(err)
				})
			}
		}
	})
}

