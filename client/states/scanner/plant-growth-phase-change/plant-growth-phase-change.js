const all = require('async-all')
const { switchForNamedArgs } = require('common/action-helpers.js')
const makeReducer = require('create-redux-reducer-from-map')
const { combineReducers } = require('redux')
const { reducer: plantGrowthPhaseChangeReducer } = require('documents/plant-growth-phase-change-document.js')
const { getActiveDocument } = require('documents/documents.js')
const template = require('./plant-growth-phase-change.html')
const { getNext: getNextGrowthPhase, getPrevious: getPreviousGrowthPhase } = require('shared/growth-phase')
const createSaveState = require('common/save.js')

module.exports = function({ stateRouter, mediator }) {
	stateRouter.addState({
		name: 'scanner.plant-growth-phase-change',
		route: 'plant-growth-phase-change',
		template: {
			template,
			twoway: false,
			modifyArrays: false,
			data: {
				getPreviousGrowthPhase: getPreviousGrowthPhase,
			}
		},
		data: {
			reducer: combineReducers({
				plantGrowthPhaseChange: plantGrowthPhaseChangeReducer,
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
							if (!state.plantGrowthPhaseChange.growthPhase) {
								dispatch({
									type: 'SELECT_GROWTH_PHASE',
									payload: getNextGrowthPhase(plant.growthPhase)
								})
							}
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
			getActiveDocument(mediator, 'plantGrowthPhaseChange', (err, doc) => {
				cb(err, {
					plantGrowthPhaseChange: doc.store.getState(),
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
		documentName: 'plantGrowthPhaseChange',
		documentStateName: 'scanner.plant-growth-phase-change',
		name: 'scanner.plant-growth-phase-change-save',
		route: 'plant-growth-phase-change/save',
		messageName: 'save plant growth phase change document'
	})

}
