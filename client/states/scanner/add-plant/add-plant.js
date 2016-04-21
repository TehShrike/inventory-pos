const all = require('async-all')
const { switchForNamedArgs } = require('common/action-helpers.js')
const makeReducer = require('create-redux-reducer-from-map')
const { combineReducers } = require('redux')
const { reducer: addPlantReducer } = require('documents/add-plant-document.js')
const { getActiveDocument } = require('documents/documents.js')
const template = require('./add-plant.html')
const createSaveState = require('common/save.js')

module.exports = function({ stateRouter, mediator }) {
	stateRouter.addState({
		name: 'scanner.add-plant',
		route: 'add-plant',
		template: {
			template,
			twoway: false
		},
		data: {
			reducer: combineReducers({
				addPlant: addPlantReducer,
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
				SCAN_PLANT: ({ dispatch, action }) => {
					mediator.request('emitToServer', 'load plant by tag number', action.payload, (err, plant) => {
						if (err) {
							console.error(err)
						} if (plant) {
							dispatch({
								type: 'REMOVE_PLANT',
								payload: action.payload
							})
						}
					})
					setTimeout(() => dispatch({ type: 'CLEAR_BARCODE_INPUT' }), 100)
				}
			})
		},
		resolve: function(data, parameters, cb) {
			getActiveDocument(mediator, 'addPlant', (err, doc) => {
				cb(err, {
					addPlant: doc.store.getState(),
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
		documentName: 'addPlant',
		documentStateName: 'scanner.add-plant',
		name: 'scanner.add-plant-save',
		route: 'add-plant/save',
		messageName: 'save add plant document'
	})
}
