module.exports = {
	serializeErrorPassedToLastCallback: serializeErrorPassedToLastCallback,
	serializeErrorForCallback: serializeErrorForCallback,
	callFunctionBeforeCallbackSync: callFunctionBeforeCallbackSync
}

function serializeErrorPassedToLastCallback(fn) {
	return function() {
		var args = []
		for (var i = 0; i < arguments.length; ++i) {
			var finalArgCallback = (i === arguments.length - 1) && typeof arguments[arguments.length - 1] === 'function'
			args.push(finalArgCallback ? serializeErrorForCallback(arguments[i]) : arguments[i])
		}
		fn.apply(null, args)
	}
}

function serializeErrorForCallback(cb) {
	return function(err) {
		var args = []

		if (err) {
			var newErrorObject = {}
			Object.getOwnPropertyNames(err).forEach(function(key) {
				newErrorObject[key] = err[key]
			})
			args.push(newErrorObject)
		} else {
			args.push(null)
		}

		for (var i = 1; i < arguments.length; ++i) {
			args.push(arguments[i])
		}

		cb.apply(null, args)
	}
}

function callFunctionBeforeCallbackSync(cb, fn) {
	return function(err, value) {
		if (err) {
			cb(err)
		} else {
			fn(value)
			cb(err, value)
		}
	}
}
