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
		}
	})
}

