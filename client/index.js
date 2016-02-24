var makeStateRouter = require('abstract-state-router')
var Ractive = require('ractive')
var makeRactiveRenderer = require('ractive-state-router')
var socketio = require('socket.io-client')
var dragAndDropFiles = require('ractive-drag-and-drop-files')
var mannish = require('mannish')
var stateRouterRedux = require('state-router-redux-ractive')

require('events').EventEmitter.defaultMaxListeners = 20

var socket = socketio(window.location.host)

var ractiveRenderer = makeRactiveRenderer(Ractive, {
	events: {
		dragAndDropFiles: dragAndDropFiles
	}
})

var stateRouter = makeStateRouter(ractiveRenderer, 'body')

stateRouterRedux(stateRouter)

var context = {
	stateRouter: stateRouter,
	socket: socket,
	mediator: mannish()
}

require('./states/app/app.js')(context)
require('./states/app/customer-search/customer-search.js')(context)
require('./states/app/customer/customer.js')(context)
require('./states/app/configuration/configuration.js')(context)
require('./states/scanner/scanner.js')(context)
require('./states/scanner/menu/menu.js')(context)
require('./states/scanner/add-plant/add-plant.js')(context)
require('./states/scanner/select-room/select-room.js')(context)
require('./states/scanner/select-strain/select-strain.js')(context)

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
