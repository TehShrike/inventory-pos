var { makeReducer } = require('../common/action-helpers.js')

module.exports.reducer = makeReducer({
	SCAN_PLANT: (state, action) => {
		return {
			...state,
			plantTags: [
				...state.plantTags,
				action.payload
			]
		}
	},
	SELECT_ROOM: (state, action) => {
		return {
			...state,
			room: action.payload
		}
	},
	SELECT_STRAIN: (state, action) => {
		return {
			...state,
			strain: action.payload
		}
	},
	SELECT_GROWTH_PHASE: (state, action) => {
		return {
			...state,
			growthPhase: action.payload
		}
	}
}, {
	plantTags: [],
	room: null,
	strain: null,
	growthPhase: 'immature'
})

module.exports.fsm = {
	'scanner.add-plant': {
		VIEW_OPTIONS: 'scanner.add-plant-change'
	},
	'scanner.add-plant-change': {
		START_ROOM_SELECTION: {
			name: 'scanner.select-room',
			parameters: {
				document: 'addPlant'
			}
		},
		START_STRAIN_SELECTION: {
			name: 'scanner.select-strain',
			parameters: {
				document: 'addPlant'
			}
		},
		START_GROWTH_PHASE_SELECTION: {
			name: 'scanner.select-growth-phase',
			parameters: {
				document: 'addPlant'
			}
		},
		BACK_TO_DOCUMENT: 'scanner.add-plant',
		START_SAVE: 'scanner.add-plant-save'
	},
	'scanner.select-room': {
		SELECT_ROOM: 'scanner.add-plant-change',
		CANCEL: 'scanner.add-plant-change'
	},
	'scanner.select-strain': {
		SELECT_STRAIN: 'scanner.add-plant-change',
		CANCEL: 'scanner.add-plant-change'
	},
	'scanner.select-growth-phase': {
		SELECT_GROWTH_PHASE: 'scanner.add-plant-change',
		CANCEL: 'scanner.add-plant-change'
	}
}
