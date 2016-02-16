import makeStateRouter from 'abstract-state-router'
import makeRactiveRenderer from 'ractive-state-router'
import socketio from 'socket.io-client'
import dragAndDropFiles from 'ractive-drag-and-drop-files'
import mannish from 'mannish'

import appTemplate from './app.html'

import customerSearch from './states/customer-search/customer-search.js'
import customer from './states/customer/customer.js'
import configuration from './states/configuration/configuration.js'
import addPlant from './states/add-plant/add-plant.js'

var socket = socketio(window.location.host)

var ractiveRenderer = makeRactiveRenderer({
	events: {
		dragAndDropFiles: dragAndDropFiles
	}
})

var stateRouter = makeStateRouter(ractiveRenderer, 'body')

stateRouter.addState({
	name: 'app',
	template: appTemplate
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

import initializeEmitToServerService from './services/emit-to-server.js'
import initializeGoToStateService from './services/go-to-state.js'
import initializeInventoryTypeService from './services/inventory-type.js'
import initializeDocumentManagerService from './services/document-manager.js'

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
