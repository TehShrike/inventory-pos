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

require('./states/customer-search/customer-search.js')(context)
require('./states/customer/customer.js')(context)
require('./states/configuration/configuration.js')(context)
require('./states/add-plant/add-plant.js')(context)

var initializeEmitToServerService = require('./services/emit-to-server.js')
var initializeGoToStateService = require('./services/go-to-state.js')
var initializeInventoryTypeService = require('./services/inventory-type.js')
var initializeDocumentManagerService = require('./services/document-manager.js')

socket.on('connect', function() {
	var userId = 666 // why not
	socket.emit('authenticate', userId, function(err, user) {
		initializeEmitToServerService(context)
		initializeGoToStateService(context)
		initializeInventoryTypeService(context)
		initializeDocumentManagerService(context)

		stateRouter.evaluateCurrentRoute('app.customer-search')
	})
})
