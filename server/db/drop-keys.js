
module.exports = function stripKeys(joiObject, columnsToStrip) {
	var newObject = {}

	return Object.keys(joiObject).forEach(function(key) {
		var columnShouldBeStripped = columnsToStrip.indexOf(key) !== -1

		if (columnShouldBeStripped) {
			newObject[key] = joiObject[key].strip()
		} else {
			newObject[key] = joiObject[key]
		}

		return newObject
	})

	return newObject
}
