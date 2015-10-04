var fs = require('fs')

module.exports = function(appContext) {
	var socket = appContext.socket
	appContext.stateRouter.addState({
		name: 'app.customer',
		route: 'customer',
		template: fs.readFileSync('client/customer.html', { encoding: 'utf8' }),
		activate: function(context) {
			socket.emit('customer search', 'someone', function(err, customers) {
				console.log(err, customers)
			})
		}
	})
}
