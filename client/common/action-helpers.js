module.exports.switchForNamedArgs = function switchForNamedArgs(mapOfFunctions) {
	return function(argumentMap) {
		var type = argumentMap.action.type

		if (mapOfFunctions[type]) {
			mapOfFunctions[type](argumentMap)
		}
	}
}

module.exports.makeReducer = function makeReducer(mapOfFunctions, initialState) {
	return function(state, action) {
		if (typeof state === 'undefined' && typeof initialState !== 'undefined') {
			return initialState
		} else if (mapOfFunctions[action.type]) {
			return mapOfFunctions[action.type](state, action)
		} else {
			return state
		}
	}
}
