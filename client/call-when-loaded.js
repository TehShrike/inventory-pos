module.exports = function() {
	var isLoaded = false
	var toCall = []

	function callWhenLoaded(fn) {
		if (isLoaded) {
			process.nextTick(fn)
		} else {
			toCall.push(fn)
		}
	}

	callWhenLoaded.markLoaded = function() {
		if (!isLoaded) {
			isLoaded = true
			toCall.forEach(function(fn) {
				process.nextTick(fn)
			})
		}
	}

	callWhenLoaded.isLoading = function() {
		return !isLoaded
	}

	return callWhenLoaded
}
