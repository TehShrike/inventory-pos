import { makeReducer } from 'action-helpers.js'

export var reducer = makeReducer({
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

export var fsm = {
	'scanner.add-plants': {
		START_ROOM_SELECTION: 'scanner.select-room',
		START_STRAIN_SELECTION: 'scanner.select-strain',
		COMMIT: 'scanner.add-plants'
	},
	'scanner.select-room': {
		SELECT_ROOM: 'scanner.add-plants',
		CANCEL: 'scanner.add-plants'
	},
	'scanner.select-strain': {
		SELECT_STRAIN: 'scanner.add-plants',
		CANCEL: 'scanner.add-plants'
	}
}
