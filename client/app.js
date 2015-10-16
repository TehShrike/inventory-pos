var makeStateRouter = require('abstract-state-router')
var makeRactiveRenderer = require('ractive-state-router')
var socketio = require('socket.io-client')
var fs = require('fs')

var socket = socketio(window.location.host)
var ractiveRenderer = makeRactiveRenderer({
	decorators: {
	}
})

var stateRouter = makeStateRouter(ractiveRenderer, 'body')

stateRouter.addState({
	name: 'app',
	template: fs.readFileSync('client/app.html', { encoding: 'utf8' })
})

var context = {
	stateRouter: stateRouter,
	socket: socket
}

require('./customer-search')(context)
require('./customer')(context)

socket.on('connect', function() {
	var userId = 666 // why not
	socket.emit('authenticate', userId, function(err, user) {
		stateRouter.evaluateCurrentRoute('app.customer-search')
	})
})
