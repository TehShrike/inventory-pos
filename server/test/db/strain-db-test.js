var connectionPoolFactory = require('connection-pool-factory')
var pool = connectionPoolFactory()

var strainDb = require('db/strain-db')(pool)

strainDb.save({
	strainId: 2,
	name: 'Sweet suckotash',
	version: 1
}, function(err, result) {
	if (err) {
		console.log(err.message || err)
	} else {
		console.log('inserted', result)
	}
})

strainDb.load(1, function(err, data) {
	console.dir(data, { depth: null })
})
