var makeStateRouter = require('abstract-state-router')
var makeRactiveRenderer = require('ractive-state-router')
var socketio = require('socket.io-client')
var dragAndDropFiles = require('ractive-drag-and-drop-files')
var fs = require('fs')
var mannish = require('mannish')

require('events').EventEmitter.defaultMaxListeners = 20

var socket = socketio(window.location.host)

var ractiveRenderer = makeRactiveRenderer({
	events: {
		dragAndDropFiles: dragAndDropFiles
	}
})

var stateRouter = makeStateRouter(ractiveRenderer, 'body')

stateRouter.addState({
	name: 'app',
	template: fs.readFileSync('client/app.html', { encoding: 'utf8' })
})

var context = {
	stateRouter: stateRouter,
	socket: socket,
	mediator: mannish()
}

require('./customer-search')(context)
require('./customer')(context)
require('./configuration')(context)

var initializeEmitToServerService = require('./services/emit-to-server')
var initializeGoToStateService = require('./services/go-to-state')
var initializeInventoryTypeService = require('./services/inventory-type')

socket.on('connect', function() {
	var userId = 666 // why not
	socket.emit('authenticate', userId, function(err, user) {
		initializeEmitToServerService(context)
		initializeGoToStateService(context)
		initializeInventoryTypeService(context)

		stateRouter.evaluateCurrentRoute('app.customer-search')
	})
})
