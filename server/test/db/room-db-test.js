var connectionPoolFactory = require('connection-pool-factory')
var pool = connectionPoolFactory()

var roomDb = require('db/room-db')(pool)

roomDb.save({
	identifier: 'MAIN-ROOM',
	name: 'Main room'
}, function(err, result) {
	if (err) {
		console.log(err.message || err)
	} else {
		console.log('inserted', result)
	}
})

roomDb.load(1, function(err, data) {
	console.dir(data, { depth: null })
})

roomDb.loadAll(function(err, data) {
	console.dir(data)
})
