var Bacon = require('baconjs')

module.exports = function observeRactive(ractive, objectKeypath, eventName) {
	return Bacon.fromBinder(function(sink) {
		ractive.on(eventName, function(event, key) {
			var keypath = objectKeypath + '.' + key
			var o = {}
			o[key] = ractive.get(keypath)
			sink(o)
		})
		ractive.on('teardown', function() {
			sink(new Bacon.End())
		})
	})
}
