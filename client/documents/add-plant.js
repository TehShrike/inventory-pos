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
	'app.add-plant': {
		START_ROOM_SELECTION: {
			name: 'app.select-room',
			parameters: {
				document: 'addPlant'
			}
		},
		START_STRAIN_SELECTION: {
			name: 'app.select-strain',
			parameters: {
				document: 'addPlant'
			}
		},
		COMMIT: 'app.add-plant'
	},
	'app.select-room': {
		SELECT_ROOM: 'app.add-plant',
		CANCEL: 'app.add-plant'
	},
	'app.select-strain': {
		SELECT_STRAIN: 'app.add-plant',
		CANCEL: 'app.add-plant'
	}
}
