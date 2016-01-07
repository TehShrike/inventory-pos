module.exports = function everythingOptionalExcept(joiObject, notOptionalColumns) {
	return Object.keys(joiObject).reduce(function(newObject, key) {
		if (notOptionalColumns.indexOf(key) !== -1) {
			newObject[key] = joiObject[key].optional()
		} else {
			newObject[key] = joiObject[key]
		}

		return newObject
	}, {})
}
