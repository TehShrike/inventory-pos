module.exports = function everythingOptionalExcept(joiObject, notOptionalColumns) {
	return Object.keys(joiObject).reduce(function(newObject, key) {
		var columnIsNotOptional = notOptionalColumns.indexOf(key) !== -1
		var columnIsOptional = !columnIsNotOptional

		if (columnIsOptional) {
			newObject[key] = joiObject[key].optional()
		} else {
			newObject[key] = joiObject[key]
		}

		return newObject
	}, {})
}
