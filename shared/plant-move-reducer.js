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
	SET_TAG_DETAILS: (state, action) => {
		return {
			...state,
			tagNumberToPlant: {
				...action.tagDetails,
				[action.payload.tagNumber]: action.payload
			}
		}
	},
	REMOVE_PLANT: (state, action) => {
		const lowercase = action.payload.toLowerCase()
		return {
			...state,
			plantTags: state.plantTags.filter(tag => tag.toLowerCase() !== lowercase)
		}
	}
}, Object.freeze({
	plantTags: Object.freeze([]),
	room: null,
	tagNumberToPlant: {}
}))
