var makeReducer = require('create-redux-reducer-from-map')

function alreadyContainsTag(listOfTags, tagNumber) {
	const lowercase = tagNumber.toLowerCase()
	return listOfTags.some(str => str.toLowerCase() === lowercase)
}

module.exports = makeReducer({
	SCAN_PLANT: (state, action) => {
		if (alreadyContainsTag(state.plantTags, action.payload)) {
			return state
		}

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
	},
	REMOVE_PLANT: (state, action) => {
		const lowercase = action.payload.toLowerCase()
		return {
			...state,
			plantTags: state.plantTags.filter(tag => tag.toLowerCase() !== lowercase)
		}
	}
}, {
	plantTags: [],
	room: null,
	strain: null,
	growthPhase: 'immature'
})
