var makeStateRouter = require('abstract-state-router')
var ractiveRenderer = require('ractive-state-router')()
var socketio = require('socket.io-client')

var socket = socketio(window.location.host)
var stateRouter = makeStateRouter(ractiveRenderer, 'body')

stateRouter.addState({
	name: 'app',
	template: '<ui-view></ui-view>'
})

var context = {
	stateRouter: stateRouter,
	socket: socket
}

require('./customer')(context)

socket.on('connect', function() {
	stateRouter.evaluateCurrentRoute('app.customer')
})
