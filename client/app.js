var makeStateRouter = require('abstract-state-router')
var makeRactiveRenderer = require('ractive-state-router')
var socketio = require('socket.io-client')
var dragAndDropFiles = require('ractive-drag-and-drop-files')
var template = require('./app.html')
var mannish = require('mannish')

require('events').EventEmitter.defaultMaxListeners = 20

const customerSearch = require('./states/customer-search/customer-search.js')
const customer = require('./states/customer/customer.js')
const configuration = require('./states/configuration/configuration.js')
const addPlant = require('./states/add-plant/add-plant.js')

var socket = socketio(window.location.host)

var ractiveRenderer = makeRactiveRenderer({
	events: {
		dragAndDropFiles: dragAndDropFiles
	}
})

var stateRouter = makeStateRouter(ractiveRenderer, 'body')

stateRouter.addState({
	name: 'app',
	template
})

var context = {
	stateRouter: stateRouter,
	socket: socket,
	mediator: mannish()
}

customerSearch(context)
customer(context)
configuration(context)
addPlant(context)

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
