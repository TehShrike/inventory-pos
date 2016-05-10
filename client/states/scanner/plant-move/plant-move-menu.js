var { switchForNamedArgs } = require('common/action-helpers.js')
var { deleteLocalDocument } = require('common/document-helpers')
var { combineReducers } = require('redux')
var { reducer: plantMoveReducer } = require('documents/plant-move-document.js')
var { getActiveDocument } = require('documents/documents.js')
var template = require('./plant-move-menu.html')

module.exports = function({ stateRouter, mediator }) {
	stateRouter.addState({
		name: 'scanner.plant-move-menu',
		route: 'plant-move/menu',
		template: {
			template,
			twoway: false
		},
		data: {
			reducer: combineReducers({
				plantMove: plantMoveReducer
			}),
			afterAction: switchForNamedArgs({
				CANCEL_DOCUMENT: () => {
					mediator.publish('finishDocument', 'plantMove', store => {
						deleteLocalDocument('plantMove')
						stateRouter.go('scanner')
					})
				}
			})
		},
		resolve: function(data, parameters, cb) {
			getActiveDocument(mediator, 'plantMove', (err, doc) => {
				cb(err, {
					plantMove: doc.store.getState()
				})
			})
		}
	})
}
