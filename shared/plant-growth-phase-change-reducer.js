var makeReducer = require('create-redux-reducer-from-map')

function alreadyContainsTag(listOfTags, tagNumber) {
	const lowercase = tagNumber.toLowerCase()
	return listOfTags.some(str => str.toLowerCase() === lowercase)
}

// scan plant (tag is unconfirmed)
// approve plant scan (tag is confirmed)
// remove scanned tag
// add tag details
// select growth phase
// on growth phase change/tag scan: set a flag on plants whose growth phase isn't right before the currently selected one

// This document represents the result of user interaction

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
	SET_TAG_DETAILS: (state, action) => {
		return {
			...state,
			tagNumberToPlant: {
				...action.tagDetails,
				[action.payload.tagNumber]: action.payload
			}
		}
	},
	SELECT_GROWTH_PHASE: (state, action) => {
		return {
			...state,
			growthPhase: action.payload
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
	strain: null,
	growthPhase: 'immature',
	tagNumberToPlant: {}
})
