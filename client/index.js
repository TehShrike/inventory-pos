var makeStateRouter = require('abstract-state-router')
var Ractive = require('ractive')
var makeRactiveRenderer = require('ractive-state-router')
var socketio = require('socket.io-client')
var dragAndDropFiles = require('ractive-drag-and-drop-files')
var mannish = require('mannish')
var stateRouterRedux = require('state-router-redux-ractive')

var globbed = require('./globbed')

require('events').EventEmitter.defaultMaxListeners = 20

var socket = socketio(window.location.host)

var ractiveRenderer = makeRactiveRenderer(Ractive, {
	events: {
		dragAndDropFiles: dragAndDropFiles
	}
})

var stateRouter = makeStateRouter(ractiveRenderer, '#main')

stateRouterRedux(stateRouter)

var context = {
	stateRouter: stateRouter,
	socket: socket,
	mediator: mannish()
}

globbed.states.forEach(createState => createState(context))

socket.on('connect', function() {
	var userId = 1
	socket.emit('authenticate', userId, function(err, user) {
		globbed.services.forEach(service => service(context))

		stateRouter.evaluateCurrentRoute('app.customer-search')
	})
})
