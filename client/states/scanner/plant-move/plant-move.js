const all = require('async-all')
const { switchForNamedArgs } = require('common/action-helpers.js')
const makeReducer = require('create-redux-reducer-from-map')
const { combineReducers } = require('redux')
const { reducer: plantMoveReducer } = require('documents/plant-move-document.js')
const { getActiveDocument } = require('documents/documents.js')
const template = require('./plant-move.html')
const createSaveState = require('common/save.js')

module.exports = function({ stateRouter, mediator }) {
	stateRouter.addState({
		name: 'scanner.plant-move',
		route: 'plant-move',
		template: {
			template,
			twoway: false,
			modifyArrays: false
		},
		data: {
			reducer: combineReducers({
				plantMove: plantMoveReducer,
				other: makeReducer({
					SCAN_PLANT: (state, action) => {
						return {
							...state,
							barcodeInput: action.payload
						}
					},
					CLEAR_BARCODE_INPUT: state => {
						return {
							...state,
							barcodeInput: ''
						}
					}
				}, {})
			}),
			afterAction: switchForNamedArgs({
				SCAN_PLANT: ({ dispatch, action, state }) => {
					mediator.request('emitToServer', 'load plant by tag number', action.payload, (err, plant) => {
						if (err) {
							console.error(err)
						} else if (plant) {
							dispatch({
								type: 'SET_TAG_DETAILS',
								payload: plant
							})
						} else {
							dispatch({
								type: 'REMOVE_PLANT',
								payload: action.payload
							})
						}
					})
					setTimeout(() => dispatch({ type: 'CLEAR_BARCODE_INPUT' }), 100)
				},
			})
		},
		resolve: function(data, parameters, cb) {
			getActiveDocument(mediator, 'plantMove', (err, doc) => {
				cb(err, {
					plantMove: doc.store.getState(),
					other: {}
				})
			})
		},
		activate: function(context) {
			const unsubscribe = mediator.subscribe('barcodeScan', barcode => context.domApi.fire('dispatch', 'SCAN_PLANT', { payload: barcode }))

			context.on('destroy', unsubscribe)
		}
	})

	createSaveState({
		stateRouter,
		mediator,
		documentName: 'plantMove',
		documentStateName: 'scanner.plant-move',
		name: 'scanner.plant-move-save',
		route: 'plant-move/save',
		messageName: 'save plant move document'
	})

}
