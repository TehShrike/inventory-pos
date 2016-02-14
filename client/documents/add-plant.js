import { makeReducer } from 'action-helpers.js'

export var reducer = makeReducer({
	SCAN_PLANT: (state, action) => state,
	ADD_PLANT_DETAILS: (state, action) => state,
	COMMIT: (state, action) => state,
	SELECT_ROOM: (state, action) => state,
	SELECT_STRAIN: (state, action) => state
}, {
	plants: [],
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
