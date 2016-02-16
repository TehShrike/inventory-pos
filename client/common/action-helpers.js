export function switchForNamedArgs(mapOfFunctions) {
	return function(argumentMap) {
		var type = argumentMap.action.type

		if (mapOfFunctions[type]) {
			mapOfFunctions[type](argumentMap)
		}
	}
}

export function makeReducer(mapOfFunctions, initialState) {
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
