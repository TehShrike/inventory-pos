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
	}
}, {
	plantTags: [],
	room: null,
	strain: null
})

module.exports.fsm = {
	'scanner.add-plant': {
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
		COMMIT: 'scanner.add-plant'
	},
	'scanner.select-room': {
		SELECT_ROOM: 'scanner.add-plant',
		CANCEL: 'scanner.add-plant'
	},
	'scanner.select-strain': {
		SELECT_STRAIN: 'scanner.add-plant',
		CANCEL: 'scanner.add-plant'
	}
}
