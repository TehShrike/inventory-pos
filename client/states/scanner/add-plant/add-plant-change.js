var { switchForNamedArgs } = require('../../../common/action-helpers.js')
var { deleteLocalDocument } = require('../../../common/document-helpers')
var { combineReducers } = require('redux')
var { reducer: addPlantReducer } = require('../../../documents/add-plant.js')
var { getActiveDocument } = require('../../../documents/documents.js')
var template = require('./add-plant-change.html')

module.exports = function({ stateRouter, mediator }) {
	stateRouter.addState({
		name: 'scanner.add-plant',
		route: 'add-plant',
		querystringParameters: ['inventoryTypeId'],
		template: {
			template,
			twoway: false
		},
		data: {
			reducer: combineReducers({
				addPlant: addPlantReducer
			}),
			afterAction: switchForNamedArgs({
				CANCEL_DOCUMENT: () => {
					mediator.publish('finishDocument', 'addPlant', store => {
						deleteLocalDocument('addPlant')
						stateRouter.go('scanner')
					})
				}
			})
		},
		resolve: function(data, parameters, cb) {
			getActiveDocument(mediator, 'addPlant', (err, doc) => {
				cb(err, {
					addPlant: doc.store.getState()
				})
			})
		}
	})
}
