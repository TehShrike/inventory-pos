var makeReducer = require('create-redux-reducer-from-map')

module.exports = makeReducer({
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
	},
	TAG_SCOPE: (state, action) => {
		return {
			...state,
			tagScope: action.payload
		}
	},
	ADD_ACCOUNT: (state, action) => {
		return {
			...state,
			accountId: action.payload
		}
	},
	ADD_USER: (state, action) => {
		return {
			...state,
			userId: action.payload
		}
	}
}, {
	plantTags: [],
	room: null,
	strain: null,
	growthPhase: 'immature'
})
