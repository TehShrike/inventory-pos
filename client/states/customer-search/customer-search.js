var fs = require('fs')
var Bacon = require('baconjs')
var makeCustomerAutocomplete = require('../../components/customer-autocomplete')

module.exports = function(appContext) {
	var mediator = appContext.mediator

	appContext.stateRouter.addState({
		name: 'app.customer-search',
		route: 'customer-search',
		template: {
			template: fs.readFileSync('client/states/customer-search/customer-search.html', { encoding: 'utf8' }),
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
				mediator.request('emitToServer', customer, cb)
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
					mediator.request('goToState', 'app.customer', { customerId: customer.customerId })
				})
				saving.onError(function(err) {
					console.error(err)
				})
			}
		}
	})
}

