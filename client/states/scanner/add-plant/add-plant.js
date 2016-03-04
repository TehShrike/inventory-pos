var all = require('async-all')
var { switchForNamedArgs, makeReducer } = require('common/action-helpers.js')
var { combineReducers } = require('redux')
var { reducer: addPlantReducer } = require('documents/add-plant.js')
var { getActiveDocument } = require('documents/documents.js')
var template = require('./add-plant.html')

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
				SCAN_PLANT: ({ dispatch }) => {
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
}
