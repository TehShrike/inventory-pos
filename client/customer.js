var fs = require('fs')
var Bacon = require('baconjs')

module.exports = function(appContext) {
	var socket = appContext.socket
	appContext.stateRouter.addState({
		name: 'app.customer',
		route: 'customer',
		template: fs.readFileSync('client/customer.html', { encoding: 'utf8' }),
		activate: function(context) {
			var ractive = context.domApi

			var autocompleteText = observeRactive(ractive, 'autocomplete')

			var matchingCustomers = autocompleteText.filter(function(value) {
					return value.length > 2
				})
				.debounce(200)
				.flatMapLatest(function(value) {
					return Bacon.fromNodeCallback(socket.emit.bind(socket), 'customer search', value)
				})
				.toProperty([])

			matchingCustomers.assign(ractive, 'set', 'matching')
		}
	})
}

function observeRactive(ractive, keypath) {
	return Bacon.fromBinder(function(sink) {
		ractive.observe(keypath, sink)
		ractive.on('teardown', function() {
			sink(new Bacon.End())
		})
	})
}

function changeRactive(ractive, keypath) {
	return function(value) {
		ractive.set(keypath, value)
	}
}
