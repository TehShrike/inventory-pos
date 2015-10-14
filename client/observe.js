var Bacon = require('baconjs')

module.exports = function observeRactive(ractive, keypath) {
	return Bacon.fromBinder(function(sink) {
		ractive.observe(keypath, sink, { init: false })
		ractive.on('teardown', function() {
			sink(new Bacon.End())
		})
	})
}
