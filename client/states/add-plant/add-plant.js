var all = require('async-all')
var { switchForNamedArgs, makeReducer } = require('../../common/action-helpers.js')
var { combineReducers } = require('redux')
var { reducer: addPlantReducer } = require('../../documents/add-plant.js')
var { getActiveDocument } = require('../../documents/documents.js')
var template = require('./add-plant.html')

module.exports = function({ stateRouter, mediator }) {
	stateRouter.addState({
		name: 'app.add-plant',
		route: 'add-plant',
		querystringParameters: ['inventoryTypeId'],
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
		}
	})
}

function buttonColumnsPerInventoryTypeCount(things) {
	if (things === 1) {
		return 12
	} else if (things === 2) {
		return 6
	} else if (things === 3) {
		return 4
	} else if (things === 4) {
		return 3
	} else if (things >= 5 && things <= 6) {
		return 4
	} else if (things >= 7) {
		return 3
	}
}
