var { switchForNamedArgs } = require('common/action-helpers.js')
var { deleteLocalDocument } = require('common/document-helpers')
var { combineReducers } = require('redux')
var { reducer: plantGrowthPhaseChangeReducer } = require('documents/plant-growth-phase-change-document.js')
var { getActiveDocument } = require('documents/documents.js')
var template = require('./plant-growth-phase-change-menu.html')

module.exports = function({ stateRouter, mediator }) {
	stateRouter.addState({
		name: 'scanner.plant-growth-phase-change-menu',
		route: 'plant-growth-phase-change/menu',
		template: {
			template,
			twoway: false
		},
		data: {
			reducer: combineReducers({
				plantGrowthPhaseChange: plantGrowthPhaseChangeReducer
			}),
			afterAction: switchForNamedArgs({
				CANCEL_DOCUMENT: () => {
					mediator.publish('finishDocument', 'plantGrowthPhaseChange', store => {
						deleteLocalDocument('plantGrowthPhaseChange')
						stateRouter.go('scanner')
					})
				}
			})
		},
		resolve: function(data, parameters, cb) {
			getActiveDocument(mediator, 'plantGrowthPhaseChange', (err, doc) => {
				cb(err, {
					plantGrowthPhaseChange: doc.store.getState()
				})
			})
		}
	})
}
