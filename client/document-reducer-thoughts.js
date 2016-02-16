/*
I am building a plant-tag-creation document
	I am able to select a room
		Display the "select room" state
		"Select room" state is done, producing a room
		OR
		"Select room" state cancels, producing nothing
	I am able to select a strain
		Display the "select strain" state
		"Select strain" state is done, producing a strain
		OR
		"Select strain" state cancels, producing nothing
	I am able to finalize the document
*/
var states = {
	'scanner.add-plants': {
		SCAN_PLANT: 'scanner.add-plants',
		ADD_PLANT_DETAILS: 'scanner.add-plants',
		START_ROOM_SELECTION: 'scanner.select-room',
		START_STRAIN_SELECTION: 'scanner.select-strain',
		COMMIT: 'scanner.add-plants',
		CANCEL: 'scanner.main'
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

var reducers = {
		SELECT_ROOM: (state, action) => { return { roomId: action.roomId, ...state } },
		SCAN_PLANT: (state, action) => { return {
			...state,
			scannedTags: [ ...state.scannedTags, action.tagNumber ]
		}}
		ADD_PLANT_DETAILS: (state, action) => { return {
			...state,
			plantDetails: {
				...state.plantDetails,
				action.plantDetails
			}
		}}
		START_ROOM_SELECTION:
		START_STRAIN_SELECTION:
		COMMIT:
		CANCEL:
	})
}

function makeReducer(reducerFunctions) {
	return function(state, action) {
		if (reducerFunctions[action.type]) {
			return reducerFunctions[action.type](state, action)
		} else {
			return state
		}
	}
}
