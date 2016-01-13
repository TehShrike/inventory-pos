var connectionPoolFactory = require('connection-pool-factory')
var pool = connectionPoolFactory()

var plantDb = require('db/plant-db')(pool)

plantDb.save({
	plant_id: 1,
	tag_scope: 'NE',
	tag_number: '1',
	strain_id: 2,
	room_id: 2,
	growth_phase: 'immature',
	version: 1
}, function(err, result) {
	if (err) {
		console.log(err.message || err)
	} else {
		console.log('inserted', result)
	}
})

plantDb.load(1, function(err, data) {
	console.dir(data, { depth: null })
})

// plantDb.loadAll(function(err, data) {
// 	console.dir(data)
// })
